//! Engine tests with a stand-in encoder and prober: T7 (skip-and-report, 部分完成), ENG4/ET4
//! (retry from source by cue text), ENG6/ET6 (cancel leaves nothing of the cancelled cues).

use std::collections::{HashMap, HashSet};
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};
use std::sync::Mutex;
use std::time::Duration;

use super::job::{import_subtitle, match_failures, retry, Engine, Prober};
use super::run::{Encoder, Event, PlannedCue};
use super::runs::{Reason, RunStatus, StoredFailure};
use super::ImportError;
use crate::library::folder::Library;
use crate::library::paths::{DB_FILE, TMP_DIR};
use crate::media::ffmpeg::Probe;
use crate::media::MediaError;
use crate::store::writer::Writer;
use crate::subs::{self, Cue};

#[derive(Default)]
struct FakeEncoder {
    /// start_ms → stderr of a failing ffmpeg
    fail: Mutex<HashMap<u64, &'static str>>,
    delay: Duration,
    /// Cues starting here take `fast` instead of `delay`.
    fast: Option<(u64, Duration)>,
    calls: AtomicUsize,
    killed: AtomicUsize,
}

impl Encoder for FakeEncoder {
    fn encode(
        &self,
        _source: &Path,
        start_ms: u64,
        _end_ms: u64,
        out: &Path,
        cancel: &AtomicBool,
    ) -> Result<(), MediaError> {
        self.calls.fetch_add(1, Ordering::SeqCst);
        // Like ffmpeg: the output file exists from the start.
        fs::write(out, b"partial").unwrap();
        let delay = match self.fast {
            Some((at, fast)) if at == start_ms => fast,
            _ => self.delay,
        };
        let mut waited = Duration::ZERO;
        while waited < delay {
            if cancel.load(Ordering::Acquire) {
                self.killed.fetch_add(1, Ordering::SeqCst);
                return Err(MediaError::Killed);
            }
            std::thread::sleep(Duration::from_millis(5));
            waited += Duration::from_millis(5);
        }
        if let Some(stderr) = self.fail.lock().unwrap().get(&start_ms) {
            return Err(MediaError::Exit {
                code: Some(1),
                stderr_tail: (*stderr).to_owned(),
            });
        }
        fs::write(out, vec![1u8; 2048]).unwrap();
        Ok(())
    }
}

struct FakeProber {
    calls: AtomicUsize,
    probe: Probe,
}

impl Prober for FakeProber {
    fn probe(&self, _source: &Path, _cancel: &AtomicBool) -> Result<Probe, MediaError> {
        self.calls.fetch_add(1, Ordering::SeqCst);
        Ok(self.probe)
    }
}

fn prober() -> FakeProber {
    FakeProber {
        calls: AtomicUsize::new(0),
        probe: Probe {
            duration_ms: Some(60_000),
            has_audio: true,
        },
    }
}

struct Fixture {
    _dir: tempfile::TempDir,
    root: PathBuf,
    subtitle: PathBuf,
    video: PathBuf,
    writer: Writer,
}

const SRT: &str = "1
00:00:01,000 --> 00:00:02,000
人類的壽命真的很短暫呢。

2
00:00:03,000 --> 00:00:04,000
那就再去一次吧。

3
00:00:05,000 --> 00:00:06,000
這一切都是命運石之門的選擇。

4
00:00:07,000 --> 00:00:08,000
我們不會忘記你們的名字。

5
00:00:09,000 --> 00:00:10,000
おはよう。
";

fn fixture() -> Fixture {
    let dir = tempfile::tempdir().unwrap();
    let root = dir.path().join("lib");
    let lib = Library::create(&root).unwrap();
    lib.conn()
        .execute_batch(
            "INSERT INTO characters (id, name, category, source, created_at, updated_at) VALUES
               (1, '芙莉蓮', 'anime', '葬送的芙莉蓮', 0, 0),
               (2, '岡部倫太郎', 'anime', '命運石之門', 0, 0);",
        )
        .unwrap();
    lib.close().unwrap();
    let subtitle = dir.path().join("ep01.srt");
    fs::write(&subtitle, SRT).unwrap();
    let video = dir.path().join("ep01.mkv");
    fs::write(&video, b"video").unwrap();
    let writer = Writer::open(&root.join(DB_FILE)).unwrap();
    Fixture {
        _dir: dir,
        root,
        subtitle,
        video,
        writer,
    }
}

/// Step 2's result: every cue, alternating between the two characters.
fn plan(subtitle: &Path) -> Vec<PlannedCue> {
    subs::parse_file(subtitle)
        .unwrap()
        .into_iter()
        .enumerate()
        .map(|(i, cue)| PlannedCue {
            cue,
            character_id: 1 + (i as i64 % 2),
        })
        .collect()
}

fn engine<'a>(
    f: &'a Fixture,
    encoder: &'a FakeEncoder,
    prober: &'a FakeProber,
    cancel: &'a AtomicBool,
    on_event: &'a (dyn Fn(Event) + Sync),
) -> Engine<'a> {
    Engine {
        library: &f.root,
        writer: &f.writer,
        encoder,
        prober,
        workers: 4,
        cancel,
        on_event,
    }
}

fn quiet(_: Event) {}

/// Rows equal files: every row's clip exists and no clip lacks a row. No `.tmp` is left.
fn assert_rows_equal_files(root: &Path) -> Vec<(String, i64)> {
    let lib = Library::open(root).unwrap();
    let rows: Vec<(String, i64)> = lib
        .conn()
        .prepare("SELECT audio_filename, character_id FROM lines ORDER BY id")
        .unwrap()
        .query_map([], |r| Ok((r.get(0)?, r.get(1)?)))
        .unwrap()
        .map(Result::unwrap)
        .collect();
    let files: HashSet<String> = fs::read_dir(root)
        .unwrap()
        .flatten()
        .filter_map(|e| e.file_name().into_string().ok())
        .filter(|n| n.ends_with(".m4a"))
        .collect();
    let named: HashSet<String> = rows.iter().map(|(n, _)| n.clone()).collect();
    assert_eq!(named, files, "rows and files differ");
    assert_eq!(
        fs::read_dir(root.join(TMP_DIR)).unwrap().count(),
        0,
        ".tmp left behind"
    );
    let pending: i64 = lib
        .conn()
        .query_row("SELECT COUNT(*) FROM pending_deletions", [], |r| r.get(0))
        .unwrap();
    assert_eq!(pending, 0);
    rows
}

fn failure_rows(root: &Path) -> Vec<(String, String, String)> {
    let lib = Library::open(root).unwrap();
    let rows = lib
        .conn()
        .prepare("SELECT cue_text, status, reason_code FROM import_failures ORDER BY cue_index")
        .unwrap()
        .query_map([], |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?)))
        .unwrap()
        .map(Result::unwrap)
        .collect();
    rows
}

#[test]
fn a_clean_run_imports_every_cue() {
    let f = fixture();
    let (encoder, prober) = (FakeEncoder::default(), prober());
    let cancel = AtomicBool::new(false);
    let out = import_subtitle(
        &engine(&f, &encoder, &prober, &cancel, &quiet),
        &f.subtitle,
        &f.video,
        plan(&f.subtitle),
    )
    .unwrap();
    assert_eq!(out.status, RunStatus::Complete);
    assert_eq!(out.imported, 5);
    assert!(out.failures.is_empty());
    let rows = assert_rows_equal_files(&f.root);
    assert_eq!(rows.len(), 5);
}

/// T7: two artificial failures → 部分完成 with both reasons; rows equal files.
#[test]
fn two_failures_are_skipped_and_reported_with_their_reasons() {
    let f = fixture();
    let (encoder, prober) = (FakeEncoder::default(), prober());
    encoder.fail.lock().unwrap().extend([
        (3000, "Error writing trailer: No space left on device"),
        (7000, "Invalid data found when processing input"),
    ]);
    let cancel = AtomicBool::new(false);
    let out = import_subtitle(
        &engine(&f, &encoder, &prober, &cancel, &quiet),
        &f.subtitle,
        &f.video,
        plan(&f.subtitle),
    )
    .unwrap();

    assert_eq!(out.status, RunStatus::Partial);
    assert_eq!(out.imported, 3);
    let reasons: Vec<Reason> = out.failures.iter().map(|f| f.reason).collect();
    assert_eq!(reasons, [Reason::DiskFull, Reason::DecodeFailed]);
    assert!(out.failures[1]
        .detail
        .as_deref()
        .unwrap()
        .contains("Invalid data"));
    assert_eq!(assert_rows_equal_files(&f.root).len(), 3);
    assert_eq!(
        failure_rows(&f.root),
        [
            (
                "那就再去一次吧。".into(),
                "failed".into(),
                "diskFull".into()
            ),
            (
                "我們不會忘記你們的名字。".into(),
                "failed".into(),
                "decodeFailed".into()
            ),
        ]
    );
}

#[test]
fn zero_length_and_out_of_range_cues_fail_before_ffmpeg_runs() {
    let f = fixture();
    let (encoder, mut prober) = (FakeEncoder::default(), prober());
    prober.probe.duration_ms = Some(8_500); // the last cue starts at 9 s
    let mut cues = plan(&f.subtitle);
    cues[0].cue.end_ms = cues[0].cue.start_ms;
    let cancel = AtomicBool::new(false);
    let out = import_subtitle(
        &engine(&f, &encoder, &prober, &cancel, &quiet),
        &f.subtitle,
        &f.video,
        cues,
    )
    .unwrap();
    let reasons: Vec<Reason> = out.failures.iter().map(|f| f.reason).collect();
    assert_eq!(reasons, [Reason::ZeroLength, Reason::OutOfRange]);
    assert_eq!(encoder.calls.load(Ordering::SeqCst), 3);
}

#[test]
fn a_video_without_audio_is_refused_by_name() {
    let f = fixture();
    let (encoder, mut prober) = (FakeEncoder::default(), prober());
    prober.probe.has_audio = false;
    let cancel = AtomicBool::new(false);
    let err = import_subtitle(
        &engine(&f, &encoder, &prober, &cancel, &quiet),
        &f.subtitle,
        &f.video,
        plan(&f.subtitle),
    )
    .unwrap_err();
    assert!(matches!(err, ImportError::NoAudio(_)));
    assert_eq!(encoder.calls.load(Ordering::SeqCst), 0);
}

/// ET6: cancel kills the in-flight encodes; cancelled cues leave no .tmp, file or row and are
/// listed as cancelled (not failed); cues finished before the cancel are kept.
#[test]
fn cancel_kills_in_flight_cues_and_keeps_finished_ones() {
    let f = fixture();
    // The first cue finishes at once; the others would take long, so they are in flight (or
    // still queued) when its completion triggers the cancel.
    let encoder = FakeEncoder {
        delay: Duration::from_secs(10),
        fast: Some((1000, Duration::ZERO)),
        ..Default::default()
    };
    let prober = prober();
    let cancel = AtomicBool::new(false);
    let on_event = |event: Event| {
        if matches!(event, Event::Progress(p) if p.imported >= 1) {
            cancel.store(true, Ordering::Release);
        }
    };
    let mut cues = plan(&f.subtitle);
    cues.extend(plan(&f.subtitle).into_iter().skip(1)); // 9 cues: more than 4 workers take
    let started = std::time::Instant::now();
    let out = import_subtitle(
        &engine(&f, &encoder, &prober, &cancel, &on_event),
        &f.subtitle,
        &f.video,
        cues,
    )
    .unwrap();

    assert!(
        started.elapsed() < Duration::from_secs(5),
        "cancel did not wait for encodes"
    );
    assert_eq!(out.status, RunStatus::Cancelled);
    assert_eq!(
        out.imported, 1,
        "the cue finished before the cancel is kept"
    );
    assert_eq!(
        encoder.killed.load(Ordering::SeqCst),
        3,
        "the other in-flight encodes were killed"
    );
    assert_eq!(out.failures.len(), 8);
    assert!(out.failures.iter().all(|f| f.reason == Reason::Cancelled));
    assert_eq!(assert_rows_equal_files(&f.root).len(), 1);
    assert!(failure_rows(&f.root)
        .iter()
        .all(|(_, status, _)| status == "cancelled"));
}

/// ET6: a cue caught after its commit loses its row and its file too.
#[test]
fn a_cue_cancelled_after_its_commit_is_removed_again() {
    let f = fixture();
    let (encoder, prober) = (FakeEncoder::default(), prober());
    let cancel = AtomicBool::new(false);
    let on_event = |event: Event| {
        if matches!(event, Event::Committed { .. }) {
            cancel.store(true, Ordering::Release);
        }
    };
    let mut e = engine(&f, &encoder, &prober, &cancel, &on_event);
    e.workers = 1;
    let out = import_subtitle(&e, &f.subtitle, &f.video, plan(&f.subtitle)).unwrap();

    assert_eq!(out.status, RunStatus::Cancelled);
    assert_eq!(out.imported, 0);
    assert_eq!(out.failures.len(), 5);
    assert!(assert_rows_equal_files(&f.root).is_empty());
}

/// ENG4/ET4: retry re-opens both sources, finds the failed cues by text even after a line was
/// inserted at the top, keeps their characters, and marks a vanished text as lost.
#[test]
fn retry_finds_failed_cues_by_text_in_a_changed_subtitle_file() {
    let f = fixture();
    let (encoder, prober) = (FakeEncoder::default(), prober());
    encoder.fail.lock().unwrap().extend([
        (3000, "Invalid data found when processing input"), // 那就再去一次吧。 (character 2)
        (5000, "Invalid data found when processing input"), // 這一切都是…      (character 1)
    ]);
    let cancel = AtomicBool::new(false);
    let first = import_subtitle(
        &engine(&f, &encoder, &prober, &cancel, &quiet),
        &f.subtitle,
        &f.video,
        plan(&f.subtitle),
    )
    .unwrap();
    assert_eq!(first.status, RunStatus::Partial);

    // The user fixes the file: a new line at the top shifts everything by 30 s, and one of the
    // failed lines is removed.
    let edited = "0\n00:00:00,000 --> 00:00:00,500\n新加的第一行\n\n".to_owned()
        + &shift_srt(SRT, 30).replace("這一切都是命運石之門的選擇。", "（刪掉了）");
    std::thread::sleep(Duration::from_millis(20));
    fs::write(&f.subtitle, edited).unwrap();
    encoder.fail.lock().unwrap().clear();

    let out = retry(
        &engine(&f, &encoder, &prober, &cancel, &quiet),
        first.run_id,
    )
    .unwrap();
    assert_eq!(
        prober.calls.load(Ordering::SeqCst),
        2,
        "the video is probed again"
    );
    assert_eq!(out.imported, 1);
    assert_eq!(out.lost, [2], "cue #2 (0-based) lost its text");
    assert_eq!(
        out.changed_sources,
        std::slice::from_ref(&f.subtitle),
        "a changed source only warns"
    );

    let rows = assert_rows_equal_files(&f.root);
    assert_eq!(rows.len(), 4);
    assert_eq!(
        rows.last().unwrap().1,
        2,
        "the retried line keeps its saved character"
    );
    assert_eq!(
        failure_rows(&f.root),
        [(
            "這一切都是命運石之門的選擇。".into(),
            "lost".into(),
            "lost".into()
        )]
    );
}

#[test]
fn retry_of_a_deleted_source_is_source_missing() {
    let f = fixture();
    let (encoder, prober) = (FakeEncoder::default(), prober());
    encoder
        .fail
        .lock()
        .unwrap()
        .insert(1000, "Invalid data found when processing input");
    let cancel = AtomicBool::new(false);
    let first = import_subtitle(
        &engine(&f, &encoder, &prober, &cancel, &quiet),
        &f.subtitle,
        &f.video,
        plan(&f.subtitle),
    )
    .unwrap();
    fs::remove_file(&f.video).unwrap();
    let err = retry(
        &engine(&f, &encoder, &prober, &cancel, &quiet),
        first.run_id,
    )
    .unwrap_err();
    assert!(matches!(err, ImportError::SourceMissing(p) if p == f.video));
}

#[test]
fn a_repeated_text_is_matched_to_the_nearest_start_time() {
    let cue = |index, start_ms, text: &str| Cue {
        index,
        start_ms,
        end_ms: start_ms + 500,
        text: text.into(),
    };
    let parsed = [
        cue(0, 1_000, "はい"),
        cue(1, 50_000, "はい"),
        cue(2, 90_000, "はい"),
    ];
    let failure = |id, start_ms| StoredFailure {
        id,
        cue_index: 0,
        cue_text: "はい".into(),
        start_ms,
        end_ms: start_ms + 500,
        character_id: 1,
    };
    let (planned, retried, lost) =
        match_failures(&[failure(7, 52_000), failure(8, 49_000)], &parsed);
    assert_eq!(
        planned.iter().map(|p| p.cue.start_ms).collect::<Vec<_>>(),
        [90_000, 50_000],
        "49 s sits next to 50 s, so 52 s takes the next nearest; each cue is used once"
    );
    assert_eq!(retried, [7, 8]);
    assert!(lost.is_empty());
}

fn shift_srt(srt: &str, seconds: u64) -> String {
    srt.lines()
        .map(|line| {
            let Some((a, b)) = line.split_once(" --> ") else {
                return line.to_owned();
            };
            format!(
                "{} --> {}",
                shift_clock(a, seconds),
                shift_clock(b, seconds)
            )
        })
        .collect::<Vec<_>>()
        .join("\n")
}

fn shift_clock(clock: &str, seconds: u64) -> String {
    let (hms, ms) = clock.split_once(',').unwrap();
    let parts: Vec<u64> = hms.split(':').map(|p| p.parse().unwrap()).collect();
    let total = parts[0] * 3600 + parts[1] * 60 + parts[2] + seconds;
    format!(
        "{:02}:{:02}:{:02},{ms}",
        total / 3600,
        total / 60 % 60,
        total % 60
    )
}

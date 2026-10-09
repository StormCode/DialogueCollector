//! Engine tests with a stand-in encoder and prober: skip-and-report (部分完成), retry from
//! source by cue text, and cancel leaving nothing of the cancelled cues.

use std::collections::{HashMap, HashSet};
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};
use std::sync::Mutex;
use std::time::Duration;

use super::job::{import_subtitle, retry, Engine, Prober};
use super::run::{Encoder, Event, PlannedCue};
use super::runs::{Reason, RunStatus};
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
    /// Every line's segments, in the order encoded.
    segments: Mutex<Vec<Vec<(u64, u64)>>>,
}

impl Encoder for FakeEncoder {
    fn encode(
        &self,
        _source: &Path,
        segments: &[(u64, u64)],
        _gap_ms: u64,
        out: &Path,
        cancel: &AtomicBool,
    ) -> Result<(), MediaError> {
        let start_ms = segments[0].0;
        self.calls.fetch_add(1, Ordering::SeqCst);
        self.segments.lock().unwrap().push(segments.to_vec());
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
            segments: Vec::new(),
            gap_ms: 0,
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
    let events = Mutex::new(Vec::new());
    let record = |e: Event| events.lock().unwrap().push(e);
    let out = import_subtitle(
        &engine(&f, &encoder, &prober, &cancel, &record),
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

    // 建立索引 starts exactly once, after the last encode and before the last cue settles.
    let events = events.into_inner().unwrap();
    let indexing: Vec<usize> = (0..events.len())
        .filter(|&i| events[i] == Event::Indexing)
        .collect();
    assert_eq!(indexing.len(), 1);
    let settled_before = events[..indexing[0]]
        .iter()
        .filter(|e| matches!(e, Event::Progress(_)))
        .count();
    assert!(settled_before < 5);
}

/// Two artificial failures → 部分完成 with both reasons; rows equal files.
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

/// Cancel kills the in-flight encodes; cancelled cues leave no .tmp, file or row and are
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

/// A cue caught after its commit loses its row and its file too.
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

/// Retry rebuilds the failed lines from their records — text,
/// translation, segments, character — so it works even when the subtitle file has changed or is
/// gone (an extracted track lives in a cache; a merged line was never in the file).
#[test]
fn retry_rebuilds_failed_lines_from_their_records() {
    let f = fixture();
    let (encoder, prober) = (FakeEncoder::default(), prober());
    encoder.fail.lock().unwrap().extend([
        (3000, "Invalid data found when processing input"),
        (5000, "Invalid data found when processing input"),
    ]);
    let cancel = AtomicBool::new(false);
    let mut planned = plan(&f.subtitle);
    // 選擇台詞 merged the first and third cues, and swapped a translation in.
    let merged = PlannedCue {
        cue: Cue {
            index: 0,
            start_ms: 5000,
            end_ms: 8000,
            text: "合併的原文，第二段".into(),
            translation: Some("Merged".into()),
        },
        character_id: 2,
        segments: vec![(5000, 6000), (7000, 8000)],
        gap_ms: 500,
    };
    planned.retain(|p| p.cue.start_ms != 5000);
    planned.push(merged);
    let first = import_subtitle(
        &engine(&f, &encoder, &prober, &cancel, &quiet),
        &f.subtitle,
        &f.video,
        planned,
    )
    .unwrap();
    assert_eq!(first.status, RunStatus::Partial);
    assert_eq!(first.failures.len(), 2);

    // The subtitle file is gone; retry does not need it.
    fs::remove_file(&f.subtitle).unwrap();
    encoder.fail.lock().unwrap().clear();
    encoder.segments.lock().unwrap().clear();
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
    assert_eq!(out.status, RunStatus::Complete);
    assert_eq!(out.imported, 2);
    assert!(out.lost.is_empty() && out.changed_sources.is_empty());
    let mut encoded = encoder.segments.lock().unwrap().clone();
    encoded.sort();
    assert_eq!(
        encoded,
        [vec![(3000, 4000)], vec![(5000, 6000), (7000, 8000)]]
    );

    let rows = assert_rows_equal_files(&f.root);
    assert_eq!(rows.len(), 5, "every planned line is in the library now");
    assert!(failure_rows(&f.root).is_empty());
    let conn = rusqlite::Connection::open(f.root.join(crate::library::paths::DB_FILE)).unwrap();
    let (translation, duration): (Option<String>, i64) = conn
        .query_row(
            "SELECT translation, duration_ms FROM lines WHERE text = '合併的原文，第二段'",
            [],
            |r| Ok((r.get(0)?, r.get(1)?)),
        )
        .unwrap();
    assert_eq!(translation.as_deref(), Some("Merged"));
    assert_eq!(
        duration, 2500,
        "a merged line lasts as long as its segments and the gap between them"
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

/// The real sidecars, end to end: ffprobe reads the duration, ffmpeg cuts every cue, a cue
/// past the end is refused as out of range. Skipped where the pinned binaries are not built.
#[test]
fn real_ffmpeg_cuts_a_generated_video() {
    use super::job::FfprobeProber;
    use super::run::FfmpegEncoder;

    let triple = match (std::env::consts::ARCH, std::env::consts::OS) {
        ("aarch64", "macos") => "aarch64-apple-darwin",
        ("x86_64", "macos") => "x86_64-apple-darwin",
        ("x86_64", "windows") => "x86_64-pc-windows-msvc",
        _ => return,
    };
    let bin = |name: &str| {
        Path::new(env!("CARGO_MANIFEST_DIR"))
            .join("binaries")
            .join(format!("{name}-{triple}{}", std::env::consts::EXE_SUFFIX))
    };
    let (ffmpeg, ffprobe) = (bin("ffmpeg"), bin("ffprobe"));
    if !ffmpeg.is_file() || !ffprobe.is_file() {
        eprintln!("skipped: {} not built", ffmpeg.display());
        return;
    }

    let f = fixture();
    // 5 s of test tone behind a black picture, like the smoke test's source.
    let video = f.root.parent().unwrap().join("tone.mp4");
    let status = std::process::Command::new(&ffmpeg)
        .args([
            "-v",
            "error",
            "-f",
            "lavfi",
            "-i",
            "sine=frequency=440:duration=5",
        ])
        .args([
            "-f",
            "lavfi",
            "-i",
            "color=c=black:s=64x64:d=5",
            "-c:a",
            "aac",
            "-c:v",
            "mpeg4",
        ])
        .args(["-shortest", "-y"])
        .arg(&video)
        .status()
        .unwrap();
    assert!(status.success());
    fs::write(
        &f.subtitle,
        "1\n00:00:00,500 --> 00:00:01,500\n一\n\n2\n00:00:02,000 --> 00:00:03,250\n二\n\n3\n00:00:09,000 --> 00:00:10,000\n三\n",
    )
    .unwrap();

    let encoder = FfmpegEncoder { ffmpeg };
    let prober = FfprobeProber { ffprobe };
    let cancel = AtomicBool::new(false);
    let engine = Engine {
        library: &f.root,
        writer: &f.writer,
        encoder: &encoder,
        prober: &prober,
        workers: 2,
        cancel: &cancel,
        on_event: &quiet,
    };
    let out = import_subtitle(&engine, &f.subtitle, &video, plan(&f.subtitle)).unwrap();

    assert_eq!(out.imported, 2, "{:?}", out.failures);
    assert_eq!(out.failures.len(), 1);
    assert_eq!(out.failures[0].reason, Reason::OutOfRange);
    let rows = assert_rows_equal_files(&f.root);
    for (name, _) in &rows {
        let bytes = fs::metadata(f.root.join(name)).unwrap().len();
        assert!(bytes > 1000, "{name} is only {bytes} bytes");
    }
}

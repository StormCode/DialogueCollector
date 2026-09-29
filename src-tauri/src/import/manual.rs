//! 直接匯入現有影音 (R6 as corrected 2026-09-28): every file becomes one line.
//!
//! - A video's whole first audio stream is encoded to m4a; an audio file (m4a, mp3, ogg) is
//!   copied in as it was, keeping its extension.
//! - Both go through `commit_cue`, so the ENG2 write order is the same as the subtitle path's.
//! - A file that fails is skipped and reported; the others carry on.
//! - 取消 takes back every line this run wrote, so the form can simply be submitted again.

use std::fs;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};

use serde::Serialize;

use crate::library::{deletion, paths::TMP_DIR};
use crate::media::ffmpeg::{self, Probe};
use crate::media::{new_clip_filename, MediaError, CLIP_EXTENSION, CLIP_EXTENSIONS};
use crate::store::writer::Writer;

use super::commit::{commit_cue, NewLine};
use super::run::{classify_import, classify_media, Progress};
use super::runs::{Reason, RunStatus};
use super::ImportError;

/// One file as InputLine filled it in.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ManualItem {
    pub path: PathBuf,
    pub character_id: i64,
    pub text: String,
    pub translation: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ManualFailure {
    /// Position in the submitted list.
    pub index: usize,
    pub reason: Reason,
    pub detail: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ManualOutcome {
    pub status: RunStatus,
    pub imported: usize,
    pub failures: Vec<ManualFailure>,
}

/// ffprobe and ffmpeg, behind a trait so the runner is tested without them.
pub trait Media: Sync {
    fn probe(&self, source: &Path, cancel: &AtomicBool) -> Result<Probe, MediaError>;
    fn extract(&self, source: &Path, out: &Path, cancel: &AtomicBool) -> Result<(), MediaError>;
}

/// The bundled sidecars.
pub struct Sidecars {
    pub ffmpeg: PathBuf,
    pub ffprobe: PathBuf,
}

impl Media for Sidecars {
    fn probe(&self, source: &Path, cancel: &AtomicBool) -> Result<Probe, MediaError> {
        ffmpeg::probe(&self.ffprobe, source, cancel)
    }

    fn extract(&self, source: &Path, out: &Path, cancel: &AtomicBool) -> Result<(), MediaError> {
        ffmpeg::extract_audio(&self.ffmpeg, source, out, cancel).map(|_| ())
    }
}

pub struct ManualRun<'a> {
    pub library: &'a Path,
    pub writer: &'a Writer,
    pub media: &'a dyn Media,
    pub cancel: &'a AtomicBool,
    pub on_progress: &'a (dyn Fn(Progress) + Sync),
}

/// The clip extension an audio file keeps, or `None` for a file ffmpeg must encode.
pub fn kept_extension(path: &Path) -> Option<&'static str> {
    let ext = path.extension()?.to_str()?.to_ascii_lowercase();
    CLIP_EXTENSIONS.iter().copied().find(|e| *e == ext)
}

enum Outcome {
    Imported(i64),
    Failed(Reason, Option<String>),
    Cancelled,
}

pub fn import_files(run: &ManualRun<'_>, items: Vec<ManualItem>) -> ManualOutcome {
    let total = items.len();
    let mut progress = Progress {
        done: 0,
        total,
        imported: 0,
        failed: 0,
    };
    let mut written = Vec::new();
    let mut failures = Vec::new();

    for (index, item) in items.into_iter().enumerate() {
        if run.cancel.load(Ordering::Acquire) {
            break;
        }
        match import_one(run, &item) {
            Outcome::Imported(id) => {
                written.push(id);
                progress.imported += 1;
            }
            Outcome::Failed(reason, detail) => {
                log::warn!(
                    "直接匯入 {} failed: {reason:?} {detail:?}",
                    item.path.display()
                );
                failures.push(ManualFailure {
                    index,
                    reason,
                    detail,
                });
                progress.failed += 1;
            }
            Outcome::Cancelled => break,
        }
        progress.done += 1;
        (run.on_progress)(progress);
    }

    if run.cancel.load(Ordering::Acquire) {
        undo(run, written);
        return ManualOutcome {
            status: RunStatus::Cancelled,
            imported: 0,
            failures: Vec::new(),
        };
    }
    let imported = written.len();
    let status = if failures.is_empty() {
        RunStatus::Complete
    } else if imported == 0 {
        RunStatus::Failed
    } else {
        RunStatus::Partial
    };
    ManualOutcome {
        status,
        imported,
        failures,
    }
}

fn import_one(run: &ManualRun<'_>, item: &ManualItem) -> Outcome {
    let probe = match run.media.probe(&item.path, run.cancel) {
        Ok(p) => p,
        Err(_) if run.cancel.load(Ordering::Acquire) => return Outcome::Cancelled,
        Err(e) => {
            let (reason, detail) = classify_media(&e);
            return Outcome::Failed(reason, detail);
        }
    };
    if !probe.has_audio {
        return Outcome::Failed(Reason::NoAudio, None);
    }
    let Some(duration_ms) = probe.duration_ms.filter(|d| *d > 0) else {
        return Outcome::Failed(Reason::DecodeFailed, Some("no duration".into()));
    };

    let tmp = run
        .library
        .join(TMP_DIR)
        .join(format!("{}.tmp", new_clip_filename()));
    let extension = match kept_extension(&item.path) {
        Some(ext) => {
            if let Err(e) = fs::copy(&item.path, &tmp) {
                remove_quietly(&tmp);
                let (reason, detail) = classify_import(&ImportError::io(&tmp, e));
                return Outcome::Failed(reason, detail);
            }
            ext
        }
        None => {
            let result = run.media.extract(&item.path, &tmp, run.cancel);
            if run.cancel.load(Ordering::Acquire) {
                remove_quietly(&tmp);
                return Outcome::Cancelled;
            }
            if let Err(e) = result {
                remove_quietly(&tmp);
                let (reason, detail) = classify_media(&e);
                return Outcome::Failed(reason, detail);
            }
            CLIP_EXTENSION
        }
    };

    let text = item.text.trim().to_owned();
    let translation = item
        .translation
        .as_deref()
        .map(str::trim)
        .filter(|t| !t.is_empty())
        .map(str::to_owned);
    let line = NewLine {
        character_id: item.character_id,
        text,
        translation,
        duration_ms: duration_ms as i64,
        extension,
    };
    match commit_cue(run.library, run.writer, &tmp, line) {
        Ok(c) => Outcome::Imported(c.line_id),
        Err(e) => {
            remove_quietly(&tmp);
            let (reason, detail) = classify_import(&e);
            Outcome::Failed(reason, detail)
        }
    }
}

/// 取消: the rows go in one transaction, their files through `pending_deletions` (ENG3).
fn undo(run: &ManualRun<'_>, ids: Vec<i64>) {
    if ids.is_empty() {
        return;
    }
    let root = run.library.to_owned();
    let undone = run.writer.write(move |conn| {
        let tx = conn.transaction()?;
        deletion::delete_lines(&tx, &ids)?;
        tx.commit()?;
        deletion::drain(conn, &root)?;
        Ok(())
    });
    if let Err(e) = undone {
        log::warn!("could not undo a cancelled 直接匯入: {e}");
    }
}

fn remove_quietly(path: &Path) {
    match fs::remove_file(path) {
        Ok(()) => {}
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => {}
        Err(e) => log::warn!("could not remove {}: {e}", path.display()),
    }
}

#[cfg(test)]
mod tests {
    use std::sync::Mutex;

    use super::*;
    use crate::library::folder::Library;
    use crate::library::paths::DB_FILE;

    /// Probes every file as 2.5 s of audio unless its name says otherwise; "extracts" by
    /// writing a few bytes, and can raise the cancel flag while doing so.
    struct FakeMedia {
        cancel_on_extract: Option<&'static str>,
        cancel: Option<&'static AtomicBool>,
    }

    impl Media for FakeMedia {
        fn probe(&self, source: &Path, _: &AtomicBool) -> Result<Probe, MediaError> {
            let name = source.file_name().unwrap().to_string_lossy();
            Ok(Probe {
                duration_ms: Some(2500),
                has_audio: !name.contains("silent"),
            })
        }

        fn extract(&self, source: &Path, out: &Path, _: &AtomicBool) -> Result<(), MediaError> {
            let name = source.file_name().unwrap().to_string_lossy();
            if name.contains("broken") {
                return Err(MediaError::Exit {
                    code: Some(1),
                    stderr_tail: "Invalid data found when processing input".into(),
                });
            }
            fs::write(out, b"m4a").unwrap();
            if self.cancel_on_extract.is_some_and(|n| name.contains(n)) {
                self.cancel.unwrap().store(true, Ordering::SeqCst);
            }
            Ok(())
        }
    }

    fn setup() -> (tempfile::TempDir, PathBuf, Writer) {
        let dir = tempfile::tempdir().unwrap();
        let lib = Library::create(&dir.path().join("lib")).unwrap();
        lib.conn()
            .execute(
                "INSERT INTO characters (id, name, category, source, created_at, updated_at)
                 VALUES (1, '芙莉蓮', 'anime', '葬送的芙莉蓮', 0, 0)",
                [],
            )
            .unwrap();
        let root = lib.root().to_owned();
        drop(lib);
        let writer = Writer::open(&root.join(DB_FILE)).unwrap();
        (dir, root, writer)
    }

    fn source(dir: &Path, name: &str) -> PathBuf {
        let p = dir.join(name);
        fs::write(&p, b"source").unwrap();
        p
    }

    fn item(path: PathBuf, text: &str) -> ManualItem {
        ManualItem {
            path,
            character_id: 1,
            text: text.into(),
            translation: None,
        }
    }

    fn clips(root: &Path) -> Vec<String> {
        let mut names: Vec<String> = fs::read_dir(root)
            .unwrap()
            .map(|e| e.unwrap().file_name().to_string_lossy().into_owned())
            .filter(|n| crate::media::is_clip_name(n))
            .collect();
        names.sort();
        names
    }

    fn rows(root: &Path) -> Vec<(String, Option<String>, String, i64)> {
        let conn = rusqlite::Connection::open(root.join(DB_FILE)).unwrap();
        let mut stmt = conn
            .prepare("SELECT text, translation, audio_filename, duration_ms FROM lines ORDER BY id")
            .unwrap();
        stmt.query_map([], |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?, r.get(3)?)))
            .unwrap()
            .collect::<Result<_, _>>()
            .unwrap()
    }

    #[test]
    fn videos_are_encoded_and_audio_files_kept_as_they_were() {
        let (dir, root, writer) = setup();
        let media = FakeMedia {
            cancel_on_extract: None,
            cancel: None,
        };
        let cancel = AtomicBool::new(false);
        let seen = Mutex::new(Vec::new());
        let on_progress = |p: Progress| seen.lock().unwrap().push(p.done);
        let run = ManualRun {
            library: &root,
            writer: &writer,
            media: &media,
            cancel: &cancel,
            on_progress: &on_progress,
        };
        let outcome = import_files(
            &run,
            vec![
                item(source(dir.path(), "ep01.mkv"), "人類的壽命真的很短暫呢。"),
                ManualItem {
                    translation: Some("  Lovely breeze. ".into()),
                    ..item(source(dir.path(), "breeze.MP3"), "  ")
                },
                item(source(dir.path(), "voice.ogg"), "我們不會忘記你們的名字。"),
            ],
        );
        assert_eq!(outcome.status, RunStatus::Complete);
        assert_eq!(outcome.imported, 3);
        assert_eq!(*seen.lock().unwrap(), [1, 2, 3]);

        let rows = rows(&root);
        assert!(rows[0].2.ends_with(".m4a"));
        assert_eq!(rows[1].0, "", "a translation alone is enough");
        assert_eq!(rows[1].1.as_deref(), Some("Lovely breeze."));
        assert!(rows[1].2.ends_with(".mp3"), "kept as it was: {}", rows[1].2);
        assert!(rows[2].2.ends_with(".ogg"));
        assert!(rows.iter().all(|r| r.3 == 2500));
        // The copied files are byte for byte the sources.
        assert_eq!(fs::read(root.join(&rows[1].2)).unwrap(), b"source");
        assert_eq!(clips(&root).len(), 3);
        assert_eq!(fs::read_dir(root.join(TMP_DIR)).unwrap().count(), 0);
    }

    #[test]
    fn a_failed_file_is_skipped_and_reported() {
        let (dir, root, writer) = setup();
        let media = FakeMedia {
            cancel_on_extract: None,
            cancel: None,
        };
        let cancel = AtomicBool::new(false);
        let run = ManualRun {
            library: &root,
            writer: &writer,
            media: &media,
            cancel: &cancel,
            on_progress: &|_| {},
        };
        let outcome = import_files(
            &run,
            vec![
                item(source(dir.path(), "silent.mp4"), "a"),
                item(source(dir.path(), "ok.m4a"), "b"),
                item(source(dir.path(), "broken.webm"), "c"),
            ],
        );
        assert_eq!(outcome.status, RunStatus::Partial);
        assert_eq!(outcome.imported, 1);
        let reasons: Vec<_> = outcome
            .failures
            .iter()
            .map(|f| (f.index, f.reason))
            .collect();
        assert_eq!(reasons, [(0, Reason::NoAudio), (2, Reason::DecodeFailed)]);
        assert_eq!(clips(&root).len(), 1);
        assert_eq!(fs::read_dir(root.join(TMP_DIR)).unwrap().count(), 0);
    }

    #[test]
    fn cancel_takes_back_every_line_of_the_run() {
        static CANCEL: AtomicBool = AtomicBool::new(false);
        let (dir, root, writer) = setup();
        let media = FakeMedia {
            cancel_on_extract: Some("second"),
            cancel: Some(&CANCEL),
        };
        let run = ManualRun {
            library: &root,
            writer: &writer,
            media: &media,
            cancel: &CANCEL,
            on_progress: &|_| {},
        };
        let outcome = import_files(
            &run,
            vec![
                item(source(dir.path(), "first.m4a"), "a"),
                item(source(dir.path(), "second.mkv"), "b"),
                item(source(dir.path(), "third.mp3"), "c"),
            ],
        );
        assert_eq!(outcome.status, RunStatus::Cancelled);
        assert!(rows(&root).is_empty());
        assert!(clips(&root).is_empty());
        assert_eq!(fs::read_dir(root.join(TMP_DIR)).unwrap().count(), 0);
    }
}

/// The real sidecars: a generated video is probed and its whole audio encoded; an m4a made
/// from it goes in untouched. Skipped where the pinned binaries are not built.
#[cfg(test)]
mod real_sidecars {
    use super::*;
    use crate::library::folder::Library;
    use crate::library::paths::DB_FILE;

    #[test]
    fn real_ffmpeg_imports_a_video_and_keeps_an_audio_file() {
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
        let sidecars = Sidecars {
            ffmpeg: bin("ffmpeg"),
            ffprobe: bin("ffprobe"),
        };
        if !sidecars.ffmpeg.is_file() || !sidecars.ffprobe.is_file() {
            eprintln!("skipped: {} not built", sidecars.ffmpeg.display());
            return;
        }

        let dir = tempfile::tempdir().unwrap();
        let lib = Library::create(&dir.path().join("lib")).unwrap();
        lib.conn()
            .execute(
                "INSERT INTO characters (id, name, category, source, created_at, updated_at)
                 VALUES (1, '芙莉蓮', 'anime', '葬送的芙莉蓮', 0, 0)",
                [],
            )
            .unwrap();
        let root = lib.root().to_owned();
        drop(lib);
        let video = dir.path().join("tone.mp4");
        let audio = dir.path().join("tone.m4a");
        let gen = |args: &[&str], out: &Path| {
            let ok = std::process::Command::new(&sidecars.ffmpeg)
                .args(["-v", "error"])
                .args(args)
                .args(["-y"])
                .arg(out)
                .status()
                .unwrap()
                .success();
            assert!(ok, "could not generate {}", out.display());
        };
        gen(
            &[
                "-f",
                "lavfi",
                "-i",
                "sine=frequency=440:duration=3",
                "-f",
                "lavfi",
                "-i",
                "color=c=black:s=64x64:d=3",
                "-c:a",
                "aac",
                "-c:v",
                "mpeg4",
                "-shortest",
            ],
            &video,
        );
        gen(
            &[
                "-f",
                "lavfi",
                "-i",
                "sine=frequency=220:duration=2",
                "-c:a",
                "aac",
            ],
            &audio,
        );

        let writer = Writer::open(&root.join(DB_FILE)).unwrap();
        let cancel = AtomicBool::new(false);
        let run = ManualRun {
            library: &root,
            writer: &writer,
            media: &sidecars,
            cancel: &cancel,
            on_progress: &|_| {},
        };
        let item = |path: PathBuf| ManualItem {
            path,
            character_id: 1,
            text: "人類的壽命真的很短暫呢。".into(),
            translation: None,
        };
        let outcome = import_files(&run, vec![item(video), item(audio.clone())]);
        assert_eq!(outcome.status, RunStatus::Complete, "{outcome:?}");

        let conn = rusqlite::Connection::open(root.join(DB_FILE)).unwrap();
        let rows: Vec<(String, i64)> = conn
            .prepare("SELECT audio_filename, duration_ms FROM lines ORDER BY id")
            .unwrap()
            .query_map([], |r| Ok((r.get(0)?, r.get(1)?)))
            .unwrap()
            .collect::<Result<_, _>>()
            .unwrap();
        assert!(
            (2900..=3100).contains(&rows[0].1),
            "video audio {} ms",
            rows[0].1
        );
        let probed = ffmpeg::probe(&sidecars.ffprobe, &root.join(&rows[0].0), &cancel).unwrap();
        assert!(probed.has_audio);
        assert_eq!(
            fs::read(root.join(&rows[1].0)).unwrap(),
            fs::read(&audio).unwrap()
        );
    }
}

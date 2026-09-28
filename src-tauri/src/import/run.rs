//! One pass of the cue → clip pipeline (T7, D11 → B, FC8, ENG6).
//!
//! - Cues are encoded up to `workers` at a time; each is committed (`commit_cue`) as soon as it
//!   is encoded, so work done before a crash or a cancel is kept.
//! - A cue that fails is skipped and reported with a reason; the others carry on (部分完成).
//! - Cancel kills every in-flight ffmpeg at once. A cancelled cue leaves nothing behind in any
//!   state it is caught in: its `.tmp` is removed; if it was already committed, its row is
//!   deleted and its file queued in `pending_deletions` and unlinked (ENG6 + ENG3). Cues that
//!   finished before the cancel are kept.

use std::collections::VecDeque;
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Mutex;

use serde::Serialize;

use crate::library::{deletion, paths::TMP_DIR};
use crate::media::{new_clip_filename, MediaError};
use crate::store::writer::Writer;
use crate::subs::Cue;

use super::commit::{commit_cue, CommittedCue, NewLine};
use super::runs::{Failure, Reason, RunStatus};
use super::ImportError;

/// Encodes one cue to `out`. Must return `MediaError::Killed` promptly once `cancel` is set.
pub trait Encoder: Send + Sync {
    fn encode(
        &self,
        source: &Path,
        start_ms: u64,
        end_ms: u64,
        out: &Path,
        cancel: &AtomicBool,
    ) -> Result<(), MediaError>;
}

/// The bundled ffmpeg.
pub struct FfmpegEncoder {
    pub ffmpeg: PathBuf,
}

impl Encoder for FfmpegEncoder {
    fn encode(
        &self,
        source: &Path,
        start_ms: u64,
        end_ms: u64,
        out: &Path,
        cancel: &AtomicBool,
    ) -> Result<(), MediaError> {
        crate::media::ffmpeg::encode_cue(&self.ffmpeg, source, start_ms, end_ms, out, cancel)
            .map(|_| ())
    }
}

/// A cue with its Step 2 assignment.
#[derive(Debug, Clone, PartialEq)]
pub struct PlannedCue {
    pub cue: Cue,
    pub character_id: i64,
}

/// Progress, emitted after every cue settles.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Progress {
    pub done: usize,
    pub total: usize,
    pub imported: usize,
    pub failed: usize,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Event {
    /// A cue's row is committed. (Tests use it to cancel at exactly this point.)
    Committed {
        cue_index: u32,
    },
    Progress(Progress),
}

pub struct Pass<'a> {
    pub library: &'a Path,
    pub writer: &'a Writer,
    pub encoder: &'a dyn Encoder,
    pub source: &'a Path,
    /// From ffprobe; cues starting at or after it are `OutOfRange`.
    pub duration_ms: Option<u64>,
    pub workers: usize,
    pub cancel: &'a AtomicBool,
    pub on_event: &'a (dyn Fn(Event) + Sync),
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PassSummary {
    pub imported: Vec<CommittedCue>,
    /// Failed and cancelled cues, by cue index.
    pub failures: Vec<Failure>,
    pub status: RunStatus,
}

enum Outcome {
    Imported(CommittedCue),
    Failed(Reason, Option<String>),
    Cancelled,
}

/// `min(4, available cores)` (FC8).
pub fn default_workers() -> usize {
    std::thread::available_parallelism().map_or(1, |n| n.get().min(4))
}

pub fn run_pass(pass: &Pass<'_>, cues: Vec<PlannedCue>) -> PassSummary {
    let total = cues.len();
    let queue = Mutex::new(cues.into_iter().collect::<VecDeque<_>>());
    let settled = Mutex::new(Vec::with_capacity(total));
    let counts = Mutex::new(Progress {
        done: 0,
        total,
        imported: 0,
        failed: 0,
    });

    std::thread::scope(|scope| {
        for _ in 0..pass.workers.max(1) {
            scope.spawn(|| loop {
                let Some(job) = queue.lock().unwrap().pop_front() else {
                    break;
                };
                let outcome = if pass.cancel.load(Ordering::Acquire) {
                    Outcome::Cancelled
                } else {
                    process(pass, &job)
                };
                let progress = {
                    let mut c = counts.lock().unwrap();
                    c.done += 1;
                    match outcome {
                        Outcome::Imported(_) => c.imported += 1,
                        Outcome::Failed(..) => c.failed += 1,
                        Outcome::Cancelled => {}
                    }
                    *c
                };
                settled.lock().unwrap().push((job, outcome));
                (pass.on_event)(Event::Progress(progress));
            });
        }
    });

    let mut imported = Vec::new();
    let mut failures = Vec::new();
    for (job, outcome) in settled.into_inner().unwrap() {
        let failure = |reason, detail| Failure {
            cue_index: job.cue.index,
            text: job.cue.text.clone(),
            start_ms: job.cue.start_ms,
            end_ms: job.cue.end_ms,
            character_id: job.character_id,
            reason,
            detail,
        };
        match outcome {
            Outcome::Imported(c) => imported.push(c),
            Outcome::Failed(reason, detail) => failures.push(failure(reason, detail)),
            Outcome::Cancelled => failures.push(failure(Reason::Cancelled, None)),
        }
    }
    failures.sort_by_key(|f| f.cue_index);

    let status = if pass.cancel.load(Ordering::Acquire) {
        RunStatus::Cancelled
    } else if failures.is_empty() {
        RunStatus::Complete
    } else if imported.is_empty() {
        RunStatus::Failed
    } else {
        RunStatus::Partial
    };
    PassSummary {
        imported,
        failures,
        status,
    }
}

fn process(pass: &Pass<'_>, job: &PlannedCue) -> Outcome {
    let cue = &job.cue;
    if cue.end_ms <= cue.start_ms {
        return Outcome::Failed(Reason::ZeroLength, None);
    }
    if pass.duration_ms.is_some_and(|d| cue.start_ms >= d) {
        return Outcome::Failed(Reason::OutOfRange, None);
    }

    let tmp = pass
        .library
        .join(TMP_DIR)
        .join(format!("{}.tmp", new_clip_filename()));
    let encoded = pass
        .encoder
        .encode(pass.source, cue.start_ms, cue.end_ms, &tmp, pass.cancel);
    if pass.cancel.load(Ordering::Acquire) {
        remove_quietly(&tmp);
        return Outcome::Cancelled;
    }
    if let Err(e) = encoded {
        remove_quietly(&tmp);
        let (reason, detail) = classify_media(&e);
        return Outcome::Failed(reason, detail);
    }

    let line = NewLine {
        character_id: job.character_id,
        text: cue.text.clone(),
        translation: cue.translation.clone(),
        duration_ms: (cue.end_ms - cue.start_ms) as i64,
    };
    let committed = match commit_cue(pass.library, pass.writer, &tmp, line) {
        Ok(c) => c,
        Err(e) => {
            remove_quietly(&tmp);
            let (reason, detail) = classify_import(&e);
            return Outcome::Failed(reason, detail);
        }
    };
    (pass.on_event)(Event::Committed {
        cue_index: cue.index,
    });

    if pass.cancel.load(Ordering::Acquire) {
        // Caught after its commit: the row goes in a transaction, the file through
        // pending_deletions, so nothing of a cancelled cue survives (ENG6).
        let root = pass.library.to_owned();
        let id = committed.line_id;
        let undone = pass.writer.write(move |conn| {
            let tx = conn.transaction()?;
            deletion::delete_lines(&tx, &[id])?;
            tx.commit()?;
            deletion::drain(conn, &root)?;
            Ok(())
        });
        if let Err(e) = undone {
            log::warn!("could not undo cancelled cue {}: {e}", cue.index);
        }
        return Outcome::Cancelled;
    }
    Outcome::Imported(committed)
}

fn remove_quietly(path: &Path) {
    match fs::remove_file(path) {
        Ok(()) => {}
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => {}
        Err(e) => log::warn!("could not remove {}: {e}", path.display()),
    }
}

/// ffmpeg's outcome → the reason 部分完成 shows. Pure, so it is tested without ffmpeg.
pub fn classify_media(err: &MediaError) -> (Reason, Option<String>) {
    match err {
        MediaError::SidecarUnusable(detail) => (Reason::SidecarUnusable, Some(detail.clone())),
        MediaError::Killed => (Reason::Killed, None),
        MediaError::Exit { stderr_tail, .. } => {
            let lower = stderr_tail.to_ascii_lowercase();
            let reason = if lower.contains("no space left") || lower.contains("disk full") {
                Reason::DiskFull
            } else if [
                "invalid data found",
                "error while decoding",
                "matches no streams",
                "does not contain any stream",
                "could not find codec parameters",
                "decoding error",
            ]
            .iter()
            .any(|needle| lower.contains(needle))
            {
                Reason::DecodeFailed
            } else {
                Reason::Other
            };
            (reason, Some(stderr_tail.clone()))
        }
    }
}

fn classify_import(err: &ImportError) -> (Reason, Option<String>) {
    let reason = match err {
        ImportError::Io { source, .. } if is_disk_full(source) => Reason::DiskFull,
        _ => Reason::WriteFailed,
    };
    (reason, Some(err.to_string()))
}

fn is_disk_full(e: &std::io::Error) -> bool {
    #[cfg(unix)]
    const CODES: &[i32] = &[libc_enospc()];
    // ERROR_DISK_FULL, ERROR_HANDLE_DISK_FULL
    #[cfg(windows)]
    const CODES: &[i32] = &[112, 39];
    e.kind() == std::io::ErrorKind::StorageFull
        || e.raw_os_error().is_some_and(|c| CODES.contains(&c))
}

/// ENOSPC is 28 on both Linux and macOS.
#[cfg(unix)]
const fn libc_enospc() -> i32 {
    28
}

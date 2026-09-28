//! Starting a subtitle import and retrying one (T7, ENG4).
//!
//! Retry re-reads BOTH sources — the subtitle file is re-parsed and the video re-probed; nothing
//! from the first pass is reused (D11). Each failed cue is found again by its text, ties broken
//! by the start time nearest the recorded one, so inserting a line at the top of the file does
//! not shift anything; a cue whose text is gone is marked lost and kept on record. A changed
//! source only warns (ENG4); a missing one is `SourceMissing`.

use std::path::{Path, PathBuf};
use std::sync::atomic::AtomicBool;

use serde::Serialize;

use crate::media::ffmpeg::Probe;
use crate::media::MediaError;
use crate::store::writer::Writer;
use crate::subs::{self, Cue};

use super::run::{run_pass, Encoder, Event, Pass, PassSummary, PlannedCue};
use super::runs::{self, SourceStamp, StoredFailure};
use super::ImportError;

/// Reads a video's duration and audio streams.
pub trait Prober: Send + Sync {
    fn probe(&self, source: &Path, cancel: &AtomicBool) -> Result<Probe, MediaError>;
}

/// The bundled ffprobe.
pub struct FfprobeProber {
    pub ffprobe: PathBuf,
}

impl Prober for FfprobeProber {
    fn probe(&self, source: &Path, cancel: &AtomicBool) -> Result<Probe, MediaError> {
        crate::media::ffmpeg::probe(&self.ffprobe, source, cancel)
    }
}

/// What the engine needs besides the sources.
pub struct Engine<'a> {
    pub library: &'a Path,
    pub writer: &'a Writer,
    pub encoder: &'a dyn Encoder,
    pub prober: &'a dyn Prober,
    pub workers: usize,
    pub cancel: &'a AtomicBool,
    pub on_event: &'a (dyn Fn(Event) + Sync),
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct JobOutcome {
    pub run_id: i64,
    pub imported: usize,
    pub failures: Vec<runs::Failure>,
    pub status: runs::RunStatus,
    /// Retry only: failed cues whose text is no longer in the subtitle file.
    pub lost: Vec<u32>,
    /// Retry only: sources whose size or mtime changed since the first run (a warning).
    pub changed_sources: Vec<PathBuf>,
}

/// Imports `cues` (Step 2's assignments) from `video` into the library.
pub fn import_subtitle(
    engine: &Engine<'_>,
    subtitle: &Path,
    video: &Path,
    cues: Vec<PlannedCue>,
) -> Result<JobOutcome, ImportError> {
    for path in [subtitle, video] {
        if !path.is_file() {
            return Err(ImportError::SourceMissing(path.to_owned()));
        }
    }
    let probe = engine.prober.probe(video, engine.cancel)?;
    if !probe.has_audio {
        return Err(ImportError::NoAudio(video.to_owned()));
    }
    let run_id = runs::start_subtitle_run(
        engine.writer,
        &SourceStamp::of(subtitle),
        &SourceStamp::of(video),
    )?;
    let summary = run_pass(&pass(engine, video, probe), cues);
    finish(engine, run_id, summary, Vec::new(), Vec::new())
}

/// 再試一次: re-runs the failed and cancelled cues of `run_id` from fresh reads of its sources.
pub fn retry(engine: &Engine<'_>, run_id: i64) -> Result<JobOutcome, ImportError> {
    let (subtitle, video, failures) =
        runs::load_for_retry(engine.writer, run_id)?.ok_or(ImportError::RunNotFound(run_id))?;
    for stamp in [&subtitle, &video] {
        if !stamp.path.is_file() {
            return Err(ImportError::SourceMissing(stamp.path.clone()));
        }
    }
    let changed_sources: Vec<PathBuf> = [&subtitle, &video]
        .into_iter()
        .filter(|s| SourceStamp::of(&s.path) != **s)
        .map(|s| s.path.clone())
        .collect();
    if !changed_sources.is_empty() {
        log::warn!("retrying run {run_id} from changed sources: {changed_sources:?}");
    }

    // Both sources are opened again: nothing from the first pass is reused.
    let parsed = subs::parse_file(&subtitle.path)?;
    let probe = engine.prober.probe(&video.path, engine.cancel)?;
    if !probe.has_audio {
        return Err(ImportError::NoAudio(video.path.clone()));
    }

    let (planned, retried, lost) = match_failures(&failures, &parsed);
    runs::begin_retry(
        engine.writer,
        run_id,
        retried,
        lost.iter().map(|f| f.id).collect(),
    )?;
    let summary = run_pass(&pass(engine, &video.path, probe), planned);
    finish(
        engine,
        run_id,
        summary,
        lost.iter().map(|f| f.cue_index).collect(),
        changed_sources,
    )
}

fn pass<'a>(engine: &'a Engine<'a>, video: &'a Path, probe: Probe) -> Pass<'a> {
    Pass {
        library: engine.library,
        writer: engine.writer,
        encoder: engine.encoder,
        source: video,
        duration_ms: probe.duration_ms,
        workers: engine.workers,
        cancel: engine.cancel,
        on_event: engine.on_event,
    }
}

fn finish(
    engine: &Engine<'_>,
    run_id: i64,
    summary: PassSummary,
    lost: Vec<u32>,
    changed_sources: Vec<PathBuf>,
) -> Result<JobOutcome, ImportError> {
    let PassSummary {
        imported,
        failures,
        status,
    } = summary;
    runs::finish_run(
        engine.writer,
        run_id,
        status,
        imported.len(),
        failures.clone(),
    )?;
    Ok(JobOutcome {
        run_id,
        imported: imported.len(),
        failures,
        status,
        lost,
        changed_sources,
    })
}

/// Finds each failure again in the re-parsed cues: same text, and among repeats the start time
/// nearest the recorded one. Pairs are taken closest-first across all failures, so one failure
/// cannot take the cue another failure sits right next to. Each parsed cue is used at most
/// once. Returns the cues to retry (in failure order), the failure ids being retried, and the
/// failures that are lost.
pub(crate) fn match_failures(
    failures: &[StoredFailure],
    parsed: &[Cue],
) -> (Vec<PlannedCue>, Vec<i64>, Vec<StoredFailure>) {
    let mut pairs: Vec<(u64, usize, usize)> = Vec::new();
    for (fi, failure) in failures.iter().enumerate() {
        for (ci, cue) in parsed.iter().enumerate() {
            if cue.text == failure.cue_text {
                pairs.push((cue.start_ms.abs_diff(failure.start_ms), fi, ci));
            }
        }
    }
    pairs.sort_unstable();

    let mut matched: Vec<Option<usize>> = vec![None; failures.len()];
    let mut used = vec![false; parsed.len()];
    for (_, fi, ci) in pairs {
        if matched[fi].is_none() && !used[ci] {
            matched[fi] = Some(ci);
            used[ci] = true;
        }
    }

    let mut planned = Vec::new();
    let mut retried = Vec::new();
    let mut lost = Vec::new();
    for (failure, found) in failures.iter().zip(matched) {
        match found {
            Some(ci) => {
                planned.push(PlannedCue {
                    cue: parsed[ci].clone(),
                    character_id: failure.character_id,
                });
                retried.push(failure.id);
            }
            None => lost.push(failure.clone()),
        }
    }
    (planned, retried, lost)
}

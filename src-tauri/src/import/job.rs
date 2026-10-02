//! Starting a subtitle import and retrying one (T7, ENG4 as revised 2026-10-02).
//!
//! Retry rebuilds each failed line from what `import_failures` kept — its text, translation,
//! time segments and character — because a line picked in 選擇台詞 may have been merged or
//! swapped and no longer appears in the subtitle file. The video is probed again (nothing of
//! the first pass is reused); a changed video only warns (ENG4), a missing one is
//! `SourceMissing`.

use std::path::{Path, PathBuf};
use std::sync::atomic::AtomicBool;

use serde::Serialize;

use crate::media::ffmpeg::Probe;
use crate::media::MediaError;
use crate::store::writer::Writer;
use crate::subs::Cue;

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

/// 再試一次: re-runs the failed and cancelled lines of `run_id` from their records.
pub fn retry(engine: &Engine<'_>, run_id: i64) -> Result<JobOutcome, ImportError> {
    let (_subtitle, video, failures) =
        runs::load_for_retry(engine.writer, run_id)?.ok_or(ImportError::RunNotFound(run_id))?;
    if !video.path.is_file() {
        return Err(ImportError::SourceMissing(video.path.clone()));
    }
    let changed_sources: Vec<PathBuf> = (SourceStamp::of(&video.path) != video)
        .then(|| video.path.clone())
        .into_iter()
        .collect();
    if !changed_sources.is_empty() {
        log::warn!("retrying run {run_id} from a changed video: {changed_sources:?}");
    }

    // The video is opened again: nothing from the first pass is reused.
    let probe = engine.prober.probe(&video.path, engine.cancel)?;
    if !probe.has_audio {
        return Err(ImportError::NoAudio(video.path.clone()));
    }

    let planned = failures.iter().map(rebuild).collect();
    runs::begin_retry(
        engine.writer,
        run_id,
        failures.iter().map(|f| f.id).collect(),
        Vec::new(),
    )?;
    let summary = run_pass(&pass(engine, &video.path, probe), planned);
    finish(engine, run_id, summary, Vec::new(), changed_sources)
}

/// A failed line as it was planned, from its record.
fn rebuild(failure: &StoredFailure) -> PlannedCue {
    PlannedCue {
        cue: Cue {
            index: failure.cue_index,
            start_ms: failure.start_ms,
            end_ms: failure.end_ms,
            text: failure.cue_text.clone(),
            translation: failure.translation.clone(),
        },
        character_id: failure.character_id,
        segments: failure.segments.clone(),
        gap_ms: failure.gap_ms,
    }
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

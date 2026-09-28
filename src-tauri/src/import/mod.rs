//! The cue → clip pipeline. Both intake paths (subtitle and manual) are one pipeline with a
//! pluggable cue source (0G C1).
//!
//! Contracts this module owns, all specified in PLAN.md:
//! - `commit_cue` write order (ENG2 → A): `.tmp` → fsync → rename → insert → commit. This is
//!   the only place that order may exist.
//! - partial failure is skip-and-report with 部分完成 (D11 → B)
//! - retry re-reads both sources and matches by cue text, nearest start time on ties (ENG4);
//!   the full re-parse and re-probe are required and must not be cached
//! - cancel kills every in-flight ffmpeg child and leaves no `.tmp`, file or row (ENG6)
//! - a single-job guard: a second import cannot start while one is running
//!
//! 索引中 (R8, decided 2026-09-29) is the `commit_cue` phase: giving each clip its 12-character
//! name and writing its row. It is real work, normally quick, and builds no search index.

pub mod commit;
pub mod job;
pub mod run;
pub mod runs;

use std::path::{Path, PathBuf};

use crate::media::MediaError;
use crate::store::StoreError;
use crate::subs::SubsError;

#[derive(Debug, thiserror::Error)]
pub enum ImportError {
    #[error(transparent)]
    Subs(#[from] SubsError),

    #[error(transparent)]
    Media(#[from] MediaError),

    #[error(transparent)]
    Store(#[from] StoreError),

    #[error("an import is already running")]
    AlreadyRunning,

    #[error("source file changed since the original run: {0}")]
    SourceChanged(std::path::PathBuf),

    #[error("source file is missing: {0}")]
    SourceMissing(std::path::PathBuf),

    /// The video has no audio stream to cut from (the 匯入失敗 screen).
    #[error("the video has no audio stream: {0}")]
    NoAudio(PathBuf),

    #[error("import run {0} not found")]
    RunNotFound(i64),

    #[error("{path}: {source}")]
    Io {
        path: PathBuf,
        #[source]
        source: std::io::Error,
    },
}

impl ImportError {
    pub fn io(path: &Path, source: std::io::Error) -> Self {
        Self::Io {
            path: path.to_owned(),
            source,
        }
    }
}

#[cfg(test)]
mod tests;

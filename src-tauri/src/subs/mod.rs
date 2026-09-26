//! Subtitle parsing: ASS and SRT → `Cue`s.
//!
//! OPEN DECISION F2 (PLAN.md "Unresolved Decisions"): which side parses subtitles — Rust or
//! the renderer. Must be recorded before this module gains a parser. If Rust, the chosen
//! crate must handle ASS `Comment:` events, `\N`, `{...}` override blocks and the Name field.

use serde::{Deserialize, Serialize};

pub const SUBTITLE_EXTENSIONS: &[&str] = &["ass", "srt"];

/// One timed line from a subtitle file.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Cue {
    /// Position in the source file, 0-based.
    pub index: u32,
    pub start_ms: u64,
    pub end_ms: u64,
    /// Plain text, override tags stripped, `\N` turned into a newline.
    pub text: String,
}

#[derive(Debug, thiserror::Error)]
pub enum SubsError {
    #[error("subtitle file not found: {0}")]
    NotFound(std::path::PathBuf),

    #[error("unsupported subtitle format: {0}")]
    UnsupportedFormat(String),

    #[error("subtitle file could not be parsed: {0}")]
    Parse(String),
}

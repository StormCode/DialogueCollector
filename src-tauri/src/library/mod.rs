//! The self-contained library folder (D8 → B) and everything that must stay consistent
//! with it: the folder pointer, the two settings files (ENG17), re-pointing, the volume
//! check (ENG5), deletion with `pending_deletions` (ENG3), and export/import (D10, D14).
//!
//! Layout of a library folder:
//! ```text
//! <library>/
//!   library.sqlite      audio paths inside are relative to this directory
//!   <12 A-Z0-9>.m4a     one file per line
//!   images/             portraits and posters (R1)
//!   .tmp/               same-volume scratch space, swept on open (R4)
//! ```

pub mod paths;
pub mod settings;

use std::path::PathBuf;

#[derive(Debug, thiserror::Error)]
pub enum LibraryError {
    #[error("cannot determine the OS {0} directory")]
    NoOsDir(&'static str),

    #[error("settings file {path}: {source}")]
    SettingsIo {
        path: PathBuf,
        #[source]
        source: std::io::Error,
    },

    #[error("settings file {path} is not valid: {source}")]
    SettingsParse {
        path: PathBuf,
        #[source]
        source: serde_json::Error,
    },

    #[error("invalid setting `{field}`: {reason}")]
    InvalidSetting { field: &'static str, reason: String },
}

impl LibraryError {
    /// Stable identifier sent to the renderer as `CommandError.kind`.
    pub fn kind(&self) -> &'static str {
        match self {
            Self::NoOsDir(_) => "NoOsDir",
            Self::SettingsIo { .. } => "SettingsIo",
            Self::SettingsParse { .. } => "SettingsParse",
            Self::InvalidSetting { .. } => "InvalidSetting",
        }
    }
}

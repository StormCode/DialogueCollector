//! The error shape that crosses the IPC boundary.
//!
//! Each module owns a `thiserror` enum (no `anyhow` at boundaries, no catch-alls). Commands
//! convert those into `CommandError`, which serializes as `{ kind, message }` so the
//! renderer can branch on `kind` and localize the text itself.

use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct CommandError {
    /// Stable, machine-readable identifier, e.g. `"Library.Settings"`.
    pub kind: String,
    /// Developer-facing detail; the renderer shows localized copy keyed on `kind`.
    pub message: String,
}

impl CommandError {
    pub fn new(kind: impl Into<String>, message: impl ToString) -> Self {
        Self {
            kind: kind.into(),
            message: message.to_string(),
        }
    }
}

impl From<crate::library::LibraryError> for CommandError {
    fn from(e: crate::library::LibraryError) -> Self {
        Self::new(format!("Library.{}", e.kind()), e)
    }
}

impl From<crate::media::MediaError> for CommandError {
    fn from(e: crate::media::MediaError) -> Self {
        use crate::media::MediaError;
        let kind = match e {
            MediaError::SidecarUnusable(_) => "Media.SidecarUnusable",
            MediaError::Exit { .. } => "Media.Exit",
            MediaError::Killed => "Media.Killed",
        };
        Self::new(kind, e)
    }
}

impl From<crate::store::StoreError> for CommandError {
    fn from(e: crate::store::StoreError) -> Self {
        use crate::store::StoreError;
        let kind = match e {
            StoreError::Sqlite(_) => "Store.Sqlite",
            StoreError::SchemaTooNew { .. } => "Store.SchemaTooNew",
        };
        Self::new(kind, e)
    }
}

pub type CommandResult<T> = Result<T, CommandError>;

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
            StoreError::Migration { .. } => "Store.Migration",
            StoreError::WriterSpawn(_) => "Store.WriterSpawn",
            StoreError::WriterClosed => "Store.WriterClosed",
        };
        Self::new(kind, e)
    }
}

impl From<crate::library::backup::BackupError> for CommandError {
    fn from(e: crate::library::backup::BackupError) -> Self {
        use crate::library::backup::BackupError;
        match e {
            // Surface the underlying library/store kind so the renderer handles them uniformly.
            BackupError::Library(inner) => inner.into(),
            BackupError::Store(inner) => inner.into(),
            other => Self::new(format!("Backup.{}", other.kind()), other),
        }
    }
}

impl From<crate::updater::UpdateError> for CommandError {
    fn from(e: crate::updater::UpdateError) -> Self {
        Self::new(format!("Update.{}", e.kind()), e)
    }
}

impl From<crate::subs::SubsError> for CommandError {
    fn from(e: crate::subs::SubsError) -> Self {
        Self::new(format!("Subs.{}", e.kind()), e)
    }
}

impl From<crate::library::images::ImageError> for CommandError {
    fn from(e: crate::library::images::ImageError) -> Self {
        Self::new(format!("Image.{}", e.kind()), e)
    }
}

impl From<crate::library::characters::CharacterError> for CommandError {
    fn from(e: crate::library::characters::CharacterError) -> Self {
        use crate::library::characters::CharacterError;
        match e {
            CharacterError::Invalid { field } => Self::new(format!("Character.Invalid.{field}"), e),
            CharacterError::Image(inner) => inner.into(),
            CharacterError::Store(inner) => inner.into(),
        }
    }
}

impl From<crate::import::ImportError> for CommandError {
    fn from(e: crate::import::ImportError) -> Self {
        use crate::import::ImportError;
        match e {
            // The underlying module names the failure; the renderer handles them uniformly.
            ImportError::Subs(inner) => inner.into(),
            ImportError::Media(inner) => inner.into(),
            ImportError::Store(inner) => inner.into(),
            ImportError::AlreadyRunning => Self::new("Import.AlreadyRunning", e),
            ImportError::SourceChanged(_) => Self::new("Import.SourceChanged", e),
            ImportError::SourceMissing(_) => Self::new("Import.SourceMissing", e),
            ImportError::NoAudio(_) => Self::new("Import.NoAudio", e),
            ImportError::RunNotFound(_) => Self::new("Import.RunNotFound", e),
            ImportError::Io { .. } => Self::new("Import.Io", e),
        }
    }
}

pub type CommandResult<T> = Result<T, CommandError>;

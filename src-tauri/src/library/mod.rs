//! The self-contained library folder and everything that must stay consistent
//! with it: the folder pointer, the two settings files, re-pointing and moving
//!, the volume check, deletion with `pending_deletions`, and
//! export/import.
//!
//! Layout of a library folder:
//! ```text
//! <library>/
//!   library.sqlite      audio paths inside are relative to this directory
//!   <12 A-Z0-9>.<ext>   one file per line
//!   images/             portraits and posters
//!   .tmp/               same-volume scratch space, swept on open
//! ```
//!
//! The app never stores an absolute path to anything inside the library. The only absolute
//! path is the pointer to the folder itself, in `machine.json`, which never leaves this
//! machine — so moving or copying the whole folder keeps every internal reference valid.

pub mod backup;
pub mod characters;
pub mod deletion;
pub mod folder;
pub mod images;
pub mod lines;
pub mod paths;
pub mod relocate;
pub mod settings;
pub mod volume;

use std::path::{Path, PathBuf};

use serde::Serialize;

use crate::store::StoreError;
use folder::{Library, LibraryStats};
use volume::VolumeKind;

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

    #[error("library folder not found: {0}")]
    NotFound(PathBuf),

    #[error("{0} is not a library folder (no library.sqlite)")]
    NotALibrary(PathBuf),

    #[error("{0} already holds a library")]
    AlreadyALibrary(PathBuf),

    #[error("{0} is not empty and is not a library")]
    TargetNotEmpty(PathBuf),

    #[error("{0} is inside the current library")]
    TargetInsideLibrary(PathBuf),

    #[error("{path} is on an unsupported volume: {kind:?}")]
    UnsupportedVolume { path: PathBuf, kind: VolumeKind },

    #[error("copied library at {0} does not match the original")]
    MoveVerifyFailed(PathBuf),

    #[error("another library operation is in progress")]
    Busy,

    /// A command needs the library, but none is open (找不到收藏庫).
    #[error("no library is open")]
    NotReady,

    #[error("{path}: {source}")]
    Io {
        path: PathBuf,
        #[source]
        source: std::io::Error,
    },

    #[error(transparent)]
    Store(#[from] StoreError),
}

impl LibraryError {
    pub fn io(path: &Path, source: std::io::Error) -> Self {
        Self::Io {
            path: path.to_owned(),
            source,
        }
    }

    /// Stable identifier sent to the renderer as `CommandError.kind`.
    pub fn kind(&self) -> &'static str {
        match self {
            Self::NoOsDir(_) => "NoOsDir",
            Self::SettingsIo { .. } => "SettingsIo",
            Self::SettingsParse { .. } => "SettingsParse",
            Self::InvalidSetting { .. } => "InvalidSetting",
            Self::NotFound(_) => "NotFound",
            Self::NotALibrary(_) => "NotALibrary",
            Self::AlreadyALibrary(_) => "AlreadyALibrary",
            Self::TargetNotEmpty(_) => "TargetNotEmpty",
            Self::TargetInsideLibrary(_) => "TargetInsideLibrary",
            Self::UnsupportedVolume {
                kind: VolumeKind::CloudSync { .. },
                ..
            } => "UnsupportedVolume.CloudSync",
            Self::UnsupportedVolume { .. } => "UnsupportedVolume.Network",
            Self::MoveVerifyFailed(_) => "MoveVerifyFailed",
            Self::Busy => "Busy",
            Self::NotReady => "NotReady",
            Self::Io { .. } => "Io",
            Self::Store(StoreError::SchemaTooNew { .. }) => "SchemaTooNew",
            Self::Store(_) => "Store",
        }
    }
}

/// The library the app is working with, or why there is none.
pub enum LibraryState {
    Ready(Library),
    Unavailable {
        /// The last known location, shown so the user can tell 「隨身碟沒插」 from
        /// 「資料真的不見了」.
        path: Option<PathBuf>,
        reason: UnavailableReason,
    },
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(tag = "code", rename_all = "camelCase")]
pub enum UnavailableReason {
    /// `machine.json` has no pointer (e.g. only `settings.json` was restored).
    NoPointer,
    NotFound,
    NotALibrary,
    UnsupportedVolume {
        volume: VolumeKind,
    },
    SchemaTooNew {
        found: u32,
        supported: u32,
    },
    /// A move to a new location is in progress.
    Moving,
    Error {
        message: String,
    },
}

impl From<(Option<PathBuf>, LibraryError)> for LibraryState {
    fn from((path, error): (Option<PathBuf>, LibraryError)) -> Self {
        let reason = match error {
            LibraryError::NotFound(_) => UnavailableReason::NotFound,
            LibraryError::NotALibrary(_) => UnavailableReason::NotALibrary,
            LibraryError::UnsupportedVolume { kind, .. } => {
                UnavailableReason::UnsupportedVolume { volume: kind }
            }
            LibraryError::Store(StoreError::SchemaTooNew { found, supported }) => {
                UnavailableReason::SchemaTooNew { found, supported }
            }
            other => UnavailableReason::Error {
                message: other.to_string(),
            },
        };
        log::warn!("library unavailable at {path:?}: {reason:?}");
        Self::Unavailable { path, reason }
    }
}

impl LibraryState {
    /// Resolve the library at startup from the pointer in `machine.json`.
    ///
    /// The default location belongs to the app, so a library missing there is simply created:
    /// a first launch never shows 找不到收藏庫 — including a launch whose `machine.json` was
    /// written by an older build that never created the folder. Anywhere else, a missing folder
    /// is reported and never silently recreated, because it usually means a drive is not
    /// attached, and an empty stand-in would hide that.
    pub fn at_startup(pointer: Option<&Path>, default_dir: &Path) -> Self {
        let Some(path) = pointer else {
            return Self::Unavailable {
                path: None,
                reason: UnavailableReason::NoPointer,
            };
        };
        backup::recover_interrupted_import(path);
        let create_default = path == default_dir
            && matches!(
                folder::classify_dir(path),
                Ok(folder::DirKind::Missing | folder::DirKind::Empty)
            );
        let opened = if create_default {
            Library::create(path)
        } else {
            Library::open(path)
        };
        match opened {
            Ok(library) => Self::Ready(library),
            Err(e) => (Some(path.to_owned()), e).into(),
        }
    }

    pub fn library(&self) -> Option<&Library> {
        match self {
            Self::Ready(library) => Some(library),
            Self::Unavailable { .. } => None,
        }
    }

    pub fn library_mut(&mut self) -> Option<&mut Library> {
        match self {
            Self::Ready(library) => Some(library),
            Self::Unavailable { .. } => None,
        }
    }

    pub fn status(&self) -> LibraryStatus {
        match self {
            Self::Ready(library) => LibraryStatus {
                ready: true,
                path: Some(library.root().to_owned()),
                reason: None,
                stats: library.stats().ok(),
            },
            Self::Unavailable { path, reason } => LibraryStatus {
                ready: false,
                path: path.clone(),
                reason: Some(reason.clone()),
                stats: None,
            },
        }
    }
}

/// What the renderer needs to draw 檔案管理 and the 找不到收藏庫 toast.
#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LibraryStatus {
    pub ready: bool,
    pub path: Option<PathBuf>,
    pub reason: Option<UnavailableReason>,
    pub stats: Option<LibraryStats>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_missing_default_library_is_created_silently() {
        let dir = tempfile::tempdir().unwrap();
        let default = dir.path().join("DialogueCollector");
        let state = LibraryState::at_startup(Some(&default), &default);
        assert!(state.status().ready);
        assert!(default.join(paths::DB_FILE).is_file());

        // An existing default library is opened, not recreated.
        if let LibraryState::Ready(library) = state {
            library
                .conn()
                .execute(
                    "INSERT INTO characters (name, category, source, created_at, updated_at)
                     VALUES ('a', 'tv', 'b', 0, 0)",
                    [],
                )
                .unwrap();
        }
        let reopened = LibraryState::at_startup(Some(&default), &default);
        let count: i64 = reopened
            .library()
            .unwrap()
            .conn()
            .query_row("SELECT COUNT(*) FROM characters", [], |r| r.get(0))
            .unwrap();
        assert_eq!(count, 1);
    }

    #[test]
    fn a_missing_library_elsewhere_is_reported_not_recreated() {
        let dir = tempfile::tempdir().unwrap();
        let default = dir.path().join("DialogueCollector");
        let moved = dir.path().join("USB/DialogueCollector");
        let status = LibraryState::at_startup(Some(&moved), &default).status();
        assert!(!status.ready);
        assert_eq!(status.reason, Some(UnavailableReason::NotFound));
        assert_eq!(status.path.as_deref(), Some(moved.as_path()));
        assert!(!moved.exists());
    }

    #[test]
    fn a_default_folder_with_foreign_content_is_not_taken_over() {
        let dir = tempfile::tempdir().unwrap();
        let default = dir.path().join("DialogueCollector");
        std::fs::create_dir(&default).unwrap();
        std::fs::write(default.join("notes.txt"), "x").unwrap();
        let status = LibraryState::at_startup(Some(&default), &default).status();
        assert_eq!(status.reason, Some(UnavailableReason::NotALibrary));
    }

    #[test]
    fn no_pointer_is_its_own_state() {
        let status = LibraryState::at_startup(None, Path::new("/default")).status();
        assert_eq!(status.reason, Some(UnavailableReason::NoPointer));
    }

    #[test]
    fn a_newer_library_is_reported_with_both_versions() {
        let dir = tempfile::tempdir().unwrap();
        Library::create(dir.path()).unwrap().close().unwrap();
        let conn = rusqlite::Connection::open(dir.path().join(paths::DB_FILE)).unwrap();
        conn.execute("UPDATE schema_version SET version = 99", [])
            .unwrap();
        drop(conn);
        let status = LibraryState::at_startup(Some(dir.path()), Path::new("/elsewhere")).status();
        assert_eq!(
            status.reason,
            Some(UnavailableReason::SchemaTooNew {
                found: 99,
                supported: crate::store::SCHEMA_VERSION
            })
        );
    }
}

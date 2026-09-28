//! 匯出／匯入: the single-zip backup (0G.3, D10 → A, D14 → A, ENG17).
//!
//! Archive layout, format version 1:
//! ```text
//! settings.json       the portable settings file (ENG17); machine.json never enters an archive
//! library/…           the whole library folder: clips, images/, library.sqlite (a consistent
//!                     snapshot taken with VACUUM INTO); never .tmp/, never -wal / -shm
//! manifest.json       written LAST, so a truncated archive is recognisably incomplete
//! ```
//!
//! Import is REPLACE (D10 → A) and follows the user's own ordering requirement (D14): the
//! archive is fully unpacked to a hidden sibling of the library on the same volume and verified
//! before the existing library is touched. The swap is two renames on one volume:
//! `<lib>` → `.<lib>.previous`, then `.<lib>.importing` → `<lib>`, then the previous copy is
//! deleted. `recover_interrupted_import` runs before every library open and restores the
//! previous copy if a crash landed between the two renames, so an interrupted import always
//! leaves the existing library intact (T10's "2am test").
//!
//! Unlike R3's wording (rewrite the pointer to the unpacked folder), the library keeps its path
//! and the pointer never changes; the startup recovery gives the same crash guarantee without
//! the library folder being renamed by every import.

use std::fs;
use std::io::{self, Read, Write};
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};

use serde::{Deserialize, Serialize};
use zip::write::SimpleFileOptions;
use zip::{CompressionMethod, ZipArchive, ZipWriter};

use super::folder::Library;
use super::paths::{DB_FILE, IMAGES_DIR, TMP_DIR};
use super::settings::Settings;
use super::LibraryError;
use crate::store::{self, StoreError, SCHEMA_VERSION};

pub const FORMAT: &str = "dialogue-collector-backup";
pub const FORMAT_VERSION: u32 = 1;
const MANIFEST: &str = "manifest.json";
const SETTINGS: &str = "settings.json";
const LIBRARY_PREFIX: &str = "library/";
/// Headroom kept free beyond the archive's own size.
const SPACE_MARGIN: u64 = 16 * 1024 * 1024;

#[derive(Debug, thiserror::Error)]
pub enum BackupError {
    #[error("{path}: {source}")]
    Io {
        path: PathBuf,
        #[source]
        source: io::Error,
    },
    #[error("archive error: {0}")]
    Zip(#[from] zip::result::ZipError),
    #[error("not a DialogueCollector backup")]
    NotOurArchive,
    #[error("backup format v{found} is newer than this app supports (v{supported})")]
    FormatTooNew { found: u32, supported: u32 },
    #[error("backup schema v{found} is newer than this app supports (v{supported})")]
    SchemaTooNew { found: u32, supported: u32 },
    #[error("archive entry escapes the target folder: {0}")]
    PathTraversal(String),
    #[error("not enough free space: {needed} bytes needed, {available} available")]
    InsufficientSpace { needed: u64, available: u64 },
    #[error("backup settings are invalid: {0}")]
    InvalidSettings(String),
    #[error("cancelled")]
    Cancelled,
    #[error(transparent)]
    Store(#[from] StoreError),
    #[error(transparent)]
    Library(#[from] LibraryError),
}

impl BackupError {
    fn io(path: &Path, source: io::Error) -> Self {
        Self::Io {
            path: path.to_owned(),
            source,
        }
    }

    pub fn kind(&self) -> &'static str {
        match self {
            Self::Io { .. } => "Io",
            Self::Zip(_) => "Zip",
            Self::NotOurArchive => "NotOurArchive",
            Self::FormatTooNew { .. } => "FormatTooNew",
            Self::SchemaTooNew { .. } => "SchemaTooNew",
            Self::PathTraversal(_) => "PathTraversal",
            Self::InsufficientSpace { .. } => "InsufficientSpace",
            Self::InvalidSettings(_) => "InvalidSettings",
            Self::Cancelled => "Cancelled",
            Self::Store(_) => "Store",
            Self::Library(_) => "Library",
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Manifest {
    pub format: String,
    pub format_version: u32,
    pub schema_version: u32,
    pub app_version: String,
    pub created_at: i64,
    pub clip_count: i64,
    pub character_count: i64,
    pub bytes: i64,
}

/// Progress of an export, in files written out of the total.
#[derive(Debug, Clone, Copy, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ExportProgress {
    pub done: u64,
    pub total: u64,
    /// True once every library file is in and only settings, database and manifest remain.
    pub finishing: bool,
}

// ---------------------------------------------------------------- export

/// Everything an export needs from the open library, gathered while briefly holding it.
/// Writing the archive afterwards touches no database connection, so it can run on a worker
/// thread while the library stays available (the busy flag keeps writers out meanwhile).
pub struct ExportPlan {
    root: PathBuf,
    files: Vec<(PathBuf, u64)>,
    snapshot: PathBuf,
    manifest: Manifest,
}

impl Drop for ExportPlan {
    fn drop(&mut self) {
        let _ = fs::remove_file(&self.snapshot);
    }
}

pub fn prepare_export(library: &Library, app_version: &str) -> Result<ExportPlan, BackupError> {
    let root = library.root().to_owned();
    let stats = library.stats()?;
    let character_count: i64 = library
        .conn()
        .query_row("SELECT COUNT(*) FROM characters", [], |r| r.get(0))
        .map_err(StoreError::from)?;
    let files = library_files(&root)?;

    // A consistent database snapshot without closing the library.
    let tmp_dir = root.join(TMP_DIR);
    fs::create_dir_all(&tmp_dir).map_err(|e| BackupError::io(&tmp_dir, e))?;
    let snapshot = tmp_dir.join(format!("export-{}.sqlite", std::process::id()));
    let _ = fs::remove_file(&snapshot);
    library
        .conn()
        .execute("VACUUM INTO ?1", [snapshot.to_string_lossy()])
        .map_err(StoreError::from)?;

    Ok(ExportPlan {
        root,
        files,
        snapshot,
        manifest: Manifest {
            format: FORMAT.to_owned(),
            format_version: FORMAT_VERSION,
            schema_version: SCHEMA_VERSION,
            app_version: app_version.to_owned(),
            created_at: store::now_ms(),
            clip_count: stats.clip_count,
            character_count,
            bytes: stats.bytes,
        },
    })
}

/// Write the archive to `dest`. `dest` only appears once the archive is complete; a cancelled
/// or failed export leaves nothing at `dest`.
pub fn write_export(
    plan: ExportPlan,
    settings_file: &Path,
    dest: &Path,
    cancel: &AtomicBool,
    mut progress: impl FnMut(ExportProgress),
) -> Result<Manifest, BackupError> {
    let payload: u64 = plan.files.iter().map(|(_, len)| len).sum();
    let dest_dir = dest.parent().unwrap_or(Path::new("."));
    ensure_space(dest_dir, payload)?;

    let part = dest.with_extension("zip.part");
    let result = (|| {
        let file = fs::File::create(&part).map_err(|e| BackupError::io(&part, e))?;
        let mut zip = ZipWriter::new(file);
        let stored = SimpleFileOptions::default()
            .compression_method(CompressionMethod::Stored)
            .large_file(true);
        let deflated = SimpleFileOptions::default()
            .compression_method(CompressionMethod::Deflated)
            .large_file(true);

        let total = plan.files.len() as u64;
        progress(ExportProgress {
            done: 0,
            total,
            finishing: false,
        });
        for (i, (relative, _)) in plan.files.iter().enumerate() {
            if cancel.load(Ordering::SeqCst) {
                return Err(BackupError::Cancelled);
            }
            // Audio and images are already compressed; storing them is faster at no size cost.
            let name = format!("{LIBRARY_PREFIX}{}", zip_name(relative));
            zip.start_file(name, stored)?;
            copy_into(&plan.root.join(relative), &mut zip)?;
            progress(ExportProgress {
                done: i as u64 + 1,
                total,
                finishing: false,
            });
        }
        if cancel.load(Ordering::SeqCst) {
            return Err(BackupError::Cancelled);
        }
        progress(ExportProgress {
            done: total,
            total,
            finishing: true,
        });

        zip.start_file(SETTINGS, deflated)?;
        copy_into(settings_file, &mut zip)?;
        zip.start_file(format!("{LIBRARY_PREFIX}{DB_FILE}"), deflated)?;
        copy_into(&plan.snapshot, &mut zip)?;
        zip.start_file(MANIFEST, deflated)?;
        zip.write_all(&serde_json::to_vec_pretty(&plan.manifest).expect("manifest serializes"))
            .map_err(|e| BackupError::io(&part, e))?;
        let file = zip.finish()?;
        file.sync_all().map_err(|e| BackupError::io(&part, e))?;
        drop(file);
        fs::rename(&part, dest).map_err(|e| BackupError::io(dest, e))?;
        Ok(plan.manifest.clone())
    })();

    if result.is_err() {
        let _ = fs::remove_file(&part);
    }
    result
}

/// `prepare_export` + `write_export` in one call.
#[cfg(test)]
pub fn export(
    library: &Library,
    settings_file: &Path,
    dest: &Path,
    app_version: &str,
    cancel: &AtomicBool,
    progress: impl FnMut(ExportProgress),
) -> Result<Manifest, BackupError> {
    let plan = prepare_export(library, app_version)?;
    write_export(plan, settings_file, dest, cancel, progress)
}

/// Every file of the library except the live database, its WAL files and `.tmp/`, relative to
/// the root, with sizes. Sorted for a deterministic archive.
fn library_files(root: &Path) -> Result<Vec<(PathBuf, u64)>, BackupError> {
    let mut out = Vec::new();
    let mut stack = vec![root.to_path_buf()];
    while let Some(dir) = stack.pop() {
        for entry in fs::read_dir(&dir).map_err(|e| BackupError::io(&dir, e))? {
            let entry = entry.map_err(|e| BackupError::io(&dir, e))?;
            let path = entry.path();
            let relative = path.strip_prefix(root).unwrap().to_path_buf();
            let top_level = relative.parent() == Some(Path::new(""));
            if top_level {
                let name = relative.to_string_lossy();
                if relative == Path::new(TMP_DIR) || name.starts_with(DB_FILE) {
                    continue;
                }
            }
            let meta = entry.metadata().map_err(|e| BackupError::io(&path, e))?;
            if meta.is_dir() {
                stack.push(path);
            } else if meta.is_file() {
                out.push((relative, meta.len()));
            }
        }
    }
    out.sort();
    Ok(out)
}

/// Zip entry names always use `/`, whatever the platform separator.
fn zip_name(relative: &Path) -> String {
    relative
        .components()
        .map(|c| c.as_os_str().to_string_lossy())
        .collect::<Vec<_>>()
        .join("/")
}

fn copy_into(path: &Path, zip: &mut ZipWriter<fs::File>) -> Result<(), BackupError> {
    let mut file = fs::File::open(path).map_err(|e| BackupError::io(path, e))?;
    io::copy(&mut file, zip).map_err(|e| BackupError::io(path, e))?;
    Ok(())
}

fn ensure_space(dir: &Path, needed: u64) -> Result<(), BackupError> {
    let needed = needed + SPACE_MARGIN;
    match fs4::available_space(dir) {
        Ok(available) if available < needed => {
            Err(BackupError::InsufficientSpace { needed, available })
        }
        Ok(_) => Ok(()),
        // Unknown free space is not a reason to refuse; the write itself will fail if full.
        Err(e) => {
            log::warn!("cannot read free space of {}: {e}", dir.display());
            Ok(())
        }
    }
}

// ---------------------------------------------------------------- inspect

/// Read and validate an archive's manifest without unpacking anything.
pub fn inspect(archive: &Path) -> Result<Manifest, BackupError> {
    let file = fs::File::open(archive).map_err(|e| BackupError::io(archive, e))?;
    let mut zip = ZipArchive::new(file).map_err(|_| BackupError::NotOurArchive)?;
    read_manifest(&mut zip)
}

fn read_manifest(zip: &mut ZipArchive<fs::File>) -> Result<Manifest, BackupError> {
    let mut bytes = Vec::new();
    zip.by_name(MANIFEST)
        .map_err(|_| BackupError::NotOurArchive)?
        .take(1024 * 1024)
        .read_to_end(&mut bytes)
        .map_err(|_| BackupError::NotOurArchive)?;
    let manifest: Manifest =
        serde_json::from_slice(&bytes).map_err(|_| BackupError::NotOurArchive)?;
    if manifest.format != FORMAT {
        return Err(BackupError::NotOurArchive);
    }
    if manifest.format_version > FORMAT_VERSION {
        return Err(BackupError::FormatTooNew {
            found: manifest.format_version,
            supported: FORMAT_VERSION,
        });
    }
    if manifest.schema_version > SCHEMA_VERSION {
        return Err(BackupError::SchemaTooNew {
            found: manifest.schema_version,
            supported: SCHEMA_VERSION,
        });
    }
    Ok(manifest)
}

// ---------------------------------------------------------------- import

fn sibling(target: &Path, suffix: &str) -> PathBuf {
    let name = target
        .file_name()
        .map(|n| n.to_string_lossy().into_owned())
        .unwrap_or_else(|| "DialogueCollector".to_owned());
    target.with_file_name(format!(".{name}.{suffix}"))
}

fn staging_path(target: &Path) -> PathBuf {
    sibling(target, "importing")
}

fn previous_path(target: &Path) -> PathBuf {
    sibling(target, "previous")
}

/// Unpack `archive` next to `target` and verify it. Returns the staging folder and the
/// archive's settings. The existing library at `target` is not touched.
pub fn unpack(archive: &Path, target: &Path) -> Result<(PathBuf, Settings), BackupError> {
    let file = fs::File::open(archive).map_err(|e| BackupError::io(archive, e))?;
    let mut zip = ZipArchive::new(file).map_err(|_| BackupError::NotOurArchive)?;
    read_manifest(&mut zip)?;

    let staging = staging_path(target);
    if staging.exists() {
        fs::remove_dir_all(&staging).map_err(|e| BackupError::io(&staging, e))?;
    }
    let parent = target.parent().unwrap_or(Path::new("."));
    fs::create_dir_all(parent).map_err(|e| BackupError::io(parent, e))?;
    let unpacked_size: u64 = (0..zip.len())
        .filter_map(|i| zip.by_index_raw(i).ok().map(|f| f.size()))
        .sum();
    ensure_space(parent, unpacked_size)?;

    let result = (|| {
        fs::create_dir_all(&staging).map_err(|e| BackupError::io(&staging, e))?;
        let mut settings_bytes: Option<Vec<u8>> = None;
        for i in 0..zip.len() {
            let mut entry = zip.by_index(i)?;
            let raw_name = entry.name().to_owned();
            // S1: reject anything that could land outside the staging folder. Absolute names are
            // refused outright rather than reinterpreted as relative.
            if raw_name.starts_with('/')
                || raw_name.starts_with('\\')
                || raw_name.chars().nth(1) == Some(':')
            {
                return Err(BackupError::PathTraversal(raw_name));
            }
            let Some(name) = entry.enclosed_name() else {
                return Err(BackupError::PathTraversal(raw_name));
            };
            if entry.is_symlink() {
                return Err(BackupError::PathTraversal(raw_name));
            }
            if name == Path::new(MANIFEST) {
                continue;
            }
            if name == Path::new(SETTINGS) {
                let mut bytes = Vec::new();
                entry
                    .by_ref()
                    .take(1024 * 1024)
                    .read_to_end(&mut bytes)
                    .map_err(|e| BackupError::io(&staging, e))?;
                settings_bytes = Some(bytes);
                continue;
            }
            let Ok(relative) = name.strip_prefix(LIBRARY_PREFIX.trim_end_matches('/')) else {
                return Err(BackupError::NotOurArchive);
            };
            if relative.as_os_str().is_empty() {
                continue;
            }
            let out = staging.join(relative);
            if entry.is_dir() {
                fs::create_dir_all(&out).map_err(|e| BackupError::io(&out, e))?;
                continue;
            }
            if let Some(dir) = out.parent() {
                fs::create_dir_all(dir).map_err(|e| BackupError::io(dir, e))?;
            }
            let mut file = fs::File::create(&out).map_err(|e| BackupError::io(&out, e))?;
            io::copy(&mut entry, &mut file).map_err(|e| BackupError::io(&out, e))?;
            file.sync_all().map_err(|e| BackupError::io(&out, e))?;
        }

        let settings_bytes = settings_bytes.ok_or(BackupError::NotOurArchive)?;
        let settings: Settings = serde_json::from_slice(&settings_bytes)
            .map_err(|e| BackupError::InvalidSettings(e.to_string()))?;
        let settings = settings
            .validated()
            .map_err(|e| BackupError::InvalidSettings(e.to_string()))?;

        // Verify: the database is there and opens (migrating an older schema forward).
        if !staging.join(DB_FILE).is_file() {
            return Err(BackupError::NotOurArchive);
        }
        for dir in [IMAGES_DIR, TMP_DIR] {
            let path = staging.join(dir);
            fs::create_dir_all(&path).map_err(|e| BackupError::io(&path, e))?;
        }
        let conn = store::open(&staging.join(DB_FILE))?;
        conn.pragma_update(None, "wal_checkpoint", "TRUNCATE")
            .map_err(StoreError::from)?;
        conn.close().map_err(|(_, e)| StoreError::from(e))?;
        Ok(settings)
    })();

    match result {
        Ok(settings) => Ok((staging, settings)),
        Err(e) => {
            let _ = fs::remove_dir_all(&staging);
            Err(e)
        }
    }
}

/// Replace the (already closed) library at `target` with the verified `staging` folder.
pub fn swap_in(staging: &Path, target: &Path) -> Result<(), BackupError> {
    let previous = previous_path(target);
    if previous.exists() {
        fs::remove_dir_all(&previous).map_err(|e| BackupError::io(&previous, e))?;
    }
    let had_library = target.exists();
    if had_library {
        fs::rename(target, &previous).map_err(|e| BackupError::io(target, e))?;
    }
    if let Err(e) = fs::rename(staging, target) {
        if had_library {
            // Put the original back; the import failed but nothing was lost.
            let _ = fs::rename(&previous, target);
        }
        return Err(BackupError::io(staging, e));
    }
    if had_library {
        if let Err(e) = fs::remove_dir_all(&previous) {
            log::warn!(
                "imported, but the previous library at {} remains: {e}",
                previous.display()
            );
        }
    }
    Ok(())
}

/// Undo or finish an import that a crash interrupted. Runs before the library is opened.
pub fn recover_interrupted_import(target: &Path) {
    let previous = previous_path(target);
    let staging = staging_path(target);
    if previous.exists() {
        if target.exists() {
            // Both renames happened; only deleting the old copy was left.
            if let Err(e) = fs::remove_dir_all(&previous) {
                log::warn!("cannot remove {}: {e}", previous.display());
            }
        } else if let Err(e) = fs::rename(&previous, target) {
            log::error!(
                "cannot restore {} after an interrupted import: {e}",
                target.display()
            );
        } else {
            log::warn!("restored the library after an interrupted import");
        }
    }
    if staging.exists() {
        // An unpack that never reached the swap: garbage.
        let _ = fs::remove_dir_all(&staging);
    }
}

#[cfg(test)]
mod tests;

//! Tauri command surface. Thin: validate, delegate to a module, map the error.

use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};

use serde::Serialize;
use tauri::{AppHandle, Emitter, Manager, State};

use crate::error::{CommandError, CommandResult};
use crate::library::backup::{self, ExportProgress, Manifest};
use crate::library::folder::Library;
use crate::library::relocate::{self, Plan};
use crate::library::settings::Settings;
use crate::library::{LibraryError, LibraryState, LibraryStatus, UnavailableReason};
use crate::AppState;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppInfo {
    pub version: String,
    pub schema_version: u32,
}

#[tauri::command]
pub fn app_info(app: tauri::AppHandle) -> AppInfo {
    AppInfo {
        version: app.package_info().version.to_string(),
        schema_version: crate::store::SCHEMA_VERSION,
    }
}

#[tauri::command]
pub fn get_settings(state: State<'_, AppState>) -> CommandResult<Settings> {
    let settings = state
        .settings
        .lock()
        .map_err(|e| CommandError::new("Internal.Poisoned", e))?;
    Ok(settings.clone())
}

#[tauri::command]
pub fn save_settings(state: State<'_, AppState>, settings: Settings) -> CommandResult<Settings> {
    let settings = settings.validated()?;
    state.settings_files.save_settings(&settings)?;
    let mut current = state
        .settings
        .lock()
        .map_err(|e| CommandError::new("Internal.Poisoned", e))?;
    *current = settings.clone();
    Ok(settings)
}

// ---------- library ----------

/// Event carrying `{ done, total }` bytes while a cross-volume move copies files.
pub const MOVE_PROGRESS_EVENT: &str = "library-move-progress";

#[derive(Clone, Serialize)]
struct MoveProgress {
    done: u64,
    total: u64,
}

pub(crate) fn lock<'a, T>(
    m: &'a std::sync::Mutex<T>,
) -> CommandResult<std::sync::MutexGuard<'a, T>> {
    m.lock()
        .map_err(|e| CommandError::new("Internal.Poisoned", e))
}

/// Let the asset protocol serve clips and images from the library, wherever it lives.
pub fn grant_asset_scope(app: &AppHandle, root: &Path) {
    if let Err(e) = app.asset_protocol_scope().allow_directory(root, true) {
        log::error!("cannot grant asset scope for {}: {e}", root.display());
    }
}

#[tauri::command]
pub fn library_status(state: State<'_, AppState>) -> CommandResult<LibraryStatus> {
    Ok(lock(&state.library)?.status())
}

/// 設定頁 → 檔案管理 → 瀏覽. See `library::relocate` for the rules.
#[tauri::command]
pub async fn choose_library_location(
    app: AppHandle,
    state: State<'_, AppState>,
    path: PathBuf,
) -> CommandResult<LibraryStatus> {
    if state.library_busy.swap(true, Ordering::SeqCst) {
        return Err(LibraryError::Busy.into());
    }
    let result = relocate_to(&app, &state, path).await;
    state.library_busy.store(false, Ordering::SeqCst);
    result
}

async fn relocate_to(
    app: &AppHandle,
    state: &State<'_, AppState>,
    chosen: PathBuf,
) -> CommandResult<LibraryStatus> {
    let current = lock(&state.library)?.library().map(|l| l.root().to_owned());
    let plan = relocate::plan(&chosen, current.as_deref())?;
    log::info!("library relocation plan: {plan:?}");

    let opened = match plan {
        Plan::Unchanged => return Ok(lock(&state.library)?.status()),
        Plan::OpenExisting { target } => Library::open(&target)?,
        Plan::Create { target } => Library::create(&target)?,
        Plan::Move { from, target } => {
            // Take the open library out and close it so the folder is quiescent on disk.
            let old = std::mem::replace(
                &mut *lock(&state.library)?,
                LibraryState::Unavailable {
                    path: Some(from.clone()),
                    reason: UnavailableReason::Moving,
                },
            );
            if let LibraryState::Ready(library) = old {
                library.close()?;
            }
            let emitter = app.clone();
            let (src, dst) = (from.clone(), target.clone());
            let moved = tauri::async_runtime::spawn_blocking(move || {
                relocate::move_library(&src, &dst, |done, total| {
                    let _ = emitter.emit(MOVE_PROGRESS_EVENT, MoveProgress { done, total });
                })
            })
            .await
            .map_err(|e| CommandError::new("Internal.Join", e))?;

            match moved.and_then(|()| Library::open(&target)) {
                Ok(library) => library,
                Err(e) => {
                    // The pointer was never changed, so the original stays authoritative.
                    *lock(&state.library)? = match Library::open(&from) {
                        Ok(library) => LibraryState::Ready(library),
                        Err(reopen) => (Some(from), reopen).into(),
                    };
                    return Err(e.into());
                }
            }
        }
    };

    // Only now, with the library complete at its new location, rewrite the pointer.
    let root = opened.root().to_owned();
    {
        let mut machine = lock(&state.machine)?;
        machine.library_path = Some(root.clone());
        state.settings_files.save_machine(&machine)?;
    }
    grant_asset_scope(app, &root);
    let mut library = lock(&state.library)?;
    *library = LibraryState::Ready(opened);
    Ok(library.status())
}

// ---------------------------------------------------------------- backup

/// Event carrying `ExportProgress` while an export runs.
pub const EXPORT_PROGRESS_EVENT: &str = "library-export-progress";

/// Holds the busy flag for the lifetime of one library operation.
pub(crate) struct BusyGuard<'a>(&'a AtomicBool);

impl<'a> BusyGuard<'a> {
    pub(crate) fn acquire(flag: &'a AtomicBool) -> CommandResult<Self> {
        if flag.swap(true, Ordering::SeqCst) {
            return Err(LibraryError::Busy.into());
        }
        Ok(Self(flag))
    }
}

impl Drop for BusyGuard<'_> {
    fn drop(&mut self) {
        self.0.store(false, Ordering::SeqCst);
    }
}

/// 匯出. Writes the archive to `dest` (chosen by the renderer's save dialog).
#[tauri::command]
pub async fn export_library(
    app: AppHandle,
    state: State<'_, AppState>,
    dest: PathBuf,
) -> CommandResult<Manifest> {
    let _busy = BusyGuard::acquire(&state.library_busy)?;
    state.export_cancel.store(false, Ordering::SeqCst);
    let settings_file = state
        .settings_files
        .dir()
        .join(crate::library::paths::SETTINGS_FILE);
    let version = app.package_info().version.to_string();

    // Hold the library only for the snapshot; the zip is written on a worker thread.
    let plan = {
        let library = lock(&state.library)?;
        let Some(library) = library.library() else {
            return Err(LibraryError::NotFound(PathBuf::new()).into());
        };
        backup::prepare_export(library, &version)?
    };
    let cancel = state.export_cancel.clone();
    let emitter = app.clone();
    let target = dest.clone();
    let manifest = tauri::async_runtime::spawn_blocking(move || {
        backup::write_export(
            plan,
            &settings_file,
            &target,
            &cancel,
            |p: ExportProgress| {
                let _ = emitter.emit(EXPORT_PROGRESS_EVENT, p);
            },
        )
    })
    .await
    .map_err(|e| CommandError::new("Internal.Join", e))??;
    log::info!("exported library to {}", dest.display());
    Ok(manifest)
}

#[tauri::command]
pub fn cancel_export(state: State<'_, AppState>) {
    state.export_cancel.store(true, Ordering::SeqCst);
}

/// What the 匯入 confirmation shows: the archive, and what the current library holds.
#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BackupPreview {
    pub archive: Manifest,
    pub current_characters: i64,
    pub current_clips: i64,
    pub current_bytes: i64,
}

#[tauri::command]
pub fn inspect_backup(state: State<'_, AppState>, path: PathBuf) -> CommandResult<BackupPreview> {
    let archive = backup::inspect(&path)?;
    let library = lock(&state.library)?;
    let (current_characters, current_clips, current_bytes) = match library.library() {
        Some(lib) => {
            let stats = lib.stats()?;
            let characters: i64 = lib
                .conn()
                .query_row("SELECT COUNT(*) FROM characters", [], |r| r.get(0))
                .map_err(crate::store::StoreError::from)?;
            (characters, stats.clip_count, stats.bytes)
        }
        None => (0, 0, 0),
    };
    Ok(BackupPreview {
        archive,
        current_characters,
        current_clips,
        current_bytes,
    })
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ImportOutcome {
    pub status: LibraryStatus,
    pub settings: Settings,
}

/// 匯入 (REPLACE). Unpacks and verifies before touching the current library,
/// then swaps it in and overwrites settings.json — never machine.json.
#[tauri::command]
pub async fn import_backup(
    app: AppHandle,
    state: State<'_, AppState>,
    path: PathBuf,
) -> CommandResult<ImportOutcome> {
    let _busy = BusyGuard::acquire(&state.library_busy)?;
    let target = match lock(&state.machine)?.library_path.clone() {
        Some(p) => p,
        None => crate::library::paths::default_library_dir()?,
    };

    let archive = path.clone();
    let unpack_target = target.clone();
    let (staging, settings) =
        tauri::async_runtime::spawn_blocking(move || backup::unpack(&archive, &unpack_target))
            .await
            .map_err(|e| CommandError::new("Internal.Join", e))??;

    // Close the current library so its folder can be renamed (Windows refuses otherwise).
    let old = std::mem::replace(
        &mut *lock(&state.library)?,
        LibraryState::Unavailable {
            path: Some(target.clone()),
            reason: UnavailableReason::Moving,
        },
    );
    if let LibraryState::Ready(library) = old {
        library.close()?;
    }

    let swapped = backup::swap_in(&staging, &target);
    // Whatever happened, reopen whatever is at the target now.
    let reopened = Library::open(&target);
    match reopened {
        Ok(library) => {
            grant_asset_scope(&app, library.root());
            *lock(&state.library)? = LibraryState::Ready(library);
        }
        Err(e) => *lock(&state.library)? = (Some(target.clone()), e).into(),
    }
    swapped?;

    state.settings_files.save_settings(&settings)?;
    *lock(&state.settings)? = settings.clone();
    log::info!(
        "imported backup {} into {}",
        path.display(),
        target.display()
    );
    Ok(ImportOutcome {
        status: lock(&state.library)?.status(),
        settings,
    })
}

/// 驗證收藏庫: every line whose clip is gone from the library folder.
#[tauri::command]
pub fn verify_library(state: State<'_, AppState>) -> CommandResult<VerifyReport> {
    let guard = state.library.lock().unwrap();
    let Some(lib) = guard.library() else {
        return Ok(VerifyReport::default());
    };
    let report = VerifyReport {
        missing: lib.missing_files()?,
        orphans: lib.orphan_files()?,
    };
    if !report.orphans.is_empty() {
        log::warn!(
            "{} orphan clip(s) with no row: {:?}",
            report.orphans.len(),
            report.orphans
        );
    }
    Ok(report)
}

/// 遺失的檔案 → 全部刪除: deletes the lines whose clips are gone. Holds the library-busy guard so
/// it never runs beside an import, move or backup.
#[tauri::command]
pub fn delete_missing_lines(state: State<'_, AppState>) -> CommandResult<usize> {
    let _busy = BusyGuard::acquire(&state.library_busy)?;
    let mut library = lock(&state.library)?;
    let lib = library.library_mut().ok_or(LibraryError::NotReady)?;
    Ok(lib.delete_missing_lines()?)
}

/// 驗證收藏庫: rows whose clip is gone, and clips no row points at (crash leftovers).
#[derive(Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct VerifyReport {
    pub missing: Vec<crate::library::folder::MissingFile>,
    pub orphans: Vec<String>,
}

/// 檢查更新. Resolves only when already up to date; otherwise the app restarts into the
/// new version, reporting download progress on `update-progress` first.
#[tauri::command]
pub async fn check_for_update(app: AppHandle) -> CommandResult<crate::updater::CheckOutcome> {
    Ok(crate::updater::check_and_install(&app).await?)
}

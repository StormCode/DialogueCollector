//! Tauri command surface. Thin: validate, delegate to a module, map the error.

use std::path::{Path, PathBuf};
use std::sync::atomic::Ordering;

use serde::Serialize;
use tauri::{AppHandle, Emitter, Manager, State};

use crate::error::{CommandError, CommandResult};
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

// ---------- library (T9) ----------

/// Event carrying `{ done, total }` bytes while a cross-volume move copies files.
pub const MOVE_PROGRESS_EVENT: &str = "library-move-progress";

#[derive(Clone, Serialize)]
struct MoveProgress {
    done: u64,
    total: u64,
}

fn lock<'a, T>(m: &'a std::sync::Mutex<T>) -> CommandResult<std::sync::MutexGuard<'a, T>> {
    m.lock()
        .map_err(|e| CommandError::new("Internal.Poisoned", e))
}

/// Let the asset protocol serve clips and images from the library, wherever it lives (B11).
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

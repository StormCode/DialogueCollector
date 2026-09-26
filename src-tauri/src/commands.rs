//! Tauri command surface. Thin: validate, delegate to a module, map the error.

use serde::Serialize;
use tauri::State;

use crate::error::{CommandError, CommandResult};
use crate::library::settings::Settings;
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

//! Glue between the settings page and tauri-plugin-updater (T22, G1 → B).
//!
//! The feed, public key and signature rules are configuration (`tauri.conf.json`); this file
//! only decides when to check and when to install:
//!
//! - 檢查更新: check → download (signature verified) → install → restart, reporting progress.
//! - 自動更新 on: one silent check at startup; a found update is downloaded in the background
//!   and installed when the app quits, so nothing the user is doing gets interrupted.
//! - Offline or rate-limited: `UpdateError::Unreachable`, which the startup check swallows.

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Mutex;

use serde::Serialize;
use tauri::{AppHandle, Emitter, Manager, Runtime};
use tauri_plugin_updater::{Update, UpdaterExt};

use crate::AppState;

pub const UPDATE_PROGRESS_EVENT: &str = "update-progress";

#[derive(Debug, thiserror::Error)]
pub enum UpdateError {
    #[error("update feed unreachable: {0}")]
    Unreachable(String),
    #[error("update signature rejected: {0}")]
    BadSignature(String),
    #[error("update failed: {0}")]
    Failed(String),
    #[error("another update, import or export is running")]
    Busy,
}

impl UpdateError {
    pub fn kind(&self) -> &'static str {
        match self {
            Self::Unreachable(_) => "Unreachable",
            Self::BadSignature(_) => "BadSignature",
            Self::Failed(_) => "Failed",
            Self::Busy => "Busy",
        }
    }
}

impl From<tauri_plugin_updater::Error> for UpdateError {
    fn from(e: tauri_plugin_updater::Error) -> Self {
        use tauri_plugin_updater::Error as E;
        match e {
            // A release that lacks this platform reads the same as no feed at all.
            E::Reqwest(_)
            | E::Network(_)
            | E::ReleaseNotFound
            | E::TargetNotFound(_)
            | E::TargetsNotFound(_) => Self::Unreachable(e.to_string()),
            E::Minisign(_)
            | E::Base64(_)
            | E::SignatureUtf8(_)
            | E::SignedVersionMismatch { .. }
            | E::MissingSignedVersion => Self::BadSignature(e.to_string()),
            other => Self::Failed(other.to_string()),
        }
    }
}

#[derive(Default)]
pub struct UpdaterState {
    busy: AtomicBool,
    /// Downloaded and verified by the startup check; installed on exit.
    staged: Mutex<Option<(Update, Vec<u8>)>>,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateProgress {
    pub version: String,
    pub downloaded: u64,
    pub total: Option<u64>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase", tag = "status")]
pub enum CheckOutcome {
    UpToDate { version: String },
}

struct Busy<'a>(&'a AtomicBool);

impl<'a> Busy<'a> {
    fn take(flag: &'a AtomicBool) -> Result<Self, UpdateError> {
        flag.compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)
            .map(|_| Self(flag))
            .map_err(|_| UpdateError::Busy)
    }
}

impl Drop for Busy<'_> {
    fn drop(&mut self) {
        self.0.store(false, Ordering::Release);
    }
}

/// 檢查更新. Returns only when there is nothing to install; otherwise it installs the update
/// and restarts into it (on Windows the installer relaunches the app).
pub async fn check_and_install<R: Runtime>(
    app: &AppHandle<R>,
) -> Result<CheckOutcome, UpdateError> {
    let state = app.state::<UpdaterState>();
    let _busy = Busy::take(&state.busy)?;
    // Never swap the binary out from under a relocation, export or import.
    let app_state = app.state::<AppState>();
    let _library = Busy::take(&app_state.library_busy)?;

    let staged = state.staged.lock().unwrap().take();
    if let Some((update, bytes)) = staged {
        log::info!("installing staged update {}", update.version);
        emit_progress(
            app,
            &update.version,
            bytes.len() as u64,
            Some(bytes.len() as u64),
        );
        update.restart_after_install(true).install(bytes)?;
        app.restart();
    }

    let Some(update) = app.updater()?.check().await? else {
        return Ok(CheckOutcome::UpToDate {
            version: app.package_info().version.to_string(),
        });
    };
    log::info!("update {} found, downloading", update.version);
    let bytes = download(app, &update).await?;
    update.install(bytes)?;
    log::info!("update {} installed, restarting", update.version);
    app.restart();
}

/// 自動更新: runs once after startup. Failures are logged, never shown.
pub async fn stage_in_background<R: Runtime>(app: AppHandle<R>) {
    let state = app.state::<UpdaterState>();
    let Ok(_busy) = Busy::take(&state.busy) else {
        return;
    };
    let result = async {
        let Some(update) = app.updater()?.check().await? else {
            return Ok(None);
        };
        let bytes = update.download(|_, _| {}, || {}).await?;
        Ok::<_, UpdateError>(Some((update, bytes)))
    }
    .await;
    match result {
        Ok(Some((update, bytes))) => {
            log::info!("update {} downloaded; installing on exit", update.version);
            *state.staged.lock().unwrap() = Some((update.restart_after_install(false), bytes));
        }
        Ok(None) => log::info!("no update available"),
        Err(UpdateError::Unreachable(e)) => log::info!("update check skipped: {e}"),
        Err(e) => log::warn!("background update failed: {e}"),
    }
}

/// Installs a staged update as the app quits, unless 自動更新 was turned off meanwhile.
pub fn install_staged_on_exit<R: Runtime>(app: &AppHandle<R>) {
    let Some(state) = app.try_state::<UpdaterState>() else {
        return;
    };
    let Some((update, bytes)) = state.staged.lock().unwrap().take() else {
        return;
    };
    let enabled = app
        .try_state::<AppState>()
        .is_some_and(|s| s.settings.lock().unwrap().auto_update);
    if !enabled {
        return;
    }
    match update.install(bytes) {
        Ok(()) => log::info!("update {} installed on exit", update.version),
        Err(e) => log::warn!("installing update {} on exit failed: {e}", update.version),
    }
}

async fn download<R: Runtime>(app: &AppHandle<R>, update: &Update) -> Result<Vec<u8>, UpdateError> {
    let mut downloaded = 0u64;
    emit_progress(app, &update.version, 0, None);
    let bytes = update
        .download(
            |chunk, total| {
                downloaded += chunk as u64;
                emit_progress(app, &update.version, downloaded, total);
            },
            || {},
        )
        .await?;
    Ok(bytes)
}

fn emit_progress<R: Runtime>(
    app: &AppHandle<R>,
    version: &str,
    downloaded: u64,
    total: Option<u64>,
) {
    let _ = app.emit(
        UPDATE_PROGRESS_EVENT,
        UpdateProgress {
            version: version.to_owned(),
            downloaded,
            total,
        },
    );
}

//! Glue between the settings page and tauri-plugin-updater (T22, G1 → B).
//!
//! The feed, public key and signature rules are configuration (`tauri.conf.json`); this file
//! only decides when to check and when to install:
//!
//! - 檢查更新: check → download (signature verified) → install → restart, reporting progress
//!   (on macOS through LaunchServices, see `relaunch`).
//! - 自動更新 on: one silent check at startup; a found update is downloaded in the background
//!   and installed when the app quits, so nothing the user is doing gets interrupted.
//! - Offline or rate-limited: `UpdateError::Unreachable`, which the startup check swallows.

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Mutex;
use std::time::Duration;

use serde::Serialize;
use tauri::{AppHandle, Emitter, Manager, Runtime};
use tauri_plugin_updater::{Update, UpdaterExt};

use crate::AppState;

pub const UPDATE_PROGRESS_EVENT: &str = "update-progress";

/// The plugin sets no timeout, so a stalled connection used to hang a check forever — and
/// with it the busy flag, refusing every later 檢查更新 (seen on Windows with 0.1.0).
const CHECK_TIMEOUT: Duration = Duration::from_secs(30);
/// Whole-request timeout for the ~30 MB bundle.
const DOWNLOAD_TIMEOUT: Duration = Duration::from_secs(15 * 60);

#[derive(Debug, thiserror::Error)]
pub enum UpdateError {
    #[error("update feed unreachable: {0}")]
    Unreachable(String),
    #[error("update signature rejected: {0}")]
    BadSignature(String),
    #[error("update failed: {0}")]
    Failed(String),
    #[error("an update is already being checked or downloaded")]
    InProgress,
    #[error("the library is being moved, exported or imported")]
    Busy,
}

impl UpdateError {
    pub fn kind(&self) -> &'static str {
        match self {
            Self::Unreachable(_) => "Unreachable",
            Self::BadSignature(_) => "BadSignature",
            Self::Failed(_) => "Failed",
            Self::InProgress => "InProgress",
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
    fn take(flag: &'a AtomicBool, err: fn() -> UpdateError) -> Result<Self, UpdateError> {
        flag.compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)
            .map(|_| Self(flag))
            .map_err(|_| err())
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
    let _busy = Busy::take(&state.busy, || UpdateError::InProgress)?;
    // Never swap the binary out from under a relocation, export or import.
    let app_state = app.state::<AppState>();
    let _library = Busy::take(&app_state.library_busy, || UpdateError::Busy)?;

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
        relaunch(app);
    }

    log::info!("checking for updates");
    let Some(update) = check(app).await? else {
        log::info!("no update available");
        return Ok(CheckOutcome::UpToDate {
            version: app.package_info().version.to_string(),
        });
    };
    log::info!("update {} found, downloading", update.version);
    let bytes = download(app, &update).await?;
    update.install(bytes)?;
    log::info!("update {} installed, restarting", update.version);
    relaunch(app);
}

/// Restarts into the freshly installed version.
///
/// On macOS `AppHandle::restart` spawns the new binary as a child, and the system takes every
/// process of a LaunchServices-launched app down with it when it quits, so the update closed
/// the app without reopening it (0.1.7). Asking LaunchServices to start a second instance
/// first gives the new version a life of its own; the old one then exits.
fn relaunch<R: Runtime>(app: &AppHandle<R>) -> ! {
    #[cfg(target_os = "macos")]
    if let Some(bundle) = app_bundle(app) {
        match std::process::Command::new("/usr/bin/open")
            .arg("-n")
            .arg(&bundle)
            .status()
        {
            Ok(status) if status.success() => {
                app.exit(0);
                // Like `restart`, never return: the exit is handled on the main thread.
                loop {
                    std::thread::sleep(Duration::MAX);
                }
            }
            Ok(status) => log::warn!("relaunching {} failed: {status}", bundle.display()),
            Err(e) => log::warn!("relaunching {} failed: {e}", bundle.display()),
        }
    }
    app.restart();
}

/// The `.app` this binary runs from; `None` outside a bundle (`tauri dev`).
#[cfg(target_os = "macos")]
fn app_bundle<R: Runtime>(app: &AppHandle<R>) -> Option<std::path::PathBuf> {
    let exe = tauri::process::current_binary(&app.env()).ok()?;
    let bundle = exe.parent()?.parent()?.parent()?;
    (bundle.extension()? == "app").then(|| bundle.to_path_buf())
}

/// 自動更新: runs once after startup. Failures are logged, never shown.
pub async fn stage_in_background<R: Runtime>(app: AppHandle<R>) {
    let state = app.state::<UpdaterState>();
    let Ok(_busy) = Busy::take(&state.busy, || UpdateError::InProgress) else {
        return;
    };
    log::info!("checking for updates in the background");
    let update = match check(&app).await {
        Ok(Some(update)) => update,
        Ok(None) => return log::info!("no update available"),
        // Offline or rate-limited: expected, so not a warning.
        Err(UpdateError::Unreachable(e)) => return log::info!("update check skipped: {e}"),
        Err(e) => return log::warn!("update check failed: {e}"),
    };
    log::info!(
        "update {} found, downloading in the background",
        update.version
    );
    match download(&app, &update).await {
        Ok(bytes) => {
            log::info!("update {} downloaded; installing on exit", update.version);
            *state.staged.lock().unwrap() = Some((update.restart_after_install(false), bytes));
        }
        // A dropped connection mid-download lands here too; the next launch starts over.
        Err(e) => log::warn!(
            "update {} download failed, retrying on next launch: {e}",
            update.version
        ),
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

async fn check<R: Runtime>(app: &AppHandle<R>) -> Result<Option<Update>, UpdateError> {
    let update = app
        .updater_builder()
        .timeout(CHECK_TIMEOUT)
        .build()?
        .check()
        .await?;
    // `check` does not pass its timeout on to the download.
    Ok(update.map(|mut u| {
        u.timeout = Some(DOWNLOAD_TIMEOUT);
        u
    }))
}

async fn download<R: Runtime>(app: &AppHandle<R>, update: &Update) -> Result<Vec<u8>, UpdateError> {
    let mut downloaded = 0u64;
    let mut logged_quarter = 0;
    emit_progress(app, &update.version, 0, None);
    let bytes = update
        .download(
            |chunk, total| {
                downloaded += chunk as u64;
                emit_progress(app, &update.version, downloaded, total);
                if let Some(total) = total.filter(|t| *t > 0) {
                    let quarter = downloaded * 4 / total;
                    if quarter > logged_quarter {
                        logged_quarter = quarter;
                        log::info!("downloaded {downloaded} of {total} bytes");
                    }
                }
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

//! Commands behind 直接匯入現有影音: InputLine probes the dropped files and plays them, then
//! 匯入 imports them all at once; 取消 is `import_cmd::cancel_import`.

use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, Manager, State};

use crate::commands::{lock, BusyGuard};
use crate::error::{CommandError, CommandResult};
use crate::import::manual::{self, ManualItem, ManualOutcome, ManualRun, Sidecars};
use crate::import::run::Progress;
use crate::import_cmd::{ImportProgress, Phase, IMPORT_PROGRESS_EVENT};
use crate::library::paths::DB_FILE;
use crate::library::LibraryError;
use crate::media::ffmpeg;
use crate::media::process::sidecar;
use crate::store::writer::Writer;
use crate::AppState;

/// What InputLine needs about a file before it can be imported.
#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MediaInfo {
    pub path: PathBuf,
    /// `None` when ffprobe could not read the file at all.
    pub duration_ms: Option<u64>,
    pub has_audio: bool,
}

/// Probes each dropped file: its length for the preview, and whether it has audio at all.
#[tauri::command]
pub async fn probe_media(paths: Vec<PathBuf>) -> CommandResult<Vec<MediaInfo>> {
    let ffprobe = sidecar("ffprobe").map_err(CommandError::from)?;
    tauri::async_runtime::spawn_blocking(move || {
        let never = AtomicBool::new(false);
        paths
            .into_iter()
            .map(|path| match ffmpeg::probe(&ffprobe, &path, &never) {
                Ok(p) => MediaInfo {
                    path,
                    duration_ms: p.duration_ms,
                    has_audio: p.has_audio,
                },
                Err(e) => {
                    log::warn!("直接匯入: could not probe {}: {e}", path.display());
                    MediaInfo {
                        path,
                        duration_ms: None,
                        has_audio: false,
                    }
                }
            })
            .collect()
    })
    .await
    .map_err(|e| CommandError::new("Internal.Join", e))
}

/// Files every webview plays as they are; anything else is previewed from an m4a made once.
const PLAYABLE: &[&str] = &["m4a", "mp3", "mp4", "wav"];

/// 播放預覽: a path the webview can play for `path`, added to the asset scope. MKV and WebM (which
/// not every macOS webview decodes) get their audio encoded to a cached m4a first.
#[tauri::command]
pub async fn prepare_preview(app: AppHandle, path: PathBuf) -> CommandResult<PathBuf> {
    let ext = path
        .extension()
        .and_then(|e| e.to_str())
        .map(str::to_ascii_lowercase)
        .unwrap_or_default();
    let playable = if PLAYABLE.contains(&ext.as_str()) {
        path
    } else {
        let dir = preview_dir(&app)?;
        let out = dir.join(format!("{:016x}.m4a", fingerprint(&path)));
        if !out.is_file() {
            let ffmpeg = sidecar("ffmpeg").map_err(CommandError::from)?;
            let source = path.clone();
            let target = out.clone();
            tauri::async_runtime::spawn_blocking(move || {
                std::fs::create_dir_all(&dir).map_err(|e| CommandError::new("Import.Io", e))?;
                let staged = target.with_extension("m4a.part");
                let never = AtomicBool::new(false);
                ffmpeg::extract_audio(&ffmpeg, &source, &staged, &never)
                    .map_err(CommandError::from)?;
                std::fs::rename(&staged, &target).map_err(|e| CommandError::new("Import.Io", e))
            })
            .await
            .map_err(|e| CommandError::new("Internal.Join", e))??;
        }
        out
    };
    app.asset_protocol_scope()
        .allow_file(&playable)
        .map_err(|e| CommandError::new("Internal.AssetScope", e))?;
    Ok(playable)
}

/// One InputLine card.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ManualEntry {
    pub path: PathBuf,
    pub character_id: i64,
    pub text: String,
    pub translation: Option<String>,
}

/// 匯入: every card at once. Resolves when the run ends; progress arrives on `import-progress`.
#[tauri::command]
pub async fn start_manual_import(
    app: AppHandle,
    state: State<'_, AppState>,
    entries: Vec<ManualEntry>,
) -> CommandResult<ManualOutcome> {
    // The same rule EditLine enforces: 原文 or 譯文, at least one (user 2026-09-29).
    for entry in &entries {
        let text = entry.text.trim();
        let translation = entry.translation.as_deref().unwrap_or("").trim();
        if (text.is_empty() && translation.is_empty())
            || text.chars().count() > 1000
            || translation.chars().count() > 1000
        {
            return Err(CommandError::new(
                "Line.Invalid.text",
                "a line needs its text or translation",
            ));
        }
    }
    let _busy = BusyGuard::acquire(&state.library_busy)?;
    let root = {
        let library = lock(&state.library)?;
        library
            .library()
            .ok_or(LibraryError::NotReady)?
            .root()
            .to_owned()
    };
    let sidecars = Sidecars {
        ffmpeg: sidecar("ffmpeg").map_err(CommandError::from)?,
        ffprobe: sidecar("ffprobe").map_err(CommandError::from)?,
    };
    let cancel = std::sync::Arc::clone(&state.import_cancel);
    cancel.store(false, Ordering::SeqCst);
    let previews = preview_dir(&app).ok();

    tauri::async_runtime::spawn_blocking(move || {
        let writer = Writer::open(&root.join(DB_FILE)).map_err(CommandError::from)?;
        let on_progress = |counts: Progress| {
            let _ = app.emit(
                IMPORT_PROGRESS_EVENT,
                ImportProgress {
                    phase: Phase::Indexing,
                    counts,
                },
            );
        };
        let run = ManualRun {
            library: &root,
            writer: &writer,
            media: &sidecars,
            cancel: &cancel,
            on_progress: &on_progress,
        };
        let items = entries
            .into_iter()
            .map(|e| ManualItem {
                path: e.path,
                character_id: e.character_id,
                text: e.text,
                translation: e.translation,
            })
            .collect();
        let outcome = manual::import_files(&run, items);
        log::info!(
            "直接匯入 {:?}: {} imported, {} failed",
            outcome.status,
            outcome.imported,
            outcome.failures.len()
        );
        if let Some(dir) = previews {
            clear_previews(&dir);
        }
        Ok(outcome)
    })
    .await
    .map_err(|e| CommandError::new("Internal.Join", e))?
}

fn preview_dir(app: &AppHandle) -> CommandResult<PathBuf> {
    app.path()
        .app_cache_dir()
        .map(|d| d.join("preview"))
        .map_err(|e| CommandError::new("Internal.CacheDir", e))
}

/// The cached previews are only for the InputLine that made them.
pub fn clear_previews(dir: &Path) {
    match std::fs::remove_dir_all(dir) {
        Ok(()) => {}
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => {}
        Err(e) => log::warn!("could not clear {}: {e}", dir.display()),
    }
}

/// Path, size and mtime: a changed file gets a new preview.
fn fingerprint(path: &Path) -> u64 {
    let mut h = DefaultHasher::new();
    path.hash(&mut h);
    if let Ok(meta) = std::fs::metadata(path) {
        meta.len().hash(&mut h);
        meta.modified().ok().hash(&mut h);
    }
    h.finish()
}

/// Called at startup: previews left by a previous session are dropped.
pub fn clear_previews_at_startup(app: &AppHandle) {
    if let Ok(dir) = preview_dir(app) {
        clear_previews(&dir);
    }
}

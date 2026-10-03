//! Commands behind the subtitle import flow: Step 1 parses, Step 2 assigns characters (and may
//! add one), Step 3 starts the engine; 取消 and 再試一次 act on the running or finished run.

use std::path::{Path, PathBuf};
use std::sync::atomic::Ordering;
use std::sync::Mutex;

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, State};

use crate::commands::{lock, BusyGuard};
use crate::error::{CommandError, CommandResult};
use crate::import::job::{self, Engine, FfprobeProber, JobOutcome};
use crate::import::run::{default_workers, Event, FfmpegEncoder, PlannedCue, Progress};
use crate::library::characters::{self, Character, NewCharacter};
use crate::library::paths::DB_FILE;
use crate::library::LibraryError;
use crate::media::process::sidecar;
use crate::store::writer::Writer;
use crate::subs::{self, Cue};
use crate::AppState;

/// Carries `ImportProgress` while an import runs.
pub const IMPORT_PROGRESS_EVENT: &str = "import-progress";

#[derive(Debug, Clone, Copy, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum Phase {
    /// 切割影片中: cues are being cut and encoded.
    Cutting,
    /// 建立索引: only the last writes remain (R8).
    Indexing,
}

#[derive(Debug, Clone, Copy, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ImportProgress {
    pub phase: Phase,
    #[serde(flatten)]
    pub counts: Progress,
}

/// Step 1: read the subtitle file.
#[tauri::command]
pub fn parse_subtitle(path: PathBuf) -> CommandResult<Vec<Cue>> {
    let cues = subs::parse_file(&path);
    // Left in the log so an odd count can be traced back to the file it came from.
    match &cues {
        Ok(c) => log::info!("parsed {}: {} cues", path.display(), c.len()),
        Err(e) => log::warn!("could not parse {}: {e}", path.display()),
    }
    Ok(cues?)
}

#[tauri::command]
pub fn list_characters(state: State<'_, AppState>) -> CommandResult<Vec<Character>> {
    let library = lock(&state.library)?;
    let lib = library.library().ok_or(LibraryError::NotReady)?;
    Ok(characters::list(lib.conn(), lib.root())?)
}

/// Runs `work` on a blocking thread, off the main one: a synchronous command runs on the main
/// thread, and while it works the window cannot repaint, so a loading button never shows its
/// spinner (user 2026-10-04: shrinking a portrait takes a second or two).
async fn off_main<T: Send + 'static>(
    app: AppHandle,
    work: impl FnOnce(&AppState) -> CommandResult<T> + Send + 'static,
) -> CommandResult<T> {
    tauri::async_runtime::spawn_blocking(move || {
        use tauri::Manager;
        work(&app.state::<AppState>())
    })
    .await
    .map_err(|e| CommandError::new("Internal.Join", e))?
}

/// 新增角色.
#[tauri::command]
pub async fn create_character(app: AppHandle, character: NewCharacter) -> CommandResult<Character> {
    off_main(app, move |state| {
        let library = lock(&state.library)?;
        let lib = library.library().ok_or(LibraryError::NotReady)?;
        Ok(characters::create(lib.conn(), lib.root(), character)?)
    })
    .await
}

/// 編輯角色.
#[tauri::command]
pub async fn update_character(
    app: AppHandle,
    id: i64,
    character: characters::CharacterEdit,
) -> CommandResult<Character> {
    off_main(app, move |state| {
        let mut library = lock(&state.library)?;
        let lib = library.library_mut().ok_or(LibraryError::NotReady)?;
        let root = lib.root().to_owned();
        Ok(characters::update(lib.conn_mut(), &root, id, character)?)
    })
    .await
}

/// 刪除角色 (ET3). Holds the library-busy guard: never beside an import of its lines.
#[tauri::command]
pub fn delete_character(state: State<'_, AppState>, id: i64) -> CommandResult<()> {
    let _busy = BusyGuard::acquire(&state.library_busy)?;
    let mut library = lock(&state.library)?;
    let lib = library.library_mut().ok_or(LibraryError::NotReady)?;
    let root = lib.root().to_owned();
    Ok(characters::delete(lib.conn_mut(), &root, id)?)
}

/// Lets the webview show a picked image before it is stored (新增角色's preview). Only that
/// one file is added to the asset scope.
#[tauri::command]
pub fn allow_preview(app: AppHandle, path: PathBuf) -> CommandResult<()> {
    use tauri::Manager;
    app.asset_protocol_scope()
        .allow_file(&path)
        .map_err(|e| CommandError::new("Internal.AssetScope", e))
}

/// One Step 2 row that has a character.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Assignment {
    pub cue: Cue,
    pub character_id: i64,
    /// A merged line's `[start_ms, end_ms]` pieces (合併); absent for an ordinary cue.
    #[serde(default)]
    pub segments: Vec<(u64, u64)>,
    /// Its 間隔秒數 in ms, clamped to 0–10 s; absent for an ordinary cue.
    #[serde(default)]
    pub gap_ms: u64,
}

/// Step 3: cut `source` along the assigned cues. Resolves when the run ends (完成, 部分完成,
/// cancelled); progress arrives on `import-progress`.
#[tauri::command]
pub async fn start_subtitle_import(
    app: AppHandle,
    state: State<'_, AppState>,
    subtitle: PathBuf,
    source: PathBuf,
    assignments: Vec<Assignment>,
) -> CommandResult<JobOutcome> {
    let cues = assignments
        .into_iter()
        .map(|a| PlannedCue {
            cue: a.cue,
            character_id: a.character_id,
            segments: a.segments,
            gap_ms: a.gap_ms.min(10_000),
        })
        .collect();
    run_job(app, &state, move |engine| {
        job::import_subtitle(engine, &subtitle, &source, cues)
    })
    .await
}

/// 再試一次 on 部分完成 / 匯入失敗.
#[tauri::command]
pub async fn retry_import(
    app: AppHandle,
    state: State<'_, AppState>,
    run_id: i64,
) -> CommandResult<JobOutcome> {
    run_job(app, &state, move |engine| job::retry(engine, run_id)).await
}

/// 取消: kills the in-flight encodes at once (ENG6).
#[tauri::command]
pub fn cancel_import(state: State<'_, AppState>) {
    state.import_cancel.store(true, Ordering::SeqCst);
}

async fn run_job<F>(
    app: AppHandle,
    state: &State<'_, AppState>,
    work: F,
) -> CommandResult<JobOutcome>
where
    F: FnOnce(&Engine<'_>) -> Result<JobOutcome, crate::import::ImportError> + Send + 'static,
{
    // One library operation at a time: no import alongside a move, export or backup import.
    let _busy = BusyGuard::acquire(&state.library_busy)?;
    let root = {
        let library = lock(&state.library)?;
        library
            .library()
            .ok_or(LibraryError::NotReady)?
            .root()
            .to_owned()
    };
    let ffmpeg = sidecar("ffmpeg").map_err(CommandError::from)?;
    let ffprobe = sidecar("ffprobe").map_err(CommandError::from)?;
    let cancel = std::sync::Arc::clone(&state.import_cancel);
    cancel.store(false, Ordering::SeqCst);

    tauri::async_runtime::spawn_blocking(move || {
        let writer = Writer::open(&root.join(DB_FILE))?;
        let last = Mutex::new(None::<Progress>);
        let emit = |phase, counts| {
            let _ = app.emit(IMPORT_PROGRESS_EVENT, ImportProgress { phase, counts });
        };
        let on_event = |event: Event| match event {
            Event::Progress(p) => {
                *last.lock().unwrap() = Some(p);
                emit(Phase::Cutting, p);
            }
            Event::Indexing => {
                if let Some(p) = *last.lock().unwrap() {
                    emit(Phase::Indexing, p);
                }
            }
            Event::Committed { .. } => {}
        };
        let engine = Engine {
            library: &root,
            writer: &writer,
            encoder: &FfmpegEncoder { ffmpeg },
            prober: &FfprobeProber { ffprobe },
            workers: default_workers(),
            cancel: &cancel,
            on_event: &on_event,
        };
        let outcome = work(&engine);
        log_outcome(&root, &outcome);
        outcome.map_err(CommandError::from)
    })
    .await
    .map_err(|e| CommandError::new("Internal.Join", e))?
}

fn log_outcome(root: &Path, outcome: &Result<JobOutcome, crate::import::ImportError>) {
    match outcome {
        Ok(o) => log::info!(
            "import run {} into {}: {:?}, {} imported, {} not imported",
            o.run_id,
            root.display(),
            o.status,
            o.imported,
            o.failures.len()
        ),
        Err(e) => log::warn!("import into {} failed: {e}", root.display()),
    }
}

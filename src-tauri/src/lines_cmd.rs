//! Commands behind the 台詞 page (Lines), EditLine, DeleteLine and the banner poster.

use std::path::PathBuf;

use serde::Serialize;
use tauri::State;

use crate::commands::{lock, BusyGuard};
use crate::error::CommandResult;
use crate::library::characters::{self, Character};
use crate::library::lines::{self, Line, LineEdit};
use crate::library::LibraryError;
use crate::AppState;

/// Everything the 台詞 page draws: the character, its poster and all its lines.
#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LinesPage {
    pub character: Character,
    pub poster_path: Option<PathBuf>,
    pub lines: Vec<Line>,
}

#[tauri::command]
pub fn open_lines(state: State<'_, AppState>, character_id: i64) -> CommandResult<LinesPage> {
    let library = lock(&state.library)?;
    let lib = library.library().ok_or(LibraryError::NotReady)?;
    let character = characters::list(lib.conn(), lib.root())?
        .into_iter()
        .find(|c| c.id == character_id)
        .ok_or(characters::CharacterError::NotFound(character_id))?;
    Ok(LinesPage {
        character,
        poster_path: lines::poster(lib.conn(), lib.root(), character_id)?,
        lines: lines::list(lib.conn(), lib.root(), character_id)?,
    })
}

#[tauri::command]
pub fn get_line(state: State<'_, AppState>, id: i64) -> CommandResult<Line> {
    let library = lock(&state.library)?;
    let lib = library.library().ok_or(LibraryError::NotReady)?;
    Ok(lines::get(lib.conn(), lib.root(), id)?)
}

#[tauri::command]
pub fn set_line_pinned(state: State<'_, AppState>, id: i64, pinned: bool) -> CommandResult<()> {
    let library = lock(&state.library)?;
    let lib = library.library().ok_or(LibraryError::NotReady)?;
    Ok(lines::set_pinned(lib.conn(), id, pinned)?)
}

#[tauri::command]
pub fn update_line(state: State<'_, AppState>, id: i64, line: LineEdit) -> CommandResult<Line> {
    let library = lock(&state.library)?;
    let lib = library.library().ok_or(LibraryError::NotReady)?;
    Ok(lines::update(lib.conn(), lib.root(), id, line)?)
}

/// 刪除台詞. Holds the library-busy guard, like every delete.
#[tauri::command]
pub fn delete_line(state: State<'_, AppState>, id: i64) -> CommandResult<()> {
    let _busy = BusyGuard::acquire(&state.library_busy)?;
    let mut library = lock(&state.library)?;
    let lib = library.library_mut().ok_or(LibraryError::NotReady)?;
    let root = lib.root().to_owned();
    Ok(lines::delete(lib.conn_mut(), &root, id)?)
}

/// 上傳／更新橫幅海報 with a path, 移除海報 with none.
#[tauri::command]
pub fn set_poster(
    state: State<'_, AppState>,
    character_id: i64,
    path: Option<PathBuf>,
) -> CommandResult<Option<PathBuf>> {
    let mut library = lock(&state.library)?;
    let lib = library.library_mut().ok_or(LibraryError::NotReady)?;
    let root = lib.root().to_owned();
    Ok(lines::set_poster(
        lib.conn_mut(),
        &root,
        character_id,
        path.as_deref(),
    )?)
}

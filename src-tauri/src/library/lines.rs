//! A character's lines (the 台詞 page, EditLine, DeleteLine) and its banner poster
//! (LinesPoster, DeletePoster).

use std::path::{Path, PathBuf};

use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};

use super::characters::CharacterError;
use super::deletion;
use super::images;
use super::paths::IMAGES_DIR;
use crate::store::{self, StoreError};

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Line {
    pub id: i64,
    pub character_id: i64,
    pub text: String,
    pub translation: Option<String>,
    /// Absolute, for the asset protocol.
    pub audio_path: PathBuf,
    pub duration_ms: i64,
    pub created_at: i64,
    /// Set when pinned; orders the pinned group.
    pub pinned_at: Option<i64>,
}

/// EditLine's form: the text, the optional translation, and the character it belongs to.
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LineEdit {
    pub text: String,
    pub translation: Option<String>,
    pub character_id: i64,
}

#[derive(Debug, thiserror::Error)]
pub enum LineError {
    #[error("invalid {field}")]
    Invalid { field: &'static str },
    #[error("line {0} not found")]
    NotFound(i64),
    #[error(transparent)]
    Character(#[from] CharacterError),
    #[error(transparent)]
    Store(#[from] StoreError),
}

impl From<rusqlite::Error> for LineError {
    fn from(e: rusqlite::Error) -> Self {
        Self::Store(e.into())
    }
}

const COLUMNS: &str =
    "id, character_id, text, translation, audio_filename, duration_ms, created_at, pinned_at";

fn row(root: &Path) -> impl Fn(&rusqlite::Row<'_>) -> rusqlite::Result<Line> + '_ {
    move |r| {
        Ok(Line {
            id: r.get(0)?,
            character_id: r.get(1)?,
            text: r.get(2)?,
            translation: r.get(3)?,
            audio_path: root.join(r.get::<_, String>(4)?),
            duration_ms: r.get(5)?,
            created_at: r.get(6)?,
            pinned_at: r.get(7)?,
        })
    }
}

/// Every line of a character. The page sorts, searches and pages them itself.
pub fn list(conn: &Connection, root: &Path, character_id: i64) -> Result<Vec<Line>, StoreError> {
    let mut stmt = conn.prepare(&format!(
        "SELECT {COLUMNS} FROM lines WHERE character_id = ?1 ORDER BY created_at DESC, id DESC"
    ))?;
    let lines = stmt.query_map([character_id], row(root))?;
    Ok(lines.collect::<Result<_, _>>()?)
}

pub fn get(conn: &Connection, root: &Path, id: i64) -> Result<Line, LineError> {
    conn.query_row(
        &format!("SELECT {COLUMNS} FROM lines WHERE id = ?1"),
        [id],
        row(root),
    )
    .optional()?
    .ok_or(LineError::NotFound(id))
}

/// 釘選 / 取消釘選.
pub fn set_pinned(conn: &Connection, id: i64, pinned: bool) -> Result<(), LineError> {
    let pinned_at = pinned.then(store::now_ms);
    let changed = conn.execute(
        "UPDATE lines SET pinned_at = ?2, updated_at = ?3 WHERE id = ?1",
        params![id, pinned_at, store::now_ms()],
    )?;
    if changed == 0 {
        return Err(LineError::NotFound(id));
    }
    Ok(())
}

/// EditLine's 儲存: the text is required, the translation optional, and the line may move to
/// another character.
pub fn update(conn: &Connection, root: &Path, id: i64, edit: LineEdit) -> Result<Line, LineError> {
    let text = edit.text.trim();
    if text.is_empty() || text.chars().count() > 1000 {
        return Err(LineError::Invalid { field: "text" });
    }
    let translation = edit
        .translation
        .as_deref()
        .map(str::trim)
        .filter(|t| !t.is_empty());
    if translation.is_some_and(|t| t.chars().count() > 1000) {
        return Err(LineError::Invalid {
            field: "translation",
        });
    }
    let character_exists: bool = conn.query_row(
        "SELECT EXISTS (SELECT 1 FROM characters WHERE id = ?1)",
        [edit.character_id],
        |r| r.get(0),
    )?;
    if !character_exists {
        return Err(LineError::Invalid { field: "character" });
    }
    let changed = conn.execute(
        "UPDATE lines SET text = ?2, translation = ?3, character_id = ?4, updated_at = ?5 WHERE id = ?1",
        params![id, text, translation, edit.character_id, store::now_ms()],
    )?;
    if changed == 0 {
        return Err(LineError::NotFound(id));
    }
    get(conn, root, id)
}

/// 刪除台詞: the row and its clip go through `pending_deletions` (ENG3).
pub fn delete(conn: &mut Connection, root: &Path, id: i64) -> Result<(), LineError> {
    let tx = conn.transaction()?;
    if deletion::delete_lines(&tx, &[id])? == 0 {
        return Err(LineError::NotFound(id));
    }
    tx.commit()?;
    let drained = deletion::drain(conn, root)?;
    if !drained.failed.is_empty() {
        return Err(CharacterError::FileRemovalFailed(drained.failed).into());
    }
    Ok(())
}

/// The banner poster (LinesPoster), as an absolute path.
pub fn poster(
    conn: &Connection,
    root: &Path,
    character_id: i64,
) -> Result<Option<PathBuf>, StoreError> {
    let file: Option<Option<String>> = conn
        .query_row(
            "SELECT poster_file FROM characters WHERE id = ?1",
            [character_id],
            |r| r.get(0),
        )
        .optional()?;
    Ok(file.flatten().map(|f| root.join(IMAGES_DIR).join(f)))
}

/// 上傳／更新橫幅海報 (`Some`) or 移除海報 (`None`). The old poster is queued for deletion in
/// the same transaction and unlinked after commit.
pub fn set_poster(
    conn: &mut Connection,
    root: &Path,
    character_id: i64,
    source: Option<&Path>,
) -> Result<Option<PathBuf>, LineError> {
    let old: Option<String> = conn
        .query_row(
            "SELECT poster_file FROM characters WHERE id = ?1",
            [character_id],
            |r| r.get(0),
        )
        .optional()?
        .ok_or(CharacterError::NotFound(character_id))?;
    let new = source
        .map(|p| images::store(root, p))
        .transpose()
        .map_err(CharacterError::from)?;

    let result = (|| -> Result<(), rusqlite::Error> {
        let tx = conn.transaction()?;
        tx.execute(
            "UPDATE characters SET poster_file = ?2, updated_at = ?3 WHERE id = ?1",
            params![character_id, new, store::now_ms()],
        )?;
        if let Some(old) = &old {
            tx.execute(
                "INSERT INTO pending_deletions (relative_path, bytes, queued_at) VALUES (?1, 0, ?2)
                 ON CONFLICT (relative_path) DO NOTHING",
                params![format!("{IMAGES_DIR}/{old}"), store::now_ms()],
            )?;
        }
        tx.commit()
    })();
    if let Err(e) = result {
        if let Some(file) = &new {
            let _ = std::fs::remove_file(root.join(IMAGES_DIR).join(file));
        }
        return Err(e.into());
    }
    deletion::drain(conn, root)?;
    Ok(new.map(|f| root.join(IMAGES_DIR).join(f)))
}

#[cfg(test)]
mod tests {
    use std::fs;

    use super::*;
    use crate::library::folder::Library;

    fn setup(dir: &Path) -> Library {
        let lib = Library::create(&dir.join("lib")).unwrap();
        lib.conn()
            .execute_batch(
                "INSERT INTO characters (id, name, category, source, created_at, updated_at) VALUES
                   (1, '優希', 'anime', '他是傳奇', 0, 0), (2, '芙莉蓮', 'anime', '葬送的芙莉蓮', 0, 0);
                 INSERT INTO lines (id, character_id, text, audio_filename, audio_bytes, duration_ms, created_at, updated_at) VALUES
                   (1, 1, '今天的風好舒服呢。', 'AAAAAAAAAAAA.m4a', 4, 2000, 100, 100),
                   (2, 1, '等一下，我還沒說完！', 'BBBBBBBBBBBB.m4a', 4, 3000, 200, 200),
                   (3, 2, '人類的壽命真的很短暫呢。', 'CCCCCCCCCCCC.m4a', 4, 2500, 300, 300);",
            )
            .unwrap();
        for f in ["AAAAAAAAAAAA.m4a", "BBBBBBBBBBBB.m4a", "CCCCCCCCCCCC.m4a"] {
            fs::write(lib.root().join(f), b"clip").unwrap();
        }
        lib
    }

    #[test]
    fn lists_a_characters_lines_newest_first_with_clip_paths() {
        let dir = tempfile::tempdir().unwrap();
        let lib = setup(dir.path());
        let lines = list(lib.conn(), lib.root(), 1).unwrap();
        assert_eq!(lines.iter().map(|l| l.id).collect::<Vec<_>>(), [2, 1]);
        assert_eq!(lines[0].audio_path, lib.root().join("BBBBBBBBBBBB.m4a"));
    }

    #[test]
    fn pins_edits_moves_and_deletes_a_line() {
        let dir = tempfile::tempdir().unwrap();
        let mut lib = setup(dir.path());
        let root = lib.root().to_owned();

        set_pinned(lib.conn(), 1, true).unwrap();
        assert!(get(lib.conn(), &root, 1).unwrap().pinned_at.is_some());
        set_pinned(lib.conn(), 1, false).unwrap();
        assert!(get(lib.conn(), &root, 1).unwrap().pinned_at.is_none());

        let edited = update(
            lib.conn(),
            &root,
            1,
            LineEdit {
                text: "  今天的風真舒服。 ".into(),
                translation: Some("The breeze is lovely today.".into()),
                character_id: 2,
            },
        )
        .unwrap();
        assert_eq!(edited.text, "今天的風真舒服。");
        assert_eq!(edited.character_id, 2, "moved to another character");
        assert!(matches!(
            update(
                lib.conn(),
                &root,
                1,
                LineEdit {
                    text: " ".into(),
                    translation: None,
                    character_id: 2
                }
            ),
            Err(LineError::Invalid { field: "text" })
        ));
        assert!(matches!(
            update(
                lib.conn(),
                &root,
                1,
                LineEdit {
                    text: "x".into(),
                    translation: None,
                    character_id: 99
                }
            ),
            Err(LineError::Invalid { field: "character" })
        ));

        delete(lib.conn_mut(), &root, 1).unwrap();
        assert!(matches!(
            get(lib.conn(), &root, 1),
            Err(LineError::NotFound(1))
        ));
        assert!(!root.join("AAAAAAAAAAAA.m4a").exists());
    }

    #[test]
    fn a_poster_is_stored_replaced_and_removed_with_its_files() {
        let dir = tempfile::tempdir().unwrap();
        let mut lib = setup(dir.path());
        let root = lib.root().to_owned();
        let png = |name: &str| {
            let mut data = b"\x89PNG\r\n\x1a\n\0\0\0\rIHDR".to_vec();
            data.extend_from_slice(&1280u32.to_be_bytes());
            data.extend_from_slice(&720u32.to_be_bytes());
            data.extend_from_slice(&[8, 6, 0, 0, 0, 0, 0, 0, 0]);
            let path = dir.path().join(name);
            fs::write(&path, data).unwrap();
            path
        };
        let images = || fs::read_dir(root.join(IMAGES_DIR)).unwrap().count();

        let first = set_poster(lib.conn_mut(), &root, 1, Some(&png("a.png")))
            .unwrap()
            .unwrap();
        assert_eq!(poster(lib.conn(), &root, 1).unwrap(), Some(first.clone()));
        let second = set_poster(lib.conn_mut(), &root, 1, Some(&png("b.png")))
            .unwrap()
            .unwrap();
        assert!(!first.exists() && second.exists());
        assert_eq!(images(), 1);
        assert_eq!(set_poster(lib.conn_mut(), &root, 1, None).unwrap(), None);
        assert_eq!(images(), 0);
        assert_eq!(poster(lib.conn(), &root, 1).unwrap(), None);
    }
}

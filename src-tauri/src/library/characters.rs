//! Characters: listing them (Step 2's 指派給… and picker, 台詞本) and adding one (新增角色).

use std::fs;
use std::path::{Path, PathBuf};

use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};

use super::deletion::{self, Drained};
use super::images::{self, ImageError};
use super::paths::IMAGES_DIR;
use crate::store::{self, StoreError};

pub const CATEGORIES: &[&str] = &["anime", "movie", "tv"];

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Character {
    pub id: i64,
    pub name: String,
    pub category: String,
    pub source: String,
    pub cv: Option<String>,
    /// Absolute, for the asset protocol.
    pub portrait_path: Option<PathBuf>,
    pub line_count: i64,
}

/// 新增角色's form. `portrait` is the picked image file, copied into the library.
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewCharacter {
    pub name: String,
    pub category: String,
    pub source: String,
    pub cv: Option<String>,
    pub portrait: Option<PathBuf>,
}

/// 編輯角色's photo control: keep it, remove it (the bin), or replace it (更換照片).
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase", tag = "kind", content = "path")]
pub enum PortraitChange {
    Keep,
    Remove,
    Replace(PathBuf),
}

/// 編輯角色's form.
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CharacterEdit {
    pub name: String,
    pub category: String,
    pub source: String,
    pub cv: Option<String>,
    pub portrait: PortraitChange,
}

#[derive(Debug, thiserror::Error)]
pub enum CharacterError {
    #[error("invalid {field}")]
    Invalid { field: &'static str },
    #[error("character {0} not found")]
    NotFound(i64),
    /// The rows are gone but some files could not be unlinked; they stay queued (ET3).
    #[error("{} file(s) could not be removed", .0.len())]
    FileRemovalFailed(Vec<(String, String)>),
    #[error(transparent)]
    Image(#[from] ImageError),
    #[error(transparent)]
    Store(#[from] StoreError),
}

impl From<rusqlite::Error> for CharacterError {
    fn from(e: rusqlite::Error) -> Self {
        Self::Store(e.into())
    }
}

/// Every character with its line count, by name.
pub fn list(conn: &Connection, root: &Path) -> Result<Vec<Character>, StoreError> {
    let mut stmt = conn.prepare(
        "SELECT c.id, c.name, c.category, c.source, c.cv, c.portrait_file,
                (SELECT COUNT(*) FROM lines l WHERE l.character_id = c.id)
           FROM characters c ORDER BY c.name, c.id",
    )?;
    let rows = stmt.query_map([], |r| {
        Ok(Character {
            id: r.get(0)?,
            name: r.get(1)?,
            category: r.get(2)?,
            source: r.get(3)?,
            cv: r.get(4)?,
            portrait_path: r
                .get::<_, Option<String>>(5)?
                .map(|f| root.join(IMAGES_DIR).join(f)),
            line_count: r.get(6)?,
        })
    })?;
    Ok(rows.collect::<Result<_, _>>()?)
}

struct Fields {
    name: String,
    source: String,
    cv: Option<String>,
}

fn validate(
    name: &str,
    category: &str,
    source: &str,
    cv: Option<&str>,
) -> Result<Fields, CharacterError> {
    let name = required(name, 100, "name")?;
    let source = required(source, 200, "source")?;
    let cv = match cv.map(str::trim).filter(|c| !c.is_empty()) {
        Some(cv) if cv.chars().count() <= 100 => Some(cv.to_owned()),
        Some(_) => return Err(CharacterError::Invalid { field: "cv" }),
        None => None,
    };
    if !CATEGORIES.contains(&category) {
        return Err(CharacterError::Invalid { field: "category" });
    }
    Ok(Fields { name, source, cv })
}

fn relative_image(file: &str) -> String {
    format!("{IMAGES_DIR}/{file}")
}

/// 編輯角色: validates, stores a replacement photo first, updates the row, and queues the old
/// photo for deletion in the same transaction (ENG3), then unlinks it.
pub fn update(
    conn: &mut Connection,
    root: &Path,
    id: i64,
    edit: CharacterEdit,
) -> Result<Character, CharacterError> {
    let f = validate(&edit.name, &edit.category, &edit.source, edit.cv.as_deref())?;
    let old: Option<String> = conn
        .query_row(
            "SELECT portrait_file FROM characters WHERE id = ?1",
            [id],
            |r| r.get(0),
        )
        .map_err(|e| match e {
            rusqlite::Error::QueryReturnedNoRows => CharacterError::NotFound(id),
            e => e.into(),
        })?;
    let new_file = match &edit.portrait {
        PortraitChange::Replace(path) => Some(images::store_portrait(root, path)?),
        _ => None,
    };
    let portrait = match &edit.portrait {
        PortraitChange::Keep => old.clone(),
        PortraitChange::Remove => None,
        PortraitChange::Replace(_) => new_file.clone(),
    };
    let result = (|| -> Result<(), CharacterError> {
        let tx = conn.transaction()?;
        tx.execute(
            "UPDATE characters SET name = ?2, category = ?3, source = ?4, cv = ?5, portrait_file = ?6,
                                   updated_at = ?7 WHERE id = ?1",
            params![id, f.name, edit.category, f.source, f.cv, portrait, store::now_ms()],
        )?;
        if let (Some(old), false) = (&old, matches!(edit.portrait, PortraitChange::Keep)) {
            queue_file(&tx, &relative_image(old))?;
        }
        tx.commit()?;
        Ok(())
    })();
    if let Err(e) = result {
        if let Some(file) = &new_file {
            let _ = fs::remove_file(root.join(IMAGES_DIR).join(file));
        }
        return Err(e);
    }
    deletion::drain(conn, root)?;
    let line_count = conn.query_row(
        "SELECT COUNT(*) FROM lines WHERE character_id = ?1",
        [id],
        |r| r.get(0),
    )?;
    Ok(Character {
        id,
        name: f.name,
        category: edit.category,
        source: f.source,
        cv: f.cv,
        portrait_path: portrait.map(|p| root.join(IMAGES_DIR).join(p)),
        line_count,
    })
}

/// 刪除角色 (ET3): its lines, its import failures, its photo and poster and the character go in
/// one transaction, every file queued in `pending_deletions`; the files are unlinked after
/// commit. Files that cannot be removed stay queued and are reported.
pub fn delete(conn: &mut Connection, root: &Path, id: i64) -> Result<(), CharacterError> {
    let tx = conn.transaction()?;
    let files: Option<(Option<String>, Option<String>)> = tx
        .query_row(
            "SELECT portrait_file, poster_file FROM characters WHERE id = ?1",
            [id],
            |r| Ok((r.get(0)?, r.get(1)?)),
        )
        .map(Some)
        .or_else(|e| match e {
            rusqlite::Error::QueryReturnedNoRows => Ok(None),
            e => Err(e),
        })?;
    let Some((portrait, poster)) = files else {
        return Err(CharacterError::NotFound(id));
    };
    let lines: Vec<i64> = tx
        .prepare("SELECT id FROM lines WHERE character_id = ?1")?
        .query_map([id], |r| r.get(0))?
        .collect::<Result<_, _>>()?;
    deletion::delete_lines(&tx, &lines)?;
    tx.execute("DELETE FROM import_failures WHERE character_id = ?1", [id])?;
    for file in portrait.iter().chain(poster.iter()) {
        queue_file(&tx, &relative_image(file))?;
    }
    tx.execute("DELETE FROM characters WHERE id = ?1", [id])?;
    tx.commit()?;
    log::info!("deleted character {id} with {} line(s)", lines.len());

    let Drained { failed, .. } = deletion::drain(conn, root)?;
    if failed.is_empty() {
        Ok(())
    } else {
        Err(CharacterError::FileRemovalFailed(failed))
    }
}

fn queue_file(tx: &rusqlite::Transaction<'_>, relative: &str) -> Result<(), rusqlite::Error> {
    tx.execute(
        "INSERT INTO pending_deletions (relative_path, bytes, queued_at) VALUES (?1, 0, ?2)
         ON CONFLICT (relative_path) DO NOTHING",
        params![relative, store::now_ms()],
    )?;
    Ok(())
}

/// Validates the form, stores the portrait, and inserts the row. If the insert fails the
/// stored image is removed again.
pub fn create(
    conn: &Connection,
    root: &Path,
    new: NewCharacter,
) -> Result<Character, CharacterError> {
    let Fields { name, source, cv } =
        validate(&new.name, &new.category, &new.source, new.cv.as_deref())?;

    let portrait = new
        .portrait
        .as_deref()
        .map(|p| images::store_portrait(root, p))
        .transpose()?;
    let now = store::now_ms();
    let inserted = conn.execute(
        "INSERT INTO characters (name, category, source, cv, portrait_file, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?6)",
        params![name, new.category, source, cv, portrait, now],
    );
    if let Err(e) = inserted {
        if let Some(file) = &portrait {
            let _ = fs::remove_file(root.join(IMAGES_DIR).join(file));
        }
        return Err(e.into());
    }
    Ok(Character {
        id: conn.last_insert_rowid(),
        name,
        category: new.category,
        source,
        cv,
        portrait_path: portrait.map(|f| root.join(IMAGES_DIR).join(f)),
        line_count: 0,
    })
}

fn required(value: &str, max_chars: usize, field: &'static str) -> Result<String, CharacterError> {
    let trimmed = value.trim();
    if trimmed.is_empty() || trimmed.chars().count() > max_chars {
        return Err(CharacterError::Invalid { field });
    }
    Ok(trimmed.to_owned())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::library::folder::Library;

    fn form() -> NewCharacter {
        NewCharacter {
            name: "  芙莉蓮 ".into(),
            category: "anime".into(),
            source: "葬送的芙莉蓮".into(),
            cv: Some(" ".into()),
            portrait: None,
        }
    }

    #[test]
    fn a_character_is_created_trimmed_and_listed() {
        let dir = tempfile::tempdir().unwrap();
        let lib = Library::create(&dir.path().join("lib")).unwrap();
        let created = create(lib.conn(), lib.root(), form()).unwrap();
        assert_eq!(created.name, "芙莉蓮");
        assert_eq!(created.cv, None, "a blank optional field is stored as NULL");
        assert_eq!(list(lib.conn(), lib.root()).unwrap(), [created]);
    }

    #[test]
    fn required_fields_and_the_category_are_checked() {
        let dir = tempfile::tempdir().unwrap();
        let lib = Library::create(&dir.path().join("lib")).unwrap();
        let blank = NewCharacter {
            name: "   ".into(),
            ..form()
        };
        assert!(matches!(
            create(lib.conn(), lib.root(), blank),
            Err(CharacterError::Invalid { field: "name" })
        ));
        let bad = NewCharacter {
            category: "comic".into(),
            ..form()
        };
        assert!(matches!(
            create(lib.conn(), lib.root(), bad),
            Err(CharacterError::Invalid { field: "category" })
        ));
    }

    #[test]
    fn a_refused_portrait_creates_nothing() {
        let dir = tempfile::tempdir().unwrap();
        let lib = Library::create(&dir.path().join("lib")).unwrap();
        let fake = dir.path().join("fake.png");
        fs::write(&fake, b"not an image").unwrap();
        let err = create(
            lib.conn(),
            lib.root(),
            NewCharacter {
                portrait: Some(fake),
                ..form()
            },
        )
        .unwrap_err();
        assert!(matches!(
            err,
            CharacterError::Image(ImageError::Unsupported)
        ));
        assert!(list(lib.conn(), lib.root()).unwrap().is_empty());
        assert_eq!(
            fs::read_dir(lib.root().join(IMAGES_DIR)).unwrap().count(),
            0
        );
    }

    fn png(dir: &Path, name: &str) -> PathBuf {
        let mut data = b"\x89PNG\r\n\x1a\n\0\0\0\rIHDR".to_vec();
        data.extend_from_slice(&64u32.to_be_bytes());
        data.extend_from_slice(&64u32.to_be_bytes());
        data.extend_from_slice(&[8, 6, 0, 0, 0, 0, 0, 0, 0]);
        let path = dir.join(name);
        fs::write(&path, data).unwrap();
        path
    }

    fn images_in(root: &Path) -> usize {
        fs::read_dir(root.join(IMAGES_DIR)).unwrap().count()
    }

    #[test]
    fn replacing_or_removing_a_photo_deletes_the_old_file() {
        let dir = tempfile::tempdir().unwrap();
        let mut lib = Library::create(&dir.path().join("lib")).unwrap();
        let root = lib.root().to_owned();
        let created = create(
            lib.conn(),
            &root,
            NewCharacter {
                portrait: Some(png(dir.path(), "a.png")),
                ..form()
            },
        )
        .unwrap();
        let edit = |portrait| CharacterEdit {
            name: "芙莉蓮".into(),
            category: "anime".into(),
            source: "葬送的芙莉蓮".into(),
            cv: Some("種﨑敦美".into()),
            portrait,
        };

        let replaced = update(
            lib.conn_mut(),
            &root,
            created.id,
            edit(PortraitChange::Replace(png(dir.path(), "b.png"))),
        )
        .unwrap();
        assert_ne!(replaced.portrait_path, created.portrait_path);
        assert!(!created.portrait_path.unwrap().exists());
        assert_eq!(images_in(&root), 1);
        assert_eq!(replaced.cv.as_deref(), Some("種﨑敦美"));

        let kept = update(
            lib.conn_mut(),
            &root,
            created.id,
            edit(PortraitChange::Keep),
        )
        .unwrap();
        assert_eq!(kept.portrait_path, replaced.portrait_path);

        let removed = update(
            lib.conn_mut(),
            &root,
            created.id,
            edit(PortraitChange::Remove),
        )
        .unwrap();
        assert_eq!(removed.portrait_path, None);
        assert_eq!(images_in(&root), 0);
    }

    /// ET3: deleting a character with 500 lines removes every row and file, its photo, and the
    /// disk figure drops to zero.
    #[test]
    fn deleting_a_character_removes_its_lines_files_and_photo() {
        let dir = tempfile::tempdir().unwrap();
        let mut lib = Library::create(&dir.path().join("lib")).unwrap();
        let root = lib.root().to_owned();
        let c = create(
            lib.conn(),
            &root,
            NewCharacter {
                portrait: Some(png(dir.path(), "a.png")),
                ..form()
            },
        )
        .unwrap();
        for i in 0..500 {
            let name = format!("{i:0>12}.m4a");
            fs::write(root.join(&name), b"clip").unwrap();
            lib.conn()
                .execute(
                    "INSERT INTO lines (character_id, text, audio_filename, audio_bytes, duration_ms, created_at, updated_at)
                     VALUES (?1, 'x', ?2, 4, 1, 0, 0)",
                    params![c.id, name],
                )
                .unwrap();
        }
        assert_eq!(lib.stats().unwrap().bytes, 2000);

        delete(lib.conn_mut(), &root, c.id).unwrap();
        assert!(list(lib.conn(), &root).unwrap().is_empty());
        assert_eq!(lib.stats().unwrap().clip_count, 0);
        assert_eq!(lib.stats().unwrap().bytes, 0);
        let clips = fs::read_dir(&root)
            .unwrap()
            .flatten()
            .filter(|e| e.file_name().to_string_lossy().ends_with(".m4a"))
            .count();
        assert_eq!(clips, 0);
        assert_eq!(images_in(&root), 0);
    }

    #[test]
    fn a_file_that_cannot_be_removed_is_reported_and_stays_queued() {
        let dir = tempfile::tempdir().unwrap();
        let mut lib = Library::create(&dir.path().join("lib")).unwrap();
        let root = lib.root().to_owned();
        let c = create(lib.conn(), &root, form()).unwrap();
        // A directory where the clip should be: remove_file fails on it everywhere.
        fs::create_dir(root.join("AAAAAAAAAAAA.m4a")).unwrap();
        lib.conn()
            .execute(
                "INSERT INTO lines (character_id, text, audio_filename, audio_bytes, duration_ms, created_at, updated_at)
                 VALUES (?1, 'x', 'AAAAAAAAAAAA.m4a', 4, 1, 0, 0)",
                [c.id],
            )
            .unwrap();

        let err = delete(lib.conn_mut(), &root, c.id).unwrap_err();
        assert!(matches!(err, CharacterError::FileRemovalFailed(ref f) if f.len() == 1));
        assert!(
            list(lib.conn(), &root).unwrap().is_empty(),
            "the character is gone regardless"
        );
        let queued: i64 = lib
            .conn()
            .query_row("SELECT COUNT(*) FROM pending_deletions", [], |r| r.get(0))
            .unwrap();
        assert_eq!(queued, 1);
    }

    #[test]
    fn the_renderer_s_portrait_change_shape_deserializes() {
        let keep: PortraitChange = serde_json::from_str(r#"{"kind":"keep"}"#).unwrap();
        assert!(matches!(keep, PortraitChange::Keep));
        let remove: PortraitChange = serde_json::from_str(r#"{"kind":"remove"}"#).unwrap();
        assert!(matches!(remove, PortraitChange::Remove));
        let replace: PortraitChange =
            serde_json::from_str(r#"{"kind":"replace","path":"/p/a.png"}"#).unwrap();
        assert!(matches!(replace, PortraitChange::Replace(p) if p == Path::new("/p/a.png")));
    }
}

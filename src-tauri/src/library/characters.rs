//! Characters: listing them (Step 2's 指派給… and picker, 台詞本) and adding one (新增角色).

use std::fs;
use std::path::{Path, PathBuf};

use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};

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

#[derive(Debug, thiserror::Error)]
pub enum CharacterError {
    #[error("invalid {field}")]
    Invalid { field: &'static str },
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

/// Validates the form, stores the portrait, and inserts the row. If the insert fails the
/// stored image is removed again.
pub fn create(
    conn: &Connection,
    root: &Path,
    new: NewCharacter,
) -> Result<Character, CharacterError> {
    let name = required(&new.name, 100, "name")?;
    let source = required(&new.source, 200, "source")?;
    let cv = match new.cv.as_deref().map(str::trim).filter(|c| !c.is_empty()) {
        Some(cv) if cv.chars().count() <= 100 => Some(cv.to_owned()),
        Some(_) => return Err(CharacterError::Invalid { field: "cv" }),
        None => None,
    };
    if !CATEGORIES.contains(&new.category.as_str()) {
        return Err(CharacterError::Invalid { field: "category" });
    }

    let portrait = new
        .portrait
        .as_deref()
        .map(|p| images::store(root, p))
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
}

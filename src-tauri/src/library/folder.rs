//! Opening, creating and inspecting a library folder.

use std::fs;
use std::path::{Path, PathBuf};

use rusqlite::Connection;
use serde::Serialize;

use super::paths::{DB_FILE, IMAGES_DIR, TMP_DIR};
use super::volume::{self, VolumeKind};
use super::LibraryError;
use crate::store;

/// OS clutter that does not make a folder "non-empty" for our purposes.
const IGNORABLE: &[&str] = &[".DS_Store", "Thumbs.db", "desktop.ini", ".localized"];

/// A line whose clip is gone from disk, with what 遺失的檔案 shows for it.
#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct MissingFile {
    pub line_id: i64,
    pub character_id: i64,
    pub character_name: String,
    /// Absolute, for the asset protocol; `None` shows the initial instead.
    pub portrait_path: Option<PathBuf>,
    pub text: String,
}

/// What a candidate location currently holds.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DirKind {
    Missing,
    Empty,
    /// Contains `library.sqlite`.
    Library,
    /// Exists, has other content, and is not a library.
    Other,
}

pub fn classify_dir(path: &Path) -> Result<DirKind, LibraryError> {
    if !path.exists() {
        return Ok(DirKind::Missing);
    }
    if !path.is_dir() {
        return Ok(DirKind::Other);
    }
    if path.join(DB_FILE).is_file() {
        return Ok(DirKind::Library);
    }
    let has_content = fs::read_dir(path)
        .map_err(|e| LibraryError::io(path, e))?
        .flatten()
        .any(|entry| !IGNORABLE.contains(&entry.file_name().to_string_lossy().as_ref()));
    Ok(if has_content {
        DirKind::Other
    } else {
        DirKind::Empty
    })
}

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LibraryStats {
    /// 台詞音檔總數.
    pub clip_count: i64,
    /// 佔用的硬碟空間 of the clips: clips plus files queued for deletion that are still on disk
    ///.
    pub bytes: i64,
    /// 圖片數: the portraits and posters characters use (counted beside clips).
    pub image_count: i64,
    /// Their size on disk; 佔用的硬碟空間 is `bytes` plus this.
    pub image_bytes: i64,
}

/// An open library: its folder and a connection to its database.
pub struct Library {
    root: PathBuf,
    conn: Connection,
}

impl Library {
    /// Open an existing library folder.
    pub fn open(root: &Path) -> Result<Self, LibraryError> {
        check_volume(root)?;
        match classify_dir(root)? {
            DirKind::Library => {}
            DirKind::Missing => return Err(LibraryError::NotFound(root.to_owned())),
            DirKind::Empty | DirKind::Other => {
                return Err(LibraryError::NotALibrary(root.to_owned()))
            }
        }
        Self::open_prepared(root)
    }

    /// Create a new, empty library at `root`, which must be missing or empty.
    pub fn create(root: &Path) -> Result<Self, LibraryError> {
        check_volume(root)?;
        match classify_dir(root)? {
            DirKind::Missing | DirKind::Empty => {}
            DirKind::Library => return Err(LibraryError::AlreadyALibrary(root.to_owned())),
            DirKind::Other => return Err(LibraryError::TargetNotEmpty(root.to_owned())),
        }
        fs::create_dir_all(root).map_err(|e| LibraryError::io(root, e))?;
        Self::open_prepared(root)
    }

    fn open_prepared(root: &Path) -> Result<Self, LibraryError> {
        for dir in [IMAGES_DIR, TMP_DIR] {
            let path = root.join(dir);
            fs::create_dir_all(&path).map_err(|e| LibraryError::io(&path, e))?;
        }
        sweep_tmp(&root.join(TMP_DIR));
        let conn = store::open(&root.join(DB_FILE))?;
        // Finish deletions a crash interrupted. TODO: bound this so a long queue
        // cannot delay the first paint.
        let drained = super::deletion::drain(&conn, root)?;
        if drained.removed > 0 || !drained.failed.is_empty() {
            log::info!(
                "pending deletions: {} removed, {} still queued",
                drained.removed,
                drained.failed.len()
            );
        }
        log::info!("library opened at {}", root.display());
        Ok(Self {
            root: root.to_owned(),
            conn,
        })
    }

    pub fn root(&self) -> &Path {
        &self.root
    }

    pub fn conn(&self) -> &Connection {
        &self.conn
    }

    pub fn conn_mut(&mut self) -> &mut Connection {
        &mut self.conn
    }

    pub fn stats(&self) -> Result<LibraryStats, LibraryError> {
        let (clip_count, bytes) = self
            .conn
            .query_row(
                "SELECT (SELECT COUNT(*) FROM lines),
                        (SELECT COALESCE(SUM(audio_bytes), 0) FROM lines)
                      + (SELECT COALESCE(SUM(bytes), 0) FROM pending_deletions)",
                [],
                |r| Ok((r.get(0)?, r.get(1)?)),
            )
            .map_err(store::StoreError::from)?;
        // Images keep no size in the database: read it off the files the characters name.
        let mut stmt = self
            .conn
            .prepare(
                "SELECT portrait_file FROM characters WHERE portrait_file IS NOT NULL
                 UNION ALL
                 SELECT poster_file FROM characters WHERE poster_file IS NOT NULL",
            )
            .map_err(store::StoreError::from)?;
        let files: Vec<String> = stmt
            .query_map([], |r| r.get(0))
            .map_err(store::StoreError::from)?
            .collect::<Result<_, _>>()
            .map_err(store::StoreError::from)?;
        let images = self.root.join(IMAGES_DIR);
        let sizes: Vec<u64> = files
            .iter()
            .filter_map(|f| fs::metadata(images.join(f)).ok())
            .map(|m| m.len())
            .collect();
        Ok(LibraryStats {
            clip_count,
            bytes,
            image_count: sizes.len() as i64,
            image_bytes: sizes.iter().sum::<u64>() as i64,
        })
    }

    /// 驗證收藏庫: clips in the folder that no row points at — what a crash between
    /// the rename and the commit in `import::commit_cue` leaves behind. Sorted by name.
    pub fn orphan_files(&self) -> Result<Vec<String>, LibraryError> {
        let mut known = std::collections::HashSet::new();
        let mut stmt = self
            .conn
            .prepare("SELECT audio_filename FROM lines")
            .map_err(store::StoreError::from)?;
        for name in stmt
            .query_map([], |r| r.get::<_, String>(0))
            .map_err(store::StoreError::from)?
        {
            known.insert(name.map_err(store::StoreError::from)?);
        }
        let mut orphans: Vec<String> = fs::read_dir(&self.root)
            .map_err(|e| LibraryError::io(&self.root, e))?
            .flatten()
            .filter(|e| e.file_type().is_ok_and(|t| t.is_file()))
            .filter_map(|e| e.file_name().into_string().ok())
            .filter(|name| crate::media::is_clip_name(name) && !known.contains(name))
            .collect();
        orphans.sort();
        Ok(orphans)
    }

    /// 驗證收藏庫: lines whose audio file is no longer in the folder, grouped by
    /// character, newest first within each. One `stat` per clip, run on demand from 檔案管理.
    pub fn missing_files(&self) -> Result<Vec<MissingFile>, LibraryError> {
        let mut stmt = self
            .conn
            .prepare(
                "SELECT l.id, l.character_id, c.name, c.portrait_file, l.text, l.audio_filename
                   FROM lines l JOIN characters c ON c.id = l.character_id
                  ORDER BY c.name, l.character_id, l.created_at DESC",
            )
            .map_err(store::StoreError::from)?;
        let rows = stmt
            .query_map([], |r| {
                Ok((
                    MissingFile {
                        line_id: r.get(0)?,
                        character_id: r.get(1)?,
                        character_name: r.get(2)?,
                        portrait_path: r
                            .get::<_, Option<String>>(3)?
                            .map(|f| self.root.join(IMAGES_DIR).join(f)),
                        text: r.get(4)?,
                    },
                    r.get::<_, String>(5)?,
                ))
            })
            .map_err(store::StoreError::from)?;
        let mut missing = Vec::new();
        for row in rows {
            let (file, audio) = row.map_err(store::StoreError::from)?;
            if !self.root.join(&audio).is_file() {
                missing.push(file);
            }
        }
        if !missing.is_empty() {
            log::warn!(
                "{} clip(s) missing from {}",
                missing.len(),
                self.root.display()
            );
        }
        Ok(missing)
    }

    /// 全部刪除 in 遺失的檔案: deletes every line whose clip is gone, found afresh here rather
    /// than trusted from the renderer. Rows go through `pending_deletions` like any delete
    /// (their files are already missing, so draining just clears the entries). Returns the count.
    pub fn delete_missing_lines(&mut self) -> Result<usize, LibraryError> {
        let ids: Vec<i64> = self.missing_files()?.iter().map(|m| m.line_id).collect();
        let tx = self.conn.transaction().map_err(store::StoreError::from)?;
        let deleted = super::deletion::delete_lines(&tx, &ids)?;
        tx.commit().map_err(store::StoreError::from)?;
        super::deletion::drain(&self.conn, &self.root)?;
        log::info!("deleted {deleted} line(s) whose clips were missing");
        Ok(deleted)
    }

    /// Fold the WAL back into the main file and close, so the folder is self-contained on
    /// disk (no `-wal` content) before it is moved or copied.
    pub fn close(self) -> Result<PathBuf, LibraryError> {
        self.conn
            .pragma_update(None, "wal_checkpoint", "TRUNCATE")
            .map_err(store::StoreError::from)?;
        self.conn
            .close()
            .map_err(|(_, e)| store::StoreError::from(e))?;
        Ok(self.root)
    }
}

pub fn check_volume(root: &Path) -> Result<(), LibraryError> {
    match volume::classify(root) {
        VolumeKind::Local => Ok(()),
        kind => Err(LibraryError::UnsupportedVolume {
            path: root.to_owned(),
            kind,
        }),
    }
}

/// `.tmp/` holds only in-flight writes, so anything left there is crash residue. The sweep
/// is purely file-based and never consults the database.
fn sweep_tmp(tmp: &Path) {
    let Ok(entries) = fs::read_dir(tmp) else {
        return;
    };
    for entry in entries.flatten() {
        let path = entry.path();
        let result = if path.is_dir() {
            fs::remove_dir_all(&path)
        } else {
            fs::remove_file(&path)
        };
        match result {
            Ok(()) => log::info!("swept stale temp file {}", path.display()),
            Err(e) => log::warn!("cannot sweep {}: {e}", path.display()),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn delete_missing_lines_removes_only_lines_without_clips() {
        let dir = tempfile::tempdir().unwrap();
        let root = dir.path().join("lib");
        let mut lib = Library::create(&root).unwrap();
        lib.conn()
            .execute_batch(
                "INSERT INTO characters (id, name, category, source, created_at, updated_at)
                 VALUES (1, 'a', 'anime', 's', 0, 0);
                 INSERT INTO lines (id, character_id, text, audio_filename, audio_bytes, duration_ms, created_at, updated_at)
                 VALUES (1, 1, 'kept', 'AAAAAAAAAAAA.m4a', 1, 1, 0, 0),
                        (2, 1, 'gone', 'BBBBBBBBBBBB.m4a', 1, 1, 0, 0);",
            )
            .unwrap();
        fs::write(root.join("AAAAAAAAAAAA.m4a"), b"m4a").unwrap();

        assert_eq!(lib.delete_missing_lines().unwrap(), 1);
        assert!(lib.missing_files().unwrap().is_empty());
        let left: Vec<String> = lib
            .conn()
            .prepare("SELECT text FROM lines")
            .unwrap()
            .query_map([], |r| r.get(0))
            .unwrap()
            .map(Result::unwrap)
            .collect();
        assert_eq!(left, ["kept"]);
        let pending: i64 = lib
            .conn()
            .query_row("SELECT COUNT(*) FROM pending_deletions", [], |r| r.get(0))
            .unwrap();
        assert_eq!(pending, 0);
    }

    #[test]
    fn deleting_a_clip_on_disk_shows_up_as_a_missing_file() {
        let dir = tempfile::tempdir().unwrap();
        let root = dir.path().join("lib");
        let lib = Library::create(&root).unwrap();
        lib.conn()
            .execute_batch(
                "INSERT INTO characters (id, name, category, source, portrait_file, created_at, updated_at)
                 VALUES (1, '芙莉蓮', 'anime', '葬送的芙莉蓮', 'P.png', 0, 0),
                        (2, '岡部倫太郎', 'anime', '命運石之門', NULL, 0, 0);
                 INSERT INTO lines (id, character_id, text, audio_filename, audio_bytes, duration_ms, created_at, updated_at)
                 VALUES (1, 1, '人類的壽命真的很短暫呢。', 'AAAAAAAAAAAA.m4a', 1, 1, 1, 1),
                        (2, 1, '那就再去一次吧。', 'BBBBBBBBBBBB.m4a', 1, 1, 2, 2),
                        (3, 2, '這一切都是命運石之門的選擇。', 'CCCCCCCCCCCC.m4a', 1, 1, 3, 3);",
            )
            .unwrap();
        for f in ["AAAAAAAAAAAA.m4a", "BBBBBBBBBBBB.m4a", "CCCCCCCCCCCC.m4a"] {
            fs::write(root.join(f), b"m4a").unwrap();
        }
        assert!(lib.missing_files().unwrap().is_empty());

        fs::remove_file(root.join("AAAAAAAAAAAA.m4a")).unwrap();
        fs::remove_file(root.join("CCCCCCCCCCCC.m4a")).unwrap();
        let missing = lib.missing_files().unwrap();
        assert_eq!(
            missing.iter().map(|m| m.line_id).collect::<Vec<_>>(),
            [3, 1],
            "grouped by character name"
        );
        assert_eq!(missing[1].character_name, "芙莉蓮");
        assert_eq!(missing[1].text, "人類的壽命真的很短暫呢。");
        assert_eq!(
            missing[1].portrait_path,
            Some(root.join(IMAGES_DIR).join("P.png"))
        );
        assert_eq!(missing[0].portrait_path, None);
    }

    #[test]
    fn create_lays_out_the_folder_and_open_finds_it() {
        let dir = tempfile::tempdir().unwrap();
        let root = dir.path().join("lib");
        let lib = Library::create(&root).unwrap();
        assert!(root.join(DB_FILE).is_file());
        assert!(root.join(IMAGES_DIR).is_dir());
        assert!(root.join(TMP_DIR).is_dir());
        assert_eq!(lib.stats().unwrap(), LibraryStats::default());
        lib.close().unwrap();

        assert_eq!(classify_dir(&root).unwrap(), DirKind::Library);
        Library::open(&root).unwrap();
    }

    #[test]
    fn open_distinguishes_missing_from_not_a_library() {
        let dir = tempfile::tempdir().unwrap();
        assert!(matches!(
            Library::open(&dir.path().join("gone")),
            Err(LibraryError::NotFound(_))
        ));
        fs::write(dir.path().join("notes.txt"), "x").unwrap();
        assert!(matches!(
            Library::open(dir.path()),
            Err(LibraryError::NotALibrary(_))
        ));
    }

    #[test]
    fn create_refuses_a_folder_with_other_content() {
        let dir = tempfile::tempdir().unwrap();
        fs::write(dir.path().join("notes.txt"), "x").unwrap();
        assert!(matches!(
            Library::create(dir.path()),
            Err(LibraryError::TargetNotEmpty(_))
        ));
    }

    #[test]
    fn os_clutter_does_not_count_as_content() {
        let dir = tempfile::tempdir().unwrap();
        fs::write(dir.path().join(".DS_Store"), "x").unwrap();
        assert_eq!(classify_dir(dir.path()).unwrap(), DirKind::Empty);
    }

    #[test]
    fn open_sweeps_stale_temp_files() {
        let dir = tempfile::tempdir().unwrap();
        Library::create(dir.path()).unwrap().close().unwrap();
        let stale = dir.path().join(TMP_DIR).join("ABCDEFGHIJKL.m4a.tmp");
        fs::write(&stale, "partial").unwrap();
        Library::open(dir.path()).unwrap();
        assert!(!stale.exists());
    }

    #[test]
    fn stats_count_clips_and_pending_deletions() {
        let dir = tempfile::tempdir().unwrap();
        let lib = Library::create(dir.path()).unwrap();
        lib.conn()
            .execute_batch(
                "INSERT INTO characters (name, category, source, created_at, updated_at)
                     VALUES ('a', 'tv', 'b', 0, 0);
                 INSERT INTO lines (character_id, text, audio_filename, audio_bytes, duration_ms, created_at, updated_at)
                     VALUES (1, 'x', 'AAAAAAAAAAAA.m4a', 1000, 1, 0, 0),
                            (1, 'y', 'BBBBBBBBBBBB.m4a', 2000, 1, 0, 0);
                 INSERT INTO pending_deletions (relative_path, bytes, queued_at)
                     VALUES ('CCCCCCCCCCCC.m4a', 500, 0);",
            )
            .unwrap();
        assert_eq!(
            lib.stats().unwrap(),
            LibraryStats {
                clip_count: 2,
                bytes: 3500,
                image_count: 0,
                image_bytes: 0,
            }
        );
    }

    #[test]
    fn stats_count_the_images_characters_use() {
        let dir = tempfile::tempdir().unwrap();
        let lib = Library::create(dir.path()).unwrap();
        let images = dir.path().join(IMAGES_DIR);
        fs::write(images.join("P1.png"), vec![0u8; 300]).unwrap();
        fs::write(images.join("B1.jpg"), vec![0u8; 700]).unwrap();
        fs::write(images.join("P2.png"), vec![0u8; 50]).unwrap();
        // Left behind, used by no character: not counted.
        fs::write(images.join("OLD.png"), vec![0u8; 9999]).unwrap();
        lib.conn()
            .execute_batch(
                "INSERT INTO characters (name, category, source, portrait_file, poster_file, created_at, updated_at)
                     VALUES ('a', 'tv', 'b', 'P1.png', 'B1.jpg', 0, 0),
                            ('c', 'tv', 'd', 'P2.png', NULL, 0, 0),
                            ('e', 'tv', 'f', 'GONE.png', NULL, 0, 0);",
            )
            .unwrap();
        let stats = lib.stats().unwrap();
        assert_eq!(
            (stats.image_count, stats.image_bytes),
            (3, 1050),
            "a missing file counts for nothing"
        );
    }
}

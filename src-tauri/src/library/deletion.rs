//! Durable deletion: the user asked that deleted audio really be deleted.
//!
//! Deleting rows queues their files in `pending_deletions` **in the same transaction**; the
//! unlink happens after commit, and anything still queued is retried on every library open.
//! A crash between commit and unlink therefore only delays the removal, and a file that cannot
//! be removed stays on the list with its error instead of being forgotten.

use std::fs;
use std::path::{Component, Path};

use rusqlite::{params, Connection, Transaction};

use crate::store::{self, StoreError};

/// Deletes `lines` rows by id and queues their clips. Runs inside the caller's transaction so
/// the rows and the obligation to delete their files commit together.
pub fn delete_lines(tx: &Transaction<'_>, ids: &[i64]) -> Result<usize, StoreError> {
    let now = store::now_ms();
    let mut queued = 0;
    for &id in ids {
        let row: Option<(String, i64)> = tx
            .query_row(
                "SELECT audio_filename, audio_bytes FROM lines WHERE id = ?1",
                [id],
                |r| Ok((r.get(0)?, r.get(1)?)),
            )
            .map(Some)
            .or_else(|e| match e {
                rusqlite::Error::QueryReturnedNoRows => Ok(None),
                e => Err(e),
            })?;
        let Some((file, bytes)) = row else { continue };
        tx.execute("DELETE FROM lines WHERE id = ?1", [id])?;
        tx.execute(
            "INSERT INTO pending_deletions (relative_path, bytes, queued_at) VALUES (?1, ?2, ?3)
             ON CONFLICT (relative_path) DO NOTHING",
            params![file, bytes, now],
        )?;
        queued += 1;
    }
    Ok(queued)
}

/// What one pass over `pending_deletions` did.
#[derive(Debug, Default, PartialEq, Eq)]
pub struct Drained {
    pub removed: usize,
    /// Still queued: `(relative_path, error)`.
    pub failed: Vec<(String, String)>,
}

/// Unlinks queued files and clears their entries. A file that is already gone counts as
/// removed. Failures stay queued with their attempt count and error.
pub fn drain(conn: &Connection, root: &Path) -> Result<Drained, StoreError> {
    let queued: Vec<String> = {
        let mut stmt =
            conn.prepare("SELECT relative_path FROM pending_deletions ORDER BY queued_at")?;
        let rows = stmt.query_map([], |r| r.get(0))?;
        rows.collect::<Result<_, _>>()?
    };
    let mut drained = Drained::default();
    for relative in queued {
        let outcome = if is_inside(&relative) {
            match fs::remove_file(root.join(&relative)) {
                Ok(()) => Ok(()),
                Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(()),
                Err(e) => Err(e.to_string()),
            }
        } else {
            Err("path escapes the library folder".to_owned())
        };
        match outcome {
            Ok(()) => {
                conn.execute(
                    "DELETE FROM pending_deletions WHERE relative_path = ?1",
                    [&relative],
                )?;
                drained.removed += 1;
            }
            Err(error) => {
                conn.execute(
                    "UPDATE pending_deletions SET attempts = attempts + 1, last_error = ?2
                     WHERE relative_path = ?1",
                    params![relative, truncate(&error, 2000)],
                )?;
                log::warn!("could not delete {relative}: {error}");
                drained.failed.push((relative, error));
            }
        }
    }
    Ok(drained)
}

/// Only plain relative paths below the library folder are ever unlinked.
fn is_inside(relative: &str) -> bool {
    let path = Path::new(relative);
    !relative.is_empty() && path.components().all(|c| matches!(c, Component::Normal(_)))
}

fn truncate(s: &str, max_chars: usize) -> String {
    s.chars().take(max_chars).collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::library::folder::Library;

    fn library_with_lines(dir: &Path, n: usize) -> (Library, Vec<i64>) {
        let lib = Library::create(&dir.join("lib")).unwrap();
        lib.conn()
            .execute(
                "INSERT INTO characters (id, name, category, source, created_at, updated_at)
                 VALUES (1, 'a', 'anime', 's', 0, 0)",
                [],
            )
            .unwrap();
        let mut ids = Vec::new();
        for i in 0..n {
            let name = format!("{i:0>12}.m4a");
            fs::write(lib.root().join(&name), b"clip").unwrap();
            lib.conn()
                .execute(
                    "INSERT INTO lines (character_id, text, audio_filename, audio_bytes, duration_ms, created_at, updated_at)
                     VALUES (1, 'x', ?1, 4, 1, 0, 0)",
                    [&name],
                )
                .unwrap();
            ids.push(lib.conn().last_insert_rowid());
        }
        (lib, ids)
    }

    #[test]
    fn deleted_rows_take_their_files_with_them() {
        let dir = tempfile::tempdir().unwrap();
        let (mut lib, ids) = library_with_lines(dir.path(), 3);
        let root = lib.root().to_owned();
        let tx = lib.conn_mut().transaction().unwrap();
        assert_eq!(delete_lines(&tx, &ids[..2]).unwrap(), 2);
        tx.commit().unwrap();

        let drained = drain(lib.conn(), &root).unwrap();
        assert_eq!(
            drained,
            Drained {
                removed: 2,
                failed: vec![]
            }
        );
        assert!(!root.join("000000000000.m4a").exists());
        assert!(root.join("000000000002.m4a").exists());
        let pending: i64 = lib
            .conn()
            .query_row("SELECT COUNT(*) FROM pending_deletions", [], |r| r.get(0))
            .unwrap();
        assert_eq!(pending, 0);
    }

    #[test]
    fn a_crash_after_commit_is_finished_by_the_next_open() {
        let dir = tempfile::tempdir().unwrap();
        let (mut lib, ids) = library_with_lines(dir.path(), 1);
        let root = lib.root().to_owned();
        let tx = lib.conn_mut().transaction().unwrap();
        delete_lines(&tx, &ids).unwrap();
        tx.commit().unwrap();
        lib.close().unwrap(); // "crash": the unlink never ran

        assert!(root.join("000000000000.m4a").exists());
        let _reopened = Library::open(&root).unwrap();
        assert!(!root.join("000000000000.m4a").exists());
    }

    #[test]
    fn a_file_that_cannot_be_removed_stays_queued_with_its_error() {
        let dir = tempfile::tempdir().unwrap();
        let (mut lib, ids) = library_with_lines(dir.path(), 1);
        let root = lib.root().to_owned();
        // A directory where the clip should be: remove_file fails on it on every platform.
        fs::remove_file(root.join("000000000000.m4a")).unwrap();
        fs::create_dir(root.join("000000000000.m4a")).unwrap();
        let tx = lib.conn_mut().transaction().unwrap();
        delete_lines(&tx, &ids).unwrap();
        tx.commit().unwrap();

        let drained = drain(lib.conn(), &root).unwrap();
        assert_eq!(drained.removed, 0);
        assert_eq!(drained.failed.len(), 1);
        let (attempts, error): (i64, Option<String>) = lib
            .conn()
            .query_row(
                "SELECT attempts, last_error FROM pending_deletions",
                [],
                |r| Ok((r.get(0)?, r.get(1)?)),
            )
            .unwrap();
        assert_eq!(attempts, 1);
        assert!(error.is_some());
    }

    #[test]
    fn paths_outside_the_library_are_never_unlinked() {
        assert!(is_inside("ABCDEFGHIJKL.m4a"));
        assert!(is_inside("images/p.png"));
        assert!(!is_inside("../evil"));
        assert!(!is_inside("/etc/passwd"));
        assert!(!is_inside(""));
    }
}

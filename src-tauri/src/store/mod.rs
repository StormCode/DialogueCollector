//! SQLite access for `<library>/library.sqlite`.
//!
//! Rules that hold for every connection:
//! - `PRAGMA foreign_keys = ON` (ET1 requires a test that fails if it is off)
//! - WAL journal mode (FC8); libraries on network / cloud-sync volumes are refused before
//!   the database is opened (ENG5 → `library`)
//! - all writes go through one single-writer task (T5), so concurrent encodes never
//!   surface `SQLITE_BUSY`
//!
//! TODO(T4/ET1): schema v1 against the six-table checklist in PLAN.md (`schema_version`,
//! `characters`, `lines`, `import_runs`, `import_failures`, `pending_deletions`), the
//! migration runner (additive-only, one transaction per migration), and the
//! `gstack-shortcut` marker naming the 7/10 ceiling and its before-first-release trigger.

use std::path::Path;

use rusqlite::Connection;

/// The schema version this build writes. Opening a newer library is refused by name.
pub const SCHEMA_VERSION: u32 = 1;

#[derive(Debug, thiserror::Error)]
pub enum StoreError {
    #[error(transparent)]
    Sqlite(#[from] rusqlite::Error),

    #[error("library schema v{found} is newer than this app supports (v{supported})")]
    SchemaTooNew { found: u32, supported: u32 },
}

/// Open a connection with the per-connection pragmas applied.
pub fn open(path: &Path) -> Result<Connection, StoreError> {
    let conn = Connection::open(path)?;
    configure(&conn)?;
    Ok(conn)
}

fn configure(conn: &Connection) -> Result<(), StoreError> {
    conn.pragma_update(None, "foreign_keys", "ON")?;
    conn.pragma_update(None, "journal_mode", "WAL")?;
    conn.pragma_update(None, "synchronous", "NORMAL")?;
    conn.busy_timeout(std::time::Duration::from_secs(5))?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn every_connection_enforces_foreign_keys_and_wal() {
        let dir = tempfile::tempdir().unwrap();
        let conn = open(&dir.path().join("library.sqlite")).unwrap();
        let fk: i64 = conn
            .pragma_query_value(None, "foreign_keys", |r| r.get(0))
            .unwrap();
        let mode: String = conn
            .pragma_query_value(None, "journal_mode", |r| r.get(0))
            .unwrap();
        assert_eq!(fk, 1);
        assert_eq!(mode, "wal");
    }
}

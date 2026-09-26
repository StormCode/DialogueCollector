//! SQLite access for `<library>/library.sqlite`.
//!
//! Rules that hold for every connection:
//! - `PRAGMA foreign_keys = ON` (ET1: a test fails if it is off)
//! - WAL journal mode (FC8); libraries on network / cloud-sync volumes are refused before
//!   the database is opened (ENG5 → `library`)
//!
//! Schema evolution (Section 9): the version lives in a one-row `schema_version` table that is
//! read before anything else. Migrations are additive-only (add tables and columns, never
//! rename or drop), each runs in its own transaction, and a library written by a newer app is
//! refused by name instead of being opened.
//!
//! TODO(T5/FC8): funnel all writes through one single-writer task once concurrent encoding
//! lands in `import`, so parallel cues never surface `SQLITE_BUSY`.

use std::path::Path;
use std::time::{SystemTime, UNIX_EPOCH};

use rusqlite::{Connection, OptionalExtension, TransactionBehavior};

/// One schema step. `sql` runs inside a transaction together with the version bump.
pub struct Migration {
    pub version: u32,
    pub sql: &'static str,
}

/// Ordered, consecutive from 1. Append only; never edit a shipped entry.
pub const MIGRATIONS: &[Migration] = &[Migration {
    version: 1,
    sql: include_str!("migrations/0001_initial.sql"),
}];

/// The schema version this build writes. Opening a newer library is refused by name.
pub const SCHEMA_VERSION: u32 = 1;

#[derive(Debug, thiserror::Error)]
pub enum StoreError {
    #[error(transparent)]
    Sqlite(#[from] rusqlite::Error),

    #[error("library schema v{found} is newer than this app supports (v{supported})")]
    SchemaTooNew { found: u32, supported: u32 },

    #[error("migration to v{version} failed: {source}")]
    Migration {
        version: u32,
        #[source]
        source: rusqlite::Error,
    },
}

/// Open (creating if needed) a library database, apply pragmas, and migrate it to
/// `SCHEMA_VERSION`. Refuses a database written by a newer app.
pub fn open(path: &Path) -> Result<Connection, StoreError> {
    let mut conn = Connection::open(path)?;
    configure(&conn)?;
    migrate(&mut conn, MIGRATIONS)?;
    Ok(conn)
}

fn configure(conn: &Connection) -> Result<(), StoreError> {
    conn.pragma_update(None, "foreign_keys", "ON")?;
    conn.pragma_update(None, "journal_mode", "WAL")?;
    // With WAL, NORMAL keeps every commit durable across an app crash; a power loss can roll
    // back the latest commits, which leaves at worst an orphan file — never a dangling row,
    // because files are fsynced and renamed before their row is inserted (ENG2).
    conn.pragma_update(None, "synchronous", "NORMAL")?;
    conn.busy_timeout(std::time::Duration::from_secs(5))?;
    Ok(())
}

/// The version recorded in the database, or `None` for a database that predates versioning
/// (i.e. a brand-new, empty file).
pub fn schema_version(conn: &Connection) -> Result<Option<u32>, StoreError> {
    let has_table: bool = conn.query_row(
        "SELECT EXISTS (SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'schema_version')",
        [],
        |r| r.get(0),
    )?;
    if !has_table {
        return Ok(None);
    }
    Ok(conn
        .query_row("SELECT version FROM schema_version WHERE id = 1", [], |r| {
            r.get(0)
        })
        .optional()?)
}

/// Bring the database up to the last entry of `migrations`. Idempotent.
pub fn migrate(conn: &mut Connection, migrations: &[Migration]) -> Result<u32, StoreError> {
    let supported = migrations.last().map_or(0, |m| m.version);

    // Check before writing anything, so a newer library is refused without being touched.
    if let Some(found) = schema_version(conn)? {
        if found > supported {
            return Err(StoreError::SchemaTooNew { found, supported });
        }
    }

    for migration in migrations {
        // IMMEDIATE takes the write lock up front, and the version is re-read under it, so two
        // processes opening the same library cannot both apply the same step.
        let tx = conn.transaction_with_behavior(TransactionBehavior::Immediate)?;
        tx.execute_batch(
            "CREATE TABLE IF NOT EXISTS schema_version (
                 id         INTEGER PRIMARY KEY CHECK (id = 1),
                 version    INTEGER NOT NULL CHECK (version >= 0),
                 updated_at INTEGER NOT NULL
             );",
        )?;
        let current: u32 = tx
            .query_row("SELECT version FROM schema_version WHERE id = 1", [], |r| {
                r.get(0)
            })
            .optional()?
            .unwrap_or(0);
        if current > supported {
            return Err(StoreError::SchemaTooNew {
                found: current,
                supported,
            });
        }
        if migration.version <= current {
            continue;
        }

        tx.execute_batch(migration.sql)
            .map_err(|source| StoreError::Migration {
                version: migration.version,
                source,
            })?;
        tx.execute(
            "INSERT INTO schema_version (id, version, updated_at) VALUES (1, ?1, ?2)
             ON CONFLICT (id) DO UPDATE SET version = excluded.version, updated_at = excluded.updated_at",
            (migration.version, now_ms()),
        )?;
        tx.commit()?;
        log::info!("library schema migrated to v{}", migration.version);
    }

    Ok(schema_version(conn)?.unwrap_or(0))
}

pub fn now_ms() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_or(0, |d| d.as_millis() as i64)
}

#[cfg(test)]
mod tests;

use std::time::{Duration, Instant};

use rusqlite::{params, Connection};

use super::*;

fn fresh() -> (tempfile::TempDir, Connection) {
    let dir = tempfile::tempdir().unwrap();
    let conn = open(&dir.path().join("library.sqlite")).unwrap();
    (dir, conn)
}

fn insert_character(conn: &Connection) -> i64 {
    conn.execute(
        "INSERT INTO characters (name, category, source, cv, created_at, updated_at)
         VALUES ('芙莉蓮', 'anime', '葬送的芙莉蓮', '種崎敦美', 0, 0)",
        [],
    )
    .unwrap();
    conn.last_insert_rowid()
}

fn insert_line(conn: &Connection, character_id: i64, audio: &str) -> rusqlite::Result<usize> {
    conn.execute(
        "INSERT INTO lines (character_id, text, audio_filename, audio_bytes, duration_ms, created_at, updated_at)
         VALUES (?1, '今天的風好舒服呢。', ?2, 34805, 2000, 0, 0)",
        params![character_id, audio],
    )
}

fn is_constraint_violation(result: rusqlite::Result<usize>) -> bool {
    matches!(
        result,
        Err(rusqlite::Error::SqliteFailure(e, _)) if e.code == rusqlite::ErrorCode::ConstraintViolation
    )
}

// ---------- connection rules ----------

#[test]
fn every_connection_enforces_foreign_keys_and_wal() {
    let (_dir, conn) = fresh();
    let fk: i64 = conn
        .pragma_query_value(None, "foreign_keys", |r| r.get(0))
        .unwrap();
    let mode: String = conn
        .pragma_query_value(None, "journal_mode", |r| r.get(0))
        .unwrap();
    assert_eq!(fk, 1);
    assert_eq!(mode, "wal");
}

// ---------- versioning and migrations (T4) ----------

#[test]
fn migrations_are_consecutive_and_end_at_schema_version() {
    for (i, m) in MIGRATIONS.iter().enumerate() {
        assert_eq!(m.version, i as u32 + 1);
    }
    assert_eq!(MIGRATIONS.last().unwrap().version, SCHEMA_VERSION);
}

#[test]
fn fresh_library_is_at_schema_version_with_all_tables() {
    let (_dir, conn) = fresh();
    assert_eq!(schema_version(&conn).unwrap(), Some(SCHEMA_VERSION));
    for table in [
        "schema_version",
        "characters",
        "lines",
        "import_runs",
        "import_failures",
        "pending_deletions",
    ] {
        let exists: bool = conn
            .query_row(
                "SELECT EXISTS (SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?1)",
                [table],
                |r| r.get(0),
            )
            .unwrap();
        assert!(exists, "missing table {table}");
    }
}

#[test]
fn reopening_is_idempotent_and_keeps_data() {
    let dir = tempfile::tempdir().unwrap();
    let path = dir.path().join("library.sqlite");
    {
        let conn = open(&path).unwrap();
        insert_character(&conn);
    }
    let conn = open(&path).unwrap();
    assert_eq!(schema_version(&conn).unwrap(), Some(SCHEMA_VERSION));
    let n: i64 = conn
        .query_row("SELECT COUNT(*) FROM characters", [], |r| r.get(0))
        .unwrap();
    assert_eq!(n, 1);
}

#[test]
fn newer_schema_is_refused_naming_both_versions() {
    let dir = tempfile::tempdir().unwrap();
    let path = dir.path().join("library.sqlite");
    {
        let conn = open(&path).unwrap();
        conn.execute(
            "UPDATE schema_version SET version = ?1",
            [SCHEMA_VERSION + 1],
        )
        .unwrap();
    }
    let err = open(&path).unwrap_err();
    assert!(matches!(
        err,
        StoreError::SchemaTooNew { found, supported }
            if found == SCHEMA_VERSION + 1 && supported == SCHEMA_VERSION
    ));
    let message = err.to_string();
    assert!(message.contains(&format!("v{}", SCHEMA_VERSION + 1)));
    assert!(message.contains(&format!("v{SCHEMA_VERSION}")));

    // Refusal must not have touched the file.
    let conn = Connection::open(&path).unwrap();
    assert_eq!(schema_version(&conn).unwrap(), Some(SCHEMA_VERSION + 1));
}

const V2: Migration = Migration {
    version: 2,
    sql: "ALTER TABLE lines ADD COLUMN note TEXT;",
};

fn v1_then(next: Migration) -> [Migration; 2] {
    [
        Migration {
            version: 1,
            sql: MIGRATIONS[0].sql,
        },
        next,
    ]
}

#[test]
fn v1_to_v2_migration_applies_once_and_is_idempotent() {
    let (_dir, mut conn) = fresh();
    let steps = v1_then(V2);
    assert_eq!(migrate(&mut conn, &steps).unwrap(), 2);
    assert_eq!(migrate(&mut conn, &steps).unwrap(), 2);

    let note_columns: i64 = conn
        .query_row(
            "SELECT COUNT(*) FROM pragma_table_info('lines') WHERE name = 'note'",
            [],
            |r| r.get(0),
        )
        .unwrap();
    assert_eq!(note_columns, 1);
}

#[test]
fn failed_migration_rolls_back_entirely() {
    let (_dir, mut conn) = fresh();
    let broken = Migration {
        version: 2,
        // The first statement succeeds, the second fails: neither may survive.
        sql: "ALTER TABLE lines ADD COLUMN note TEXT; ALTER TABLE no_such_table ADD COLUMN x;",
    };
    let err = migrate(&mut conn, &v1_then(broken)).unwrap_err();
    assert!(matches!(err, StoreError::Migration { version: 2, .. }));
    assert_eq!(schema_version(&conn).unwrap(), Some(1));
    let note_columns: i64 = conn
        .query_row(
            "SELECT COUNT(*) FROM pragma_table_info('lines') WHERE name = 'note'",
            [],
            |r| r.get(0),
        )
        .unwrap();
    assert_eq!(note_columns, 0);
}

// ---------- foreign keys (ENG3) ----------

#[test]
fn line_must_reference_an_existing_character() {
    let (_dir, conn) = fresh();
    assert!(is_constraint_violation(insert_line(
        &conn,
        999,
        "ABCDEFGHIJKL.m4a"
    )));
}

#[test]
fn deleting_a_character_with_lines_is_restricted() {
    let (_dir, conn) = fresh();
    let id = insert_character(&conn);
    insert_line(&conn, id, "ABCDEFGHIJKL.m4a").unwrap();
    assert!(is_constraint_violation(
        conn.execute("DELETE FROM characters WHERE id = ?1", [id])
    ));
}

#[test]
fn deleting_a_character_with_pending_retries_is_restricted() {
    let (_dir, conn) = fresh();
    let id = insert_character(&conn);
    conn.execute(
        "INSERT INTO import_runs (kind, status, started_at) VALUES ('subtitle', 'partial', 0)",
        [],
    )
    .unwrap();
    let run = conn.last_insert_rowid();
    conn.execute(
        "INSERT INTO import_failures (run_id, cue_index, cue_text, start_ms, end_ms, character_id, status, reason_code, created_at)
         VALUES (?1, 7, 'もう一度、あの場所で会おう。', 192480, 195020, ?2, 'failed', 'cue_out_of_range', 0)",
        params![run, id],
    )
    .unwrap();
    assert!(is_constraint_violation(
        conn.execute("DELETE FROM characters WHERE id = ?1", [id])
    ));

    // Deleting the run takes its failures with it.
    conn.execute("DELETE FROM import_runs WHERE id = ?1", [run])
        .unwrap();
    let left: i64 = conn
        .query_row("SELECT COUNT(*) FROM import_failures", [], |r| r.get(0))
        .unwrap();
    assert_eq!(left, 0);
}

// ---------- CHECK constraints (S3) ----------

#[test]
fn audio_filename_is_unique() {
    let (_dir, conn) = fresh();
    let id = insert_character(&conn);
    insert_line(&conn, id, "ABCDEFGHIJKL.m4a").unwrap();
    assert!(is_constraint_violation(insert_line(
        &conn,
        id,
        "ABCDEFGHIJKL.m4a"
    )));
}

#[test]
fn audio_filename_must_be_twelve_uppercase_alphanumerics_dot_m4a() {
    let (_dir, conn) = fresh();
    let id = insert_character(&conn);
    for bad in [
        "abcdefghijkl.m4a",
        "ABCDEFGHIJK.m4a",
        "ABCDEFGHIJKLM.m4a",
        "ABCDEFGHIJKL.mp3",
        "ABCDEF/HIJKL.m4a",
        "../ABCDEFGHI.m4a",
    ] {
        assert!(
            is_constraint_violation(insert_line(&conn, id, bad)),
            "{bad} was accepted"
        );
    }
    insert_line(&conn, id, "A1B2C3D4E5F6.m4a").unwrap();
}

#[test]
fn character_checks_reject_bad_input() {
    let (_dir, conn) = fresh();
    let long = "字".repeat(101);
    let cases: [(&str, &str, &str, Option<&str>); 5] = [
        ("", "anime", "作品", None),
        ("   ", "anime", "作品", None),
        (&long, "anime", "作品", None),
        ("名字", "drama", "作品", None),
        ("名字", "anime", "", None),
    ];
    for (name, category, source, cv) in cases {
        let result = conn.execute(
            "INSERT INTO characters (name, category, source, cv, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, 0, 0)",
            params![name, category, source, cv],
        );
        assert!(
            is_constraint_violation(result),
            "accepted name={name:?} category={category} source={source:?}"
        );
    }
    // 100 CJK characters is exactly the limit and must pass.
    conn.execute(
        "INSERT INTO characters (name, category, source, created_at, updated_at)
         VALUES (?1, 'tv', '封神榜', 0, 0)",
        [&"字".repeat(100)],
    )
    .unwrap();
}

#[test]
fn line_checks_reject_bad_input() {
    let (_dir, conn) = fresh();
    let id = insert_character(&conn);
    let insert = |text: &str, color: Option<&str>, bytes: i64, duration: i64| {
        conn.execute(
            "INSERT INTO lines (character_id, text, text_color, audio_filename, audio_bytes, duration_ms, created_at, updated_at)
             VALUES (?1, ?2, ?3, 'ZZZZZZZZZZZZ.m4a', ?4, ?5, 0, 0)",
            params![id, text, color, bytes, duration],
        )
    };
    let long = "台".repeat(1001);
    assert!(is_constraint_violation(insert("", None, 1, 1)));
    assert!(is_constraint_violation(insert(&long, None, 1, 1)));
    assert!(is_constraint_violation(insert("ok", Some("red"), 1, 1)));
    assert!(is_constraint_violation(insert("ok", Some("#12345"), 1, 1)));
    assert!(is_constraint_violation(insert("ok", Some("#GGGGGG"), 1, 1)));
    assert!(is_constraint_violation(insert("ok", None, -1, 1)));
    assert!(is_constraint_violation(insert("ok", None, 1, 0)));
    insert("ok", Some("#3c6fD6"), 1, 1).unwrap();
}

#[test]
fn enumerations_are_closed() {
    let (_dir, conn) = fresh();
    assert!(is_constraint_violation(conn.execute(
        "INSERT INTO import_runs (kind, status, started_at) VALUES ('batch', 'running', 0)",
        [],
    )));
    assert!(is_constraint_violation(conn.execute(
        "INSERT INTO import_runs (kind, status, started_at) VALUES ('subtitle', 'done', 0)",
        [],
    )));
}

// ---------- indexes and search (T5) ----------

#[test]
fn required_indexes_exist() {
    let (_dir, conn) = fresh();
    let index_on = |table: &str, leading: &str| -> bool {
        let mut stmt = conn
            .prepare("SELECT name FROM pragma_index_list(?1)")
            .unwrap();
        let names: Vec<String> = stmt
            .query_map([table], |r| r.get(0))
            .unwrap()
            .map(Result::unwrap)
            .collect();
        names.iter().any(|index| {
            conn.query_row(
                "SELECT name FROM pragma_index_info(?1) WHERE seqno = 0",
                [index],
                |r| r.get::<_, String>(0),
            )
            .map(|col| col == leading)
            .unwrap_or(false)
        })
    };
    assert!(index_on("lines", "character_id"));
    assert!(index_on("lines", "audio_filename"));
    assert!(index_on("characters", "category"));
    assert!(index_on("characters", "name"));
    assert!(index_on("characters", "source"));
}

/// FC1: `LIKE '%…%'` over 30,000 lines is the chosen search; FTS5 was withdrawn. Budget: one
/// page query (count + 10 rows) under 50 ms in a debug build, well inside a 150 ms debounce.
#[test]
fn like_search_over_30k_lines_is_within_budget() {
    let (_dir, conn) = fresh();
    let id = insert_character(&conn);
    let phrases = [
        "今天的風好舒服呢。",
        "等一下，我還沒說完！",
        "不管發生什麼事，我都會站在你這邊。",
        "もう一度、あの場所で会おう。",
        "El Psy Congroo.",
    ];
    conn.execute_batch("BEGIN").unwrap();
    {
        let mut stmt = conn
            .prepare(
                "INSERT INTO lines (character_id, text, audio_filename, audio_bytes, duration_ms, created_at, updated_at)
                 VALUES (?1, ?2, ?3, 30000, 2000, ?4, ?4)",
            )
            .unwrap();
        for i in 0..30_000i64 {
            let text = format!("{} #{i}", phrases[i as usize % phrases.len()]);
            let audio = format!("{:012}.m4a", i);
            stmt.execute(params![id, text, audio, i]).unwrap();
        }
    }
    conn.execute_batch("COMMIT").unwrap();

    let started = Instant::now();
    let total: i64 = conn
        .query_row(
            "SELECT COUNT(*) FROM lines WHERE character_id = ?1 AND text LIKE ?2",
            params![id, "%站在你%"],
            |r| r.get(0),
        )
        .unwrap();
    let mut stmt = conn
        .prepare(
            "SELECT id FROM lines WHERE character_id = ?1 AND text LIKE ?2
             ORDER BY created_at DESC LIMIT 10 OFFSET 0",
        )
        .unwrap();
    let page: Vec<i64> = stmt
        .query_map(params![id, "%站在你%"], |r| r.get(0))
        .unwrap()
        .map(Result::unwrap)
        .collect();
    let elapsed = started.elapsed();
    eprintln!("30k-line LIKE page query: {elapsed:?}");

    assert_eq!(total, 6_000);
    assert_eq!(page.len(), 10);
    assert!(
        elapsed < Duration::from_millis(50),
        "search took {elapsed:?}"
    );
}

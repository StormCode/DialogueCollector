-- Schema v1 for <library>/library.sqlite.
--
-- gstack-shortcut: completeness 7/10, accepted in the eng review (ENG1, D6 → B): PLAN.md
-- carries only a required-tables checklist and this DDL was written at implementation time
-- rather than reviewed there. Upgrade trigger: before the first public release — migrations
-- are additive-only (Section 9), so whatever ships here is permanent.
--
-- Conventions:
-- - Timestamps are INTEGER Unix milliseconds (UTC).
-- - Paths inside the library are stored relative to the library folder, never absolute (D8).
-- - Every TEXT column that holds user input has a length bound (Section 3, S3). length() on
--   TEXT counts characters, so CJK text is bounded by characters, not bytes.
-- - Enumerations are stable codes; the renderer owns the localized labels.

CREATE TABLE characters (
    id              INTEGER PRIMARY KEY,
    name            TEXT    NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 100),
    -- 動畫 / 電影 / 電視劇 on the boards.
    category        TEXT    NOT NULL CHECK (category IN ('anime', 'movie', 'tv')),
    -- 動畫／戲劇名稱: required on the AddCharacter / EditCharacter boards, and a filter on 台詞本.
    source          TEXT    NOT NULL CHECK (length(trim(source)) BETWEEN 1 AND 200),
    -- CV／飾演 (optional).
    cv              TEXT             CHECK (cv IS NULL OR length(cv) <= 100),
    -- File names under <library>/images/ (R1).
    portrait_file   TEXT             CHECK (portrait_file IS NULL OR length(portrait_file) <= 64),
    poster_file     TEXT             CHECK (poster_file IS NULL OR length(poster_file) <= 64),
    created_at      INTEGER NOT NULL,
    updated_at      INTEGER NOT NULL
);

CREATE INDEX idx_characters_name     ON characters (name);
CREATE INDEX idx_characters_category ON characters (category);
CREATE INDEX idx_characters_source   ON characters (source);

CREATE TABLE lines (
    id              INTEGER PRIMARY KEY,
    -- RESTRICT is the database-level guard; deleting a character is done by application code
    -- that removes its lines first and records their files in pending_deletions (ENG3).
    character_id    INTEGER NOT NULL REFERENCES characters (id) ON DELETE RESTRICT,
    -- 原文 and 譯文.
    text            TEXT    NOT NULL CHECK (length(trim(text)) BETWEEN 1 AND 1000),
    translation     TEXT             CHECK (translation IS NULL OR length(translation) <= 1000),
    -- 樣式: per-line font colour as #RRGGBB; NULL means the theme default.
    text_color      TEXT             CHECK (text_color IS NULL OR text_color GLOB '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'),
    -- 12 random A-Z0-9 characters + .m4a, relative to the library folder.
    audio_filename  TEXT    NOT NULL UNIQUE
                            CHECK (length(audio_filename) = 16
                                   AND substr(audio_filename, 13) = '.m4a'
                                   AND substr(audio_filename, 1, 12) NOT GLOB '*[^A-Z0-9]*'),
    -- Stored at insert so 檔案管理 can sum disk usage in SQL instead of walking the folder.
    audio_bytes     INTEGER NOT NULL CHECK (audio_bytes >= 0),
    duration_ms     INTEGER NOT NULL CHECK (duration_ms > 0),
    -- 已釘選: NULL when not pinned; the pin time orders the pinned group.
    pinned_at       INTEGER,
    created_at      INTEGER NOT NULL,
    updated_at      INTEGER NOT NULL
);

-- Leading character_id serves the 台詞頁 query (T5) and both sort orders on the board.
CREATE INDEX idx_lines_character_created  ON lines (character_id, created_at);
CREATE INDEX idx_lines_character_duration ON lines (character_id, duration_ms);

-- One row per import (subtitle path or manual path). Holds source PATHS, not contents (R5),
-- so a 部分完成 run survives closing the window and can be retried from source (D11, ENG4).
CREATE TABLE import_runs (
    id              INTEGER PRIMARY KEY,
    kind            TEXT    NOT NULL CHECK (kind IN ('subtitle', 'manual')),
    subtitle_path   TEXT             CHECK (subtitle_path IS NULL OR length(subtitle_path) <= 4096),
    video_path      TEXT             CHECK (video_path IS NULL OR length(video_path) <= 4096),
    -- Size and mtime at run time. Retry compares them only to warn (ENG4): the fresh subtitle
    -- re-read is authoritative, so a change is reported, not refused.
    subtitle_bytes  INTEGER,
    subtitle_mtime  INTEGER,
    video_bytes     INTEGER,
    video_mtime     INTEGER,
    status          TEXT    NOT NULL CHECK (status IN ('running', 'complete', 'partial', 'failed', 'cancelled')),
    imported_count  INTEGER NOT NULL DEFAULT 0 CHECK (imported_count >= 0),
    started_at      INTEGER NOT NULL,
    finished_at     INTEGER
);

-- Cues that did not become lines. Retry looks them up by cue_text, breaking ties by the
-- nearest start_ms (ENG4). Named cue_*, not line_*: no line row exists for them (ENG10).
CREATE TABLE import_failures (
    id              INTEGER PRIMARY KEY,
    run_id          INTEGER NOT NULL REFERENCES import_runs (id) ON DELETE CASCADE,
    -- Position in the original subtitle file; shown on 部分完成, not used to match on retry.
    cue_index       INTEGER NOT NULL CHECK (cue_index >= 0),
    cue_text        TEXT    NOT NULL CHECK (length(cue_text) BETWEEN 1 AND 1000),
    start_ms        INTEGER NOT NULL CHECK (start_ms >= 0),
    end_ms          INTEGER NOT NULL CHECK (end_ms >= 0),
    -- The Step 2 assignment (D13-REV) is user input, so it is persisted for retry. Deleting a
    -- character must remove its failures in the same transaction, as it does its lines.
    character_id    INTEGER NOT NULL REFERENCES characters (id) ON DELETE RESTRICT,
    -- failed: an error on this cue. cancelled: the run was cancelled with it in flight or
    -- queued (ENG6). lost: on retry its text no longer appears in the subtitle file (ENG4).
    status          TEXT    NOT NULL CHECK (status IN ('failed', 'cancelled', 'lost')),
    -- Stable code for the renderer to localize, plus developer detail (e.g. ffmpeg stderr).
    reason_code     TEXT    NOT NULL CHECK (length(reason_code) BETWEEN 1 AND 64),
    reason_detail   TEXT             CHECK (reason_detail IS NULL OR length(reason_detail) <= 2000),
    created_at      INTEGER NOT NULL
);

CREATE INDEX idx_import_failures_run      ON import_failures (run_id);
CREATE INDEX idx_import_failures_cue_text ON import_failures (cue_text);
CREATE INDEX idx_import_failures_character ON import_failures (character_id);

-- Files whose rows are gone but which have not been unlinked yet (ENG3). Inserted in the same
-- transaction as the row deletes, drained after commit and again on every library open.
CREATE TABLE pending_deletions (
    -- Relative to the library folder: an audio file or an image under images/.
    relative_path   TEXT    PRIMARY KEY CHECK (length(relative_path) BETWEEN 1 AND 256),
    -- Counted as still occupying disk until the unlink succeeds (ENG3 point 5).
    bytes           INTEGER NOT NULL DEFAULT 0 CHECK (bytes >= 0),
    queued_at       INTEGER NOT NULL,
    attempts        INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
    last_error      TEXT             CHECK (last_error IS NULL OR length(last_error) <= 2000)
) WITHOUT ROWID;

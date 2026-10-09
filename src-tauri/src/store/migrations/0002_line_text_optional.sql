-- 原文 or 譯文: either one may be left empty, but not both. While the
-- table is rebuilt anyway, clips may also be .mp3 or .ogg: 直接匯入 copies audio files without
-- converting them. SQLite can't change a CHECK in place, so `lines`
-- is rebuilt. Nothing references `lines`, so dropping
-- the old table is safe with foreign keys on.
CREATE TABLE lines_v2 (
    id              INTEGER PRIMARY KEY,
    character_id    INTEGER NOT NULL REFERENCES characters (id) ON DELETE RESTRICT,
    -- 原文 and 譯文. An absent 原文 is stored as ''; an absent 譯文 as NULL.
    text            TEXT    NOT NULL CHECK (length(text) <= 1000),
    translation     TEXT             CHECK (translation IS NULL OR length(translation) <= 1000),
    text_color      TEXT             CHECK (text_color IS NULL OR text_color GLOB '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'),
    -- 12 random A-Z0-9 characters + the clip's extension, relative to the library folder.
    audio_filename  TEXT    NOT NULL UNIQUE
                            CHECK (length(audio_filename) = 16
                                   AND substr(audio_filename, 13) IN ('.m4a', '.mp3', '.ogg')
                                   AND substr(audio_filename, 1, 12) NOT GLOB '*[^A-Z0-9]*'),
    audio_bytes     INTEGER NOT NULL CHECK (audio_bytes >= 0),
    duration_ms     INTEGER NOT NULL CHECK (duration_ms > 0),
    pinned_at       INTEGER,
    created_at      INTEGER NOT NULL,
    updated_at      INTEGER NOT NULL,
    CHECK (length(trim(text)) > 0 OR length(trim(coalesce(translation, ''))) > 0)
);

INSERT INTO lines_v2 (id, character_id, text, translation, text_color, audio_filename,
                      audio_bytes, duration_ms, pinned_at, created_at, updated_at)
SELECT id, character_id, text, translation, text_color, audio_filename,
       audio_bytes, duration_ms, pinned_at, created_at, updated_at
FROM lines;

DROP TABLE lines;
ALTER TABLE lines_v2 RENAME TO lines;

CREATE INDEX idx_lines_character_created  ON lines (character_id, created_at);
CREATE INDEX idx_lines_character_duration ON lines (character_id, duration_ms);

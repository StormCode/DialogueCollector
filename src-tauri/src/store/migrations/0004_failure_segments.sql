-- 字幕匯入改版 (2026-10-02): a line chosen in 選擇台詞 may have been merged from several cues,
-- or swapped, so it no longer appears in the subtitle file. Retry rebuilds failed lines from
-- what is kept here instead of re-reading the subtitle: the translation, and the time segments
-- of a merged line (JSON `[[start_ms, end_ms], …]`; NULL means the single start_ms–end_ms).
ALTER TABLE import_failures ADD COLUMN translation TEXT
    CHECK (translation IS NULL OR length(translation) <= 1000);
ALTER TABLE import_failures ADD COLUMN segments TEXT
    CHECK (segments IS NULL OR length(segments) <= 20000);

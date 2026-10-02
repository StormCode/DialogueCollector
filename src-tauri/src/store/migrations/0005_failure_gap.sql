-- 選擇台詞's 間隔秒數 (2026-10-02): the silence put between a merged line's segments, which
-- retry needs to rebuild the line. 0 for an ordinary cue.
ALTER TABLE import_failures ADD COLUMN gap_ms INTEGER NOT NULL DEFAULT 0
    CHECK (gap_ms BETWEEN 0 AND 10000);

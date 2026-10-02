/**
 * How long a step must run before its busy card (抽取音訊, 讀取字幕, 切割影片中, 匯入中…) is
 * shown (user 2026-10-02): a step that finishes sooner goes straight to what follows, without a
 * card flashing by.
 */
export const BUSY_CARD_DELAY_MS = 500;

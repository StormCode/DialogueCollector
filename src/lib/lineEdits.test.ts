import { describe, expect, it } from "vitest";

import { canSplit, isBilingual, joinSeparator, mergeRows, rowsFrom, splitRows, swapRows } from "./lineEdits";

const rows = rowsFrom([
  { index: 0, startMs: 1000, endMs: 2000, text: "おはよう。", translation: "早安。" },
  { index: 1, startMs: 2500, endMs: 3000, text: "ん？", translation: null },
  { index: 2, startMs: 4000, endMs: 5000, text: "行こう，今すぐ", translation: "走吧，現在就走" },
]);

describe("選擇台詞 line edits", () => {
  it("joins Chinese or Japanese with 「，」 and other text with a comma", () => {
    expect(joinSeparator(["おはよう", "行こう"])).toBe("，");
    expect(joinSeparator(["Good morning", "let's go"])).toBe(", ");
    expect(joinSeparator(["OK 好的", "走吧"])).toBe("，");
  });

  it("merges any chosen rows, leaving the unchosen ones between them out", () => {
    const merged = mergeRows(rows, new Set([0, 2]), 100);
    expect(merged.map((r) => r.index)).toEqual([100, 1]);
    const m = merged[0];
    expect(m.text).toBe("おはよう。，行こう，今すぐ");
    expect(m.translation).toBe("早安。，走吧，現在就走");
    expect(m.segments).toEqual([
      [1000, 2000],
      [4000, 5000],
    ]);
    expect([m.startMs, m.endMs]).toEqual([1000, 5000]);
  });

  it("splits a merged row back into exactly what it was, commas and all", () => {
    const merged = mergeRows(rows, new Set([0, 2]), 100);
    expect(canSplit(merged, new Set([100]))).toBe(true);
    expect(canSplit(merged, new Set([1]))).toBe(false);
    const split = splitRows(merged, new Set([100]));
    expect(split.map((r) => r.index)).toEqual([0, 2, 1]);
    expect(split.find((r) => r.index === 2)?.text).toBe("行こう，今すぐ");
  });

  it("a merge of merges splits one level at a time", () => {
    const once = mergeRows(rows, new Set([0, 1]), 100);
    const twice = mergeRows(once, new Set([100, 2]), 101);
    expect(twice).toHaveLength(1);
    const back = splitRows(twice, new Set([101]));
    expect(back.map((r) => r.index)).toEqual([100, 2]);
    expect(back[0].segments).toEqual([
      [1000, 2000],
      [2500, 3000],
    ]);
  });

  it("swaps the whole subtitle's text and translation, merged parts included", () => {
    expect(isBilingual(rows)).toBe(true);
    expect(isBilingual(rowsFrom([{ index: 0, startMs: 0, endMs: 1, text: "a", translation: null }]))).toBe(false);
    const merged = mergeRows(rows, new Set([0, 2]), 100);
    const swapped = swapRows(merged);
    expect(swapped[0].text).toBe("早安。，走吧，現在就走");
    expect(swapped[1].text, "no translation: unchanged").toBe("ん？");
    const parts = splitRows(swapped, new Set([100]));
    expect(parts[0]).toMatchObject({ text: "早安。", translation: "おはよう。" });
  });
});

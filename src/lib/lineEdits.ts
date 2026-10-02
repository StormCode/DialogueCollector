import type { Cue } from "./types";

/**
 * A row of 選擇台詞: a cue from the subtitle, or several merged into one (合併). `index` is the
 * row's identity (an original cue keeps its own; a merged row gets a fresh one). A merged row
 * keeps the rows it was made from in `parts`, so 拆分 brings them back exactly — the joined text
 * is never split at commas, since a line may hold commas of its own.
 */
export interface Row extends Cue {
  /** `[startMs, endMs]` pieces of a merged row, in time order; null for an ordinary cue. */
  segments: [number, number][] | null;
  /** The rows merged into this one, in list order; null for an ordinary cue. */
  parts: Row[] | null;
  /** A merged row's 間隔秒數 in ms: the silence put between its segments; null for an ordinary cue. */
  gapMs: number | null;
}

/** A new merged row's 間隔秒數 (board SubtitleSelect: 0.5 s). */
export const DEFAULT_GAP_MS = 500;
/** The 間隔秒數 input's range, 0–10 s. */
export const MAX_GAP_MS = 10_000;

export function rowsFrom(cues: Cue[]): Row[] {
  return cues.map((c) => ({ ...c, segments: null, parts: null, gapMs: null }));
}

/** A row's audio: its segments, or its own start–end. */
export function spans(row: Row): [number, number][] {
  return row.segments ?? [[row.startMs, row.endMs]];
}

const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}　-〿＀-￯]/u;
const LETTER = /[\p{L}\p{N}]/u;

/**
 * 「，」 when the lines are mostly Chinese or Japanese, else ", " (user 2026-10-02: 「，」 for
 * CJK, 「,」 otherwise; a space follows the Latin comma as Latin text expects).
 */
export function joinSeparator(texts: string[]): string {
  let cjk = 0;
  let letters = 0;
  for (const ch of texts.join("")) {
    if (CJK.test(ch)) cjk += 1;
    else if (LETTER.test(ch)) letters += 1;
  }
  return cjk >= letters ? "，" : ", ";
}

function join(texts: string[]): string {
  const kept = texts.map((t) => t.trim()).filter((t) => t !== "");
  return kept.join(joinSeparator(kept));
}

/**
 * 合併: the chosen rows become one, at the first one's place. Any rows may be chosen; the ones
 * between them that were not chosen stay as they are and their audio is not taken (user
 * 2026-10-02), so the merged row is the chosen rows' segments, joined in time order.
 */
export function mergeRows(rows: Row[], chosen: Set<number>, newIndex: number): Row[] {
  const parts = rows.filter((r) => chosen.has(r.index));
  if (parts.length < 2) return rows;
  const translations = parts.map((p) => p.translation ?? "");
  const translation = join(translations);
  const merged: Row = {
    index: newIndex,
    startMs: Math.min(...parts.map((p) => p.startMs)),
    endMs: Math.max(...parts.map((p) => p.endMs)),
    text: join(parts.map((p) => p.text)),
    translation: translation === "" ? null : translation,
    segments: parts.flatMap(spans).sort((a, b) => a[0] - b[0]),
    parts,
    // Merging onto a merged row keeps the gap it was given.
    gapMs: parts[0].gapMs ?? DEFAULT_GAP_MS,
  };
  const out: Row[] = [];
  for (const r of rows) {
    if (r === parts[0]) out.push(merged);
    else if (!chosen.has(r.index)) out.push(r);
  }
  return out;
}

/**
 * 拆分: each chosen merged row gives back the rows it was made from, each at its own place by
 * time (user 2026-10-02), so rows merged across unchosen ones go back around them.
 */
export function splitRows(rows: Row[], chosen: Set<number>): Row[] {
  const out: Row[] = [];
  const restored: Row[] = [];
  for (const r of rows) {
    if (chosen.has(r.index) && r.parts) restored.push(...r.parts);
    else out.push(r);
  }
  const before = (a: Row, b: Row) => a.startMs < b.startMs || (a.startMs === b.startMs && a.index < b.index);
  for (const part of restored) {
    const at = out.findIndex((r) => before(part, r));
    out.splice(at === -1 ? out.length : at, 0, part);
  }
  return out;
}

/** Whether any chosen row can be split. */
export function canSplit(rows: Row[], chosen: Set<number>): boolean {
  return rows.some((r) => chosen.has(r.index) && r.parts !== null);
}

/** A bilingual subtitle: some line carries a translation. */
export function isBilingual(rows: Row[]): boolean {
  return rows.some((r) => !!r.translation);
}

/**
 * 調換: the whole subtitle's 原文 and 譯文 trade places (user 2026-10-02: every line, whatever
 * is checked). Lines without a translation stay as they are; merged rows swap their parts too,
 * so 拆分 later gives the swapped lines back.
 */
export function swapRows(rows: Row[]): Row[] {
  return rows.map(swapRow);
}

function swapRow(r: Row): Row {
  const parts = r.parts ? r.parts.map(swapRow) : null;
  if (!r.translation) return { ...r, parts };
  return { ...r, text: r.translation, translation: r.text || null, parts };
}

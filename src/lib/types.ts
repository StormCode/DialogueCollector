// Mirrors of the Rust types that cross the IPC boundary. Keep in sync with
// src-tauri/src/library/settings.rs and src-tauri/src/commands.rs.

export const THEMES = [
  "indigo", // 靛藍 (default)
  "lightBlue", // 舒適淺藍
  "ruby", // 寶石紅
  "emerald", // 翠綠
  "sunset", // 夕陽橘
  "lipstick", // 蜜桃粉 (was 口紅粉; the id stays for saved settings)
  "midnight", // 夜光黑
] as const;
export type Theme = (typeof THEMES)[number];

export const LOCALES = ["zh-Hant", "zh-Hans", "ja", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const LINE_FONTS = ["ChironGoRoundTC", "KosugiMaru", "Yomogi"] as const;
export type LineFont = (typeof LINE_FONTS)[number];

/** Portable settings (`settings.json`, travels in the export zip). */
export interface Settings {
  theme: Theme;
  locale: Locale;
  charactersPerPage: number;
  linesPerPage: number;
  lineFont: LineFont;
  /** 全部播放每句切換秒數, 0–30 in 0.5 steps. */
  playAllGapSeconds: number;
  autoUpdate: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: "indigo",
  locale: "zh-Hant",
  charactersPerPage: 8,
  linesPerPage: 10,
  lineFont: "ChironGoRoundTC",
  playAllGapSeconds: 2,
  autoUpdate: false,
};

export interface AppInfo {
  version: string;
  schemaVersion: number;
}

/** Shape of every rejected command (`CommandError` in Rust). */
export interface CommandError {
  kind: string;
  message: string;
}

/** Result of the T1 walking-skeleton check (`smoke.rs`). */
export interface SmokeReport {
  clipPath: string;
  clipBytes: number;
  rowId: number;
  cutMs: number;
}

// ---------- library (T9), mirrors src-tauri/src/library ----------

export type VolumeKind =
  | { kind: "local" }
  | { kind: "network"; detail: string }
  | { kind: "cloudSync"; provider: string };

export type UnavailableReason =
  | { code: "noPointer" }
  | { code: "notFound" }
  | { code: "notALibrary" }
  | { code: "unsupportedVolume"; volume: VolumeKind }
  | { code: "schemaTooNew"; found: number; supported: number }
  | { code: "moving" }
  | { code: "error"; message: string };

export interface LibraryStats {
  clipCount: number;
  bytes: number;
}

export interface LibraryStatus {
  ready: boolean;
  path: string | null;
  reason: UnavailableReason | null;
  stats: LibraryStats | null;
}

export interface MoveProgress {
  done: number;
  total: number;
}

// ---------- backup (T10), mirrors src-tauri/src/library/backup.rs ----------

export interface BackupManifest {
  format: string;
  formatVersion: number;
  schemaVersion: number;
  appVersion: string;
  createdAt: number;
  clipCount: number;
  characterCount: number;
  bytes: number;
}

export interface BackupPreview {
  archive: BackupManifest;
  currentCharacters: number;
  currentClips: number;
  currentBytes: number;
}

export interface ExportProgress {
  done: number;
  total: number;
  finishing: boolean;
}

export interface ImportOutcome {
  status: LibraryStatus;
  settings: Settings;
}

/** `update-progress` payload (src-tauri/src/updater.rs). */
export interface UpdateProgress {
  version: string;
  downloaded: number;
  total: number | null;
}

/** `check_for_update` resolves only when nothing needs installing. */
export interface UpdateCheck {
  status: "upToDate";
  version: string;
}

/** `verify_library`: rows whose clip is gone (T20) and clips no row points at (ENG2). */
export interface VerifyReport {
  missing: MissingFile[];
  orphans: string[];
}

/** A line whose clip is gone from the library folder (T20, `verify_library`). */
export interface MissingFile {
  lineId: number;
  characterId: number;
  characterName: string;
  portraitPath: string | null;
  text: string;
}

// ---------------------------------------------------------------- subtitle import (S8, T7/T8)

/** One subtitle cue (`subs::Cue`). */
export interface Cue {
  index: number;
  startMs: number;
  endMs: number;
  /** 原文: the first line. */
  text: string;
  /** 譯文: the remaining lines, if any. */
  translation: string | null;
}

export type Category = "anime" | "movie" | "tv";

export interface Character {
  id: number;
  name: string;
  category: Category;
  source: string;
  cv: string | null;
  portraitPath: string | null;
  lineCount: number;
}

/** 新增角色's form; `portrait` is the picked image file. */
export interface NewCharacter {
  name: string;
  category: Category;
  source: string;
  cv: string | null;
  portrait: string | null;
}

export interface Assignment {
  cue: Cue;
  characterId: number;
  /** A merged line's [startMs, endMs] pieces (合併); omitted for an ordinary cue. */
  segments?: [number, number][];
}

/** A text subtitle stream inside a video (選擇字幕軌). */
export interface SubtitleTrack {
  /** The stream's index in the container. */
  index: number;
  codec: string;
  /** ISO 639 code, e.g. "jpn", "chi". */
  language: string | null;
  title: string | null;
}

export interface ExtractedSubtitle {
  path: string;
  cues: Cue[];
}

export interface ImportProgress {
  phase: "cutting" | "indexing";
  done: number;
  total: number;
  imported: number;
  failed: number;
}

export type FailureReason =
  | "zeroLength"
  | "outOfRange"
  | "decodeFailed"
  | "diskFull"
  | "writeFailed"
  | "sidecarUnusable"
  | "killed"
  | "other"
  | "noAudio"
  | "cancelled";

export interface ImportFailure {
  cueIndex: number;
  text: string;
  translation?: string | null;
  startMs: number;
  endMs: number;
  /** A merged line's pieces; empty for an ordinary cue. */
  segments?: [number, number][];
  characterId: number;
  reason: FailureReason;
  detail: string | null;
}

export interface JobOutcome {
  runId: number;
  imported: number;
  failures: ImportFailure[];
  status: "running" | "complete" | "partial" | "failed" | "cancelled";
  lost: number[];
  changedSources: string[];
}

/** 編輯角色's photo control (`characters::PortraitChange`). */
export type PortraitChange = { kind: "keep" } | { kind: "remove" } | { kind: "replace"; path: string };

/** 編輯角色's form. */
export interface CharacterEdit {
  name: string;
  category: Category;
  source: string;
  cv: string | null;
  portrait: PortraitChange;
}

// ---------------------------------------------------------------- 台詞 page

export interface Line {
  id: number;
  characterId: number;
  text: string;
  translation: string | null;
  audioPath: string;
  durationMs: number;
  createdAt: number;
  pinnedAt: number | null;
}

export interface LinesPageData {
  character: Character;
  posterPath: string | null;
  lines: Line[];
}

/** EditLine's form. */
export interface LineEdit {
  text: string;
  translation: string | null;
  characterId: number;
}

// ---------------------------------------------------------------- 直接匯入

export interface MediaInfo {
  path: string;
  durationMs: number | null;
  hasAudio: boolean;
}

/** One InputLine card as it is imported. */
export interface ManualEntry {
  path: string;
  characterId: number;
  text: string;
  translation: string | null;
}

export interface ManualFailure {
  /** Position in the submitted list. */
  index: number;
  reason: FailureReason;
  detail: string | null;
}

export interface ManualOutcome {
  status: "complete" | "partial" | "failed" | "cancelled";
  imported: number;
  failures: ManualFailure[];
}

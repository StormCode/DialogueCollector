// Mirrors of the Rust types that cross the IPC boundary. Keep in sync with
// src-tauri/src/library/settings.rs and src-tauri/src/commands.rs.

export const THEMES = [
  "indigo", // 靛藍 (default)
  "lightBlue", // 舒適淺藍
  "ruby", // 寶石紅
  "emerald", // 翠綠
  "sunset", // 夕陽橘
  "lipstick", // 口紅粉
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

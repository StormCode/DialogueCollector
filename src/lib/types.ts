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
  autoUpdate: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: "indigo",
  locale: "zh-Hant",
  charactersPerPage: 8,
  linesPerPage: 10,
  lineFont: "ChironGoRoundTC",
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

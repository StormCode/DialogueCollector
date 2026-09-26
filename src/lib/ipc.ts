// Typed wrappers over Tauri commands. Components and stores call these, never `invoke`
// directly, so every command name and payload shape lives in one place.

import { invoke } from "@tauri-apps/api/core";

import type { AppInfo, Settings } from "./types";

export const ipc = {
  appInfo: () => invoke<AppInfo>("app_info"),
  getSettings: () => invoke<Settings>("get_settings"),
  saveSettings: (settings: Settings) => invoke<Settings>("save_settings", { settings }),
};

/** True when running inside the Tauri webview (false under plain `vite` or tests). */
export const inTauri = () => typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

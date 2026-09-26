// Typed wrappers over Tauri commands. Components and stores call these, never `invoke`
// directly, so every command name and payload shape lives in one place.

import { invoke } from "@tauri-apps/api/core";

import type { AppInfo, Settings, SmokeReport } from "./types";

export const ipc = {
  appInfo: () => invoke<AppInfo>("app_info"),
  getSettings: () => invoke<Settings>("get_settings"),
  saveSettings: (settings: Settings) => invoke<Settings>("save_settings", { settings }),
  smokeMode: () => invoke<boolean>("smoke_mode"),
  runSmoke: () => invoke<SmokeReport>("run_smoke"),
  smokeFinish: (ok: boolean, detail: string) => invoke<void>("smoke_finish", { ok, detail }),
};

/** True when running inside the Tauri webview (false under plain `vite` or tests). */
export const inTauri = () => typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

// Typed wrappers over Tauri commands. Components and stores call these, never `invoke`
// directly, so every command name and payload shape lives in one place.

import { invoke } from "@tauri-apps/api/core";

import type {
  AppInfo,
  BackupManifest,
  BackupPreview,
  ImportOutcome,
  LibraryStatus,
  Settings,
  SmokeReport,
} from "./types";

export const ipc = {
  appInfo: () => invoke<AppInfo>("app_info"),
  getSettings: () => invoke<Settings>("get_settings"),
  saveSettings: (settings: Settings) => invoke<Settings>("save_settings", { settings }),
  libraryStatus: () => invoke<LibraryStatus>("library_status"),
  chooseLibraryLocation: (path: string) =>
    invoke<LibraryStatus>("choose_library_location", { path }),
  exportLibrary: (dest: string) => invoke<BackupManifest>("export_library", { dest }),
  cancelExport: () => invoke<void>("cancel_export"),
  inspectBackup: (path: string) => invoke<BackupPreview>("inspect_backup", { path }),
  importBackup: (path: string) => invoke<ImportOutcome>("import_backup", { path }),
  smokeMode: () => invoke<boolean>("smoke_mode"),
  runSmoke: () => invoke<SmokeReport>("run_smoke"),
  smokeFinish: (ok: boolean, detail: string) => invoke<void>("smoke_finish", { ok, detail }),
};

/** True when running inside the Tauri webview (false under plain `vite` or tests). */
export const inTauri = () => typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

/** Tauri rejects commands with the Rust `CommandError` shape; anything else is unexpected. */
export function errorKind(e: unknown): string {
  return typeof e === "object" && e !== null && "kind" in e ? String((e as { kind: unknown }).kind) : "Unknown";
}

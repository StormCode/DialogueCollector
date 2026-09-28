// Typed wrappers over Tauri commands. Components and stores call these, never `invoke`
// directly, so every command name and payload shape lives in one place.

import { invoke } from "@tauri-apps/api/core";

import type {
  AppInfo,
  Assignment,
  Character,
  CharacterEdit,
  Cue,
  JobOutcome,
  Line,
  LineEdit,
  LinesPageData,
  NewCharacter,
  BackupManifest,
  BackupPreview,
  ImportOutcome,
  LibraryStatus,
  Settings,
  SmokeReport,
  UpdateCheck,
  VerifyReport,
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
  deleteMissingLines: () => invoke<number>("delete_missing_lines"),
  verifyLibrary: () => invoke<VerifyReport>("verify_library"),
  parseSubtitle: (path: string) => invoke<Cue[]>("parse_subtitle", { path }),
  listCharacters: () => invoke<Character[]>("list_characters"),
  // `portrait` is serde's adjacently tagged PortraitChange: { kind, path? }.
  updateCharacter: (id: number, character: CharacterEdit) =>
    invoke<Character>("update_character", { id, character }),
  deleteCharacter: (id: number) => invoke<void>("delete_character", { id }),
  openLines: (characterId: number) => invoke<LinesPageData>("open_lines", { characterId }),
  getLine: (id: number) => invoke<Line>("get_line", { id }),
  setLinePinned: (id: number, pinned: boolean) => invoke<void>("set_line_pinned", { id, pinned }),
  updateLine: (id: number, line: LineEdit) => invoke<Line>("update_line", { id, line }),
  deleteLine: (id: number) => invoke<void>("delete_line", { id }),
  setPoster: (characterId: number, path: string | null) =>
    invoke<string | null>("set_poster", { characterId, path }),
  allowPreview: (path: string) => invoke<void>("allow_preview", { path }),
  createCharacter: (character: NewCharacter) => invoke<Character>("create_character", { character }),
  startSubtitleImport: (subtitle: string, source: string, assignments: Assignment[]) =>
    invoke<JobOutcome>("start_subtitle_import", { subtitle, source, assignments }),
  retryImport: (runId: number) => invoke<JobOutcome>("retry_import", { runId }),
  cancelImport: () => invoke<void>("cancel_import"),
  checkForUpdate: () => invoke<UpdateCheck>("check_for_update"),
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

import { listen } from "@tauri-apps/api/event";
import { create } from "zustand";

import { ipc } from "../lib/ipc";
import type { BackupManifest, BackupPreview, ExportProgress, ImportOutcome } from "../lib/types";
import { useLibraryStore } from "./libraryStore";
import { useSettingsStore } from "./settingsStore";

/** Must match `EXPORT_PROGRESS_EVENT` in src-tauri/src/commands.rs. */
const EXPORT_PROGRESS_EVENT = "library-export-progress";

interface BackupState {
  exporting: boolean;
  exportProgress: ExportProgress | null;
  importing: boolean;
  /** Rejects with the Rust `CommandError`; `Backup.Cancelled` when the user cancelled. */
  exportTo: (dest: string) => Promise<BackupManifest>;
  cancelExport: () => Promise<void>;
  inspect: (path: string) => Promise<BackupPreview>;
  importFrom: (path: string) => Promise<ImportOutcome>;
}

export const useBackupStore = create<BackupState>((set) => ({
  exporting: false,
  exportProgress: null,
  importing: false,

  exportTo: async (dest) => {
    set({ exporting: true, exportProgress: null });
    const unlisten = await listen<ExportProgress>(EXPORT_PROGRESS_EVENT, (e) =>
      set({ exportProgress: e.payload }),
    );
    try {
      return await ipc.exportLibrary(dest);
    } finally {
      unlisten();
      set({ exporting: false, exportProgress: null });
    }
  },

  cancelExport: () => ipc.cancelExport(),

  inspect: (path) => ipc.inspectBackup(path),

  importFrom: async (path) => {
    set({ importing: true });
    try {
      const outcome = await ipc.importBackup(path);
      // The archive's settings.json replaced ours; apply them to the running UI.
      useSettingsStore.setState({ settings: outcome.settings });
      useLibraryStore.setState({ status: outcome.status });
      return outcome;
    } finally {
      set({ importing: false });
      await useLibraryStore.getState().load();
    }
  },
}));

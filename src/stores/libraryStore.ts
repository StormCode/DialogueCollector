import { listen } from "@tauri-apps/api/event";
import { create } from "zustand";

import { inTauri, ipc } from "../lib/ipc";
import type { LibraryStatus, MoveProgress } from "../lib/types";

/** Must match `MOVE_PROGRESS_EVENT` in src-tauri/src/commands.rs. */
const MOVE_PROGRESS_EVENT = "library-move-progress";

interface LibraryState {
  status: LibraryStatus | null;
  /** Set while 瀏覽 → a new location is being applied; `progress` only for a cross-volume copy. */
  relocating: boolean;
  progress: MoveProgress | null;
  load: () => Promise<void>;
  /** Resolves to the new status; rejects with the Rust `CommandError`. */
  chooseLocation: (path: string) => Promise<LibraryStatus>;
}

export const useLibraryStore = create<LibraryState>((set) => ({
  status: null,
  relocating: false,
  progress: null,

  load: async () => {
    if (!inTauri()) return;
    set({ status: await ipc.libraryStatus() });
  },

  chooseLocation: async (path) => {
    set({ relocating: true, progress: null });
    const unlisten = await listen<MoveProgress>(MOVE_PROGRESS_EVENT, (e) =>
      set({ progress: e.payload }),
    );
    try {
      const status = await ipc.chooseLibraryLocation(path);
      set({ status });
      return status;
    } finally {
      unlisten();
      // The backend may have reopened the old library after a failed move; refresh either way.
      set({ relocating: false, progress: null, status: await ipc.libraryStatus() });
    }
  },
}));

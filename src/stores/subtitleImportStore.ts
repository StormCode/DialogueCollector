import { listen } from "@tauri-apps/api/event";
import { create } from "zustand";

import { errorKind, ipc } from "../lib/ipc";
import type { Character, Cue, ImportProgress, JobOutcome, NewCharacter } from "../lib/types";

/** Must match `IMPORT_PROGRESS_EVENT` in src-tauri/src/import_cmd.rs. */
const IMPORT_PROGRESS_EVENT = "import-progress";

/**
 * Screens of the subtitle path, one per board:
 * reading SubtitleImporting · readFailed SubtitleFailed · select SubtitleSelect (+ empty toast)
 * · source VideoSelect · cutting VideoCutting · indexing VideoImportingIndex
 * · complete VideoComplete · partial VideoPartial · failed VideoFailed.
 */
export type Screen =
  | "reading"
  | "readFailed"
  | "select"
  | "source"
  | "cutting"
  | "indexing"
  | "complete"
  | "partial"
  | "failed";

interface SubtitleImportState {
  screen: Screen;
  subtitlePath: string | null;
  sourcePath: string | null;
  cues: Cue[];
  /** 無法提取台詞: the file parsed but holds no dialogue. */
  noCues: boolean;
  characters: Character[];
  /** cue index → character id (Step 2). */
  assigned: Record<number, number>;
  /** Checked rows, by cue index; only used to assign in bulk. */
  selected: Set<number>;
  progress: ImportProgress | null;
  outcome: JobOutcome | null;
  /** Error kind of the last failed step, for logs and tests. */
  error: string | null;

  openSubtitle: (path: string) => Promise<void>;
  retryRead: () => Promise<void>;
  loadCharacters: () => Promise<void>;
  addCharacter: (form: NewCharacter) => Promise<Character>;
  toggle: (index: number) => void;
  selectAll: () => void;
  clearAll: () => void;
  /** Assigns the checked rows (then clears the checks), or one row. `null` unassigns. */
  assignSelected: (characterId: number | null) => void;
  assignOne: (index: number, characterId: number | null) => void;
  toSource: () => void;
  toSelect: () => void;
  startImport: (source: string) => Promise<void>;
  cancel: () => Promise<void>;
  retry: () => Promise<void>;
  reset: () => void;
}

const initial = {
  screen: "reading" as Screen,
  subtitlePath: null,
  sourcePath: null,
  cues: [] as Cue[],
  noCues: false,
  assigned: {} as Record<number, number>,
  selected: new Set<number>(),
  progress: null,
  outcome: null,
  error: null,
};

function screenFor(outcome: JobOutcome): Screen {
  if (outcome.status === "complete") return "complete";
  if (outcome.imported === 0 && outcome.status === "failed") return "failed";
  return "partial";
}

export const useSubtitleImportStore = create<SubtitleImportState>((set, get) => {
  /** Runs an import step with progress, landing on the outcome's screen. */
  async function run(job: () => Promise<JobOutcome>) {
    set({ screen: "cutting", progress: null, error: null });
    const unlisten = await listen<ImportProgress>(IMPORT_PROGRESS_EVENT, (e) =>
      set({ progress: e.payload, screen: e.payload.phase === "indexing" ? "indexing" : "cutting" }),
    );
    try {
      const outcome = await job();
      set({ outcome, screen: screenFor(outcome) });
    } catch (e) {
      set({ error: errorKind(e), screen: "failed" });
    } finally {
      unlisten();
    }
  }

  return {
    ...initial,
    characters: [],

    openSubtitle: async (path) => {
      set({ ...initial, selected: new Set(), subtitlePath: path, screen: "reading" });
      try {
        const cues = await ipc.parseSubtitle(path);
        set({ cues, screen: "select" });
      } catch (e) {
        const kind = errorKind(e);
        // A file that parsed but has no dialogue opens Step 2 empty, with its toast.
        if (kind === "Subs.NoCues") set({ noCues: true, cues: [], screen: "select", error: kind });
        else set({ error: kind, screen: "readFailed" });
      }
    },

    retryRead: async () => {
      const path = get().subtitlePath;
      if (path) await get().openSubtitle(path);
    },

    loadCharacters: async () => set({ characters: await ipc.listCharacters() }),

    addCharacter: async (form) => {
      const created = await ipc.createCharacter(form);
      set({ characters: [...get().characters, created].sort((a, b) => a.name.localeCompare(b.name)) });
      return created;
    },

    toggle: (index) => {
      const selected = new Set(get().selected);
      if (selected.has(index)) selected.delete(index);
      else selected.add(index);
      set({ selected });
    },
    selectAll: () => set({ selected: new Set(get().cues.map((c) => c.index)) }),
    clearAll: () => set({ selected: new Set() }),

    assignSelected: (characterId) => {
      const assigned = { ...get().assigned };
      for (const index of get().selected) {
        if (characterId === null) delete assigned[index];
        else assigned[index] = characterId;
      }
      set({ assigned, selected: new Set() });
    },
    assignOne: (index, characterId) => {
      const assigned = { ...get().assigned };
      if (characterId === null) delete assigned[index];
      else assigned[index] = characterId;
      set({ assigned });
    },

    toSource: () => set({ screen: "source" }),
    toSelect: () => set({ screen: "select" }),

    startImport: async (source) => {
      const { subtitlePath, cues, assigned } = get();
      if (!subtitlePath) return;
      set({ sourcePath: source });
      const assignments = cues
        .filter((c) => assigned[c.index] !== undefined)
        .map((cue) => ({ cue, characterId: assigned[cue.index] }));
      await run(() => ipc.startSubtitleImport(subtitlePath, source, assignments));
    },

    cancel: () => ipc.cancelImport(),

    /** 再試一次: re-runs the failed and cancelled cues, or the whole import if it never ran. */
    retry: async () => {
      const { outcome, sourcePath } = get();
      if (outcome) await run(() => ipc.retryImport(outcome.runId));
      else if (sourcePath) await get().startImport(sourcePath);
    },

    reset: () => set({ ...initial, selected: new Set() }),
  };
});

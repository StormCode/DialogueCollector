import { listen } from "@tauri-apps/api/event";
import { create } from "zustand";

import { errorKind, ipc } from "../lib/ipc";
import {
  canSplit,
  isBilingual,
  MAX_GAP_MS,
  mergeRows,
  rowsFrom,
  spans,
  splitRows,
  swapRows,
  type Row,
} from "../lib/lineEdits";
import type { Character, Cue, ImportProgress, JobOutcome, NewCharacter, SubtitleTrack } from "../lib/types";

/** Must match `IMPORT_PROGRESS_EVENT` in src-tauri/src/import_cmd.rs. */
const IMPORT_PROGRESS_EVENT = "import-progress";

/** Merged rows get indexes from here on, clear of any cue's own. */
const MERGED_INDEX_BASE = 1_000_000;

/**
 * Screens of the subtitle path (字幕匯入改版 2026-10-02), one per board:
 * reading SubtitleImporting · readFailed SubtitleFailed (字幕讀取失敗) · extracting
 * AudioExtracting · tracks TrackSelect · select SubtitleSelect (+ empty toast, embedded variant)
 * · cutting VideoCutting · indexing VideoImportingIndex · complete VideoComplete · partial
 * VideoPartial · failed VideoFailed · aborted: 取消 on reading or extracting, back to the main page.
 */
export type Screen =
  | "reading"
  | "readFailed"
  | "extracting"
  | "tracks"
  | "select"
  | "cutting"
  | "indexing"
  | "complete"
  | "partial"
  | "failed"
  | "aborted";

/** Where the subtitle comes from: a dropped file, or a track inside the video. */
export type Flow = "file" | "embedded";

interface SubtitleImportState {
  screen: Screen;
  flow: Flow;
  videoPath: string | null;
  /** The subtitle file: the dropped one, or the extracted track's. */
  subtitlePath: string | null;
  /** 抽取音訊's result: what the rows play from. */
  audioPath: string | null;
  tracks: SubtitleTrack[];
  rows: Row[];
  /** 無法提取台詞: the file parsed but holds no dialogue. */
  noCues: boolean;
  /** Whether the subtitle came in bilingual: 調換 is offered only then. */
  bilingual: boolean;
  characters: Character[];
  /** row index → character id. */
  assigned: Record<number, number>;
  /** Checked rows, by row index. */
  selected: Set<number>;
  nextIndex: number;
  progress: ImportProgress | null;
  outcome: JobOutcome | null;
  /** Error kind of the last failed step, for logs and tests. */
  error: string | null;

  /** Starts the path: a subtitle file with its video, or a video alone (embedded subtitles). */
  open: (video: string, subtitle: string | null) => Promise<void>;
  /** 再試一次 on 字幕讀取失敗: repeats the step that failed. */
  retryRead: () => Promise<void>;
  /** 取消 on 讀取字幕 or 抽取音訊. */
  abort: () => Promise<void>;
  pickTrack: (track: SubtitleTrack) => Promise<void>;
  loadCharacters: () => Promise<void>;
  addCharacter: (form: NewCharacter) => Promise<Character>;
  toggle: (index: number) => void;
  selectAll: () => void;
  clearAll: () => void;
  /** Assigns the checked rows (then clears the checks), or one row. `null` unassigns. */
  assignSelected: (characterId: number | null) => void;
  assignOne: (index: number, characterId: number | null) => void;
  merge: () => void;
  split: () => void;
  swap: () => void;
  /** A merged row's 間隔秒數, clamped to 0–10 s. */
  setGap: (index: number, gapMs: number) => void;
  canMerge: () => boolean;
  canSplit: () => boolean;
  /** 回上一步 from 選擇台詞: the track list (embedded), else nothing to go back to. */
  backFromSelect: () => boolean;
  startImport: () => Promise<void>;
  cancel: () => Promise<void>;
  retry: () => Promise<void>;
  reset: () => void;
}

const initial = {
  screen: "reading" as Screen,
  flow: "file" as Flow,
  videoPath: null,
  subtitlePath: null,
  audioPath: null,
  tracks: [] as SubtitleTrack[],
  rows: [] as Row[],
  noCues: false,
  bilingual: false,
  assigned: {} as Record<number, number>,
  selected: new Set<number>(),
  nextIndex: MERGED_INDEX_BASE,
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

  /** True once 取消 was pressed: a step finishing afterwards must not move the screen on. */
  const aborted = () => get().screen === "aborted";

  /** Shows a parsed subtitle in 選擇台詞. */
  function showCues(cues: Cue[], subtitlePath: string) {
    const rows = rowsFrom(cues);
    set({
      rows,
      subtitlePath,
      bilingual: isBilingual(rows),
      noCues: false,
      assigned: {},
      selected: new Set(),
      nextIndex: MERGED_INDEX_BASE,
      screen: "select",
    });
  }

  function readFailed(e: unknown, subtitlePath: string | null) {
    if (aborted()) return;
    const kind = errorKind(e);
    // A subtitle that parsed but has no dialogue opens 選擇台詞 empty, with its toast.
    if (kind === "Subs.NoCues") {
      set({ noCues: true, rows: [], subtitlePath, screen: "select", error: kind });
    } else {
      set({ error: kind, screen: "readFailed" });
    }
  }

  /** 抽取音訊: the video's audio, for the rows to play. Returns false if it did not finish. */
  async function extractAudio(video: string): Promise<boolean> {
    set({ screen: "extracting" });
    try {
      const audioPath = await ipc.preparePreview(video);
      if (aborted()) return false;
      set({ audioPath });
      return true;
    } catch (e) {
      if (!aborted()) set({ error: errorKind(e), screen: "failed" });
      return false;
    }
  }

  return {
    ...initial,
    characters: [],

    open: async (video, subtitle) => {
      set({ ...initial, selected: new Set(), videoPath: video, flow: subtitle ? "file" : "embedded" });
      if (subtitle) {
        set({ screen: "reading", subtitlePath: subtitle });
        let cues: Cue[];
        try {
          cues = await ipc.parseSubtitle(subtitle);
        } catch (e) {
          // 字幕讀取失敗, or 選擇台詞 empty with its toast: nothing to play, so no 抽取音訊.
          readFailed(e, subtitle);
          return;
        }
        if (aborted() || !(await extractAudio(video))) return;
        showCues(cues, subtitle);
        return;
      }
      if (!(await extractAudio(video))) return;
      try {
        const tracks = await ipc.listSubtitleTracks(video);
        if (aborted()) return;
        if (tracks.length === 0) set({ error: "Subs.NoTracks", screen: "readFailed" });
        else set({ tracks, screen: "tracks" });
      } catch (e) {
        readFailed(e, null);
      }
    },

    retryRead: async () => {
      const { videoPath, flow, subtitlePath } = get();
      if (videoPath) await get().open(videoPath, flow === "file" ? subtitlePath : null);
    },

    abort: async () => {
      set({ screen: "aborted" });
      await ipc.cancelPrepare().catch(() => {});
    },

    pickTrack: async (track) => {
      const video = get().videoPath;
      if (!video) return;
      set({ screen: "reading" });
      try {
        const extracted = await ipc.extractSubtitleTrack(video, track.index, track.codec);
        if (aborted()) return;
        showCues(extracted.cues, extracted.path);
      } catch (e) {
        readFailed(e, null);
      }
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
    selectAll: () => set({ selected: new Set(get().rows.map((r) => r.index)) }),
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

    canMerge: () => get().selected.size >= 2,
    canSplit: () => canSplit(get().rows, get().selected),

    // 合併: the merged row takes the character of the earliest chosen row that has one.
    merge: () => {
      const { rows, selected, assigned, nextIndex } = get();
      if (selected.size < 2) return;
      const chosen = rows.filter((r) => selected.has(r.index));
      const owner = chosen.map((r) => assigned[r.index]).find((id) => id !== undefined);
      const next = { ...assigned };
      for (const r of chosen) delete next[r.index];
      if (owner !== undefined) next[nextIndex] = owner;
      set({
        rows: mergeRows(rows, selected, nextIndex),
        assigned: next,
        selected: new Set([nextIndex]),
        nextIndex: nextIndex + 1,
      });
    },

    // 拆分: the parts come back; each takes the merged row's character if it has one.
    split: () => {
      const { rows, selected, assigned } = get();
      const next = { ...assigned };
      const restored = new Set<number>();
      for (const r of rows) {
        if (!selected.has(r.index) || !r.parts) continue;
        const owner = next[r.index];
        delete next[r.index];
        for (const p of r.parts) {
          if (owner !== undefined) next[p.index] = owner;
          restored.add(p.index);
        }
      }
      set({ rows: splitRows(rows, selected), assigned: next, selected: restored });
    },

    swap: () => {
      if (!get().bilingual) return;
      set({ rows: swapRows(get().rows) });
    },

    setGap: (index, gapMs) => {
      const gap = Number.isFinite(gapMs) ? Math.round(Math.min(MAX_GAP_MS, Math.max(0, gapMs))) : 0;
      set({ rows: get().rows.map((r) => (r.index === index && r.segments ? { ...r, gapMs: gap } : r)) });
    },

    backFromSelect: () => {
      if (get().flow !== "embedded" || get().tracks.length === 0) return false;
      set({ screen: "tracks" });
      return true;
    },

    startImport: async () => {
      const { subtitlePath, videoPath, rows, assigned } = get();
      if (!subtitlePath || !videoPath) return;
      const assignments = rows
        .filter((r) => assigned[r.index] !== undefined)
        .map((r) => ({
          cue: { index: r.index, startMs: r.startMs, endMs: r.endMs, text: r.text, translation: r.translation },
          characterId: assigned[r.index],
          ...(r.segments ? { segments: spans(r), gapMs: r.gapMs ?? 0 } : {}),
        }));
      await run(() => ipc.startSubtitleImport(subtitlePath, videoPath, assignments));
    },

    cancel: () => ipc.cancelImport(),

    /** 再試一次: re-runs the failed and cancelled lines, or the whole import if it never ran. */
    retry: async () => {
      const { outcome } = get();
      if (outcome) await run(() => ipc.retryImport(outcome.runId));
      else await get().startImport();
    },

    reset: () => set({ ...initial, selected: new Set() }),
  };
});

import { convertFileSrc } from "@tauri-apps/api/core";
import { useCallback, useEffect, useRef, useState } from "react";

import { inTauri } from "../lib/ipc";

export interface PlayerItem {
  id: number;
  audioPath: string;
}

export type PlayMode = "single" | "all" | "seq";

export interface PlayerState {
  /** Line being played (or paused), if any. */
  currentId: number | null;
  paused: boolean;
  /** 0–1 through the current line. */
  progress: number;
  mode: PlayMode | null;
}

const IDLE: PlayerState = { currentId: null, paused: false, progress: 0, mode: null };

/**
 * One audio element playing a queue of clips from the library (asset protocol), with `gapMs`
 * of silence between them (設定 → 全部播放每句切換秒數). `onAdvance` fires as each clip starts,
 * so the page can follow it. The queue is fixed when it starts: checking or unchecking lines
 * during 依序播放 doesn't change it, and a clip that won't play is skipped.
 */
export function usePlayer(gapMs: number, onAdvance?: (id: number) => void) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const queue = useRef<PlayerItem[]>([]);
  const index = useRef(0);
  const gapTimer = useRef<number | undefined>(undefined);
  /** Bumped per clip, so a late failure of an earlier clip is ignored. */
  const generation = useRef(0);
  const advance = useRef(onAdvance);
  advance.current = onAdvance;
  const [state, setState] = useState<PlayerState>(IDLE);

  const stop = useCallback(() => {
    window.clearTimeout(gapTimer.current);
    generation.current += 1;
    audio.current?.pause();
    queue.current = [];
    index.current = 0;
    setState(IDLE);
  }, []);

  const playAt = useCallback((i: number, mode: PlayMode) => {
    const item = queue.current[i];
    if (!item) return;
    index.current = i;
    const gen = ++generation.current;
    const el = audio.current ?? (audio.current = new Audio());
    // A clip that can't play (its file went missing) is skipped; the queue goes on.
    const skip = () => {
      if (gen !== generation.current) return;
      if (index.current + 1 < queue.current.length) playAt(index.current + 1, mode);
      else stop();
    };
    el.onerror = skip;
    el.onended = () => {
      if (index.current + 1 < queue.current.length) {
        setState((s) => ({ ...s, progress: 1 }));
        gapTimer.current = window.setTimeout(() => playAt(index.current + 1, mode), gapMs);
      } else {
        stop();
      }
    };
    el.ontimeupdate = () => {
      if (el.duration > 0) setState((s) => ({ ...s, progress: el.currentTime / el.duration }));
    };
    el.src = inTauri() ? convertFileSrc(item.audioPath) : item.audioPath;
    setState({ currentId: item.id, paused: false, progress: 0, mode });
    advance.current?.(item.id);
    void el.play().catch((e: unknown) => {
      if ((e as Error)?.name !== "AbortError") skip();
    });
  }, [gapMs, stop]);

  const start = useCallback(
    (items: PlayerItem[], mode: PlayMode) => {
      if (items.length === 0) return;
      window.clearTimeout(gapTimer.current);
      queue.current = items;
      playAt(0, mode);
    },
    [playAt],
  );

  /** A card's play button: toggles pause on the current line, otherwise plays just that one. */
  const toggle = useCallback(
    (item: PlayerItem) => {
      const el = audio.current;
      if (state.currentId === item.id && el) {
        if (state.paused) {
          void el.play();
          setState((s) => ({ ...s, paused: false }));
        } else {
          el.pause();
          setState((s) => ({ ...s, paused: true }));
        }
        return;
      }
      start([item], "single");
    },
    [start, state.currentId, state.paused],
  );

  useEffect(() => () => stop(), [stop]);

  return { ...state, start, toggle, stop };
}

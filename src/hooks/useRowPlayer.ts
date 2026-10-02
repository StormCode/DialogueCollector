import { convertFileSrc } from "@tauri-apps/api/core";
import { useCallback, useEffect, useRef, useState } from "react";

import { inTauri } from "../lib/ipc";

/**
 * 選擇台詞's per-row playback from the audio 抽取音訊 made: a row plays its `[startMs, endMs]`
 * segments in turn, with its 間隔秒數 of silence between them as the imported clip will have,
 * and stops at the last one's end. Pressing the playing row pauses or resumes it; another row
 * takes over (as on the 台詞 page). The end is watched every frame, since `timeupdate` alone
 * fires only a few times a second and would run into the next line.
 */
export function useRowPlayer(audioPath: string | null) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const segments = useRef<[number, number][]>([]);
  const segment = useRef(0);
  const gap = useRef(0);
  const frame = useRef(0);
  /** The silence between two segments, while it runs. */
  const gapTimer = useRef<number | undefined>(undefined);
  const [current, setCurrent] = useState<{ index: number; paused: boolean } | null>(null);

  const halt = useCallback(() => {
    cancelAnimationFrame(frame.current);
    window.clearTimeout(gapTimer.current);
    gapTimer.current = undefined;
    audio.current?.pause();
  }, []);

  const stop = useCallback(() => {
    halt();
    setCurrent(null);
  }, [halt]);

  const watch = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    const [, end] = segments.current[segment.current] ?? [0, 0];
    if (el.currentTime * 1000 >= end) {
      segment.current += 1;
      const next = segments.current[segment.current];
      if (!next) {
        stop();
        return;
      }
      el.currentTime = next[0] / 1000;
      if (gap.current > 0) {
        // Wait out the gap at the next segment's start; resuming after a pause skips the rest.
        el.pause();
        gapTimer.current = window.setTimeout(() => {
          gapTimer.current = undefined;
          void el.play().catch(() => stop());
          frame.current = requestAnimationFrame(watch);
        }, gap.current);
        return;
      }
    }
    frame.current = requestAnimationFrame(watch);
  }, [stop]);

  const toggle = useCallback(
    (index: number, rowSegments: [number, number][], gapMs = 0) => {
      if (!audioPath) return;
      const el = audio.current ?? (audio.current = new Audio(inTauri() ? convertFileSrc(audioPath) : audioPath));
      if (current?.index === index) {
        if (current.paused) {
          void el.play().catch(() => stop());
          frame.current = requestAnimationFrame(watch);
          setCurrent({ index, paused: false });
        } else {
          halt();
          setCurrent({ index, paused: true });
        }
        return;
      }
      halt();
      segments.current = rowSegments;
      segment.current = 0;
      gap.current = gapMs;
      el.currentTime = rowSegments[0][0] / 1000;
      void el.play().catch(() => stop());
      frame.current = requestAnimationFrame(watch);
      setCurrent({ index, paused: false });
    },
    [audioPath, current, halt, stop, watch],
  );

  useEffect(() => halt, [halt]);

  return { current, toggle, stop };
}

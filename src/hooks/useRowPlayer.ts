import { convertFileSrc } from "@tauri-apps/api/core";
import { useCallback, useEffect, useRef, useState } from "react";

import { inTauri } from "../lib/ipc";

/**
 * 選擇台詞's per-row playback from the audio 抽取音訊 made: a row plays its `[startMs, endMs]`
 * segments in turn and stops at the last one's end. Pressing the playing row pauses or resumes
 * it; another row takes over (as on the 台詞 page). The end is watched every frame, since
 * `timeupdate` alone fires only a few times a second and would run into the next line.
 */
export function useRowPlayer(audioPath: string | null) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const segments = useRef<[number, number][]>([]);
  const segment = useRef(0);
  const frame = useRef(0);
  const [current, setCurrent] = useState<{ index: number; paused: boolean } | null>(null);

  const stop = useCallback(() => {
    cancelAnimationFrame(frame.current);
    audio.current?.pause();
    setCurrent(null);
  }, []);

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
    }
    frame.current = requestAnimationFrame(watch);
  }, [stop]);

  const toggle = useCallback(
    (index: number, rowSegments: [number, number][]) => {
      if (!audioPath) return;
      const el = audio.current ?? (audio.current = new Audio(inTauri() ? convertFileSrc(audioPath) : audioPath));
      if (current?.index === index) {
        if (current.paused) {
          void el.play().catch(() => stop());
          frame.current = requestAnimationFrame(watch);
          setCurrent({ index, paused: false });
        } else {
          cancelAnimationFrame(frame.current);
          el.pause();
          setCurrent({ index, paused: true });
        }
        return;
      }
      cancelAnimationFrame(frame.current);
      segments.current = rowSegments;
      segment.current = 0;
      el.currentTime = rowSegments[0][0] / 1000;
      void el.play().catch(() => stop());
      frame.current = requestAnimationFrame(watch);
      setCurrent({ index, paused: false });
    },
    [audioPath, current, stop, watch],
  );

  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      audio.current?.pause();
    },
    [],
  );

  return { current, toggle, stop };
}

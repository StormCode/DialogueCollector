import { useEffect, useRef, useState, type RefObject } from "react";

import { inTauri } from "../../lib/ipc";

/** Lower-case extension without the dot. */
export function extensionOf(path: string): string {
  const name = path.split(/[\\/]/).pop() ?? "";
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
}

/**
 * Files dropped from the OS onto `ref`'s element. The webview only reports drops window-wide
 * (with paths — HTML5 drops carry none), so the drop position decides which zone gets them.
 * Returns whether files are being dragged over the zone, for its hover state.
 */
export function useFileDrop(
  ref: RefObject<HTMLElement | null>,
  onDrop: (paths: string[]) => void,
  enabled = true,
): boolean {
  const [over, setOver] = useState(false);
  const handler = useRef(onDrop);
  handler.current = onDrop;

  useEffect(() => {
    if (!enabled || !inTauri()) return;
    let unlisten: (() => void) | undefined;
    let live = true;
    const inside = (x: number, y: number) => {
      const el = ref.current;
      if (!el) return false;
      const r = el.getBoundingClientRect();
      // Physical pixels → CSS pixels.
      const cx = x / window.devicePixelRatio;
      const cy = y / window.devicePixelRatio;
      return cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
    };
    void import("@tauri-apps/api/webview").then(({ getCurrentWebview }) =>
      getCurrentWebview()
        .onDragDropEvent((event) => {
          const p = event.payload;
          if (p.type === "leave") setOver(false);
          else if (p.type === "enter" || p.type === "over") setOver(inside(p.position.x, p.position.y));
          else if (p.type === "drop") {
            setOver(false);
            if (inside(p.position.x, p.position.y) && p.paths.length > 0) handler.current(p.paths);
          }
        })
        .then((fn) => {
          if (live) unlisten = fn;
          else fn();
        }),
    );
    return () => {
      live = false;
      unlisten?.();
    };
  }, [ref, enabled]);

  return over;
}

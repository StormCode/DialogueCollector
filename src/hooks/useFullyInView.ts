import { useEffect, useState, type RefObject } from "react";

/**
 * Whether `target` has once been wholly inside `root`'s visible area, its bottom edge included
 * (user 2026-10-04: the 台詞頁 toolbar rises in only then). Stays true once seen, so it reveals
 * once. Without IntersectionObserver (tests, very old engines) it counts as seen at once.
 */
export function useFullyInView(
  target: RefObject<HTMLElement | null>,
  root: RefObject<HTMLElement | null>,
  ready = true,
): boolean {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = target.current;
    if (seen || !ready || !el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.intersectionRatio >= 0.99)) setSeen(true);
      },
      { root: root.current, threshold: [0.99, 1] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, root, ready, seen]);
  return seen;
}

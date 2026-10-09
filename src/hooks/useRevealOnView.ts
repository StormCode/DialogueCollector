import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/**
 * Items rise in one after another, at least this far apart (together looked
 * unnatural), in page order. Scrolling brings cards into view a few ms apart, so each waits for
 * the one before it; one coming into view after a pause rises at once.
 */
export const STAGGER_MS = 250;

/** How an item shows: not yet (hidden), at once as the page opens, or rising in after a delay. */
export type Reveal = undefined | "instant" | number;

/**
 * Reveals items once each is wholly inside `root`'s visible area (the 台詞頁
 * toolbar and cards). `refFor(key)` goes on each item; `revealOf(key)` says how it shows. Items
 * already in view when the page opens just show, with no animation; items that
 * come into view later, by scrolling or as new ones mount, rise in, queued as above. Seen stays
 * seen, so an item reveals once. Without IntersectionObserver (tests, very old engines) every
 * item just shows.
 */
export function useRevealOnView<K>(root: RefObject<HTMLElement | null>, ready = true) {
  const [reveals, setReveals] = useState<Map<K, Reveal>>(new Map());
  const observer = useRef<IntersectionObserver | null>(null);
  /** The element each key is on now. */
  const elements = useRef(new Map<K, Element>());
  /** When the last item queued starts rising, on the `performance.now()` clock. */
  const lastStart = useRef(-Infinity);
  /** Items already given a reveal, so a second sighting changes nothing. */
  const settled = useRef(new Set<K>());

  // Worked out here, once per sighting, not in a state updater: React may call an updater twice
  // (StrictMode does in development), which pushed the first card back a step.
  const reveal = useCallback((atOpen: K[], later: K[]) => {
    const now = performance.now();
    const fresh = new Map<K, Reveal>();
    for (const key of atOpen) {
      if (settled.current.has(key)) continue;
      settled.current.add(key);
      fresh.set(key, "instant");
    }
    for (const key of later) {
      if (settled.current.has(key)) continue;
      settled.current.add(key);
      // A step after the last one to start, or at once if that was a step ago or more.
      const start = Math.max(now, lastStart.current + STAGGER_MS);
      lastStart.current = start;
      fresh.set(key, Math.round(start - now));
    }
    if (fresh.size) setReveals((prev) => new Map([...prev, ...fresh]));
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (typeof IntersectionObserver === "undefined") {
      reveal([...elements.current.keys()], []);
      return;
    }
    // What is on the page as it opens: its first report says whether each is already in view.
    const atOpen = new Set(elements.current.values());
    const keyOf = (el: Element) => [...elements.current].find(([, e]) => e === el)?.[0];
    const io = new IntersectionObserver(
      (entries) => {
        const inView: K[] = [];
        const later: K[] = [];
        const ordered = [...entries].sort((a, b) =>
          a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
        );
        for (const e of ordered) {
          const first = atOpen.delete(e.target);
          const key = keyOf(e.target);
          if (key === undefined || e.intersectionRatio < 0.99) continue;
          (first ? inView : later).push(key);
        }
        if (inView.length || later.length) reveal(inView, later);
      },
      { root: root.current, threshold: [0.99, 1] },
    );
    observer.current = io;
    for (const el of elements.current.values()) io.observe(el);
    return () => {
      io.disconnect();
      observer.current = null;
    };
  }, [root, ready, reveal]);

  const refFor = useCallback(
    (key: K) => (el: HTMLElement | null) => {
      const before = elements.current.get(key);
      if (before === el) return;
      if (before) {
        observer.current?.unobserve(before);
        elements.current.delete(key);
      }
      if (!el) return;
      elements.current.set(key, el);
      if (observer.current) observer.current.observe(el);
      else if (typeof IntersectionObserver === "undefined") reveal([key], []);
    },
    [reveal],
  );

  const revealOf = useCallback((key: K): Reveal => reveals.get(key), [reveals]);
  return { refFor, revealOf };
}

/** The class and style an item takes for its reveal. */
export function revealProps(reveal: Reveal): { className: string; style?: { animationDelay: string } } {
  if (reveal === undefined) return { className: "" };
  if (reveal === "instant") return { className: " is-revealed is-instant" };
  return { className: " is-revealed", style: reveal ? { animationDelay: `${reveal}ms` } : undefined };
}

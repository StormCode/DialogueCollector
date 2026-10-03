import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/**
 * Items rise in one after another, this far apart (user 2026-10-04: together looked unnatural),
 * in page order. Only items behind one still waiting are held: the first to come into view
 * rises at once (user: a delay on it reads as lag).
 */
export const STAGGER_MS = 250;

/**
 * Reveals items once each is wholly inside `root`'s visible area (user 2026-10-04: the 台詞頁
 * cards, like its toolbar). `refFor(key)` goes on each item; `delayOf(key)` is undefined until the
 * item has been seen, then how long it waits for its turn in the queue. Seen stays seen, so an
 * item reveals once. Without IntersectionObserver (tests, very old engines) every item is seen at
 * once.
 */
export function useRevealOnView<K>(root: RefObject<HTMLElement | null>, ready = true) {
  const [delays, setDelays] = useState<Map<K, number>>(new Map());
  const observer = useRef<IntersectionObserver | null>(null);
  /** The element each key is on now. */
  const elements = useRef(new Map<K, Element>());
  /** When the last item queued starts rising, on the `performance.now()` clock. */
  const lastStart = useRef(-Infinity);
  /** Items already scheduled, so a second sighting doesn't queue them again. */
  const scheduled = useRef(new Set<K>());

  // The queue is worked out here, once per sighting, not in the state updater: React may call
  // an updater twice (StrictMode does in development), which pushed the first card back a step.
  const reveal = useCallback((seen: K[]) => {
    const now = performance.now();
    const fresh = new Map<K, number>();
    for (const key of seen) {
      if (scheduled.current.has(key)) continue;
      scheduled.current.add(key);
      // Behind an item starting now or later, wait a step after it; otherwise go at once.
      const start = lastStart.current >= now ? lastStart.current + STAGGER_MS : now;
      lastStart.current = start;
      fresh.set(key, Math.round(start - now));
    }
    if (fresh.size) setDelays((prev) => new Map([...prev, ...fresh]));
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (typeof IntersectionObserver === "undefined") {
      reveal([...elements.current.keys()]);
      return;
    }
    const keyOf = (el: Element) => [...elements.current].find(([, e]) => e === el)?.[0];
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((e) => e.intersectionRatio >= 0.99)
          .map((e) => e.target)
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
          .map(keyOf)
          .filter((k): k is K => k !== undefined);
        if (seen.length) reveal(seen);
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
      else if (typeof IntersectionObserver === "undefined") reveal([key]);
    },
    [reveal],
  );

  const delayOf = useCallback((key: K) => delays.get(key), [delays]);
  return { refFor, delayOf };
}

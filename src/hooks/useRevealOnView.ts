import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/** Cards that come into view together rise in this far apart, in page order. */
const STAGGER_MS = 100;

/**
 * Reveals items once each is wholly inside `root`'s visible area (user 2026-10-04: the 台詞頁
 * cards, like its toolbar). `refFor(key)` goes on each item; `delayOf(key)` is undefined until the
 * item has been seen, then its stagger among the items seen with it. Seen stays seen, so an item
 * reveals once. Without IntersectionObserver (tests, very old engines) every item is seen at once.
 */
export function useRevealOnView<K>(root: RefObject<HTMLElement | null>, ready = true) {
  const [delays, setDelays] = useState<Map<K, number>>(new Map());
  const observer = useRef<IntersectionObserver | null>(null);
  /** The element each key is on now. */
  const elements = useRef(new Map<K, Element>());

  const reveal = useCallback((seen: K[]) => {
    setDelays((prev) => {
      const next = new Map(prev);
      let i = 0;
      for (const key of seen) if (!next.has(key)) next.set(key, i++ * STAGGER_MS);
      return i === 0 ? prev : next;
    });
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

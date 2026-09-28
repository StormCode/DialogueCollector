import { useEffect, type RefObject } from "react";

export const SCROLLBAR_VISIBLE_CLASS = "is-scrollbar-visible";

/**
 * Shows a `.st-scroll` container's scrollbar while it scrolls or the pointer moves over it,
 * and hides it `hideAfterMs` after the last of either (the fade itself is CSS). Listeners go
 * straight on the element so the container's own `onScroll` handler stays untouched.
 */
export function useRevealScrollbar(ref: RefObject<HTMLElement | null>, hideAfterMs = 1000) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: number | undefined;
    const reveal = () => {
      el.classList.add(SCROLLBAR_VISIBLE_CLASS);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => el.classList.remove(SCROLLBAR_VISIBLE_CLASS), hideAfterMs);
    };
    el.addEventListener("scroll", reveal, { passive: true });
    el.addEventListener("mousemove", reveal);
    return () => {
      window.clearTimeout(timer);
      el.removeEventListener("scroll", reveal);
      el.removeEventListener("mousemove", reveal);
    };
  }, [ref, hideAfterMs]);
}

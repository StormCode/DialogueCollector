import { useEffect, useState } from "react";

import { BUSY_CARD_DELAY_MS } from "../lib/timing";

/**
 * Whether a busy card may show: only once the page has been busy for `BUSY_CARD_DELAY_MS`.
 * The delay times a whole run of busy steps, not each one: once a card is up, the next busy
 * step (切割影片中 → 匯入中) shows at once instead of blanking for another delay.
 */
export function useBusyReveal(busy: boolean): boolean {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (!busy) {
      setRevealed(false);
      return;
    }
    const timer = window.setTimeout(() => setRevealed(true), BUSY_CARD_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [busy]);
  return busy && revealed;
}

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { BUSY_CARD_DELAY_MS } from "../lib/timing";
import { useBusyReveal } from "./useBusyReveal";

describe("useBusyReveal", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("shows a busy card only once the work has run past the delay", () => {
    const { result, rerender } = renderHook(({ busy }) => useBusyReveal(busy), { initialProps: { busy: true } });
    act(() => vi.advanceTimersByTime(BUSY_CARD_DELAY_MS - 1));
    expect(result.current, "quick work never shows a card").toBe(false);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe(true);

    // 切割影片中 → 匯入中 is still busy: the card stays up.
    rerender({ busy: true });
    expect(result.current).toBe(true);

    rerender({ busy: false });
    expect(result.current).toBe(false);
    rerender({ busy: true });
    expect(result.current, "a new run waits again").toBe(false);
  });

  it("work that ends before the delay leaves nothing behind", () => {
    const { result, rerender } = renderHook(({ busy }) => useBusyReveal(busy), { initialProps: { busy: true } });
    act(() => vi.advanceTimersByTime(BUSY_CARD_DELAY_MS / 2));
    rerender({ busy: false });
    act(() => vi.advanceTimersByTime(BUSY_CARD_DELAY_MS));
    expect(result.current).toBe(false);
  });
});

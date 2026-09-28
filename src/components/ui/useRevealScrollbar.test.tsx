import { fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SCROLLBAR_VISIBLE_CLASS, useRevealScrollbar } from "./useRevealScrollbar";

function Scroller() {
  const ref = useRef<HTMLDivElement>(null);
  useRevealScrollbar(ref);
  return <div data-testid="scroller" ref={ref} />;
}

describe("useRevealScrollbar", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("shows the scrollbar on scroll and hides it a second later", () => {
    render(<Scroller />);
    const el = screen.getByTestId("scroller");
    expect(el).not.toHaveClass(SCROLLBAR_VISIBLE_CLASS);

    fireEvent.scroll(el);
    expect(el).toHaveClass(SCROLLBAR_VISIBLE_CLASS);
    vi.advanceTimersByTime(999);
    expect(el).toHaveClass(SCROLLBAR_VISIBLE_CLASS);
    vi.advanceTimersByTime(1);
    expect(el).not.toHaveClass(SCROLLBAR_VISIBLE_CLASS);
  });

  it("shows it while the pointer moves, restarting the second each time", () => {
    render(<Scroller />);
    const el = screen.getByTestId("scroller");

    fireEvent.mouseMove(el);
    vi.advanceTimersByTime(800);
    fireEvent.mouseMove(el);
    vi.advanceTimersByTime(800);
    expect(el).toHaveClass(SCROLLBAR_VISIBLE_CLASS);
    vi.advanceTimersByTime(200);
    expect(el).not.toHaveClass(SCROLLBAR_VISIBLE_CLASS);
  });
});

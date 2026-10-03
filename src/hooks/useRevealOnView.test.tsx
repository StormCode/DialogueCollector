import { act, render } from "@testing-library/react";
import { StrictMode, useRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { STAGGER_MS, useRevealOnView } from "./useRevealOnView";

type Entry = { target: Element; intersectionRatio: number };

function List({ ids }: { ids: number[] }) {
  const root = useRef<HTMLDivElement>(null);
  const { refFor, revealOf } = useRevealOnView<number>(root);
  return (
    <div ref={root}>
      {ids.map((id) => (
        <div key={id} ref={refFor(id)} data-id={id} data-reveal={revealOf(id) ?? "hidden"} />
      ))}
    </div>
  );
}

const reveals = (c: HTMLElement) => [...c.querySelectorAll("[data-id]")].map((el) => el.getAttribute("data-reveal"));

/** A fake IntersectionObserver; `report` plays the browser's callback. */
function fakeObserver() {
  const io = { report: (_: Entry[]) => {} };
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: (entries: Entry[]) => void) {
        io.report = cb;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  return io;
}

describe("useRevealOnView", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("just shows what is wholly in view as the page opens", () => {
    const io = fakeObserver();
    const { container } = render(<List ids={[1, 2, 3]} />);
    const el = (id: number) => container.querySelector(`[data-id="${id}"]`)!;
    expect(reveals(container)).toEqual(["hidden", "hidden", "hidden"]);
    // The first report: two wholly in view, the third cut off by the bottom edge.
    act(() =>
      io.report([
        { target: el(1), intersectionRatio: 1 },
        { target: el(2), intersectionRatio: 1 },
        { target: el(3), intersectionRatio: 0.4 },
      ]),
    );
    expect(reveals(container)).toEqual(["instant", "instant", "hidden"]);
    // Scrolled to: it rises in, at once since none has risen before it.
    act(() => io.report([{ target: el(3), intersectionRatio: 1 }]));
    expect(reveals(container)).toEqual(["instant", "instant", "0"]);
  });

  it("rises later items in one by one, each at least a step after the one before", () => {
    let now = 0;
    vi.spyOn(performance, "now").mockImplementation(() => now);
    const io = fakeObserver();
    const { container } = render(<List ids={[1, 2, 3, 4, 5]} />);
    const el = (id: number) => container.querySelector(`[data-id="${id}"]`)!;
    // As the page opens, all are below the fold.
    act(() => io.report([1, 2, 3, 4, 5].map((id) => ({ target: el(id), intersectionRatio: 0 }))));

    // Two come into view together (reported out of order): page order, one step apart.
    act(() =>
      io.report([
        { target: el(2), intersectionRatio: 1 },
        { target: el(1), intersectionRatio: 1 },
      ]),
    );
    expect(reveals(container).slice(0, 2)).toEqual(["0", String(STAGGER_MS)]);

    // 100 ms later, while the second still waits: the next ones queue behind it.
    now = 100;
    act(() => io.report([{ target: el(3), intersectionRatio: 1 }, { target: el(4), intersectionRatio: 1 }]));
    expect(reveals(container).slice(2, 4)).toEqual([String(2 * STAGGER_MS - 100), String(3 * STAGGER_MS - 100)]);

    // Scrolled on just after the last one started: it still keeps a step behind it.
    now = 3 * STAGGER_MS + 50;
    act(() => io.report([{ target: el(5), intersectionRatio: 1 }]));
    expect(reveals(container)[4]).toBe(String(STAGGER_MS - 50));
  });

  it("queues correctly under StrictMode, which runs updaters twice", () => {
    vi.spyOn(performance, "now").mockReturnValue(5_000);
    const io = fakeObserver();
    const { container } = render(
      <StrictMode>
        <List ids={[1, 2]} />
      </StrictMode>,
    );
    const el = (id: number) => container.querySelector(`[data-id="${id}"]`)!;
    act(() => io.report([1, 2].map((id) => ({ target: el(id), intersectionRatio: 0 }))));
    // Two sightings in one task: the second update waits for render, where StrictMode runs its
    // updater twice.
    act(() => {
      io.report([{ target: el(1), intersectionRatio: 1 }]);
      io.report([{ target: el(2), intersectionRatio: 1 }]);
    });
    expect(reveals(container)).toEqual(["0", String(STAGGER_MS)]);
  });

  it("just shows everything where IntersectionObserver is missing", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { container } = render(<List ids={[1, 2]} />);
    expect(reveals(container)).toEqual(["instant", "instant"]);
  });
});

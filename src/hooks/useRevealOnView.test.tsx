import { act, render } from "@testing-library/react";
import { StrictMode, useRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { STAGGER_MS, useRevealOnView } from "./useRevealOnView";

type Entry = { target: Element; intersectionRatio: number };

function List({ ids }: { ids: number[] }) {
  const root = useRef<HTMLDivElement>(null);
  const { refFor, delayOf } = useRevealOnView<number>(root);
  return (
    <div ref={root}>
      {ids.map((id) => (
        <div key={id} ref={refFor(id)} data-id={id} data-delay={delayOf(id) ?? "hidden"} />
      ))}
    </div>
  );
}

const delays = (c: HTMLElement) => [...c.querySelectorAll("[data-id]")].map((el) => el.getAttribute("data-delay"));

describe("useRevealOnView", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("reveals items one by one as each comes wholly into view, queueing those that come later", () => {
    let now = 0;
    vi.spyOn(performance, "now").mockImplementation(() => now);
    let report: (entries: Entry[]) => void = () => {};
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: (entries: Entry[]) => void) {
          report = cb;
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    const { container } = render(<List ids={[1, 2, 3, 4, 5]} />);
    const el = (id: number) => container.querySelector(`[data-id="${id}"]`)!;
    expect(delays(container)).toEqual(["hidden", "hidden", "hidden", "hidden", "hidden"]);

    // The first two come into view together (reported out of order); the third only partly.
    act(() =>
      report([
        { target: el(2), intersectionRatio: 1 },
        { target: el(1), intersectionRatio: 1 },
        { target: el(3), intersectionRatio: 0.4 },
      ]),
    );
    expect(delays(container)).toEqual(["0", String(STAGGER_MS), "hidden", "hidden", "hidden"]);

    // Scrolled on 100 ms later, while the second still waits: the next ones queue behind it.
    now = 100;
    act(() => report([{ target: el(3), intersectionRatio: 1 }, { target: el(4), intersectionRatio: 1 }]));
    expect(delays(container).slice(2, 4)).toEqual([String(2 * STAGGER_MS - 100), String(3 * STAGGER_MS - 100)]);

    // Once every queued item has started, the next one rises at once, even right after.
    now = 100 + 3 * STAGGER_MS - 100 + 1;
    act(() => report([{ target: el(5), intersectionRatio: 1 }]));
    expect(delays(container)[4]).toBe("0");
  });

  it("starts the first item at once under StrictMode, which runs updaters twice", () => {
    let report: (entries: Entry[]) => void = () => {};
    vi.spyOn(performance, "now").mockReturnValue(5_000);
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: (entries: Entry[]) => void) {
          report = cb;
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    const { container } = render(
      <StrictMode>
        <List ids={[1, 2]} />
      </StrictMode>,
    );
    const el = (id: number) => container.querySelector(`[data-id="${id}"]`)!;
    // Two sightings in one task (as when the toolbar and the cards come into view together): the
    // second update waits for render, where StrictMode runs its updater twice.
    act(() => {
      report([{ target: el(1), intersectionRatio: 1 }]);
      report([{ target: el(2), intersectionRatio: 1 }]);
    });
    expect(delays(container)).toEqual(["0", String(STAGGER_MS)]);
  });

  it("shows everything where IntersectionObserver is missing", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { container } = render(<List ids={[1, 2]} />);
    expect(delays(container).every((d) => d !== "hidden")).toBe(true);
  });
});

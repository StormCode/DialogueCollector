import { act, render } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useRevealOnView } from "./useRevealOnView";

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
  afterEach(() => vi.unstubAllGlobals());

  it("reveals items as each comes wholly into view, staggering those that come together", () => {
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
    const { container } = render(<List ids={[1, 2, 3, 4]} />);
    const el = (id: number) => container.querySelector(`[data-id="${id}"]`)!;
    expect(delays(container)).toEqual(["hidden", "hidden", "hidden", "hidden"]);

    // The first two come into view together (reported out of order); the third only partly.
    act(() =>
      report([
        { target: el(2), intersectionRatio: 1 },
        { target: el(1), intersectionRatio: 1 },
        { target: el(3), intersectionRatio: 0.4 },
      ]),
    );
    expect(delays(container)).toEqual(["0", "100", "hidden", "hidden"]);

    // Scrolled on: the next ones start their own stagger from zero.
    act(() => report([{ target: el(3), intersectionRatio: 1 }, { target: el(4), intersectionRatio: 1 }]));
    expect(delays(container)).toEqual(["0", "100", "0", "100"]);
  });

  it("shows everything where IntersectionObserver is missing", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { container } = render(<List ids={[1, 2]} />);
    expect(delays(container).every((d) => d !== "hidden")).toBe(true);
  });
});

import { act, render } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useFullyInView } from "./useFullyInView";

type Callback = (entries: { intersectionRatio: number }[]) => void;

function Probe({ onSeen }: { onSeen: (seen: boolean) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const target = useRef<HTMLDivElement>(null);
  onSeen(useFullyInView(target, root));
  return (
    <div ref={root}>
      <div ref={target} />
    </div>
  );
}

describe("useFullyInView", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("turns true only once the target is wholly visible, and stays so", () => {
    let report: Callback = () => {};
    const disconnect = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: Callback) {
          report = cb;
        }
        observe() {}
        disconnect = disconnect;
      },
    );
    const seen: boolean[] = [];
    render(<Probe onSeen={(s) => seen.push(s)} />);
    act(() => report([{ intersectionRatio: 0.5 }]));
    expect(seen[seen.length - 1], "half in view").toBe(false);
    act(() => report([{ intersectionRatio: 1 }]));
    expect(seen[seen.length - 1]).toBe(true);
    expect(disconnect).toHaveBeenCalled();
  });

  it("counts as seen where IntersectionObserver is missing", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const seen: boolean[] = [];
    render(<Probe onSeen={(s) => seen.push(s)} />);
    expect(seen[seen.length - 1]).toBe(true);
  });
});

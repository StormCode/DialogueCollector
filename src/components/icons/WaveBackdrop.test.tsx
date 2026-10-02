import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BOARD_ART } from "./iconData";
import { WaveBackdrop } from "./WaveBackdrop";
import { BOARD_CURVE, WAVE_AMPLITUDE, WAVE_CENTER, WAVE_LENGTH, wavePath, waveX } from "./waveFrames";

/** The edge's points at whole steps down the page, as drawn. */
const edge = (d: string) =>
  new Map<number, number>(
    [...d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)]
      .map((m): [number, number] => [Number(m[2]), Number(m[1])])
      .filter(([y]) => y % 20 === 0 && y <= 800),
  );

describe("WaveBackdrop", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("stays within the boards' curve, cresting where it bulges", () => {
    expect(BOARD_ART.backdrop.body).toContain(`d="${BOARD_CURVE}"`);
    const start = edge(wavePath(0));
    expect(waveX(250, 0)).toBeCloseTo(WAVE_CENTER + WAVE_AMPLITUDE);
    // It never leaves the span the board's curve covers.
    for (const x of start.values()) {
      expect(x).toBeGreaterThanOrEqual(1000);
      expect(x).toBeLessThanOrEqual(1100);
    }
  });

  it("turns its bulge into a dip half a turn later, and returns after a full turn", () => {
    expect(waveX(250, 0)).toBeGreaterThan(WAVE_CENTER);
    expect(waveX(250, Math.PI)).toBeLessThan(WAVE_CENTER);
    expect(wavePath(0.7 + 2 * Math.PI)).toBe(wavePath(0.7));
    expect(wavePath(0).endsWith("L 1284,804 L 1284,-4 Z")).toBe(true);
  });

  it("climbs as the phase grows", () => {
    // One step's worth of phase moves the whole edge up one step (20 units).
    const now = edge(wavePath(1));
    const later = edge(wavePath(1 + (2 * Math.PI * 20) / WAVE_LENGTH));
    for (const y of [200, 400, 600]) expect(later.get(y - 20)).toBeCloseTo(now.get(y)!, 0);
  });

  it("stays on the boards' curve with reduced motion", () => {
    vi.stubGlobal("matchMedia", (q: string) => ({
      matches: q.includes("reduce"),
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    const { container } = render(<WaveBackdrop />);
    expect(container.querySelector("path")).toHaveAttribute("d", BOARD_CURVE);
  });
});

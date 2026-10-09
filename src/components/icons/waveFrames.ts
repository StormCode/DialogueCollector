/**
 * WaveBackdrop's geometry. The curve on the page is a stretch of an endless sine curve that keeps
 * moving, so the whole line writhes: wherever it bulges now it will dip later, and the other way
 * round. The wave is short, so more than one shows and the climb reads clearly, and low, so the edge stays nearly straight. The
 * boards draw it at phase 0, so the still curve and the animation's start agree. One full turn
 * of `phase` brings it back exactly.
 */

/**
 * The curve behind every page as the boards draw it (`backdrop` in iconData, from Main.dc.html):
 * this wave at phase 0, a cubic between each crest, trough and crossing.
 */
export const BOARD_CURVE =
  "M 1032,0 C 1032,50 1021.5,100 1010,150 C 998.5,200 988,250 988,300 C 988,350 998.5,400 1010,450 C 1021.5,500 1032,550 1032,600 C 1032,650 1021.5,700 1010,750 C 1006.2,766.7 1002.3,783.3 999,800 L 1284,804 L 1284,-4 Z";

/** The edge's middle line, in the board's 1280×800 units. */
export const WAVE_CENTER = 1010;
/** How far the edge swings either way. */
export const WAVE_AMPLITUDE = 22;
/** Crest to crest: more than one wave shows, so it visibly climbs. */
export const WAVE_LENGTH = 600;
/** The crest's height at phase 0. */
export const WAVE_CREST_Y = 600;

/** Height between the points the edge is drawn through. */
const STEP = 20;

/** The edge's x at height `y` and `phase` (radians); growing phase moves the wave up. */
export function waveX(y: number, phase: number): number {
  const angle = (2 * Math.PI * (y - WAVE_CREST_Y)) / WAVE_LENGTH + Math.PI / 2 + phase;
  return WAVE_CENTER + WAVE_AMPLITUDE * Math.sin(angle);
}

type Point = [number, number];

/**
 * The backdrop at `phase`: the edge drawn as one smooth curve through its points (Catmull-Rom
 * as cubics), then closed along the right side as the board does.
 */
export function wavePath(phase: number): string {
  const points: Point[] = [];
  for (let y = -STEP; y <= 800 + STEP; y += STEP) points.push([waveX(y, phase), y]);
  const r = (n: number) => Math.round(n * 10) / 10;
  // The first and last points lie beyond the page, only to shape the ends.
  let d = `M ${r(points[1][0])},0`;
  for (let i = 1; i < points.length - 2; i++) {
    const [p0, p1, p2, p3] = [points[i - 1], points[i], points[i + 1], points[i + 2]];
    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${r(c1[0])},${r(c1[1])} ${r(c2[0])},${r(c2[1])} ${r(p2[0])},${r(p2[1])}`;
  }
  return `${d} L 1284,804 L 1284,-4 Z`;
}

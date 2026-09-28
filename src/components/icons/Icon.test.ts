import { describe, expect, it } from "vitest";

import { MATERIAL_ICONS } from "./iconData";

// Every icon must be the exact one its board uses, so icons are drawn only from iconData.ts
// (generated from the Bento bundle and the official Material Symbols SVGs). A hand-drawn
// <svg>/<path> anywhere else is how a look-alike slips in.
const sources = import.meta.glob(["../../**/*.tsx", "!../../**/*.test.tsx", "!./**"], {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

describe("icons", () => {
  it("are never hand-drawn outside components/icons", () => {
    const offenders = Object.entries(sources)
      .filter(([, code]) => /<svg[\s>]|<path[\s>]/.test(code))
      .map(([path]) => path);
    expect(Object.keys(sources).length).toBeGreaterThan(10);
    expect(offenders).toEqual([]);
  });

  it("carry the boards' Material weight (wght 200 glyphs in the 960 grid)", () => {
    // book_2 matches the wght 200 file in the project's asset folder.
    expect(MATERIAL_ICONS.book_2.startsWith("M304.62-120q-43.39 0-74-30.62")).toBe(true);
  });
});

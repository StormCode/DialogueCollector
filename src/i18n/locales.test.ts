import { describe, expect, it } from "vitest";

import { resources } from "./index";

function keys(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [prefix];
  return Object.entries(obj).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
}

// T15: a key missing from any locale fails the build.
describe("locales", () => {
  const reference = keys(resources["zh-Hant"].translation).sort();

  for (const [locale, { translation }] of Object.entries(resources)) {
    it(`${locale} has exactly the zh-Hant key set`, () => {
      expect(keys(translation).sort()).toEqual(reference);
    });
  }
});

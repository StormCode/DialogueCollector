import { describe, expect, it } from "vitest";

import { resources } from "./index";

function keys(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [prefix];
  return Object.entries(obj).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
}

// Plural variants (`key_one`, `key_other`, …) exist only in languages that need them; the
// bare key is the fallback every language carries.
const PLURAL = /_(zero|one|two|few|many|other)$/;

// T15: a key missing from any locale fails the build.
describe("locales", () => {
  const reference = keys(resources["zh-Hant"].translation).sort();

  for (const [locale, { translation }] of Object.entries(resources)) {
    it(`${locale} has exactly the zh-Hant key set`, () => {
      const all = keys(translation);
      expect(all.filter((k) => !PLURAL.test(k)).sort()).toEqual(reference);
      // A plural variant must sit beside its fallback key.
      for (const k of all.filter((k) => PLURAL.test(k))) {
        expect(all, `${k} has no fallback`).toContain(k.replace(PLURAL, ""));
      }
    });
  }
});

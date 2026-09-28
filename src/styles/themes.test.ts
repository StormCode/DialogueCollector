// T16: WCAG contrast of every product theme, read straight from the CSS so a colour change
// can't slip past. Themes below AA are recorded as known (DD4 defers the fix); the test fails
// if one of them starts passing (update the list) or another starts failing.
import { describe, expect, it } from "vitest";

import tokens from "../../design/bento/tokens.css?raw";
import { THEMES } from "../lib/types";
import themes from "./themes.css?raw";

// Known below 4.5:1 for white text on the primary button (DD4, deferred).
const KNOWN_AA_FAILURES = new Set(["lightBlue", "emerald", "sunset"]);
// Known below 3:1 for --dc-accent-60 text on --dc-accent-5 (emerald measures 2.98).
const KNOWN_SOFT_FAILURES = new Set(["emerald"]);

function token(name: string): string {
  const match = tokens.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`token --${name} not found`);
  return match[1];
}

function themeBlock(theme: string): string {
  const block = themes.match(new RegExp(`\\[data-theme="${theme}"\\]\\s*\\{([^}]*)\\}`));
  if (!block) throw new Error(`theme ${theme} not found`);
  return block[1];
}

/** A variable set in the theme's block, as a token reference or (夜光黑) a literal. */
function themeValue(theme: string, name: string): string | null {
  const m = themeBlock(theme).match(new RegExp(`--${name}:\\s*(?:var\\(--([\\w-]+)\\)|(#[0-9a-fA-F]{6}))`));
  if (!m) return null;
  return m[1] ? token(m[1]) : m[2];
}

function rampStep(theme: string, step: number): string {
  const value = themeValue(theme, `dc-ramp-${step}`);
  if (!value) throw new Error(`${theme} has no step ${step}`);
  return value;
}

/** Primary button text: white unless the theme overrides it (夜光黑 is dark-on-light). */
function buttonText(theme: string): string {
  return themeValue(theme, "bento-action-solid-primary-fg") ?? "#ffffff";
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe("theme contrast (T16)", () => {
  it.each(THEMES)("%s: text on the primary button", (theme) => {
    const ratio = contrast(buttonText(theme), rampStep(theme, 50));
    if (KNOWN_AA_FAILURES.has(theme)) {
      expect(ratio, `${theme} now passes AA; drop it from KNOWN_AA_FAILURES`).toBeLessThan(4.5);
    } else {
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    }
  });

  it.each(THEMES)("%s: hover text on the soft fill stays legible", (theme) => {
    // --dc-accent-60 on --dc-accent-5 carries the active nav item and TOC labels.
    const ratio = contrast(rampStep(theme, 60), rampStep(theme, 5));
    if (KNOWN_SOFT_FAILURES.has(theme)) {
      expect(ratio, `${theme} now passes; drop it from KNOWN_SOFT_FAILURES`).toBeLessThan(3);
    } else {
      expect(ratio).toBeGreaterThanOrEqual(3);
    }
  });
});

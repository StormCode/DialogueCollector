// @vitest-environment node
/// <reference types="node" />
// Comments, docs and test names say what the code does and why in plain words. They never cite
// the local planning document, its review codes (T1, ENG3, D10 → A …) or dated decision notes
// ("user 2026-10-02"): none of those mean anything to a reader of this repository.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const SELF = "src/test/noPlanningNotes.test.ts";

/** Tracked files that are someone else's text, or name the planning files on purpose. */
const SKIP = [
  /^\.gitignore$/,
  /(^|\/)package-lock\.json$/,
  /\.lock$/,
  /^design\/(bento|boards)\//,
  /\.(png|jpe?g|gif|ico|icns|woff2?|ttf|otf|m4a|mp3|wav|mkv|mp4|zip)$/i,
];

const RULES: [string, RegExp][] = [
  ["names the planning document", /PLAN(?:\.en)?\.md/],
  ["cites a planning code", /\b(?:T|ENG|ET|FC|DT|DD|DX|UX)\d{1,2}\b/],
  ["cites a review decision", /\b[A-Z]{1,3}\d{1,2}(?:-REV)?\s*→\s*[A-Z]\b|\b[A-Z]{1,3}\d{1,2}-REV\b/],
  // Prose only: "… (B11)". A call such as `v1_then(V2)` has no space before its parenthesis.
  ["cites a code in parentheses", /(?:^|\s)\(\s*[A-Z]{1,3}\d{1,2}(?:\s*[,/+]\s*[A-Z]{1,3}\d{1,2})*\s*\)/],
  ["dates a decision", /\b(?:user|decided|decisions?)\b.{0,15}\d{4}-\d{2}-\d{2}|\(\s*\d{4}-\d{2}-\d{2}\s*\)/i],
];

function trackedTextFiles() {
  const out = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" });
  return out
    .split("\0")
    .filter((f) => f && f !== SELF && !SKIP.some((re) => re.test(f)));
}

describe("planning notes stay out of the repository", () => {
  it("finds no planning document, planning code or dated decision in tracked files", () => {
    const hits: string[] = [];
    for (const file of trackedTextFiles()) {
      let text: string;
      try {
        text = readFileSync(file, "utf8");
      } catch {
        continue; // deleted in the working tree
      }
      if (text.includes("\0")) continue; // binary
      text.split("\n").forEach((line, i) => {
        for (const [what, re] of RULES) {
          const m = line.match(re);
          if (m) hits.push(`${file}:${i + 1} ${what}: ${m[0]}`);
        }
      });
    }
    expect(hits).toEqual([]);
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

import { ipc } from "../lib/ipc";
import type { Cue, JobOutcome } from "../lib/types";
import { useSubtitleImportStore } from "./subtitleImportStore";

vi.mock("@tauri-apps/api/event", () => ({ listen: vi.fn(async () => () => {}) }));

const cue = (index: number): Cue => ({ index, startMs: index * 1000, endMs: index * 1000 + 500, text: `line ${index}`, translation: null });

describe("Step 2 assignment (T8)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useSubtitleImportStore.getState().reset();
    useSubtitleImportStore.setState({ subtitlePath: "/s.ass", cues: [0, 1, 2, 3].map(cue), screen: "select" });
  });

  it("assigns in several passes, overwrites on reassign, and sends only assigned lines", async () => {
    const s = () => useSubtitleImportStore.getState();
    s().toggle(0);
    s().toggle(1);
    s().assignSelected(1);
    expect(s().selected.size).toBe(0);

    s().toggle(2);
    s().assignSelected(2); // a second pass leaves the first alone
    expect(s().assigned).toEqual({ 0: 1, 1: 1, 2: 2 });

    s().toggle(0);
    s().assignSelected(2); // reassigning overwrites
    s().assignOne(1, null); // 未指派 removes it
    expect(s().assigned).toEqual({ 0: 2, 2: 2 });

    s().assignOne(1, 1);
    const outcome = { runId: 1, imported: 3, failures: [], status: "complete", lost: [], changedSources: [] } as JobOutcome;
    const start = vi.spyOn(ipc, "startSubtitleImport").mockResolvedValue(outcome);
    await s().startImport("/v.mkv");

    const sent = start.mock.calls[0][2];
    expect(sent.map((a) => [a.cue.index, a.characterId])).toEqual([
      [0, 2],
      [1, 1],
      [2, 2],
    ]);
    expect(new Set(sent.map((a) => a.characterId)).size).toBe(2);
    expect(s().screen).toBe("complete");
  });
});

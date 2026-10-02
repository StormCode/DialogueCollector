import { beforeEach, describe, expect, it, vi } from "vitest";

import { ipc } from "../lib/ipc";
import { rowsFrom } from "../lib/lineEdits";
import type { Cue, JobOutcome } from "../lib/types";
import { useSubtitleImportStore } from "./subtitleImportStore";

vi.mock("@tauri-apps/api/event", () => ({ listen: vi.fn(async () => () => {}) }));

const cue = (index: number, translation: string | null = null): Cue => ({
  index,
  startMs: index * 1000,
  endMs: index * 1000 + 500,
  text: `line ${index}`,
  translation,
});
const outcome = { runId: 1, imported: 3, failures: [], status: "complete", lost: [], changedSources: [] } as JobOutcome;
const s = () => useSubtitleImportStore.getState();

describe("選擇台詞 (T8, T28)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    s().reset();
    useSubtitleImportStore.setState({
      subtitlePath: "/s.ass",
      videoPath: "/v.mkv",
      rows: rowsFrom([0, 1, 2, 3].map((i) => cue(i))),
      screen: "select",
    });
  });

  it("assigns in several passes, overwrites on reassign, and sends only assigned lines", async () => {
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
    const start = vi.spyOn(ipc, "startSubtitleImport").mockResolvedValue(outcome);
    await s().startImport();

    expect(start.mock.calls[0][0]).toBe("/s.ass");
    expect(start.mock.calls[0][1]).toBe("/v.mkv");
    const sent = start.mock.calls[0][2];
    expect(sent.map((a) => [a.cue.index, a.characterId])).toEqual([
      [0, 2],
      [1, 1],
      [2, 2],
    ]);
    expect(sent.every((a) => a.segments === undefined)).toBe(true);
    expect(s().screen).toBe("complete");
  });

  it("merges checked rows with the first assigned character, sends their segments, and splits back", async () => {
    s().assignOne(2, 7);
    s().toggle(0);
    s().toggle(2);
    expect(s().canMerge()).toBe(true);
    s().merge();
    const merged = s().rows[0];
    expect(s().rows.map((r) => r.index)).toEqual([merged.index, 1, 3]);
    expect(s().assigned).toEqual({ [merged.index]: 7 });
    expect(s().selected.size, "the checks clear").toBe(0);
    s().toggle(merged.index);
    expect(s().canSplit()).toBe(true);
    s().toggle(merged.index);

    const start = vi.spyOn(ipc, "startSubtitleImport").mockResolvedValue(outcome);
    await s().startImport();
    expect(start.mock.calls[0][2]).toEqual([
      {
        cue: { index: merged.index, startMs: 0, endMs: 2500, text: "line 0, line 2", translation: null },
        characterId: 7,
        segments: [
          [0, 500],
          [2000, 2500],
        ],
        gapMs: 500,
      },
    ]);

    s().setGap(merged.index, 12_000);
    expect(s().rows[0].gapMs, "clamped to 10 s").toBe(10_000);
    s().setGap(merged.index, 1200);
    s().setGap(1, 800);
    expect(s().rows[1].gapMs, "an ordinary row has no gap").toBeNull();

    useSubtitleImportStore.setState({ screen: "select", selected: new Set([merged.index]) });
    s().split();
    expect(s().rows.map((r) => r.index)).toEqual([0, 2, 1, 3]);
    expect(s().assigned, "the parts take the merged row's character").toEqual({ 0: 7, 2: 7 });
    expect(s().selected.size).toBe(0);
  });

  it("merges a second set of checked rows on its own, not into the first merge", () => {
    useSubtitleImportStore.setState({ rows: rowsFrom([0, 1, 2, 3, 4, 5].map((i) => cue(i))) });
    s().toggle(0);
    s().toggle(1);
    s().merge();
    s().toggle(3);
    s().toggle(5);
    s().merge();
    expect(s().rows.map((r) => r.text)).toEqual(["line 0, line 1", "line 2", "line 3, line 5", "line 4"]);
  });

  it("swaps the whole subtitle only when it is bilingual", () => {
    s().swap();
    expect(s().rows[0].text, "not bilingual: nothing happens").toBe("line 0");
    useSubtitleImportStore.setState({ rows: rowsFrom([cue(0, "第零句"), cue(1)]), bilingual: true });
    s().swap();
    expect(s().rows.map((r) => [r.text, r.translation])).toEqual([
      ["第零句", "line 0"],
      ["line 1", null],
    ]);
  });
});

describe("opening the subtitle path (T27)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    s().reset();
  });

  it("a subtitle file: reads it, extracts the audio, then 選擇台詞", async () => {
    vi.spyOn(ipc, "parseSubtitle").mockResolvedValue([cue(0, "零")]);
    const prepare = vi.spyOn(ipc, "preparePreview").mockResolvedValue("/cache/v.m4a");
    await s().open("/v.mkv", "/s.ass");
    expect(prepare).toHaveBeenCalledWith("/v.mkv");
    expect(s()).toMatchObject({ screen: "select", flow: "file", audioPath: "/cache/v.m4a", bilingual: true });
  });

  it("a video alone: extracts the audio, lists the tracks, and reads the chosen one", async () => {
    vi.spyOn(ipc, "preparePreview").mockResolvedValue("/cache/v.m4a");
    const track = { index: 3, codec: "ass", language: "jpn", title: null };
    vi.spyOn(ipc, "listSubtitleTracks").mockResolvedValue([track]);
    const extract = vi.spyOn(ipc, "extractSubtitleTrack").mockResolvedValue({ path: "/cache/t3.ass", cues: [cue(0)] });
    await s().open("/v.mkv", null);
    expect(s()).toMatchObject({ screen: "tracks", flow: "embedded" });
    await s().pickTrack(track);
    expect(extract).toHaveBeenCalledWith("/v.mkv", 3, "ass");
    expect(s()).toMatchObject({ screen: "select", subtitlePath: "/cache/t3.ass" });
    expect(s().backFromSelect()).toBe(true);
    expect(s().screen).toBe("tracks");
  });

  it("a video without text subtitles is 字幕讀取失敗", async () => {
    vi.spyOn(ipc, "preparePreview").mockResolvedValue("/cache/v.m4a");
    vi.spyOn(ipc, "listSubtitleTracks").mockResolvedValue([]);
    await s().open("/v.mkv", null);
    expect(s().screen).toBe("readFailed");
  });

  it("取消 during 抽取音訊 goes back without moving on", async () => {
    let finish: (p: string) => void = () => {};
    vi.spyOn(ipc, "preparePreview").mockReturnValue(new Promise((r) => (finish = r)));
    const list = vi.spyOn(ipc, "listSubtitleTracks").mockResolvedValue([]);
    const cancel = vi.spyOn(ipc, "cancelPrepare").mockResolvedValue();
    const opening = s().open("/v.mkv", null);
    await s().abort();
    expect(cancel).toHaveBeenCalled();
    finish("/cache/v.m4a");
    await opening;
    expect(s().screen).toBe("aborted");
    expect(list).not.toHaveBeenCalled();
  });
});

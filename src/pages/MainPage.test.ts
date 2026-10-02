import { describe, expect, it } from "vitest";

import i18n from "../i18n";
import { MANUAL_EXTENSIONS, sortDropped, sortSubtitleDrop } from "./MainPage";

describe("dropping files on the main page", () => {
  it("keeps the supported files and counts the rest", () => {
    expect(sortDropped(["/a/ep1.mkv", "/a/notes.txt", "/a/b.MP3", "/a/c.ts"], ["mkv", "mp3"])).toEqual({
      supported: ["/a/ep1.mkv", "/a/b.MP3"],
      skipped: 2,
    });
    expect(sortDropped(["/a/c.ts"], ["mkv"])).toEqual({ supported: [], skipped: 1 });
  });

  it("直接匯入 takes WAV but no longer OGG", () => {
    expect(sortDropped(["/a/v.wav", "/a/v.ogg", "/a/ep.mkv"], MANUAL_EXTENSIONS)).toEqual({
      supported: ["/a/v.wav", "/a/ep.mkv"],
      skipped: 1,
    });
  });

  it("words the notice for one file and for several", () => {
    const t = i18n.getFixedT("zh-Hant");
    expect(t("main.unsupported")).toBe("尚未支援此格式");
    expect(t("main.unsupportedSkipped", { count: 3 })).toBe("尚未支援此格式，略過了 3 個檔案");
  });

  it("the subtitle zone takes a subtitle with its video, or a video alone", () => {
    expect(sortSubtitleDrop(["/a/ep.ass", "/a/ep.MKV", "/a/notes.txt"])).toEqual({
      subtitles: ["/a/ep.ass"],
      videos: ["/a/ep.MKV"],
      skipped: 1,
    });
    expect(sortSubtitleDrop(["/a/ep.mp4"])).toEqual({ subtitles: [], videos: ["/a/ep.mp4"], skipped: 0 });
    expect(sortSubtitleDrop(["/a/ep.ogg"]).skipped, "the subtitle path no longer cuts from audio files").toBe(1);
  });
});

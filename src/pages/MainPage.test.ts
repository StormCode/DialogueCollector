import { describe, expect, it } from "vitest";

import i18n from "../i18n";
import { sortDropped } from "./MainPage";

describe("dropping files on the main page", () => {
  it("keeps the supported files and counts the rest", () => {
    expect(sortDropped(["/a/ep1.mkv", "/a/notes.txt", "/a/b.MP3", "/a/c.ts"], ["mkv", "mp3"])).toEqual({
      supported: ["/a/ep1.mkv", "/a/b.MP3"],
      skipped: 2,
    });
    expect(sortDropped(["/a/c.ts"], ["mkv"])).toEqual({ supported: [], skipped: 1 });
  });

  it("words the notice for one file and for several", () => {
    const t = i18n.getFixedT("zh-Hant");
    expect(t("main.unsupported")).toBe("尚未支援此格式");
    expect(t("main.unsupportedSkipped", { count: 3 })).toBe("尚未支援此格式，略過了3個檔案");
  });
});

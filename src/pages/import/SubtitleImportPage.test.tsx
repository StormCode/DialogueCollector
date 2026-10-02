import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import "../../i18n";
import { ipc } from "../../lib/ipc";
import type { Character, Cue, JobOutcome } from "../../lib/types";
import { useSubtitleImportStore } from "../../stores/subtitleImportStore";
import { SubtitleImportPage } from "./SubtitleImportPage";

vi.mock("@tauri-apps/api/event", () => ({ listen: vi.fn(async () => () => {}) }));
vi.mock("@tauri-apps/plugin-dialog", () => ({ open: vi.fn() }));

const CUES: Cue[] = [
  { index: 0, startMs: 12_480, endMs: 15_230, text: "おはよう。今日は早いんだね。", translation: "早安。今天真早呢。" },
  { index: 1, startMs: 15_900, endMs: 18_040, text: "ちょっと眠れなくてさ。", translation: null },
  { index: 2, startMs: 19_310, endMs: 21_760, text: "そう言えば、昨日の話なんだけど。", translation: null },
];

const CHARACTERS: Character[] = [
  { id: 1, name: "優希", category: "anime", source: "他是傳奇", cv: null, portraitPath: null, lineCount: 0 },
  { id: 2, name: "芙莉蓮", category: "anime", source: "葬送的芙莉蓮", cv: null, portraitPath: null, lineCount: 3 },
];

function renderFlow(state: { video: string; subtitle?: string } = { video: "/videos/ep01.mkv", subtitle: "/subs/ep01.ass" }) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: "/import/subtitle", state }]}>
      <Routes>
        <Route path="/import/subtitle" element={<SubtitleImportPage />} />
        <Route path="/" element={<p>main page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("subtitle import flow", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useSubtitleImportStore.getState().reset();
    useSubtitleImportStore.setState({ videoPath: null, characters: [] });
    vi.spyOn(ipc, "listCharacters").mockResolvedValue(CHARACTERS);
    vi.spyOn(ipc, "preparePreview").mockResolvedValue("/cache/ep01.m4a");
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  });

  it("lists the cues with their translations and assigns checked rows in bulk (T8)", async () => {
    vi.spyOn(ipc, "parseSubtitle").mockResolvedValue(CUES);
    renderFlow();

    expect(await screen.findByText("Step 2. 選擇台詞")).toBeInTheDocument();
    expect(screen.getByText("00:00:12.480 ~ 00:00:15.230")).toBeInTheDocument();
    expect(screen.getByText("早安。今天真早呢。")).toBeInTheDocument();
    const importButton = screen.getByRole("button", { name: "開始匯入" });
    expect(importButton).toBeDisabled();
    expect(screen.getByRole("button", { name: "指派給..." })).toBeDisabled();

    fireEvent.click(screen.getByLabelText("選取字幕 1"));
    fireEvent.click(screen.getByLabelText("選取字幕 3"));
    fireEvent.click(screen.getByRole("button", { name: "指派給..." }));
    const menu = await screen.findByRole("menu");
    fireEvent.change(within(menu).getByRole("searchbox"), { target: { value: "葬送" } });
    fireEvent.click(within(menu).getByRole("menuitem", { name: /芙莉蓮/ }));

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getAllByRole("img", { name: "芙莉蓮" })).toHaveLength(2);
    expect(screen.getByLabelText("選取字幕 1")).not.toBeChecked(); // checks clear after assigning
    expect(importButton).toBeEnabled();
  });

  it("changes one row's character from its avatar", async () => {
    vi.spyOn(ipc, "parseSubtitle").mockResolvedValue(CUES);
    renderFlow();
    fireEvent.click(await screen.findByRole("button", { name: "為第 2 句選擇角色" }));
    const picker = screen.getByRole("dialog", { name: "選擇角色" });
    fireEvent.click(within(picker).getByRole("button", { name: /優希/ }));
    expect(screen.getByRole("img", { name: "優希" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "選擇角色" })).not.toBeInTheDocument();
  });

  it("offers 未指派 and 新增角色 in the picker, and assigns a new character to that row", async () => {
    vi.spyOn(ipc, "parseSubtitle").mockResolvedValue(CUES);
    vi.spyOn(ipc, "listCharacters").mockResolvedValue([]);
    const created: Character = { id: 9, name: "壹原侑子", category: "anime", source: "×××HOLiC", cv: null, portraitPath: null, lineCount: 0 };
    vi.spyOn(ipc, "createCharacter").mockResolvedValue(created);
    renderFlow();

    fireEvent.click(await screen.findByRole("button", { name: "為第 2 句選擇角色" }));
    const picker = screen.getByRole("dialog", { name: "選擇角色" });
    expect(within(picker).getByRole("button", { name: /未指派/ })).toBeInTheDocument();
    expect(within(picker).queryByText("找不到符合的角色")).not.toBeInTheDocument();

    fireEvent.click(within(picker).getByRole("button", { name: "新增角色" }));
    const modal = await screen.findByRole("dialog", { name: "新增角色" });
    fireEvent.change(within(modal).getByLabelText("角色名稱 *"), { target: { value: "壹原侑子" } });
    fireEvent.change(within(modal).getByLabelText("動畫/戲劇名稱 *"), { target: { value: "×××HOLiC" } });
    fireEvent.click(within(modal).getByRole("button", { name: "新增" }));

    expect(await screen.findByRole("img", { name: "壹原侑子" })).toBeInTheDocument();
    expect(useSubtitleImportStore.getState().assigned).toEqual({ 1: 9 });
  });

  it("imports only the assigned lines and shows 部分完成 with cancelled ones apart", async () => {
    vi.spyOn(ipc, "parseSubtitle").mockResolvedValue(CUES);
    const outcome: JobOutcome = {
      runId: 7,
      imported: 1,
      status: "cancelled",
      lost: [],
      changedSources: [],
      failures: [
        { cueIndex: 1, text: "ちょっと眠れなくてさ。", startMs: 15_900, endMs: 18_040, characterId: 2, reason: "diskFull", detail: null },
        { cueIndex: 2, text: "そう言えば、昨日の話なんだけど。", startMs: 19_310, endMs: 21_760, characterId: 2, reason: "cancelled", detail: null },
      ],
    };
    const start = vi.spyOn(ipc, "startSubtitleImport").mockResolvedValue(outcome);
    renderFlow();

    fireEvent.click(await screen.findByRole("button", { name: "為第 1 句選擇角色" }));
    fireEvent.click(within(screen.getByRole("dialog", { name: "選擇角色" })).getByRole("button", { name: /芙莉蓮/ }));
    fireEvent.click(screen.getByRole("button", { name: "開始匯入" }));
    await waitFor(() =>
      expect(start).toHaveBeenCalledWith("/subs/ep01.ass", "/videos/ep01.mkv", [{ cue: CUES[0], characterId: 2 }]),
    );

    expect(await screen.findByText("部分完成")).toBeInTheDocument();
    expect(screen.getByText("1 句", { selector: ".part-stat--ok *" })).toBeInTheDocument();
    expect(screen.getByText("寫入音檔失敗：磁碟空間不足")).toBeInTheDocument();
    expect(screen.getByText("已取消")).toHaveClass("is-cancelled");
  });

  it("opens Step 2 empty with its toast when the file holds no dialogue", async () => {
    vi.spyOn(ipc, "parseSubtitle").mockRejectedValue({ kind: "Subs.NoCues", message: "" });
    renderFlow();
    expect(await screen.findByRole("alert")).toHaveTextContent("無法從字幕檔提取任何台詞");
    expect(screen.getByText("沒有可選擇的台詞")).toBeInTheDocument();
  });

  it("shows 字幕讀取失敗 with 再試一次 when the file cannot be read", async () => {
    const parse = vi.spyOn(ipc, "parseSubtitle").mockRejectedValue({ kind: "Subs.Parse", message: "" });
    renderFlow();
    expect(await screen.findByText("字幕讀取失敗")).toBeInTheDocument();
    parse.mockResolvedValue(CUES);
    fireEvent.click(screen.getByRole("button", { name: "再試一次" }));
    expect(await screen.findByText("Step 2. 選擇台詞")).toBeInTheDocument();
  });

  it("plays a row, merges checked rows and swaps the whole bilingual subtitle", async () => {
    vi.spyOn(ipc, "parseSubtitle").mockResolvedValue(CUES);
    renderFlow();
    await screen.findByText("Step 2. 選擇台詞");
    const merge = screen.getByRole("button", { name: "合併" });
    const split = screen.getByRole("button", { name: "拆分" });
    expect(merge).toBeDisabled();
    expect(split).toBeDisabled();
    expect(screen.getByRole("button", { name: "調換" })).toBeEnabled(); // one line has a translation

    fireEvent.click(screen.getByRole("button", { name: "播放第 1 句" }));
    expect(screen.getByRole("button", { name: "暫停第 1 句" })).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("選取字幕 1"));
    fireEvent.click(screen.getByLabelText("選取字幕 3"));
    fireEvent.click(merge);
    expect(screen.getByText("おはよう。今日は早いんだね。，そう言えば、昨日の話なんだけど。")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);

    fireEvent.click(split);
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);

    fireEvent.click(screen.getByRole("button", { name: "調換" }));
    expect(screen.getByText("早安。今天真早呢。", { selector: ".sel-text__line" })).toBeInTheDocument();
  });

  it("a video alone: 抽取音訊 → Step 2 選擇字幕軌 → Step 3 選擇台詞", async () => {
    vi.spyOn(ipc, "listSubtitleTracks").mockResolvedValue([
      { index: 2, codec: "subrip", language: "jpn", title: null },
      { index: 3, codec: "ass", language: "chi", title: "繁體中文" },
    ]);
    const extract = vi.spyOn(ipc, "extractSubtitleTrack").mockResolvedValue({ path: "/cache/t3.ass", cues: CUES });
    renderFlow({ video: "/videos/ep01.mkv" });

    expect(await screen.findByText("Step 2. 選擇字幕軌")).toBeInTheDocument();
    const next = screen.getByRole("button", { name: "下一步" });
    expect(next).toBeDisabled();
    expect(screen.getByRole("radio", { name: /#2.*繁體中文/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: /#2/ }));
    fireEvent.click(next);

    expect(await screen.findByText("Step 3. 選擇台詞")).toBeInTheDocument();
    expect(extract).toHaveBeenCalledWith("/videos/ep01.mkv", 3, "ass");
    expect(screen.getByText("選擇字幕軌")).toBeInTheDocument(); // the three-step header
    fireEvent.click(screen.getByRole("button", { name: "回上一步" }));
    expect(await screen.findByText("Step 2. 選擇字幕軌")).toBeInTheDocument();
  });
});

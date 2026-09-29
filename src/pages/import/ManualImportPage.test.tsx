import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import "../../i18n";
import { ipc } from "../../lib/ipc";
import type { Character, MediaInfo } from "../../lib/types";
import { useUiStore } from "../../stores/uiStore";
import { cardReady, ManualImportPage } from "./ManualImportPage";

vi.mock("@tauri-apps/plugin-dialog", () => ({ open: vi.fn() }));

const media = (path: string, hasAudio = true): MediaInfo => ({ path, durationMs: hasAudio ? 4000 : null, hasAudio });
const FRIEREN: Character = {
  id: 1,
  name: "芙莉蓮",
  category: "anime",
  source: "葬送的芙莉蓮",
  cv: null,
  portraitPath: null,
  lineCount: 0,
};

function renderPage(files: string[]) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: "/import/manual", state: { files } }]}>
      <Routes>
        <Route path="/import/manual" element={<ManualImportPage />} />
        <Route path="/" element={<p>main page</p>} />
        <Route path="/characters" element={<p>script book</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

const importButton = () => screen.getByRole("button", { name: "匯入" });
const chooseCharacter = (name: string) => {
  fireEvent.click(screen.getByRole("button", { name: "角色" }));
  fireEvent.click(screen.getByRole("option", { name: new RegExp(name) }));
};

describe("ManualImportPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    vi.spyOn(ipc, "listCharacters").mockResolvedValue([FRIEREN]);
    useUiStore.setState({ notice: null });
  });

  it("a card needs text or translation and a real character", () => {
    expect(cardReady({ text: "", translation: "", owner: 1 })).toBe(false);
    expect(cardReady({ text: "", translation: "Lovely breeze.", owner: 1 })).toBe(true);
    expect(cardReady({ text: "a", translation: "", owner: "none" })).toBe(false);
    expect(cardReady({ text: "a", translation: "", owner: null })).toBe(false);
  });

  it("one file: no pager, 匯入 waits for the card, then 匯入完成", async () => {
    vi.spyOn(ipc, "probeMedia").mockResolvedValue([media("/v/ep01.mkv")]);
    const start = vi.spyOn(ipc, "startManualImport").mockResolvedValue({ status: "complete", imported: 1, failures: [] });
    renderPage(["/v/ep01.mkv"]);
    expect(await screen.findByRole("heading", { name: "請輸入台詞" })).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "台詞切換" })).not.toBeInTheDocument();
    expect(screen.getByText("0:00 / 0:04")).toBeInTheDocument();

    expect(importButton()).toBeDisabled();
    expect(screen.getByText("請填寫台詞內容或譯文，並指派角色")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("台詞內容"), { target: { value: "人類的壽命真的很短暫呢。" } });
    fireEvent.click(screen.getByRole("button", { name: "角色" }));
    fireEvent.click(screen.getByRole("option", { name: "未指派" }));
    expect(screen.getByText("未指派角色無法匯入，請選擇角色")).toBeInTheDocument();
    expect(screen.getByText("請指派角色後再匯入")).toBeInTheDocument();
    chooseCharacter("芙莉蓮");
    expect(importButton()).toBeEnabled();

    fireEvent.click(importButton());
    expect(await screen.findByText("匯入完成")).toBeInTheDocument();
    expect(start).toHaveBeenCalledWith([
      { path: "/v/ep01.mkv", characterId: 1, text: "人類的壽命真的很短暫呢。", translation: null },
    ]);
    fireEvent.click(screen.getByRole("button", { name: "匯入下一句" }));
    expect(screen.getByText("main page")).toBeInTheDocument();
  });

  it("several files: the pager, the pending list, and files without audio skipped", async () => {
    vi.spyOn(ipc, "probeMedia").mockResolvedValue([media("/a.mp3"), media("/silent.mp4", false), media("/b.ogg")]);
    renderPage(["/a.mp3", "/silent.mp4", "/b.ogg"]);
    expect(await screen.findByText("1/2")).toBeInTheDocument();
    expect(useUiStore.getState().notice?.text).toBe("略過了 1 個沒有音訊的檔案");
    expect(screen.getByText("尚有 2 筆未完成（第 1、2 筆）")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("台詞譯文"), { target: { value: "Lovely breeze." } });
    chooseCharacter("芙莉蓮");
    expect(screen.getByText("尚有 1 筆未完成（第 2 筆）")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "下一筆" }));
    expect(screen.getByText("2/2")).toBeInTheDocument();
    expect(screen.getByLabelText("台詞譯文")).toHaveValue("");
    fireEvent.click(screen.getByRole("button", { name: "上一筆" }));
    expect(screen.getByLabelText("台詞譯文")).toHaveValue("Lovely breeze.");
  });

  it("a partial run shows 匯入失敗 and 再試一次 retries only the failed files", async () => {
    vi.spyOn(ipc, "probeMedia").mockResolvedValue([media("/a.mp3"), media("/b.mkv")]);
    const start = vi
      .spyOn(ipc, "startManualImport")
      .mockResolvedValueOnce({ status: "partial", imported: 1, failures: [{ index: 1, reason: "decodeFailed", detail: null }] })
      .mockResolvedValueOnce({ status: "complete", imported: 1, failures: [] });
    renderPage(["/a.mp3", "/b.mkv"]);
    await screen.findByText("1/2");
    for (const text of ["一", "二"]) {
      fireEvent.change(screen.getByLabelText("台詞內容"), { target: { value: text } });
      chooseCharacter("芙莉蓮");
      if (text === "一") fireEvent.click(screen.getByRole("button", { name: "下一筆" }));
    }
    fireEvent.click(importButton());
    expect(await screen.findByText("已匯入 1 句，1 句失敗")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "再試一次" }));
    await waitFor(() => expect(start).toHaveBeenCalledTimes(2));
    expect(start.mock.calls[1][0]).toEqual([{ path: "/b.mkv", characterId: 1, text: "二", translation: null }]);
    expect(await screen.findByText("匯入完成")).toBeInTheDocument();
  });

  it("goes back to the main page when no file has audio", async () => {
    vi.spyOn(ipc, "probeMedia").mockResolvedValue([media("/silent.mp4", false)]);
    renderPage(["/silent.mp4"]);
    expect(await screen.findByText("main page")).toBeInTheDocument();
  });
});

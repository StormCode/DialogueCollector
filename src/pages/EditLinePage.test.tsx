import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import "../i18n";
import { ipc } from "../lib/ipc";
import type { Character, Line } from "../lib/types";
import { EditLinePage } from "./EditLinePage";

vi.mock("@tauri-apps/plugin-dialog", () => ({ open: vi.fn() }));

const LINE: Line = {
  id: 7,
  characterId: 1,
  text: "今天的風好舒服呢。",
  translation: null,
  audioPath: "/lib/7.m4a",
  durationMs: 4000,
  createdAt: 0,
  pinnedAt: null,
};
const character = (id: number, name: string, source: string): Character => ({
  id,
  name,
  category: "anime",
  source,
  cv: null,
  portraitPath: null,
  lineCount: 1,
});

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/characters/1/lines/7/edit"]}>
      <Routes>
        <Route path="/characters/:characterId/lines/:lineId/edit" element={<EditLinePage />} />
        <Route path="/characters/:characterId" element={<p>lines page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("EditLinePage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    vi.spyOn(ipc, "getLine").mockResolvedValue(LINE);
    vi.spyOn(ipc, "listCharacters").mockResolvedValue([character(1, "優希", "他是傳奇"), character(2, "芙莉蓮", "葬送的芙莉蓮")]);
  });

  it("requires the text, then saves text, translation and a new character", async () => {
    const update = vi.spyOn(ipc, "updateLine").mockResolvedValue({ ...LINE, characterId: 2 });
    renderPage();
    const text = await screen.findByLabelText("台詞內容");
    await waitFor(() => expect(text).toHaveValue("今天的風好舒服呢。"));
    expect(screen.getByText("0:00 / 0:04")).toBeInTheDocument();

    fireEvent.change(text, { target: { value: "  " } });
    fireEvent.click(screen.getByRole("button", { name: "儲存" }));
    expect(screen.getByText("請輸入台詞內容")).toBeInTheDocument();
    expect(update).not.toHaveBeenCalled();

    fireEvent.change(text, { target: { value: "今天的風真舒服。" } });
    fireEvent.change(screen.getByLabelText("台詞譯文 (optional)"), { target: { value: "Lovely breeze." } });
    fireEvent.click(screen.getByRole("button", { name: "角色" }));
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "葬送" } });
    fireEvent.click(screen.getByRole("option", { name: /芙莉蓮/ }));
    fireEvent.click(screen.getByRole("button", { name: "儲存" }));
    await waitFor(() =>
      expect(update).toHaveBeenCalledWith(7, { text: "今天的風真舒服。", translation: "Lovely breeze.", characterId: 2 }),
    );
    expect(await screen.findByText("已儲存變更")).toBeInTheDocument();
  });

  it("取消 goes back to the lines page", async () => {
    renderPage();
    fireEvent.click(await screen.findByRole("link", { name: "取消" }));
    expect(screen.getByText("lines page")).toBeInTheDocument();
  });
});

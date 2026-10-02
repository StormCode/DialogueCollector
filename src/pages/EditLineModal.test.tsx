import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import "../i18n";
import { ipc } from "../lib/ipc";
import type { Character, Line } from "../lib/types";
import { EditLineModal } from "./EditLineModal";

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

describe("EditLineModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    vi.spyOn(ipc, "listCharacters").mockResolvedValue([character(1, "優希", "他是傳奇"), character(2, "芙莉蓮", "葬送的芙莉蓮")]);
  });

  it("requires the text or the translation, then saves them and a new character and closes", async () => {
    const update = vi.spyOn(ipc, "updateLine").mockResolvedValue({ ...LINE, characterId: 2 });
    const onClose = vi.fn();
    render(<EditLineModal line={LINE} onClose={onClose} />);
    const dialog = screen.getByRole("dialog", { name: "編輯台詞" });
    const text = within(dialog).getByLabelText("台詞內容");
    expect(text).toHaveValue("今天的風好舒服呢。");
    expect(screen.getByText("0:00 / 0:04")).toBeInTheDocument();

    fireEvent.change(text, { target: { value: "  " } });
    fireEvent.click(screen.getByRole("button", { name: "儲存" }));
    expect(screen.getByText("請輸入台詞內容或譯文")).toBeInTheDocument();
    expect(update).not.toHaveBeenCalled();

    fireEvent.change(text, { target: { value: "今天的風真舒服。" } });
    fireEvent.change(screen.getByLabelText("台詞譯文 (optional)"), { target: { value: "Lovely breeze." } });
    await screen.findByText("優希");
    fireEvent.click(screen.getByRole("button", { name: "角色" }));
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "葬送" } });
    fireEvent.click(screen.getByRole("option", { name: /芙莉蓮/ }));
    fireEvent.click(screen.getByRole("button", { name: "儲存" }));
    await waitFor(() =>
      expect(update).toHaveBeenCalledWith(7, { text: "今天的風真舒服。", translation: "Lovely breeze.", characterId: 2 }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalledWith(true));
  });

  it("saves a line that has only a 譯文", async () => {
    const update = vi.spyOn(ipc, "updateLine").mockResolvedValue({ ...LINE, text: "", translation: "Lovely breeze." });
    render(<EditLineModal line={LINE} onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText("台詞內容"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("台詞譯文 (optional)"), { target: { value: "Lovely breeze." } });
    fireEvent.click(screen.getByRole("button", { name: "儲存" }));
    await waitFor(() => expect(update).toHaveBeenCalledWith(7, { text: "", translation: "Lovely breeze.", characterId: 1 }));
  });

  it("closing without saving tells the page nothing changed", () => {
    const onClose = vi.fn();
    render(<EditLineModal line={LINE} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "關閉" }));
    expect(onClose).toHaveBeenCalledWith(false);
  });
});

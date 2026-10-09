import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import "../i18n";
import { ipc } from "../lib/ipc";
import type { Character } from "../lib/types";
import { DEFAULT_SETTINGS } from "../lib/types";
import { useSettingsStore } from "../stores/settingsStore";
import { ScriptBookPage } from "./ScriptBookPage";

vi.mock("@tauri-apps/plugin-dialog", () => ({ open: vi.fn() }));

const character = (id: number, name: string, category: Character["category"], source: string, cv: string | null = null): Character => ({
  id,
  name,
  category,
  source,
  cv,
  portraitPath: null,
  lineCount: 0,
});

const CAST = [
  character(1, "芙莉蓮", "anime", "葬送的芙莉蓮", "種﨑敦美"),
  character(2, "費倫", "anime", "葬送的芙莉蓮", "市之瀨加那"),
  character(3, "岡部倫太郎", "anime", "命運石之門", "宮野真守"),
  character(4, "周公旦", "tv", "封神榜", "魏啟明"),
  character(5, "妲己", "tv", "封神榜"),
];

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/characters"]}>
      <Routes>
        <Route path="/characters" element={<ScriptBookPage />} />
        <Route path="/characters/:characterId" element={<p>lines page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

const names = () => screen.queryAllByRole("button", { name: /^(芙莉蓮|費倫|岡部倫太郎|周公旦|妲己)/ }).map((b) => b.querySelector(".sb-card__name")?.textContent);

describe("ScriptBookPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useSettingsStore.setState({ settings: { ...DEFAULT_SETTINGS, charactersPerPage: 4 }, loaded: true });
  });

  it("shows 這裡什麼都沒有 without characters", async () => {
    vi.spyOn(ipc, "listCharacters").mockResolvedValue([]);
    renderPage();
    expect(await screen.findByText("這裡什麼都沒有")).toBeInTheDocument();
  });

  it("pages by the 台詞本 page size and searches names and CV", async () => {
    vi.spyOn(ipc, "listCharacters").mockResolvedValue(CAST);
    renderPage();
    await screen.findByText("芙莉蓮");
    expect(names()).toHaveLength(4);
    fireEvent.click(screen.getByRole("button", { name: "第 2 頁" }));
    expect(names()).toEqual(["妲己"]);

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "宮野" } });
    expect(names()).toEqual(["岡部倫太郎"]);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "沒有這個人" } });
    expect(screen.getByRole("status")).toHaveTextContent("找不到符合的角色");
  });

  it("filters by category and title, shown as removable chips", async () => {
    vi.spyOn(ipc, "listCharacters").mockResolvedValue(CAST);
    renderPage();
    await screen.findByText("芙莉蓮");
    fireEvent.click(screen.getByRole("button", { name: "篩選" }));
    fireEvent.click(screen.getByLabelText("電視劇"));
    expect(names()).toEqual(["周公旦", "妲己"]);
    fireEvent.click(screen.getByRole("button", { name: "移除「電視劇」" }));
    fireEvent.click(screen.getByLabelText("命運石之門"));
    expect(names()).toEqual(["岡部倫太郎"]);
  });

  it("opens a character's lines, and deletes one after confirming from 編輯角色", async () => {
    vi.spyOn(ipc, "listCharacters").mockResolvedValue(
      CAST.map((c) => (c.name === "周公旦" ? { ...c, lineCount: 12 } : c)),
    );
    const del = vi.spyOn(ipc, "deleteCharacter").mockResolvedValue();
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "編輯周公旦" }));
    const edit = screen.getByRole("dialog", { name: "編輯角色" });
    expect(within(edit).getByLabelText("角色名稱 *")).toHaveValue("周公旦");
    fireEvent.click(within(edit).getByRole("button", { name: "刪除角色" }));

    const confirm = screen.getByRole("dialog", { name: "確認" });
    // How many lines go with it.
    expect(confirm).toHaveTextContent("刪除「周公旦」後，此角色的 12 句台詞將一併移除，且無法復原。");
    expect(within(confirm).getByRole("button", { name: "取消" })).toHaveFocus();
    fireEvent.click(within(confirm).getByRole("button", { name: "刪除" }));
    await vi.waitFor(() => expect(del).toHaveBeenCalledWith(4));

    fireEvent.click(screen.getByText("芙莉蓮"));
    expect(await screen.findByText("lines page")).toBeInTheDocument();
  });

  it("a character without lines just says deleting can't be undone", async () => {
    vi.spyOn(ipc, "listCharacters").mockResolvedValue(CAST);
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "編輯周公旦" }));
    fireEvent.click(within(screen.getByRole("dialog", { name: "編輯角色" })).getByRole("button", { name: "刪除角色" }));
    expect(screen.getByRole("dialog", { name: "確認" })).toHaveTextContent("刪除「周公旦」後將無法復原。");
  });

  it("編輯 spins and takes no second click while the character is saved", async () => {
    vi.spyOn(ipc, "listCharacters").mockResolvedValue(CAST);
    let finish: () => void = () => {};
    const update = vi
      .spyOn(ipc, "updateCharacter")
      .mockImplementation(() => new Promise((resolve) => (finish = () => resolve(CAST[3]))));
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "編輯周公旦" }));
    const edit = screen.getByRole("dialog", { name: "編輯角色" });
    const save = within(edit).getByRole("button", { name: "編輯" });
    fireEvent.click(save);
    await vi.waitFor(() => expect(save).toHaveAttribute("aria-busy", "true"));
    expect(save).toBeDisabled();
    fireEvent.click(save);
    expect(update).toHaveBeenCalledTimes(1);
    finish();
    await vi.waitFor(() => expect(screen.queryByRole("dialog", { name: "編輯角色" })).toBeNull());
  });
});


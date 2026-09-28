import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import "../i18n";
import { ipc } from "../lib/ipc";
import { DEFAULT_SETTINGS } from "../lib/types";
import { useBackupStore } from "../stores/backupStore";
import { useLibraryStore } from "../stores/libraryStore";
import { useSettingsStore } from "../stores/settingsStore";
import { SettingsPage } from "./SettingsPage";

const dialog = vi.hoisted(() => ({ open: vi.fn(), save: vi.fn() }));
vi.mock("@tauri-apps/plugin-dialog", () => dialog);

function renderPage() {
  return render(
    <MemoryRouter>
      <SettingsPage />
    </MemoryRouter>,
  );
}

describe("SettingsPage", () => {
  beforeEach(() => {
    useSettingsStore.setState({ settings: { ...DEFAULT_SETTINGS }, loaded: true });
    useLibraryStore.setState({
      status: {
        ready: true,
        path: "/Users/me/Library/Application Support/DialogueCollector",
        reason: null,
        stats: { clipCount: 1284, bytes: 2.36 * 1024 ** 3 },
      },
      relocating: false,
      progress: null,
      load: async () => {},
    });
    useBackupStore.setState({ exporting: false, exportProgress: null, importing: false });
    dialog.open.mockReset();
    vi.restoreAllMocks();
  });

  it("lists the five sections of the board in the index", () => {
    renderPage();
    const toc = screen.getByRole("navigation", { name: "設定目錄" });
    const labels = within(toc)
      .getAllByRole("button")
      .map((b) => b.textContent);
    expect(labels).toEqual(["介面", "角色簿", "台詞頁", "檔案管理", "目前版本"]);
  });

  it("picks a theme from the swatches and marks it checked", async () => {
    renderPage();
    const ruby = screen.getByRole("radio", { name: "寶石紅" });
    fireEvent.click(ruby);
    await vi.waitFor(() => expect(useSettingsStore.getState().settings.theme).toBe("ruby"));
    expect(screen.getByRole("radio", { name: "寶石紅" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "靛藍" })).toHaveAttribute("aria-checked", "false");
  });

  it("commits a valid per-page count and reverts an invalid one", async () => {
    renderPage();
    const field = screen.getAllByLabelText("每頁筆數")[0] as HTMLInputElement;

    fireEvent.change(field, { target: { value: "12" } });
    fireEvent.blur(field);
    await vi.waitFor(() => expect(useSettingsStore.getState().settings.charactersPerPage).toBe(12));

    fireEvent.change(field, { target: { value: "0" } });
    fireEvent.blur(field);
    expect(field.value).toBe("12");
    expect(useSettingsStore.getState().settings.charactersPerPage).toBe(12);
  });

  it("accepts the play gap only in half-second steps", async () => {
    renderPage();
    const field = screen.getByLabelText(/全部播放每句切換秒數/) as HTMLInputElement;
    fireEvent.change(field, { target: { value: "1.25" } });
    fireEvent.blur(field);
    expect(field.value).toBe("2");
    fireEvent.change(field, { target: { value: "3.5" } });
    fireEvent.blur(field);
    await vi.waitFor(() => expect(useSettingsStore.getState().settings.playAllGapSeconds).toBe(3.5));
  });

  it("previews the chosen 台詞 font", () => {
    renderPage();
    fireEvent.change(screen.getByLabelText("台詞字型"), { target: { value: "Yomogi" } });
    expect(screen.getByText(/この声、ずっと覚えてる/).style.fontFamily).toContain("Yomogi");
  });

  it("confirms an import with what will be lost before replacing anything (D10)", async () => {
    dialog.open.mockResolvedValue("/tmp/backup.zip");
    const importFrom = vi.fn().mockResolvedValue({});
    useBackupStore.setState({
      inspect: vi.fn().mockResolvedValue({
        archive: {},
        currentCharacters: 12,
        currentClips: 1284,
        currentBytes: 2.36 * 1024 ** 3,
      }),
      importFrom,
    });
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "匯入" }));

    const confirm = await screen.findByRole("dialog", { name: "確認" });
    expect(confirm).toHaveTextContent("確定要匯入備份嗎？");
    expect(confirm).toHaveTextContent("12 個角色、1,284 句台詞，共 2.36 GB");
    // DT2: a destructive dialog opens with focus on 取消.
    expect(within(confirm).getByRole("button", { name: "取消" })).toHaveFocus();
    expect(importFrom).not.toHaveBeenCalled();

    fireEvent.click(within(confirm).getByRole("button", { name: "確定匯入" }));
    await vi.waitFor(() => expect(importFrom).toHaveBeenCalledWith("/tmp/backup.zip"));
    expect(await screen.findByRole("status")).toHaveTextContent("匯入完成");
  });

  it("shows export progress with a cancel action", () => {
    useBackupStore.setState({ exporting: true, exportProgress: { done: 642, total: 1284, finishing: false } });
    renderPage();
    const modal = screen.getByRole("dialog", { name: "匯出" });
    expect(modal).toHaveTextContent("匯出中…");
    expect(modal).toHaveTextContent("正在複製音檔 642 / 1,284");
    expect(within(modal).getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");
    expect(within(modal).getByRole("button", { name: "取消匯出" })).toBeInTheDocument();
  });

  it("hides 遺失的檔案數 while every clip is on disk", async () => {
    const verify = vi.spyOn(ipc, "verifyLibrary").mockResolvedValue({ missing: [], orphans: [] });
    renderPage();
    await vi.waitFor(() => expect(verify).toHaveBeenCalled());
    expect(screen.queryByRole("button", { name: /遺失的檔案數/ })).not.toBeInTheDocument();
  });

  it("lists missing clips and links each to its character's 台詞頁 (T20)", async () => {
    vi.spyOn(ipc, "verifyLibrary").mockResolvedValue({
      missing: [
        { lineId: 3, characterId: 7, characterName: "岡部倫太郎", portraitPath: null, text: "這一切都是命運石之門的選擇。" },
        { lineId: 1, characterId: 2, characterName: "芙莉蓮", portraitPath: null, text: "人類的壽命真的很短暫呢。" },
      ],
      orphans: [],
    });
    render(
      <MemoryRouter initialEntries={["/settings"]}>
        <Routes>
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/characters/:characterId" element={<p>lines page</p>} />
        </Routes>
      </MemoryRouter>,
    );
    const stat = await screen.findByRole("button", { name: /遺失的檔案數/ });
    expect(stat).toHaveTextContent("2");
    fireEvent.click(stat);

    const modal = screen.getByRole("dialog", { name: "遺失的檔案" });
    expect(modal).toHaveTextContent("共 2 個台詞的音檔已不在收藏庫中");
    expect(within(modal).getAllByRole("row")).toHaveLength(3);
    expect(modal).toHaveTextContent("這一切都是命運石之門的選擇。");
    fireEvent.click(within(modal).getByRole("link", { name: "查看芙莉蓮的台詞" }));
    expect(await screen.findByText("lines page")).toBeInTheDocument();
  });
});

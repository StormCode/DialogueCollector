import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import "../i18n";
import { ipc } from "../lib/ipc";
import type { Line, LinesPageData } from "../lib/types";
import { DEFAULT_SETTINGS } from "../lib/types";
import { useSettingsStore } from "../stores/settingsStore";
import { formatCreated, formatDuration, lineTitle, LinesPage } from "./LinesPage";

vi.mock("@tauri-apps/plugin-dialog", () => ({ open: vi.fn() }));

const line = (id: number, text: string, durationMs: number, pinnedAt: number | null = null): Line => ({
  id,
  characterId: 1,
  text,
  translation: null,
  audioPath: `/lib/${id}.m4a`,
  durationMs,
  createdAt: id * 1000,
  pinnedAt,
});

const page = (lines: Line[], posterPath: string | null = null): LinesPageData => ({
  character: { id: 1, name: "優希", category: "anime", source: "他是傳奇", cv: null, portraitPath: null, lineCount: lines.length },
  posterPath,
  lines,
});

const LINES = [
  line(1, "今天的風好舒服呢。", 2000),
  line(2, "等一下，我還沒說完！", 5000),
  line(3, "不管發生什麼事，我都會站在你這邊。", 3000, 10),
  line(4, "這種程度的困難，根本不算什麼。", 1000),
];

function renderPage(entry = "/characters/1") {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/characters/:characterId" element={<LinesPage />} />
        <Route path="/characters/:characterId/lines/:lineId/edit" element={<p>edit page</p>} />
        <Route path="/" element={<p>main page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

const texts = (root: HTMLElement) => [...root.querySelectorAll(".ln-card-text")].map((e) => e.textContent);
const mainList = () => document.querySelectorAll<HTMLElement>(".ln-list")[document.querySelectorAll(".ln-list").length - 1];

describe("LinesPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useSettingsStore.setState({ settings: { ...DEFAULT_SETTINGS, linesPerPage: 2, playAllGapSeconds: 0 }, loaded: true });
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  });

  it("formats durations and creation times as the board does", () => {
    expect(formatDuration(65_400)).toBe("1:05");
    expect(formatCreated(new Date(2026, 8, 22, 21, 5).getTime())).toBe("2026/09/22 21:05");
  });

  it("titles a card with the 譯文 when there is no 原文", () => {
    expect(lineTitle({ text: "", translation: "El Psy Congroo." })).toBe("El Psy Congroo.");
    expect(lineTitle({ text: "今天的風好舒服呢。", translation: "Lovely breeze." })).toBe("今天的風好舒服呢。");
  });

  it("shows 這裡什麼都沒有 with 匯入台詞 when the character has no lines", async () => {
    vi.spyOn(ipc, "openLines").mockResolvedValue(page([]));
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "匯入台詞" }));
    expect(screen.getByText("main page")).toBeInTheDocument();
  });

  it("keeps pinned lines apart, pages the rest, sorts and searches", async () => {
    vi.spyOn(ipc, "openLines").mockResolvedValue(page(LINES));
    renderPage();
    expect(await screen.findByRole("heading", { name: "優希的台詞" })).toBeInTheDocument();
    const pinned = screen.getByRole("region", { name: "已釘選的台詞" });
    expect(texts(pinned)).toEqual(["不管發生什麼事，我都會站在你這邊。"]);
    // Newest first, two per page, pinned left out of paging.
    expect(texts(mainList())).toEqual(["這種程度的困難，根本不算什麼。", "等一下，我還沒說完！"]);
    expect(screen.getByText("共 4 句 · 建立時間 遞減")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "第 2 頁" }));
    expect(texts(mainList())).toEqual(["今天的風好舒服呢。"]);

    fireEvent.click(screen.getByRole("button", { name: "排序" }));
    fireEvent.click(screen.getByRole("button", { name: "按時長排序" }));
    expect(texts(mainList())).toEqual(["等一下，我還沒說完！", "今天的風好舒服呢。"]);

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "沒有這句" } });
    expect(screen.getByRole("status")).toHaveTextContent("找不到符合的台詞");
  });

  it("plays everything, pinned first, and stops", async () => {
    let audio: HTMLMediaElement | undefined;
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (this: HTMLMediaElement) {
      audio = this;
      return Promise.resolve();
    });
    vi.spyOn(ipc, "openLines").mockResolvedValue(page(LINES));
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "全部播放" }));
    const active = () => document.querySelector(".ln-card.is-active .ln-card-text")?.textContent;
    expect(active()).toBe("不管發生什麼事，我都會站在你這邊。");
    // The clip ends: after the gap, on to the newest unpinned line.
    act(() => audio?.onended?.(new Event("ended")));
    await waitFor(() => expect(active()).toBe("這種程度的困難，根本不算什麼。"));
    fireEvent.click(screen.getByRole("button", { name: "全部停止" }));
    expect(active()).toBeUndefined();
  });

  it("依序播放 needs checked lines", async () => {
    vi.spyOn(ipc, "openLines").mockResolvedValue(page(LINES));
    renderPage();
    const seq = await screen.findByRole("button", { name: /依序播放/ });
    expect(seq).toBeDisabled();
    fireEvent.click(within(mainList()).getAllByRole("checkbox", { name: "勾選此句" })[1]);
    expect(seq).toBeEnabled();
    fireEvent.click(seq);
    expect(document.querySelector(".ln-card.is-active .ln-card-text")?.textContent).toBe("等一下，我還沒說完！");
    expect(screen.getByRole("button", { name: /停止依序播放/ })).toBeInTheDocument();
  });

  it("edit mode pins, links to EditLine and deletes after confirming", async () => {
    vi.spyOn(ipc, "openLines").mockResolvedValue(page(LINES));
    const pin = vi.spyOn(ipc, "setLinePinned").mockResolvedValue();
    const del = vi.spyOn(ipc, "deleteLine").mockResolvedValue();
    renderPage();
    fireEvent.click(await screen.findByRole("switch", { name: "編輯模式" }));
    expect(screen.queryByRole("button", { name: "播放" })).not.toBeInTheDocument();

    fireEvent.click(within(mainList()).getAllByRole("button", { name: "釘選" })[0]);
    expect(pin).toHaveBeenCalledWith(4, true);

    fireEvent.click(within(mainList()).getAllByRole("button", { name: "刪除" })[0]);
    expect(screen.getByText("確定要刪除台詞嗎？")).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "刪除" }));
    await waitFor(() => expect(del).toHaveBeenCalledWith(4));

    fireEvent.click(within(mainList()).getAllByRole("link", { name: "編輯" })[0]);
    expect(screen.getByText("edit page")).toBeInTheDocument();
  });

  it("opens on the page of a missing line and marks it (LinesMissing)", async () => {
    vi.spyOn(ipc, "openLines").mockResolvedValue(page(LINES));
    renderPage("/characters/1?missing=1");
    await screen.findByRole("heading", { name: "優希的台詞" });
    await waitFor(() => expect(texts(mainList())).toEqual(["今天的風好舒服呢。"]));
    expect(document.querySelector('[data-line-id="1"]')).toHaveClass("is-missing");
  });

  it("asks before deleting the poster", async () => {
    vi.spyOn(ipc, "openLines").mockResolvedValue(page(LINES, "/lib/images/p.png"));
    const set = vi.spyOn(ipc, "setPoster").mockResolvedValue(null);
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "刪除橫幅海報" }));
    expect(screen.getByText("確定要刪除橫幅海報嗎？")).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "刪除" }));
    await waitFor(() => expect(set).toHaveBeenCalledWith(1, null));
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import "../../i18n";
import { ipc } from "../../lib/ipc";
import { VersionSection } from "./VersionSection";

type Handler = (e: { payload: unknown }) => void;
const events = vi.hoisted(() => ({ handler: null as Handler | null }));
vi.mock("@tauri-apps/api/event", () => ({
  listen: vi.fn(async (_name: string, handler: Handler) => {
    events.handler = handler;
    return () => (events.handler = null);
  }),
}));

function renderSection() {
  return render(
    <MemoryRouter>
      <VersionSection />
    </MemoryRouter>,
  );
}

describe("VersionSection (T22)", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("says 已是最新版本! when nothing needs installing", async () => {
    vi.spyOn(ipc, "checkForUpdate").mockResolvedValue({ status: "upToDate", version: "0.1.0" });
    renderSection();
    fireEvent.click(screen.getByRole("button", { name: "檢查更新" }));
    expect(await screen.findByRole("status")).toHaveTextContent("已是最新版本!");
  });

  it("shows 更新中... with progress while an update downloads", async () => {
    vi.spyOn(ipc, "checkForUpdate").mockReturnValue(new Promise(() => {}));
    renderSection();
    const button = screen.getByRole("button", { name: "檢查更新" });
    fireEvent.click(button);
    await vi.waitFor(() => expect(events.handler).not.toBeNull());
    events.handler!({ payload: { version: "0.2.0", downloaded: 512, total: 1024 } });
    expect(await screen.findByRole("status")).toHaveTextContent("更新中... 50%");
    expect(button).toBeDisabled();
  });

  it("names the reason when the check fails", async () => {
    vi.spyOn(ipc, "checkForUpdate").mockRejectedValue({ kind: "Update.BadSignature", message: "x" });
    renderSection();
    fireEvent.click(screen.getByRole("button", { name: "檢查更新" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("簽章驗證失敗");
    expect(screen.getByRole("button", { name: "檢查更新" })).toBeEnabled();
  });
});

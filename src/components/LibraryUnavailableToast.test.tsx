import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";

import "../i18n";
import type { LibraryStatus } from "../lib/types";
import { useLibraryStore } from "../stores/libraryStore";
import { LibraryUnavailableToast } from "./LibraryUnavailableToast";

function show(status: LibraryStatus) {
  useLibraryStore.setState({ status });
  return render(
    <MemoryRouter>
      <LibraryUnavailableToast />
    </MemoryRouter>,
  );
}

const unavailable = (reason: LibraryStatus["reason"]): LibraryStatus => ({
  ready: false,
  path: "/Volumes/USB/DialogueCollector",
  reason,
  stats: null,
});

describe("LibraryUnavailableToast", () => {
  beforeEach(() => useLibraryStore.setState({ status: null }));

  it("uses the board copy for a missing library and links to 設定", () => {
    show(unavailable({ code: "notFound" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "找不到收藏庫，請至「設定 → 檔案管理」指定收藏庫位置",
    );
    expect(screen.getByRole("link", { name: "設定" })).toHaveAttribute("href", "/settings");
  });

  it("names a cloud-sync location", () => {
    show(unavailable({ code: "unsupportedVolume", volume: { kind: "cloudSync", provider: "Dropbox" } }));
    expect(screen.getByRole("alert")).toHaveTextContent("雲端同步資料夾");
  });

  it("names both schema versions", () => {
    show(unavailable({ code: "schemaTooNew", found: 3, supported: 1 }));
    expect(screen.getByRole("alert")).toHaveTextContent("v3");
    expect(screen.getByRole("alert")).toHaveTextContent("v1");
  });

  it("stays hidden when the library is ready or being moved", () => {
    const { container } = show({ ready: true, path: "/lib", reason: null, stats: null });
    expect(container).toBeEmptyDOMElement();
    const moving = show(unavailable({ code: "moving" }));
    expect(moving.container).toBeEmptyDOMElement();
  });
});

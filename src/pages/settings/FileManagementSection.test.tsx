import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import "../../i18n";
import { useLibraryStore } from "../../stores/libraryStore";
import { FileManagementSection } from "./FileManagementSection";

describe("FileManagementSection", () => {
  beforeEach(() =>
    useLibraryStore.setState({ status: null, relocating: false, progress: null }),
  );

  it("shows the location and the storage totals", () => {
    useLibraryStore.setState({
      status: {
        ready: true,
        path: "/Users/me/Library/Application Support/DialogueCollector",
        reason: null,
        stats: { clipCount: 1284, bytes: 2.36 * 1024 ** 3 },
      },
    });
    render(<FileManagementSection />);
    expect(screen.getByLabelText("台詞音檔的預設存放位置")).toHaveValue(
      "/Users/me/Library/Application Support/DialogueCollector",
    );
    expect(screen.getByText("1,284")).toBeInTheDocument();
    expect(screen.getByText("2.36 GB")).toBeInTheDocument();
  });

  it("shows the board's 找不到收藏庫 toast when the library is missing", () => {
    useLibraryStore.setState({
      status: { ready: false, path: "/gone", reason: { code: "notFound" }, stats: null },
    });
    render(<FileManagementSection />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "找不到收藏庫，請重新指定台詞音檔的存放位置",
    );
  });

  it("blocks with a progress dialog while moving", () => {
    useLibraryStore.setState({
      status: { ready: false, path: "/old", reason: { code: "moving" }, stats: null },
      relocating: true,
      progress: { done: 25, total: 100 },
    });
    render(<FileManagementSection />);
    expect(screen.getByRole("dialog")).toHaveTextContent("搬移中…");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "25");
    expect(screen.getByRole("button", { name: "瀏覽" })).toBeDisabled();
  });
});

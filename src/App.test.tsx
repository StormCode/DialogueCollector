import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "./App";
import "./i18n";

describe("App", () => {
  it("renders the main page with both intake paths and the navigation", async () => {
    render(<App />);
    expect(await screen.findByText("依字幕的時間軸切分影片為多個片段")).toBeInTheDocument();
    expect(screen.getByText("直接匯入現有的影片或音訊")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "瀏覽檔案" })).toHaveLength(2);
    expect(screen.getByText("台詞本")).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe("indigo");
  });
});

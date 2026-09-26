import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "./App";
import "./i18n";

describe("App", () => {
  it("renders the main page with both intake paths and the navigation", async () => {
    render(<App />);
    expect(await screen.findByText("從影片字幕匯入")).toBeInTheDocument();
    expect(screen.getByText("直接匯入現有影音")).toBeInTheDocument();
    expect(screen.getByText("台詞本")).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe("indigo");
  });
});

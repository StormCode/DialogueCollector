import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";

import "../../i18n";
import { useUiStore } from "../../stores/uiStore";
import { SideNav } from "./SideNav";

function renderNav() {
  return render(
    <MemoryRouter>
      <SideNav />
    </MemoryRouter>,
  );
}

describe("SideNav", () => {
  beforeEach(() => useUiStore.setState({ navExpanded: true }));

  it("collapses the whole widget, not just its labels", () => {
    renderNav();
    const nav = screen.getByRole("navigation");
    const toggle = screen.getByRole("button", { name: "收合選單" });
    expect(nav).not.toHaveClass("is-collapsed");
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(toggle);
    expect(nav).toHaveClass("is-collapsed");
    expect(screen.getByRole("button", { name: "展開選單" })).toHaveAttribute("aria-expanded", "false");
    // Labels stay; the off-screen links leave the tab order.
    expect(nav).toHaveTextContent("主頁");
    expect(nav.querySelector(".side-nav__items")).toHaveAttribute("inert");

    fireEvent.click(screen.getByRole("button", { name: "展開選單" }));
    expect(nav).not.toHaveClass("is-collapsed");
    expect(nav.querySelector(".side-nav__items")).not.toHaveAttribute("inert");
  });
});

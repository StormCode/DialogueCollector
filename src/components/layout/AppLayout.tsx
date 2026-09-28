import { Outlet } from "react-router";

import { BoardArt } from "../icons/Icon";
import { SideNav } from "./SideNav";

export function AppLayout() {
  return (
    <div className="app-layout">
      {/* The curve every board draws behind its page, in the theme's accent. */}
      <BoardArt name="backdrop" className="app-layout__backdrop" preserveAspectRatio="none" />
      <main className="app-layout__content">
        <Outlet />
      </main>
      <SideNav />
    </div>
  );
}

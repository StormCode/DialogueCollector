import { Outlet } from "react-router";

import { SideNav } from "./SideNav";

export function AppLayout() {
  return (
    <div className="app-layout">
      <main className="app-layout__content">
        <Outlet />
      </main>
      <SideNav />
    </div>
  );
}

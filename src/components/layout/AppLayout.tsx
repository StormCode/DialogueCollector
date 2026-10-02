import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import { inTauri } from "../../lib/ipc";
import { useUiStore } from "../../stores/uiStore";
import { Toast } from "../feedback/Toast";
import { WaveBackdrop } from "../icons/WaveBackdrop";
import { SideNav } from "./SideNav";

/** Must match `NAVIGATE_EVENT` in src-tauri/src/menu.rs: macOS 前往's routes. */
const MENU_NAVIGATE_EVENT = "menu-navigate";

export function AppLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!inTauri()) return;
    const unlisten = listen<string>(MENU_NAVIGATE_EVENT, (e) => navigate(e.payload));
    return () => void unlisten.then((stop) => stop());
  }, [navigate]);
  const notice = useUiStore((s) => s.notice);
  const dismissNotice = useUiStore((s) => s.dismissNotice);
  return (
    <div className="app-layout">
      {/* The curve every board draws behind its page, in the theme's accent, as a moving sine. */}
      <WaveBackdrop className="app-layout__backdrop" />
      <main className="app-layout__content">
        <Outlet />
      </main>
      <SideNav />
      {notice && (
        <Toast
          key={notice.text}
          tone={notice.tone}
          onDismiss={dismissNotice}
          autoDismissMs={5000}
          minWidth={notice.minWidth}
        >
          {notice.text}
        </Toast>
      )}
    </div>
  );
}

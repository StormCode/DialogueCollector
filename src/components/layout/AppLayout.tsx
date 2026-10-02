import { Outlet } from "react-router";

import { useUiStore } from "../../stores/uiStore";
import { Toast } from "../feedback/Toast";
import { WaveBackdrop } from "../icons/WaveBackdrop";
import { SideNav } from "./SideNav";

export function AppLayout() {
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

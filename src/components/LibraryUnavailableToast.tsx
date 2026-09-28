import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import type { UnavailableReason } from "../lib/types";
import { useLibraryStore } from "../stores/libraryStore";
import { Toast } from "./feedback/Toast";

/** Navigation state that makes 設定頁 scroll 檔案管理 into view and focus it (DD3). */
export const FOCUS_FILES_STATE = { focus: "files" } as const;

export function unavailableMessageKey(reason: UnavailableReason): string {
  switch (reason.code) {
    case "unsupportedVolume":
      return reason.volume.kind === "cloudSync"
        ? "library.unavailable.cloudSync"
        : "library.unavailable.network";
    case "schemaTooNew":
      return "library.unavailable.schemaTooNew";
    default:
      return "library.unavailable.notFound";
  }
}

// Board: Main.dc.html (libraryNotFound). Shown on the main page when no library could be opened.
export function LibraryUnavailableToast() {
  const { t } = useTranslation();
  const status = useLibraryStore((s) => s.status);
  const [dismissed, setDismissed] = useState(false);

  const reason = status?.reason;
  if (dismissed || !status || status.ready || !reason || reason.code === "moving") return null;

  const values =
    reason.code === "schemaTooNew" ? { found: reason.found, supported: reason.supported } : {};

  return (
    <Toast
      tone="negative"
      onDismiss={() => setDismissed(true)}
      action={
        <Link className="toast__action" to="/settings" state={FOCUS_FILES_STATE}>
          {t("nav.settings")}
        </Link>
      }
    >
      {t(unavailableMessageKey(reason), values)}
    </Toast>
  );
}

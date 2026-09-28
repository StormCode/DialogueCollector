import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import "./Toast.css";

interface ToastProps {
  tone: "negative" | "positive" | "informative";
  children: ReactNode;
  onDismiss: () => void;
  /** Extra control shown before the close button (e.g. the 設定 link on the main page). */
  action?: ReactNode;
  /** Milliseconds before auto-dismiss; omit to stay until closed. */
  autoDismissMs?: number;
}

// Boards: Main.dc.html (.lib-toast) and the Settings toasts.
export function Toast({ tone, children, onDismiss, action, autoDismissMs }: ToastProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!autoDismissMs) return;
    const timer = window.setTimeout(onDismiss, autoDismissMs);
    return () => window.clearTimeout(timer);
  }, [autoDismissMs, onDismiss]);

  return (
    <div className={`toast toast--${tone}`} role={tone === "negative" ? "alert" : "status"}>
      <span className="toast__text">{children}</span>
      {action}
      <button type="button" className="toast__close" aria-label={t("common.close")} onClick={onDismiss}>
        <svg viewBox="0 -960 960 960" width="16" height="16" aria-hidden="true" fill="currentColor">
          <path d="m256-213.85-42.15-42.15L437.85-480 213.85-704l42.15-42.15L480-522.15l224-224L746.15-704l-224 224 224 224L704-213.85l-224-224-224 224Z" />
        </svg>
      </button>
    </div>
  );
}

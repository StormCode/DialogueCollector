import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { BentoIcon, type BentoIconName } from "../icons/Icon";
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

// Bento Toast's leading glyph per tone.
const GLYPH: Record<ToastProps["tone"], BentoIconName> = {
  negative: "NegativeSolid",
  positive: "PositiveSolid",
  informative: "InfoSolid",
};

// Boards: Main.dc.html (.lib-toast) and the Settings toasts (Bento Toast).
export function Toast({ tone, children, onDismiss, action, autoDismissMs }: ToastProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!autoDismissMs) return;
    const timer = window.setTimeout(onDismiss, autoDismissMs);
    return () => window.clearTimeout(timer);
  }, [autoDismissMs, onDismiss]);

  return (
    <div className={`toast toast--${tone}`} role={tone === "negative" ? "alert" : "status"}>
      <span className="toast__icon">
        <BentoIcon name={GLYPH[tone]} size={16} />
      </span>
      <span className="toast__text">{children}</span>
      {action}
      <button type="button" className="toast__close" aria-label={t("common.close")} onClick={onDismiss}>
        <BentoIcon name="XWeightBold" size={16} />
      </button>
    </div>
  );
}

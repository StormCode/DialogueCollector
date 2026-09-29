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
  /** Boards that set the Bento Toast's width (e.g. 360 on SubtitleSelect). */
  width?: number;
  /** Sized to its text but at least this wide (Main's 尚未支援此格式: 360). */
  minWidth?: number;
}

// Bento Toast's leading glyph per tone.
const GLYPH: Record<ToastProps["tone"], BentoIconName> = {
  negative: "NegativeSolid",
  positive: "PositiveSolid",
  informative: "InfoSolid",
};

// Boards: Main.dc.html (.lib-toast) and the Settings toasts (Bento Toast).
export function Toast({ tone, children, onDismiss, action, autoDismissMs, width, minWidth }: ToastProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!autoDismissMs) return;
    const timer = window.setTimeout(onDismiss, autoDismissMs);
    return () => window.clearTimeout(timer);
  }, [autoDismissMs, onDismiss]);

  return (
    <div
      className={`toast toast--${tone}`}
      role={tone === "negative" ? "alert" : "status"}
      style={
        width
          ? { width: `min(${width}px, calc(100vw - 48px))` }
          : minWidth
            ? { width: "auto", minWidth: `min(${minWidth}px, calc(100vw - 48px))` }
            : undefined
      }
    >
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

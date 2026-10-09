import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { BentoIcon } from "../icons/Icon";
import { ButtonSpinner } from "./Button";
import "./ui.css";

interface ModalProps {
  title: string;
  children: ReactNode;
  /** Omit to make the modal non-dismissable (e.g. while an export runs). */
  onClose?: () => void;
  size?: "small" | "medium" | "large";
  /** Extra class on the dialog, e.g. to retint its buttons as a board does. */
  className?: string;
  /** Bento Modal's Actions row: a transparent secondary and a solid primary button. */
  actions?: {
    primary: { label: string; onClick: () => void; disabled?: boolean; loading?: boolean };
    secondary: { label: string; onClick: () => void };
  };
}

/** Open modals, bottom to top. */
const openModals: symbol[] = [];

// Bento Modal as drawn on the boards: scrim, drop-in card, title bar. Focus moves into the
// dialog on open; the first element marked data-autofocus wins (取消 on destructive
// dialogs), otherwise the dialog itself.
export function Modal({ title, children, onClose, size = "medium", actions, className = "" }: ModalProps) {
  const { t } = useTranslation();
  const dialog = useRef<HTMLDivElement>(null);

  // A layout effect, so focus is in the dialog before it first paints — never on the page
  // behind it, however slow the machine.
  useLayoutEffect(() => {
    const el = dialog.current;
    const target = el?.querySelector<HTMLElement>("[data-autofocus]") ?? el;
    target?.focus();
  }, []);

  // Stacked modals (e.g. 全部刪除's confirmation over 遺失的檔案): Esc closes only the top one.
  const id = useRef(Symbol("modal"));
  useEffect(() => {
    const me = id.current;
    openModals.push(me);
    return () => {
      openModals.splice(openModals.indexOf(me), 1);
    };
  }, []);

  useEffect(() => {
    if (!onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openModals[openModals.length - 1] === id.current) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Rendered into <body>: an ancestor with a transform (a section's entrance, another modal's
  // drop-in) would otherwise become the containing block of this fixed layer.
  return createPortal(
    <div className="ui-modal-layer">
      <div className="ui-modal-backdrop" aria-hidden="true" />
      <div
        ref={dialog}
        className={`ui-modal ui-modal--${size} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <div className="ui-modal__head">
          <span className="ui-modal__title">{title}</span>
          {onClose && (
            <button type="button" className="ui-modal__close" aria-label={t("common.close")} onClick={onClose}>
              <BentoIcon name="XWeightBold" size={16} />
            </button>
          )}
        </div>
        <div className="ui-modal__divider" />
        <div className="ui-modal__body">{children}</div>
        {actions && (
          <div className="ui-modal__actions">
            <button type="button" className="ui-btn ui-btn--medium ui-btn--transparent" onClick={actions.secondary.onClick}>
              {actions.secondary.label}
            </button>
            <button
              type="button"
              className={`ui-btn ui-btn--medium ui-btn--solid${actions.primary.loading ? " is-loading" : ""}`}
              onClick={actions.primary.onClick}
              disabled={actions.primary.disabled || actions.primary.loading}
              aria-busy={actions.primary.loading || undefined}
            >
              {actions.primary.loading && <ButtonSpinner />}
              {actions.primary.label}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

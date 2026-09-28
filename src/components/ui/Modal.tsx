import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { BentoIcon } from "../icons/Icon";
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
    primary: { label: string; onClick: () => void; disabled?: boolean };
    secondary: { label: string; onClick: () => void };
  };
}

// Bento Modal as drawn on the boards: scrim, drop-in card, title bar. Focus moves into the
// dialog on open; the first element marked data-autofocus wins (DT2: 取消 on destructive
// dialogs), otherwise the dialog itself.
export function Modal({ title, children, onClose, size = "medium", actions, className = "" }: ModalProps) {
  const { t } = useTranslation();
  const dialog = useRef<HTMLDivElement>(null);

  // A layout effect, so focus is in the dialog before it first paints — never on the page
  // behind it, however slow the machine (DT2).
  useLayoutEffect(() => {
    const el = dialog.current;
    const target = el?.querySelector<HTMLElement>("[data-autofocus]") ?? el;
    target?.focus();
  }, []);

  useEffect(() => {
    if (!onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
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
              className="ui-btn ui-btn--medium ui-btn--solid"
              onClick={actions.primary.onClick}
              disabled={actions.primary.disabled}
            >
              {actions.primary.label}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import "./ui.css";

interface ModalProps {
  title: string;
  children: ReactNode;
  /** Omit to make the modal non-dismissable (e.g. while an export runs). */
  onClose?: () => void;
  size?: "small" | "medium";
}

// Bento Modal as drawn on the boards: scrim, drop-in card, title bar. Focus moves into the
// dialog on open; the first element marked data-autofocus wins (DT2: 取消 on destructive
// dialogs), otherwise the dialog itself.
export function Modal({ title, children, onClose, size = "medium" }: ModalProps) {
  const { t } = useTranslation();
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
        className={`ui-modal ui-modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <div className="ui-modal__head">
          <span className="ui-modal__title">{title}</span>
          {onClose && (
            <button type="button" className="ui-modal__close" aria-label={t("common.close")} onClick={onClose}>
              <svg viewBox="0 -960 960 960" width="20" height="20" aria-hidden="true" fill="currentColor">
                <path d="m256-213.85-42.15-42.15L437.85-480 213.85-704l42.15-42.15L480-522.15l224-224L746.15-704l-224 224 224 224L704-213.85l-224-224-224 224Z" />
              </svg>
            </button>
          )}
        </div>
        <div className="ui-modal__body">{children}</div>
      </div>
    </div>
  );
}

import type { ButtonHTMLAttributes } from "react";

import { MaterialIcon } from "../icons/Icon";
import "./ui.css";

type Variant = "solid" | "outline" | "neutral" | "danger" | "dangerOutline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "medium" | "small";
  fullWidth?: boolean;
  /** Work under way (e.g. a portrait being shrunk on save): a spinner before the label, no clicks. */
  loading?: boolean;
}

/** The spinner a loading button shows before its label (as on 設定's update check). */
export function ButtonSpinner() {
  return (
    <span className="ui-spin" aria-hidden="true">
      <MaterialIcon name="progress_activity" size={18} />
    </span>
  );
}

// Bento Button as used on the boards: solid / outline primary, plus the neutral and danger
// buttons the modals draw by hand (.ic-btn-neutral / .ic-btn-danger).
export function Button({
  variant = "solid",
  size = "medium",
  fullWidth = false,
  className = "",
  type = "button",
  loading = false,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`ui-btn ui-btn--${variant === "dangerOutline" ? "danger-outline" : variant} ui-btn--${size}${fullWidth ? " ui-btn--full" : ""}${loading ? " is-loading" : ""} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <ButtonSpinner />}
      {children}
    </button>
  );
}

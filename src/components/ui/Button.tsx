import type { ButtonHTMLAttributes } from "react";

import "./ui.css";

type Variant = "solid" | "outline" | "neutral" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "medium" | "small";
  fullWidth?: boolean;
}

// Bento Button as used on the boards: solid / outline primary, plus the neutral and danger
// buttons the modals draw by hand (.ic-btn-neutral / .ic-btn-danger).
export function Button({
  variant = "solid",
  size = "medium",
  fullWidth = false,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`ui-btn ui-btn--${variant} ui-btn--${size}${fullWidth ? " ui-btn--full" : ""} ${className}`}
      {...rest}
    />
  );
}

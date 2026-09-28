import type { SelectHTMLAttributes } from "react";

import "./ui.css";

export interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

// Bento SelectField, rendered as a native <select> so keyboard and screen readers work for free.
export function SelectField({ options, value, onChange, className = "", ...rest }: SelectFieldProps) {
  return (
    <span className={`ui-select ${className}`}>
      <select value={value} onChange={(e) => onChange(e.target.value)} {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg viewBox="0 -960 960 960" width="18" height="18" aria-hidden="true" fill="currentColor">
        <path d="M480-362.46 240-602.46 282.46-645 480-447.46 677.54-645 720-602.46l-240 240Z" />
      </svg>
    </span>
  );
}

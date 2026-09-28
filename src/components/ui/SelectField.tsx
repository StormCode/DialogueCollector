import type { SelectHTMLAttributes } from "react";

import { BentoIcon } from "../icons/Icon";
import "./ui.css";

export interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  /** Bento SelectField's 11px label; omit when the row already labels it. */
  label?: string;
}

// Bento SelectField, rendered as a native <select> so keyboard and screen readers work for free.
export function SelectField({ options, value, onChange, label, className = "", ...rest }: SelectFieldProps) {
  const select = (
    <span className={`ui-select ${className}`}>
      <select value={value} onChange={(e) => onChange(e.target.value)} {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <BentoIcon name="ChevronDown" className="ui-select__chevron" />
    </span>
  );
  if (!label) return select;
  return (
    <label className="ui-field">
      <span className="ui-field__label">{label}</span>
      {select}
    </label>
  );
}

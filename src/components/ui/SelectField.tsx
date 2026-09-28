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
      <BentoIcon name="ChevronDown" className="ui-select__chevron" />
    </span>
  );
}

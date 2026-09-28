import { useId } from "react";

import "./ui.css";

// Bento Field (text): an 11px label (" *" when required) over a 16px-radius input box.
export function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  autoFocus,
  invalid,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  autoFocus?: boolean;
  invalid?: boolean;
}) {
  const id = useId();
  return (
    <div className="ui-field">
      <label className="ui-field__label" htmlFor={id}>
        {label}
        {required && " *"}
      </label>
      <div className={`ui-field__box${invalid ? " is-invalid" : ""}`}>
        <input
          id={id}
          value={value}
          placeholder={placeholder}
          required={required}
          aria-invalid={invalid || undefined}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

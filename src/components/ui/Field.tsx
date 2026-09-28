import { useId } from "react";

import "./ui.css";

// Bento Field: an 11px label (" *" when required) over a 16px-radius input box; `rows` makes it
// the textarea kind, `error` draws the strong negative ring and the 12px text under the box.
export function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  autoFocus,
  invalid,
  error,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  autoFocus?: boolean;
  invalid?: boolean;
  error?: string;
  rows?: number;
}) {
  const id = useId();
  const bad = invalid || !!error;
  const common = {
    id,
    value,
    placeholder,
    required,
    autoFocus,
    "aria-invalid": bad || undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  };
  return (
    <div className="ui-field">
      <label className="ui-field__label" htmlFor={id}>
        {label}
        {required && " *"}
      </label>
      <div className={`ui-field__box${bad ? " is-invalid" : ""}${rows ? " is-textarea" : ""}`}>
        {rows ? (
          <textarea {...common} rows={rows} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input {...common} onChange={(e) => onChange(e.target.value)} />
        )}
      </div>
      {error && (
        <div className="ui-field__error" id={`${id}-error`}>
          {error}
        </div>
      )}
    </div>
  );
}

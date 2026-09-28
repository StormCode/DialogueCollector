import { useEffect, useState } from "react";

import "./ui.css";

interface NumberFieldProps {
  id?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  /** Called with a valid value when the user commits (blur or Enter). */
  onCommit: (value: number) => void;
  "aria-label"?: string;
}

function isValid(n: number, min: number, max: number, step: number) {
  return Number.isFinite(n) && n >= min && n <= max && Math.abs(n / step - Math.round(n / step)) < 1e-9;
}

// Bento Field kind="number" with a unit suffix. Edits are local until committed; an invalid
// entry reverts to the last saved value instead of being saved.
export function NumberField({ id, value, min, max, step = 1, unit, onCommit, ...rest }: NumberFieldProps) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  const commit = () => {
    const n = Number(draft);
    if (draft.trim() !== "" && isValid(n, min, max, step)) {
      if (n !== value) onCommit(n);
    } else {
      setDraft(String(value));
    }
  };

  return (
    <span className="ui-number">
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        {...rest}
      />
      <span className="ui-number__unit" aria-hidden="true">
        {unit}
      </span>
    </span>
  );
}

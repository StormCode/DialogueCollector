import { BentoIcon } from "../icons/Icon";
import "./ui.css";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** Name the box for screen readers only, as boards that draw a bare box do (aria-label). */
  hideLabel?: boolean;
}

export function Checkbox({ checked, onChange, label, hideLabel }: CheckboxProps) {
  return (
    <label className="ui-checkbox">
      <input
        type="checkbox"
        checked={checked}
        aria-label={hideLabel ? label : undefined}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="ui-checkbox__box" aria-hidden="true">
        <BentoIcon name="CheckWeightBold" size={16} />
      </span>
      {!hideLabel && <span>{label}</span>}
    </label>
  );
}

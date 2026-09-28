import { BentoIcon } from "../icons/Icon";
import "./ui.css";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="ui-checkbox">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="ui-checkbox__box" aria-hidden="true">
        <BentoIcon name="CheckWeightBold" size={16} />
      </span>
      <span>{label}</span>
    </label>
  );
}

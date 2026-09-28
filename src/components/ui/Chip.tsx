import { BentoIcon } from "../icons/Icon";
import "./ui.css";

// Bento Chip (color "indigo" → the theme accent, removable).
export function Chip({ label, onRemove, removeLabel }: { label: string; onRemove: () => void; removeLabel: string }) {
  return (
    <span className="ui-chip">
      <span className="ui-chip__label">{label}</span>
      <button type="button" className="ui-chip__remove" aria-label={removeLabel} onClick={onRemove}>
        <BentoIcon name="XWeightBold" size={12} />
      </button>
    </span>
  );
}

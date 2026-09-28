import "./ui.css";

// Bento Switch: a 42×24 track with a 16px knob, label beside it.
export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (on: boolean) => void; label: string }) {
  return (
    <label className="ui-switch">
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="ui-switch__track" aria-hidden="true">
        <span className="ui-switch__knob" />
      </span>
      <span className="ui-switch__label">{label}</span>
    </label>
  );
}

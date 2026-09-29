import { convertFileSrc } from "@tauri-apps/api/core";

import { inTauri } from "../../lib/ipc";
import "./characters.css";

// Avatar fallback colours: one data-vis ramp per character, stable across sessions. The boards
// give each character a ramp and draw the initial in step 70 on step 10.
const RAMPS = ["indigo", "jade", "pink", "orange", "blue", "violet", "red", "green"] as const;

export function rampFor(characterId: number) {
  return RAMPS[Math.abs(characterId) % RAMPS.length];
}

/** A round portrait, or the name's first character on the character's ramp. */
export function CharacterAvatar({
  id,
  name,
  portraitPath,
  size = 32,
  label,
}: {
  id: number;
  name: string;
  portraitPath: string | null;
  size?: number;
  /** Set when the avatar alone identifies the character (otherwise decorative). */
  label?: string;
}) {
  const ramp = rampFor(id);
  return (
    <span
      className="char-avatar"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      title={label}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.43),
        // The ramp is for the initial; a photo keeps its own transparency.
        background: portraitPath ? "transparent" : `var(--bento-dv-${ramp}-10)`,
        color: `var(--bento-dv-${ramp}-70)`,
      }}
    >
      {portraitPath && inTauri() ? <img src={convertFileSrc(portraitPath)} alt="" /> : Array.from(name)[0]}
    </span>
  );
}

import type { CSSProperties } from "react";

import { BENTO_ICONS, BOARD_ART, MATERIAL_ICONS } from "./iconData";

// The two icon sets the boards use. Use exactly the board's icon — never a look-alike from the
// other set (scripts/icons/build-icons.mjs adds new ones).

export type BentoIconName = keyof typeof BENTO_ICONS;
export type MaterialIconName = keyof typeof MATERIAL_ICONS;
export type BoardArtName = keyof typeof BOARD_ART;

interface IconProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/** A board's `<Icon name="…">`, rendered as Bento's Icon does. */
export function BentoIcon({ name, size = 24, className, style }: IconProps & { name: BentoIconName }) {
  const icon = BENTO_ICONS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox={icon.viewBox}
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ display: "block", flexShrink: 0, ...style }}
      // Verbatim path markup from the vendored Bento bundle (geometry only).
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}

/** A board's `.material-symbol` glyph (Outlined, FILL 0, wght 200, opsz 24). */
export function MaterialIcon({
  name,
  size = 24,
  className,
  style,
}: IconProps & { name: MaterialIconName }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 -960 960 960"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={{ display: "block", flexShrink: 0, ...style }}
    >
      <path d={MATERIAL_ICONS[name]} />
    </svg>
  );
}

/** SVG art drawn on a board itself (no icon set), verbatim. Size it with `style`/CSS. */
export function BoardArt({
  name,
  className,
  style,
  preserveAspectRatio,
}: {
  name: BoardArtName;
  className?: string;
  style?: CSSProperties;
  preserveAspectRatio?: string;
}) {
  const art = BOARD_ART[name];
  return (
    <svg
      viewBox={art.viewBox}
      aria-hidden="true"
      className={className}
      style={style}
      preserveAspectRatio={preserveAspectRatio}
      // Verbatim markup from design/boards (geometry only).
      dangerouslySetInnerHTML={{ __html: art.body }}
    />
  );
}

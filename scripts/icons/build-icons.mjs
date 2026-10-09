// Generates src/components/icons/iconData.ts: the exact icons the canvas boards use.
//
// - Bento icons (`<Icon name="X">` on a board) come from the vendored Bento bundle, resolved
//   the way Bento's resolveIconName does (a bare name picks its first weight in WEIGHTS).
// - Material Symbols glyphs (`.material-symbol` on a board) are Outlined, FILL 0, wght 200,
//   GRAD 0, opsz 24 — the boards' font-variation-settings — fetched from Google's repository.
//   Where a board overrides the settings, the entry names the variant as Google's file names
//   do: "keep:wght300", "keep:wght300fill1", "play_arrow:fill1" (wght 400, filled).
//
// Never draw a look-alike: add the board's icon name to a list below and rerun
// `node scripts/icons/build-icons.mjs`.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BENTO = [
  "Bin",
  "ChevronDown",
  "ChevronLeft",
  "ChevronRight",
  "ChevronUp",
  "CheckWeightBold",
  "GearWeightRegular",
  "Home",
  "InfoSolid",
  "LightbulbWeightRegular",
  "NegativeSolid",
  "PencilWeightRegular",
  "PositiveCircle",
  "PositiveSolid",
  "Search",
  "WarningSolid",
  "XWeightBold",
];

const MATERIAL = [
  "add",
  "arrow_back",
  "arrow_downward",
  "arrow_upward",
  "book_2",
  "calendar_today",
  "chat",
  "check",
  "chevron_left",
  "chevron_right",
  "close",
  "content_cut",
  "domain_add",
  "forward",
  "download",
  "error",
  "expand_more:wght300",
  "filter_list",
  "first_page",
  "folder_open",
  "graphic_eq",
  "image",
  "info",
  "keep",
  "keep:wght300fill1",
  "last_page",
  "more_vert",
  "lightbulb",
  "movie",
  "notes",
  "palette",
  "pause:fill1",
  "person",
  "person_add",
  "play_arrow:fill1",
  "playlist_play",
  "priority_high",
  "progress_activity",
  "refresh",
  "save",
  "schedule",
  "settings_backup_restore",
  "short_text",
  "stop:fill1",
  "stop_circle",
  "subtitles",
  "subtitles_off",
  "swap_vert",
  "call_split",
  "call_merge",
  "arrow_forward",
  "sync",
  "timer",
  "upload",
];

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

// Art drawn directly on a board (no icon set): the inner markup of one <svg>, verbatim.
const BOARD_ART = [
  // 新增角色's portrait drop zone background.
  { name: "portraitDrop", board: "AddCharacter.dc.html", svg: /<svg viewBox="0 258 1824 2034"[\s\S]*?<\/svg>/ },
  // The + before 新增角色 in Step 2's 指派給… menu.
  { name: "plus", board: "SubtitleSelect.dc.html", svg: /<svg width="16" height="16" viewBox="0 0 24 24"[\s\S]*?<\/svg>/ },
  // EditLine's preview button: its own play triangle and pause bars.
  { name: "previewPlay", board: "EditLine.dc.html", svg: /<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5\.14[\s\S]*?<\/svg>/ },
  { name: "previewPause", board: "EditLine.dc.html", svg: /<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect[\s\S]*?<\/svg>/ },
  // The curve behind every page: the moving wave's start (Main).
  { name: "backdrop", board: "Main.dc.html", svg: /<svg viewBox="0 0 1280 800"[\s\S]*?<\/svg>/ },
];

function boardArt({ name, board, svg }) {
  const html = readFileSync(join(root, "design/boards", board), "utf8");
  const found = html.match(svg);
  if (!found) throw new Error(`${name}: not found in ${board}`);
  const viewBox = found[0].match(/viewBox="([^"]+)"/)[1];
  const body = found[0]
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>$/, "")
    .trim()
    // Board-local variable names → the app's; the boards' indigo is the default theme's accent.
    .replaceAll("var(--accent-5)", "var(--dc-accent-5)")
    .replaceAll("var(--bento-dv-indigo-5)", "var(--dc-accent-5)");
  return [name, { viewBox, body }];
}
const bundle = readFileSync(join(root, "design/bento/components/bundle.js"), "utf8");

function bento(name) {
  const m = bundle.match(
    new RegExp(`"${name}": \\{\\s*viewBox: "([^"]+)",\\s*body: "((?:[^"\\\\]|\\\\.)*)"`),
  );
  if (!m) throw new Error(`Bento icon ${name} not found in the bundle`);
  return { viewBox: m[1], body: JSON.parse(`"${m[2]}"`) };
}

async function material(entry) {
  const [name, variant = "wght200"] = entry.split(":");
  const suffix = variant === "wght400" ? "" : `_${variant}`;
  const url = `https://raw.githubusercontent.com/google/material-design-icons/master/symbols/web/${name}/materialsymbolsoutlined/${name}${suffix}_24px.svg`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status} from ${url}`);
  const svg = await res.text();
  const paths = [...svg.matchAll(/<path d="([^"]+)"/g)];
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  if (paths.length !== 1 || viewBox !== "0 -960 960 960") {
    throw new Error(`${name}: unexpected SVG shape`);
  }
  return paths[0][1];
}

const bentoData = Object.fromEntries(BENTO.map((n) => [n, bento(n)]));
const materialData = Object.fromEntries(
  await Promise.all(MATERIAL.map(async (n) => [n, await material(n)])),
);

const boardData = Object.fromEntries(BOARD_ART.map(boardArt));

const out = `// Generated by scripts/icons/build-icons.mjs — do not edit. Add icons there and rerun.

/** Bento DS icons, verbatim from design/bento/components/bundle.js. */
export const BENTO_ICONS = ${JSON.stringify(bentoData, null, 2)} as const;

/** Material Symbols Outlined, FILL 0 wght 200 GRAD 0 opsz 24 unless the key names a variant ("keep:wght300fill1"); viewBox 0 -960 960 960. */
export const MATERIAL_ICONS = ${JSON.stringify(materialData, null, 2)} as const;

/** SVG art drawn on the boards themselves, verbatim (inner markup + viewBox). */
export const BOARD_ART = ${JSON.stringify(boardData, null, 2)} as const;
`;
writeFileSync(join(root, "src/components/icons/iconData.ts"), out);
console.log(
  `wrote ${BENTO.length} Bento, ${MATERIAL.length} Material and ${BOARD_ART.length} board-art icons`,
);

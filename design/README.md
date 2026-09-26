# design/

Vendored from the Claude Design canvas `https://claude.ai/artifact/T3aaPvyGx8V8aZj5sUonSD`
(Bento DS 2.7). Re-pull rather than hand-edit, so every canvas change is a reviewable diff (T23).

- `bento/tokens.css`, `bento/tokens.json` — design tokens. The app imports `tokens.css`.
- `bento/components/bundle.css`, `bundle.js` — the canvas's component bundle, kept for
  reference only. `bundle.js` is a global-namespace build for the canvas runtime and is not
  loaded by the app; `bundle.css` pulls fonts from Google Fonts, which the offline app must not.
- `boards/*.dc.html` + `canvas.json` — the 40 boards that are the UI contract. Read them as
  specs; they do not run outside the canvas.

Rules carried from PLAN.md's design review:
- `--bento-dv-indigo-*` in a board becomes `--dc-accent*` in a component (DD6, see
  `src/styles/themes.css`).
- CJK faces apply to the 台詞 area only; the interface uses the per-locale system font (DD5).
- `tokens.css` references Clash Grotesk / Brandon Text woff2 files that the canvas does not
  export; Vite warns about them at build time. They have no CJK coverage anyway.

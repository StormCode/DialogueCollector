# 台詞收藏家 / dialogue-collector

A desktop app (macOS + Windows) that builds a personal, character-organized library of
dialogue audio clips from your own video files. Fully offline. The plan and every decision
behind it live in [`PLAN.md`](PLAN.md).

## Stack (PLAN.md D1 → B)

| Layer | Choice |
|---|---|
| Shell | Tauri 2 (Rust) |
| Renderer | Vite + React 19 + TypeScript, Zustand, react-router (hash), i18next |
| Design system | Bento DS 2.7, vendored in `design/` |
| Content store | SQLite via `rusqlite` (bundled), accessed from Rust only |
| Media | ffmpeg as a Tauri sidecar, one pass per cue |
| Tests | `cargo test` (Rust), Vitest + Testing Library (renderer) |

## Layout

```
src/                     renderer
  components/layout/     AppLayout + the right-hand collapsible SideNav
  pages/                 Main, ScriptBook (角色簿), Lines (台詞頁), Settings, import/*
  stores/                Zustand stores
  lib/ipc.ts             the only place that calls `invoke`
  lib/types.ts           TS mirrors of the Rust IPC types
  i18n/locales/          zh-Hant (default), zh-Hans, ja, en — key parity is tested
  styles/                tokens import, per-locale UI font, 台詞 fonts, --dc-* theme layer
  assets/fonts, icons    OFL 台詞 fonts, Material Symbols SVGs
src-tauri/src/           Rust core
  subs/                  ASS / SRT → cues
  media/                 ffmpeg sidecar, clip naming
  store/                 SQLite connection rules, schema version
  library/               library folder, settings.json / machine.json, export/import
  import/                cue → clip pipeline, partial failure, retry, cancel
  commands.rs            the Tauri command surface
design/                  vendored canvas boards + Bento tokens (reference, re-pull to update)
```

## Where things live on disk

| What | macOS | Windows |
|---|---|---|
| `settings.json` + `machine.json` (fixed) | `~/Library/Preferences/DialogueCollector/` | `%APPDATA%\DialogueCollector\` |
| Library folder (default, relocatable) | `~/Library/Application Support/DialogueCollector` | `%LOCALAPPDATA%\DialogueCollector` |

`settings.json` is portable and goes into the export zip; `machine.json` (library pointer,
window geometry, last picker dir) never does.

## Develop

Prerequisites: Node 20+, Rust stable (`rustup`), and on Windows the WebView2 runtime.

```sh
npm install
npm run tauri dev        # app with hot reload
npm test                 # renderer tests
npm run typecheck
cd src-tauri && cargo test
```

## Not wired yet

- ffmpeg sidecar binaries — see `src-tauri/binaries/README.md` (T1, T3)
- SQLite schema v1 and migrations (T4 / ET1)
- Updater (T22), CI matrix (T21)
- Open decisions that block specific modules: **F2** (which side parses subtitles),
  **R8** (what 索引中 does), **ENG4 tie-break** confirmation. See PLAN.md.

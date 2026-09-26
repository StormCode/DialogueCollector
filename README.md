# 台詞收藏家 / dialogue-collector

可以用字幕檔提取影片台詞的應用，支援多平台。

A desktop app (macOS + Windows) that builds a personal, character-organized library of
dialogue audio clips from your own video files. Fully offline. The plan and every decision
behind it live in `PLAN.md`, which is kept locally and is not part of this repository;
decision IDs in comments (D1, ENG2, T4, …) refer to it.

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

The Windows installer (per-user) installs the program to `%LOCALAPPDATA%\Programs\DialogueCollector`.
It uses a vendored copy of Tauri's NSIS template (`src-tauri/windows/installer.nsi`) changed in
one line, because Tauri's default per-user location is the default library folder below.
`node scripts/nsis/check-template.mjs` (run in CI) fails when a Tauri CLI upgrade leaves the copy
stale; `--write` re-syncs it.

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
scripts/ffmpeg/build-macos.sh          # macOS: LGPL ffmpeg sidecar for this Mac's arch
scripts/ffmpeg/build-windows.sh        # Windows, in MSYS2 UCRT64: same, statically linked
npm run tauri dev        # app with hot reload
npm test                 # renderer tests
npm run typecheck
cd src-tauri && cargo test
```

### Walking-skeleton check (T1)

`npm run tauri build`, then run the packaged binary with `--smoke`
(`DialogueCollector.app/Contents/MacOS/dialogue-collector --smoke [--smoke-report <file>]`).
It spawns the bundled ffmpeg, cuts a hardcoded 2 s cue from a generated source, writes one row
to a throwaway database in the OS temp dir, loads the clip in the renderer through the asset
protocol, prints `SMOKE OK|FAIL …` and exits 0 / 1 (2 on watchdog timeout). The same check runs
from 設定 → 目前版本 → 診斷工具. CI: `.github/workflows/package-smoke.yml`.

## Not wired yet

- SQLite schema v1 and migrations (T4 / ET1)
- Updater (T22), CI matrix (T21)
- Open decisions that block specific modules: **F2** (which side parses subtitles),
  **R8** (what 索引中 does), **ENG4 tie-break** confirmation. See PLAN.md.

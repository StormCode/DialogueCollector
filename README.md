## Dialogue Collector · 台詞收藏家

<p align="center"><img src="src-tauri/icons/128x128@2x.png" width="160" alt="Dialogue Collector logo"></p>

**Cut your favourite lines out of your own videos and keep them, by character, in a library you own.**

**Fully offline · macOS (Apple Silicon / Intel) · Windows x64**

Latest stable release: **v0.1.5** · Supports: **macOS 11+**, **Windows 10/11 x64**

### [Download the latest stable build](https://github.com/StormCode/DialogueCollector/releases/latest)

| Platform | File |
| --- | --- |
| macOS, Apple Silicon | [DialogueCollector_0.1.5_aarch64.dmg](https://github.com/StormCode/DialogueCollector/releases/latest) |
| macOS, Intel | [DialogueCollector_0.1.5_x64.dmg](https://github.com/StormCode/DialogueCollector/releases/latest) |
| Windows x64 | [DialogueCollector_0.1.5_x64-setup.exe](https://github.com/StormCode/DialogueCollector/releases/latest) |

All releases: https://github.com/StormCode/DialogueCollector/releases

The app is not code-signed: macOS and Windows warn on first launch, and you open it anyway once (macOS: right-click → Open; Windows: More info → Run anyway).

## What is Dialogue Collector

Dialogue Collector is a desktop app that turns the videos you already own into a personal library of voice clips, one line at a time, filed under the character who said it. Nothing leaves your computer.

- **A script book of characters.** Each character gets a portrait, voice actor and series; their page plays lines one by one or in sequence, pins favourites, searches and filters, and carries a banner poster.
- **Cut clips from subtitles.** Drop a video with its ASS or SRT file; every line you pick becomes its own audio clip, cut at the subtitle's timing.
- **Embedded subtitles too.** Drop an MKV or MP4 alone and pick one of its text subtitle tracks; the app extracts it for you.
- **Bilingual subtitles, sorted out.** Lines split across two languages are paired back into one, the larger-drawn subtitle as the original and the other as the translation; one click swaps them for the whole file.
- **Shape lines before you import.** Play any line from the video's audio, merge several (with a gap of your choosing between them), split them back, and assign characters to many lines at once.
- **Import what you already have.** Bring in existing audio (m4a, mp3, wav) or video as is, several files at a time, and type the line yourself.
- **A library you own.** Clips are plain files in a folder you choose and can move; back everything up to one zip and restore it on another machine.
- **Made to feel at home.** Multiple languages supported, including Traditional and Simplified Chinese, Japanese and English; seven custom themes (including a dark theme) and optional automatic updates.

## Stack

| Layer | Choice |
| --- | --- |
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

The Windows installer (per-user) installs the program to `%LOCALAPPDATA%\Programs\DialogueCollector`. It uses a vendored copy of Tauri's NSIS template (`src-tauri/windows/installer.nsi`) with two changes: that install folder, because Tauri's default per-user location is the default library folder below; and shortcuts and the Apps & Features entry named in the installer's language. `node scripts/nsis/check-template.mjs` (run in CI) fails when a Tauri CLI upgrade leaves the copy stale; `--write` re-syncs it.

| What | macOS | Windows |
| --- | --- | --- |
| `settings.json` + `machine.json` (fixed) | `~/Library/Preferences/DialogueCollector/` | `%APPDATA%\DialogueCollector\` |
| Library folder (default, relocatable) | `~/Library/Application Support/DialogueCollector` | `%LOCALAPPDATA%\DialogueCollector` |

`settings.json` is portable and goes into the export zip; `machine.json` (library pointer, window geometry, last picker dir) never does.

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

### Walking-skeleton check

`npm run tauri build`, then run the packaged binary with `--smoke` (`DialogueCollector.app/Contents/MacOS/dialogue-collector --smoke [--smoke-report <file>]`). It spawns the bundled ffmpeg, cuts a hardcoded 2 s cue from a generated source, writes one row to a throwaway database in the OS temp dir, loads the clip in the renderer through the asset protocol, prints `SMOKE OK|FAIL …` and exits 0 / 1 (2 on watchdog timeout). The same check runs from 設定 → 目前版本 → 診斷工具. CI: `.github/workflows/package-smoke.yml`.

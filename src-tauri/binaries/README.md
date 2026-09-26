# ffmpeg sidecar

Tauri sidecars are named `<name>-<target-triple>[.exe]`. Both `ffmpeg` and `ffprobe` are
registered under `bundle.externalBin`, so `tauri dev` / `tauri build` need them present for the
target being built. They are not committed; produce them with:

| Target | Command | Source |
|---|---|---|
| `aarch64-apple-darwin` | `scripts/ffmpeg/build-macos.sh aarch64` | official source tarball, built LGPL |
| `x86_64-apple-darwin` | `scripts/ffmpeg/build-macos.sh x86_64` (needs `nasm`) | official source tarball, built LGPL |
| `x86_64-pc-windows-msvc` | `node scripts/ffmpeg/fetch-windows.mjs` | BtbN `win64-lgpl` prebuilt |

Versions and SHA256s are pinned in `scripts/ffmpeg/pins.json` (T3). Both scripts refuse a
download whose hash does not match. macOS builds from source because no LGPL macOS prebuilt
exists. The build script refuses a GPL/nonfree configuration and ad-hoc signs the result,
because Apple Silicon will not run an unsigned executable (FC2).

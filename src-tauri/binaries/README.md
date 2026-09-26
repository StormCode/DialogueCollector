# ffmpeg sidecar

Tauri sidecars are named `<name>-<target-triple>[.exe]`. Both `ffmpeg` and `ffprobe` are
registered under `bundle.externalBin`, so `tauri dev` / `tauri build` need them present for the
target being built. They are not committed; produce them with:

| Target | Command | Source |
|---|---|---|
| `aarch64-apple-darwin` | `scripts/ffmpeg/build-macos.sh aarch64` | official source tarball, built LGPL |
| `x86_64-apple-darwin` | `scripts/ffmpeg/build-macos.sh x86_64` (needs `nasm`) | official source tarball, built LGPL |
| `x86_64-pc-windows-msvc` | `scripts/ffmpeg/build-windows.sh` in MSYS2 UCRT64 | official source tarball, built LGPL, fully static |

The version and source SHA256 are pinned in `scripts/ffmpeg/pins.json` (T3); both scripts
refuse a tarball whose hash does not match, and refuse a GPL or nonfree configuration. Every
target builds from source: no LGPL prebuilt exists for macOS, and BtbN's LGPL Windows build is
~128 MB per binary. The macOS script ad-hoc signs the result, because Apple Silicon will not run
an unsigned executable (FC2). The Windows script fails if a MinGW runtime DLL leaks in.

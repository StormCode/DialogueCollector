# ffmpeg sidecar

Tauri sidecars are named `<name>-<target-triple>[.exe]`, e.g. `ffmpeg-aarch64-apple-darwin`,
`ffmpeg-x86_64-apple-darwin`, `ffmpeg-x86_64-pc-windows-msvc.exe`.

Not wired yet. T3 pins an **LGPL** build per target with a SHA256 that CI checks; T1 then adds
`"externalBin": ["binaries/ffmpeg"]` to `tauri.conf.json`. Adding `externalBin` before the
binaries exist breaks `tauri dev`, so the two land together.

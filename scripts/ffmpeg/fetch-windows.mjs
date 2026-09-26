// Download the pinned BtbN LGPL ffmpeg build for Windows, verify its SHA256, and install
// ffmpeg.exe / ffprobe.exe as Tauri sidecars in src-tauri/binaries/.
//
//   node scripts/ffmpeg/fetch-windows.mjs
//
// Runs on any OS (extraction uses `tar`, which reads zip on Windows 10+ and macOS).

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TRIPLE = "x86_64-pc-windows-msvc";
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const pins = JSON.parse(readFileSync(join(root, "scripts/ffmpeg/pins.json"), "utf8"));
const pin = pins.prebuilt[TRIPLE];

const cache = process.env.DC_CACHE_DIR ?? join(homedir(), ".cache", "dialogue-collector");
mkdirSync(cache, { recursive: true });
const zipPath = join(cache, pin.url.split("/").pop());

if (!existsSync(zipPath)) {
  console.log(`downloading ${pin.url}`);
  const res = await fetch(pin.url);
  if (!res.ok) throw new Error(`download failed: HTTP ${res.status} for ${pin.url}`);
  writeFileSync(zipPath, Buffer.from(await res.arrayBuffer()));
}

const actual = createHash("sha256").update(readFileSync(zipPath)).digest("hex");
if (actual !== pin.sha256) {
  rmSync(zipPath);
  throw new Error(`SHA256 mismatch for ${zipPath}: expected ${pin.sha256}, got ${actual}`);
}

const extractDir = join(cache, `extract-${TRIPLE}`);
rmSync(extractDir, { recursive: true, force: true });
mkdirSync(extractDir, { recursive: true });
execFileSync("tar", ["-xf", zipPath, "-C", extractDir], { stdio: "inherit" });

const outDir = join(root, "src-tauri", "binaries");
mkdirSync(outDir, { recursive: true });
for (const bin of ["ffmpeg", "ffprobe"]) {
  copyFileSync(join(extractDir, pin.archiveDir, `${bin}.exe`), join(outDir, `${bin}-${TRIPLE}.exe`));
}
console.log(`installed ffmpeg ${pins.version} (LGPL) for ${TRIPLE} → ${outDir}`);

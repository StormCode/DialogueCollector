// The Windows installer uses a vendored copy of Tauri's NSIS template with one change: the
// per-user default install directory is %LOCALAPPDATA%\Programs\<product> instead of
// %LOCALAPPDATA%\<product>, which is the default library folder. Tauri's installer hooks all
// run after the directory page, so a custom template is the only way to change that default.
//
// This check fails when the vendored template is no longer upstream + that one change, which
// is what happens after the Tauri CLI is upgraded. Re-sync with:
//   node scripts/nsis/check-template.mjs --write

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const vendored = join(root, "src-tauri", "windows", "installer.nsi");

const FROM = 'StrCpy $INSTDIR "$LOCALAPPDATA\\${PRODUCTNAME}"';
const TO = 'StrCpy $INSTDIR "$LOCALAPPDATA\\Programs\\${PRODUCTNAME}"';

const { version } = JSON.parse(
  readFileSync(join(root, "node_modules", "@tauri-apps", "cli", "package.json"), "utf8"),
);
const url = `https://raw.githubusercontent.com/tauri-apps/tauri/tauri-cli-v${version}/crates/tauri-bundler/src/bundle/windows/nsis/installer.nsi`;
const res = await fetch(url);
if (!res.ok) throw new Error(`cannot fetch upstream template for tauri-cli ${version}: HTTP ${res.status}`);
const upstream = await res.text();

if (upstream.split(FROM).length !== 2) {
  throw new Error(`upstream template for tauri-cli ${version} no longer has exactly one "${FROM}"; update this script`);
}
const expected = upstream.replace(FROM, TO);

if (process.argv.includes("--write")) {
  writeFileSync(vendored, expected);
  console.log(`wrote ${vendored} from tauri-cli ${version}`);
} else if (readFileSync(vendored, "utf8") !== expected) {
  console.error(`${vendored} does not match tauri-cli ${version}'s template + the install-dir change.`);
  console.error("Run: node scripts/nsis/check-template.mjs --write");
  process.exit(1);
} else {
  console.log(`NSIS template matches tauri-cli ${version} + install-dir change`);
}

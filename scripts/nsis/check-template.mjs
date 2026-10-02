// The Windows installer uses a vendored copy of Tauri's NSIS template with two changes:
//
// 1. The per-user default install directory is %LOCALAPPDATA%\Programs\<product> instead of
//    %LOCALAPPDATA%\<product>, which is the default library folder. Tauri's installer hooks all
//    run after the directory page, so a custom template is the only way to change that default.
// 2. Shortcuts and the Apps & Features entry carry the app's name in the installer's language
//    (user 2026-10-02): 台詞收藏家, 台词收藏家, 台詞コレクター or Dialogue Collector. The desktop
//    shortcut is made on the finish page, after every hook, so this too needs the template. The
//    name is recorded in the registry, so uninstall finds the shortcuts and an update renames the
//    ones an earlier install made.
//
// This check fails when the vendored template is no longer upstream + these changes, which is
// what happens after the Tauri CLI is upgraded. Re-sync with:
//   node scripts/nsis/check-template.mjs --write

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const vendored = join(root, "src-tauri", "windows", "installer.nsi");

/** [upstream text, replacement]; each upstream text must occur exactly once. */
const PATCHES = [
  // 1. Install directory.
  ['StrCpy $INSTDIR "$LOCALAPPDATA\\${PRODUCTNAME}"', 'StrCpy $INSTDIR "$LOCALAPPDATA\\Programs\\${PRODUCTNAME}"'],
  // 2. The localized name: chosen at start-up, recorded with the install, used for the shortcuts.
  [
    "Var WixMode\nVar OldMainBinaryName\n",
    `Var WixMode
Var OldMainBinaryName
; The name shortcuts and Apps & Features show, in the installer's language (user 2026-10-02),
; and the one an earlier install gave them.
Var AppName
Var OldAppName

; $LANGUAGE is the user's UI language when the installer carries it, else the first listed.
!macro SetAppName
  \${If} $LANGUAGE == 1028 ; TradChinese
    StrCpy $AppName "台詞收藏家"
  \${ElseIf} $LANGUAGE == 2052 ; SimpChinese
    StrCpy $AppName "台词收藏家"
  \${ElseIf} $LANGUAGE == 1041 ; Japanese
    StrCpy $AppName "台詞コレクター"
  \${Else}
    StrCpy $AppName "Dialogue Collector"
  \${EndIf}
!macroend

; The name the last install recorded; installs before it used the product name.
!macro ReadInstalledAppName out
  ReadRegStr \${out} SHCTX "\${UNINSTKEY}" "ShortcutName"
  \${If} \${out} == ""
    StrCpy \${out} "\${PRODUCTNAME}"
  \${EndIf}
!macroend
`,
  ],
  [
    '  !insertmacro SetContext\n\n  ${If} $INSTDIR == "${PLACEHOLDER_INSTALL_DIR}"',
    '  !insertmacro SetContext\n\n  !insertmacro SetAppName\n  !insertmacro ReadInstalledAppName $OldAppName\n\n  ${If} $INSTDIR == "${PLACEHOLDER_INSTALL_DIR}"',
  ],
  [
    '  WriteRegStr SHCTX "${UNINSTKEY}" "DisplayName" "${PRODUCTNAME}"',
    '  WriteRegStr SHCTX "${UNINSTKEY}" "DisplayName" "$AppName"\n  WriteRegStr SHCTX "${UNINSTKEY}" "ShortcutName" "$AppName"',
  ],
  [
    "  ; Create start menu shortcut\n  !insertmacro MUI_STARTMENU_WRITE_BEGIN Application",
    `  ; Shortcuts an earlier install named otherwise take this install's name, so updates keep them.
  \${If} $OldAppName != $AppName
    \${If} \${FileExists} "$SMPROGRAMS\\$AppStartMenuFolder\\$OldAppName.lnk"
      Rename "$SMPROGRAMS\\$AppStartMenuFolder\\$OldAppName.lnk" "$SMPROGRAMS\\$AppStartMenuFolder\\$AppName.lnk"
    \${EndIf}
    \${If} \${FileExists} "$SMPROGRAMS\\$OldAppName.lnk"
      Rename "$SMPROGRAMS\\$OldAppName.lnk" "$SMPROGRAMS\\$AppName.lnk"
    \${EndIf}
    \${If} \${FileExists} "$DESKTOP\\$OldAppName.lnk"
      Rename "$DESKTOP\\$OldAppName.lnk" "$DESKTOP\\$AppName.lnk"
    \${EndIf}
  \${EndIf}

  ; Create start menu shortcut
  !insertmacro MUI_STARTMENU_WRITE_BEGIN Application`,
  ],
  [
    "  !insertmacro MUI_UNGETLANGUAGE\n",
    "  !insertmacro MUI_UNGETLANGUAGE\n\n  ; The shortcuts carry the name the install gave them, whatever the language now.\n  !insertmacro ReadInstalledAppName $AppName\n",
  ],
];

const { version } = JSON.parse(
  readFileSync(join(root, "node_modules", "@tauri-apps", "cli", "package.json"), "utf8"),
);
const url = `https://raw.githubusercontent.com/tauri-apps/tauri/tauri-cli-v${version}/crates/tauri-bundler/src/bundle/windows/nsis/installer.nsi`;
const res = await fetch(url);
if (!res.ok) throw new Error(`cannot fetch upstream template for tauri-cli ${version}: HTTP ${res.status}`);
const upstream = await res.text();

let expected = upstream;
for (const [from, to] of PATCHES) {
  if (expected.split(from).length !== 2) {
    throw new Error(`upstream template for tauri-cli ${version} no longer has exactly one ${JSON.stringify(from)}; update this script`);
  }
  expected = expected.replace(from, () => to);
}
// Every shortcut, made or removed, by the localized name.
if (!expected.includes("${PRODUCTNAME}.lnk")) {
  throw new Error(`upstream template for tauri-cli ${version} no longer names shortcuts "\${PRODUCTNAME}.lnk"; update this script`);
}
expected = expected.replaceAll("${PRODUCTNAME}.lnk", "$AppName.lnk");

// Git on Windows may check the file out with CRLF (core.autocrlf); compare content, not line endings.
const lf = (text) => text.replace(/\r\n/g, "\n");

if (process.argv.includes("--write")) {
  writeFileSync(vendored, expected);
  console.log(`wrote ${vendored} from tauri-cli ${version}`);
} else if (lf(readFileSync(vendored, "utf8")) !== lf(expected)) {
  console.error(`${vendored} does not match tauri-cli ${version}'s template + this script's changes.`);
  console.error("Run: node scripts/nsis/check-template.mjs --write");
  process.exit(1);
} else {
  console.log(`NSIS template matches tauri-cli ${version} + this script's changes`);
}

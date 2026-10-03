## 台詞收藏家 · Dialogue Collector

<p align="center"><img src="src-tauri/icons/128x128@2x.png" width="160" alt="台詞收藏家 logo"></p>

**從你的影片剪下喜歡的台詞，並收錄至台詞本中。**

**完全離線 · macOS（Apple 晶片／Intel）· Windows x64**

最新穩定版：**v0.1.5** · 支援：**macOS 11 以上**、**Windows 10/11 x64**

### [下載最新穩定版](https://github.com/StormCode/DialogueCollector/releases/latest)

| 平台 | 檔案 |
| --- | --- |
| macOS（Apple 晶片） | [DialogueCollector_0.1.5_aarch64.dmg](https://github.com/StormCode/DialogueCollector/releases/latest) |
| macOS（Intel） | [DialogueCollector_0.1.5_x64.dmg](https://github.com/StormCode/DialogueCollector/releases/latest) |
| Windows x64 | [DialogueCollector_0.1.5_x64-setup.exe](https://github.com/StormCode/DialogueCollector/releases/latest) |

所有版本：https://github.com/StormCode/DialogueCollector/releases

本程式沒有程式碼簽章：macOS 與 Windows 第一次開啟時會跳出警告，略過一次即可（macOS：按右邊的打開；Windows：其他資訊 → 仍要執行）。

## 功能特點

台詞收藏家是一套桌面應用程式，把你手邊的影片變成個人的語音收藏庫：一句一句剪下台詞，依說話的角色分類。所有資料都留在你的電腦裡。

- **角色的台詞本。** 每個角色有自己的頭像、聲優；角色頁可以逐句或依序播放台詞、釘選經典台詞、搜尋與篩選，還能放上橫幅海報，打造成像個人主頁一樣。
- **依字幕剪下台詞。** 把影片和它的 ASS 或 SRT 字幕檔一起拖進來，每一句都會依字幕時間剪成一句一句的台詞，你可以選擇喜歡的台詞收錄至台詞本。
- **也支援內嵌字幕。** 只需拖入 MKV 或 MP4，即可從影片內的文字字幕軌抽出台詞。
- **匯入前先整理台詞。** 每一句都能直接播放影片的聲音，可以合併多句（句與句之間的間隔秒數自訂）、拆分回去，也能一次把多句指派給角色。
- **匯入現有的檔案。** 現有的音訊（m4a、mp3、wav）或影片可以直接匯入，支援匹次匯入，可自己輸入台詞。
- **收藏庫屬於你。** 音檔就是你指定資料夾裡的一般檔案，資料夾可以搬移；全部資料能備份成一個 zip，在另一台電腦還原。
- **用起來順手。** 支援繁體中文、簡體中文、日文與英文；七種主題配色（含深色主題）。

## 技術架構

| 層級 | 選用 |
| --- | --- |
| 外殼 | Tauri 2（Rust） |
| 介面 | Vite + React 19 + TypeScript、Zustand、react-router（hash）、i18next |
| 設計系統 | Bento DS 2.7，放在 `design/` |
| 資料儲存 | SQLite，透過 `rusqlite`（內建），只從 Rust 存取 |
| 媒體處理 | ffmpeg 作為 Tauri sidecar，每句台詞處理一次 |
| 測試 | `cargo test`（Rust）、Vitest + Testing Library（介面） |

## 目錄結構

```
src/                     介面
  components/layout/     AppLayout 與右側可收合的 SideNav
  pages/                 主頁、台詞本（ScriptBook）、台詞頁（Lines）、設定、import/*
  stores/                Zustand stores
  lib/ipc.ts             唯一呼叫 `invoke` 的地方
  lib/types.ts           Rust IPC 型別在 TS 的對應
  i18n/locales/          zh-Hant（預設）、zh-Hans、ja、en，有測試檢查各語系的鍵一致
  styles/                tokens 匯入、各語系的介面字型、台詞字型、--dc-* 主題層
  assets/fonts, icons    OFL 授權的台詞字型、Material Symbols SVG
src-tauri/src/           Rust 核心
  subs/                  ASS／SRT → 台詞
  media/                 ffmpeg sidecar、音檔命名
  store/                 SQLite 連線規則、schema 版本
  library/               收藏庫資料夾、settings.json／machine.json、匯出／匯入
  import/                台詞 → 音檔的流程、部分失敗、重試、取消
  menu.rs                macOS 功能表列（前往：主頁、台詞本、設定）
  commands.rs            Tauri 指令介面
design/                  canvas 畫板與 Bento tokens 的副本（參考用，需要時重新抓取）
```

## 檔案存放位置

Windows 安裝程式（個人安裝）會把程式裝到 `%LOCALAPPDATA%\Programs\DialogueCollector`。安裝程式使用一份 Tauri NSIS 範本的副本（`src-tauri/windows/installer.nsi`），改了兩處：一是安裝資料夾，因為 Tauri 預設的個人安裝位置就是下表的預設收藏庫資料夾；二是開始功能表、桌面捷徑與「應用程式與功能」的名稱會依安裝程式的語系顯示。`node scripts/nsis/check-template.mjs`（CI 會執行）會在 Tauri CLI 升級、副本過期時失敗；加上 `--write` 即可重新同步。

| 項目 | macOS | Windows |
| --- | --- | --- |
| `settings.json` + `machine.json`（固定位置） | `~/Library/Preferences/DialogueCollector/` | `%APPDATA%\DialogueCollector\` |
| 收藏庫資料夾（預設，可搬移） | `~/Library/Application Support/DialogueCollector` | `%LOCALAPPDATA%\DialogueCollector` |

`settings.json` 可攜，會一起放進匯出的 zip；`machine.json`（收藏庫位置、視窗大小與位置、上次選檔的資料夾）則不會。

## 開發

需要：Node 20 以上、Rust stable（`rustup`），Windows 另需 WebView2 runtime。

```sh
npm install
scripts/ffmpeg/build-macos.sh          # macOS：建置這台 Mac 架構的 LGPL ffmpeg sidecar
scripts/ffmpeg/build-windows.sh        # Windows，在 MSYS2 UCRT64 中執行：同上，靜態連結
npm run tauri dev        # 啟動 app，支援熱更新
npm test                 # 介面測試
npm run typecheck
cd src-tauri && cargo test
```

### 打包冒煙測試

執行 `npm run tauri build`，再以 `--smoke` 執行打包後的程式（`DialogueCollector.app/Contents/MacOS/dialogue-collector --smoke [--smoke-report <file>]`）。它會啟動內附的 ffmpeg，從產生的來源剪出一段固定 2 秒的台詞，寫一筆資料到系統暫存資料夾裡的拋棄式資料庫，透過 asset protocol 在介面載入音檔，印出 `SMOKE OK|FAIL …` 後結束，結束碼為 0／1（逾時為 2）。同一項檢查也能從 設定 → 目前版本 → 診斷工具 執行。CI：`.github/workflows/package-smoke.yml`。

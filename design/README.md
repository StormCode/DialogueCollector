# design/

本目錄的內容從 Claude Design canvas `https://claude.ai/artifact/T3aaPvyGx8V8aZj5sUonSD`
（Bento DS 2.7）vendoring 而來。要更新時請從 canvas 重新拉取，不要手動修改，這樣 canvas 上的每一次
變更都會成為可審查的 diff。

- `bento/tokens.css`、`bento/tokens.json`：設計 token。App 會 import `tokens.css`。
- `bento/components/bundle.css`、`bundle.js`：canvas 的元件 bundle，僅供參考。`bundle.js` 是給
  canvas runtime 用的全域命名空間建置，App 不會載入；`bundle.css` 會從 Google Fonts 載入字型，而離線
  App 不可以這樣做。
- `boards/*.dc.html` 與 `canvas.json`：40 張畫板，是 UI 的規格依據。請當成規格閱讀，它們離開 canvas
  無法執行。

## 素材來源

字型、自訂 icon、插圖的原始檔都放在 `~/Desktop/台詞收藏家/`，需要新素材時從那裡取用，複製進 repo 後
再引用 repo 內的路徑。

| 素材 | repo 內位置 | 說明 |
|---|---|---|
| 台詞字型 | `src/assets/fonts/` | ChironGoRoundTC（使用者子集化的 ExtraLight woff2）、KosugiMaru、Yomogi，授權檔放在同一目錄 |
| 自訂 icon | `src/assets/icons/` | Material Symbols Outlined SVG，複製時去掉檔名中 `_24dp_…` 之後的部分 |
| App 圖示 | `src-tauri/icons/` | 由 `logo/` 產生，`icon.icns`、`icon.ico` 直接使用原檔 |
| 插圖 | `src/assets/illustrations/` | 見下方「插圖使用規則」 |

## 插圖使用規則

| 圖檔 | 使用時機 | 對應畫板 |
|---|---|---|
| `empty.png` | **尚未有資料**，以及**找不到搜尋結果**時 | ScriptBookEmpty、ScriptBookNoResult、LinesEmpty、LinesNoResult，以及之後任何空狀態 |
| `oops.png` | **發生錯誤**時 | Failed、SubtitleFailed、VideoFailed，以及之後任何錯誤狀態 |

兩張圖都是裝飾用途，`alt=""` 並加上 `aria-hidden="true"`，狀態的意義由旁邊的文字傳達。

## 沿用自設計審查的規則

- 畫板中的 `--bento-dv-indigo-*`，在轉成元件時一律改用 `--dc-accent*`（DD6，見
  `src/styles/themes.css`）。
- CJK 字型只套用在台詞區；介面文字使用依語系指定的系統字型（DD5）。
- `tokens.css` 參照了 canvas 沒有匯出的 Clash Grotesk / Brandon Text woff2 檔，Vite 建置時會出現
  警告。這兩套字型本來就不含中日文字。

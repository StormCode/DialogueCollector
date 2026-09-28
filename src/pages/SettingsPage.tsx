import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import { LOCALE_NAMES } from "../i18n";
import { inTauri, ipc } from "../lib/ipc";
import { LOCALES, THEMES, type Locale, type Theme } from "../lib/types";
import { useLibraryStore } from "../stores/libraryStore";
import { useSettingsStore } from "../stores/settingsStore";
import { FileManagementSection } from "./settings/FileManagementSection";
import "./settings/settings.css";

// Board: design/boards/Settings.dc.html. Wired so far: 介面 (language, theme), 檔案管理
// (location, storage) and 目前版本. 角色簿 / 台詞頁 and the section index come with S12.
export function SettingsPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.update);
  const loadLibrary = useLibraryStore((s) => s.load);
  const [version, setVersion] = useState("—");
  const filesHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (inTauri()) void ipc.appInfo().then((info) => setVersion(info.version));
    void loadLibrary();
  }, [loadLibrary]);

  // Arriving from the 找不到收藏庫 toast: bring 檔案管理 into view and move focus to it (DD3).
  useEffect(() => {
    if ((location.state as { focus?: string } | null)?.focus !== "files") return;
    const heading = filesHeading.current;
    heading?.scrollIntoView({ behavior: "smooth", block: "start" });
    heading?.focus({ preventScroll: true });
  }, [location.state]);

  return (
    <div className="page settings-page">
      <h1 className="page__title">{t("settings.title")}</h1>

      <section className="st-section" aria-labelledby="st-h-ui">
        <h2 className="st-h2" id="st-h-ui">
          {t("settings.interface")}
        </h2>
        <div className="st-row">
          <label className="st-label" htmlFor="st-locale">
            {t("settings.language")}
          </label>
          <select
            id="st-locale"
            className="st-select"
            value={settings.locale}
            onChange={(e) => void update({ locale: e.target.value as Locale })}
          >
            {LOCALES.map((l) => (
              <option key={l} value={l}>
                {LOCALE_NAMES[l]}
              </option>
            ))}
          </select>
        </div>
        <div className="st-row">
          <label className="st-label" htmlFor="st-theme">
            {t("settings.theme")}
          </label>
          <select
            id="st-theme"
            className="st-select"
            value={settings.theme}
            onChange={(e) => void update({ theme: e.target.value as Theme })}
          >
            {THEMES.map((th) => (
              <option key={th} value={th}>
                {t(`settings.themes.${th}`)}
              </option>
            ))}
          </select>
        </div>
      </section>

      <FileManagementSection ref={filesHeading} />

      <section className="st-section" aria-labelledby="st-h-version">
        <h2 className="st-h2" id="st-h-version">
          {t("settings.version")}
        </h2>
        <div className="st-row">
          <div className="st-label">{t("settings.versionLabel")}</div>
          <div>
            {version} · <Link to="/diagnostics">{t("diagnostics.link")}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { LOCALE_NAMES } from "../i18n";
import { inTauri, ipc } from "../lib/ipc";
import { LOCALES, THEMES, type Locale, type Theme } from "../lib/types";
import { useSettingsStore } from "../stores/settingsStore";

// Board: design/boards/Settings.dc.html. Only the 介面 group is wired so far; it exercises
// the full path renderer → IPC → Rust → settings.json.
export function SettingsPage() {
  const { t } = useTranslation();
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.update);
  const [version, setVersion] = useState("—");

  useEffect(() => {
    if (inTauri()) void ipc.appInfo().then((info) => setVersion(info.version));
  }, []);

  return (
    <section className="page">
      <h1 className="page__title">{t("settings.title")}</h1>

      <h2>{t("settings.interface")}</h2>
      <label>
        {t("settings.language")}{" "}
        <select
          value={settings.locale}
          onChange={(e) => void update({ locale: e.target.value as Locale })}
        >
          {LOCALES.map((l) => (
            <option key={l} value={l}>
              {LOCALE_NAMES[l]}
            </option>
          ))}
        </select>
      </label>{" "}
      <label>
        {t("settings.theme")}{" "}
        <select
          value={settings.theme}
          onChange={(e) => void update({ theme: e.target.value as Theme })}
        >
          {THEMES.map((th) => (
            <option key={th} value={th}>
              {t(`settings.themes.${th}`)}
            </option>
          ))}
        </select>
      </label>

      <h2>{t("settings.version")}</h2>
      <p>{version}</p>
    </section>
  );
}

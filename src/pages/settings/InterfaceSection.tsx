import { useTranslation } from "react-i18next";

import { SelectField } from "../../components/ui/SelectField";
import { LOCALES, THEMES, type Locale, type Theme } from "../../lib/types";
import { useSettingsStore } from "../../stores/settingsStore";

// Swatch colour per theme: step 40 of its ramp, 80 for the neutral one (Settings board).
const SWATCH: Record<Theme, string> = {
  indigo: "var(--bento-dv-indigo-40)",
  lightBlue: "var(--bento-dv-blue-40)",
  ruby: "var(--bento-dv-red-40)",
  emerald: "var(--bento-dv-jade-40)",
  sunset: "var(--bento-dv-orange-40)",
  lipstick: "var(--bento-dv-pink-40)",
  midnight: "var(--bento-neutral-80)",
};

export function InterfaceSection() {
  const { t } = useTranslation();
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.update);

  return (
    <section className="st-section" data-sec="ui" aria-labelledby="st-h-ui">
      <h2 className="st-h2" id="st-h-ui">
        {t("settings.interface")}
      </h2>
      <div className="st-row">
        <label className="st-label" htmlFor="st-locale">
          {t("settings.language")}
        </label>
        <SelectField
          id="st-locale"
          value={settings.locale}
          options={LOCALES.map((l) => ({ value: l, label: t(`settings.languages.${l}`) }))}
          onChange={(v) => void update({ locale: v as Locale })}
        />
      </div>
      <div className="st-row st-row--top">
        <div className="st-label st-label--top" id="st-theme-label">
          {t("settings.theme")}
        </div>
        <div className="swatches" role="radiogroup" aria-labelledby="st-theme-label">
          {THEMES.map((theme) => {
            const selected = theme === settings.theme;
            return (
              <div className="swatch-wrap" key={theme}>
                <button
                  type="button"
                  className="swatch"
                  role="radio"
                  aria-checked={selected}
                  aria-label={t(`settings.themes.${theme}`)}
                  onClick={() => void update({ theme })}
                  style={{ background: SWATCH[theme], outlineColor: selected ? SWATCH[theme] : "transparent" }}
                />
                <span className={`swatch-name${selected ? " is-active" : ""}`}>
                  {t(`settings.themes.${theme}`)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

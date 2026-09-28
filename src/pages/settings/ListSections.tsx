import { useTranslation } from "react-i18next";

import { NumberField } from "../../components/ui/NumberField";
import { SelectField } from "../../components/ui/SelectField";
import { LINE_FONTS, type LineFont } from "../../lib/types";
import { useSettingsStore } from "../../stores/settingsStore";

/** Font stacks for the 台詞 preview; the faces are declared in src/styles/fonts.css. */
const FONT_STACK: Record<LineFont, string> = {
  ChironGoRoundTC: '"ChironGoRoundTC", var(--dc-ui-font)',
  KosugiMaru: '"KosugiMaru", var(--dc-ui-font)',
  Yomogi: '"Yomogi", var(--dc-ui-font)',
};

export function ScriptBookSection() {
  const { t } = useTranslation();
  const perPage = useSettingsStore((s) => s.settings.charactersPerPage);
  const update = useSettingsStore((s) => s.update);

  return (
    <section className="st-section" data-sec="book" aria-labelledby="st-h-book">
      <h2 className="st-h2" id="st-h-book">
        {t("settings.book.title")}
      </h2>
      <div className="st-row">
        <label className="st-label" htmlFor="st-book-per-page">
          {t("settings.perPage")}
        </label>
        <NumberField
          id="st-book-per-page"
          value={perPage}
          min={1}
          max={100}
          unit={t("settings.unitItems")}
          onCommit={(v) => void update({ charactersPerPage: v })}
        />
      </div>
    </section>
  );
}

export function LinesSection() {
  const { t } = useTranslation();
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.update);

  return (
    <section className="st-section" data-sec="lines" aria-labelledby="st-h-lines">
      <h2 className="st-h2" id="st-h-lines">
        {t("settings.lines.title")}
      </h2>
      <div className="st-row">
        <label className="st-label" htmlFor="st-lines-per-page">
          {t("settings.perPage")}
        </label>
        <NumberField
          id="st-lines-per-page"
          value={settings.linesPerPage}
          min={1}
          max={100}
          unit={t("settings.unitItems")}
          onCommit={(v) => void update({ linesPerPage: v })}
        />
      </div>
      <div className="st-row">
        <label className="st-label" htmlFor="st-play-gap">
          {t("settings.lines.playGap")}
          <span className="st-sub">{t("settings.lines.playGapHint")}</span>
        </label>
        <NumberField
          id="st-play-gap"
          value={settings.playAllGapSeconds}
          min={0}
          max={30}
          step={0.5}
          unit={t("settings.unitSeconds")}
          onCommit={(v) => void update({ playAllGapSeconds: v })}
        />
      </div>
      <div className="st-row st-row--top">
        <label className="st-label st-label--top" htmlFor="st-line-font">
          {t("settings.lines.font")}
        </label>
        <div className="st-stack">
          <SelectField
            id="st-line-font"
            value={settings.lineFont}
            options={LINE_FONTS.map((f) => ({ value: f, label: f }))}
            onChange={(v) => void update({ lineFont: v as LineFont })}
          />
          <div className="font-preview" style={{ fontFamily: FONT_STACK[settings.lineFont] }}>
            この声、ずっと覚えてる。— 這個聲音，我會一直記得。
          </div>
        </div>
      </div>
    </section>
  );
}

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import oops from "../../assets/illustrations/oops.png";
import { BentoIcon, MaterialIcon, type MaterialIconName } from "../../components/icons/Icon";

// Parts shared by the import boards. Every `--bento-dv-indigo-*` on those boards is the theme
// accent here (themes.css binding rule).

type Motion = "streak" | "none";

/**
 * The 640px card of SubtitleImporting, VideoCutting, VideoImportingIndex, VideoComplete,
 * SubtitleFailed and VideoFailed: a 160px medallion, a title, an optional line, actions.
 */
export function StatusCard({
  medallion,
  title,
  hint,
  actions,
  actionsNote,
  footnote,
  entrance = "fade",
}: {
  medallion: ReactNode;
  title: string;
  hint?: string;
  actions?: ReactNode;
  /** A line right under the buttons (ImportingIndex: what 取消 does). */
  actionsNote?: string;
  /** A line closing the card, below the buttons (FailedPartial: what 再試一次 redoes). */
  footnote?: string;
  /** complete-card / failed-card shake the whole card in. */
  entrance?: "fade" | "celebrate" | "shake";
}) {
  return (
    <div className="imp-center">
      <div className={`imp-status imp-status--${entrance}`} role="status" aria-live="polite">
        <div className="imp-status__head">
          <div className="imp-fade imp-fade--1">{medallion}</div>
          <div className="imp-fade imp-fade--2 imp-status__text">
            <div className="imp-status__title">{title}</div>
            {hint && <div className="imp-status__hint">{hint}</div>}
          </div>
        </div>
        {actions && !actionsNote && <div className="imp-fade imp-fade--3 imp-status__actions">{actions}</div>}
        {actions && actionsNote && (
          <div className="imp-fade imp-fade--3 imp-status__stack">
            <div className="imp-status__actions">{actions}</div>
            <span className="imp-status__actions-note">{actionsNote}</span>
          </div>
        )}
        {footnote && <div className="imp-fade imp-fade--3 imp-status__footnote">{footnote}</div>}
      </div>
    </div>
  );
}

/** The ringed circle with a large glyph; `streak` adds the sweeping light of the busy boards. */
export function Medallion({ icon, motion = "none" }: { icon: MaterialIconName; motion?: Motion }) {
  return (
    <div className="imp-medallion">
      <span className="imp-medallion__glyph">
        <MaterialIcon name={icon} size={72} />
      </span>
      {motion === "streak" && (
        <span className="imp-streak" aria-hidden="true">
          <span className="imp-streak__bar" />
        </span>
      )}
    </div>
  );
}

/** AudioExtracting: five bars bouncing like a level meter. */
export function EqualizerMedallion() {
  return (
    <div className="imp-medallion">
      <span className="imp-eq" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </span>
    </div>
  );
}

/** VideoComplete's check: Bento CheckWeightBold 72. */
export function DoneMedallion() {
  return (
    <div className="imp-medallion">
      <span className="imp-medallion__glyph">
        <BentoIcon name="CheckWeightBold" size={72} />
      </span>
    </div>
  );
}

/** design/README.md: oops.png marks errors. */
export function OopsMedallion() {
  return <img className="imp-oops" src={oops} alt="" aria-hidden="true" />;
}

export function ImportButton({
  kind,
  icon,
  children,
  onClick,
  disabled,
}: {
  kind: "primary" | "secondary" | "neutral";
  icon?: ReactNode;
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`imp-btn imp-btn--${kind}${icon ? " imp-btn--icon" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {children}
    </button>
  );
}

/**
 * The step header of TrackSelect and SubtitleSelect: 匯入檔案 → 選擇台詞 for a subtitle file,
 * 匯入檔案 → 選擇字幕軌 → 選擇台詞 for embedded subtitles.
 */
export function Stepper({ embedded, current }: { embedded: boolean; current: number }) {
  const { t } = useTranslation();
  const steps = embedded
    ? [t("import.steps.files"), t("import.steps.tracks"), t("import.steps.select")]
    : [t("import.steps.files"), t("import.steps.select")];
  return (
    <ol className="imp-steps" aria-label={t("import.steps.label")}>
      {steps.map((label, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "current" : "todo";
        return [
          i > 0 && (
            <li
              key={`line-${n}`}
              role="presentation"
              className={`imp-steps__line${n <= current ? " is-done" : ""}`}
            />
          ),
          <li
            key={n}
            className={`imp-steps__step is-${state}`}
            aria-current={state === "current" ? "step" : undefined}
          >
            <span className="imp-steps__dot">
              {state === "done" ? <BentoIcon name="CheckWeightBold" size={16} /> : n}
            </span>
            <span className="imp-steps__label">{label}</span>
          </li>,
        ];
      })}
    </ol>
  );
}

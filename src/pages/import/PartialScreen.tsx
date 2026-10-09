import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { BentoIcon, MaterialIcon } from "../../components/icons/Icon";
import { useRevealScrollbar } from "../../components/ui/useRevealScrollbar";
import type { JobOutcome } from "../../lib/types";
import { ImportButton } from "./ImportParts";
import { formatClock } from "./SelectScreen";

// Board: VideoPartial.dc.html. Cancelled cues are listed apart from failed ones: their
// reason reads 已取消 in the neutral colour instead of the error red.
export function PartialScreen({
  outcome,
  onHome,
  onRetry,
}: {
  outcome: JobOutcome;
  onHome: () => void;
  onRetry: () => void;
}) {
  const { t } = useTranslation();
  const list = useRef<HTMLUListElement>(null);
  useRevealScrollbar(list);
  const failed = outcome.failures.length;

  return (
    <div className="imp-page imp-page--partial">
      <div className="imp-center">
        <div className="part-card">
          <div className="part-head part-fade-1">
            <div className="part-badge">
              <MaterialIcon name="priority_high" size={40} />
            </div>
            <div className="part-head__text">
              <h1 className="part-title">{t("import.partial.title")}</h1>
              <div className="part-hint">{t("import.partial.hint")}</div>
            </div>
          </div>

          <div className="part-stats part-fade-2">
            <div className="part-stat part-stat--ok">
              <div className="part-stat__icon">
                <BentoIcon name="CheckWeightBold" size={20} />
              </div>
              <div className="part-stat__text">
                <span className="part-stat__num">{t("import.partial.count", { count: outcome.imported })}</span>
                <span className="part-stat__cap">{t("import.partial.succeeded")}</span>
              </div>
            </div>
            <div className="part-stat part-stat--bad">
              <div className="part-stat__icon">
                <MaterialIcon name="close" size={22} />
              </div>
              <div className="part-stat__text">
                <span className="part-stat__num">{t("import.partial.count", { count: failed })}</span>
                <span className="part-stat__cap">{t("import.partial.failed")}</span>
              </div>
            </div>
          </div>

          <div className="part-list part-fade-3">
            <h2 className="part-list__title">{t("import.partial.reasons")}</h2>
            <ul ref={list} className="part-rows st-scroll">
              {outcome.failures.map((f) => (
                <li key={`${f.cueIndex}-${f.startMs}`} className="part-row">
                  <span className="part-row__idx">#{f.cueIndex + 1}</span>
                  <div className="part-row__body">
                    <div className="part-row__top">
                      <span className="part-row__line">{f.text}</span>
                      <span className="part-row__time">
                        {formatClock(f.startMs)} → {formatClock(f.endMs)}
                      </span>
                    </div>
                    <span className={`part-row__reason${f.reason === "cancelled" ? " is-cancelled" : ""}`}>
                      <MaterialIcon name="error" size={16} />
                      {t(`import.reasons.${f.reason}`)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="part-actions part-fade-4">
            <ImportButton kind="neutral" icon={<BentoIcon name="Home" size={24} />} onClick={onHome}>
              {t("import.home")}
            </ImportButton>
            <ImportButton kind="primary" icon={<MaterialIcon name="refresh" />} onClick={onRetry}>
              {t("import.retry")}
            </ImportButton>
          </div>
        </div>
      </div>
    </div>
  );
}

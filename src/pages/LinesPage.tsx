import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

import { PagePlaceholder } from "../components/PagePlaceholder";

// TODO(Lines board): `?missing=<lineId>` comes from 遺失的檔案's 查看. The lines page opens on the
// page holding that line, scrolls it into view and marks its card as LinesMissing.dc.html draws
// `.ln-card.is-missing` (negative-40 border plus a 1px inset) — decided 2026-09-29, see PLAN.md.
export function LinesPage() {
  const { t } = useTranslation();
  const { characterId } = useParams();
  return (
    <PagePlaceholder title={`${t("lines.title")} #${characterId}`} board="Lines.dc.html" />
  );
}

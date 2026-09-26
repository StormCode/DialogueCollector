import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

import { PagePlaceholder } from "../components/PagePlaceholder";

export function LinesPage() {
  const { t } = useTranslation();
  const { characterId } = useParams();
  return (
    <PagePlaceholder title={`${t("lines.title")} #${characterId}`} board="Lines.dc.html" />
  );
}

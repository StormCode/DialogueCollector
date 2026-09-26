import { useTranslation } from "react-i18next";

import { PagePlaceholder } from "../../components/PagePlaceholder";

// Flow: InputLine → Importing → Complete | Failed. Same pipeline as the subtitle path with a
// hand-supplied cue list (0G C1).
export function ManualImportPage() {
  const { t } = useTranslation();
  return <PagePlaceholder title={t("import.manualTitle")} board="InputLine.dc.html" />;
}

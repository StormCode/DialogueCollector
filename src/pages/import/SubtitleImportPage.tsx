import { useTranslation } from "react-i18next";

import { PagePlaceholder } from "../../components/PagePlaceholder";

// Flow: SubtitleImporting → SubtitleSelect (in-place 指派給…, D13-REV) → VideoSelect →
// VideoCutting → VideoComplete | VideoPartial | VideoFailed.
export function SubtitleImportPage() {
  const { t } = useTranslation();
  return <PagePlaceholder title={t("import.subtitleTitle")} board="SubtitleImporting.dc.html" />;
}

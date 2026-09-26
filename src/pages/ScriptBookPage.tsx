import { useTranslation } from "react-i18next";

import { PagePlaceholder } from "../components/PagePlaceholder";

export function ScriptBookPage() {
  const { t } = useTranslation();
  return <PagePlaceholder title={t("scriptBook.title")} board="ScriptBook.dc.html" />;
}

import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { LibraryUnavailableToast } from "../components/LibraryUnavailableToast";

// Board: design/boards/Main.dc.html — two drop zones, one per intake path.
export function MainPage() {
  const { t } = useTranslation();
  return (
    <section className="page main-page">
      <Link className="main-page__zone" to="/import/subtitle">
        {t("main.fromSubtitle")}
      </Link>
      <Link className="main-page__zone" to="/import/manual">
        {t("main.manual")}
      </Link>
      <LibraryUnavailableToast />
    </section>
  );
}

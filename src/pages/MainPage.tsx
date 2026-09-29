import { open } from "@tauri-apps/plugin-dialog";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { LibraryUnavailableToast } from "../components/LibraryUnavailableToast";
import { MaterialIcon } from "../components/icons/Icon";
import { extensionOf, useFileDrop } from "../components/ui/useFileDrop";
import type { SubtitleImportState } from "./import/SubtitleImportPage";
import { SOURCE_EXTENSIONS } from "./import/SourceScreen";
import "./main.css";

const SUBTITLE_EXTENSIONS = ["ass", "srt"];

// Board: design/boards/Main.dc.html — two drop zones, one per intake path.
export function MainPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const subtitleZone = useRef<HTMLDivElement>(null);
  const manualZone = useRef<HTMLDivElement>(null);

  const openSubtitle = (path: string | undefined) => {
    if (!path || !SUBTITLE_EXTENSIONS.includes(extensionOf(path))) return;
    navigate("/import/subtitle", { state: { subtitle: path } satisfies SubtitleImportState });
  };
  const openManual = (paths: string[]) => {
    const media = paths.filter((p) => SOURCE_EXTENSIONS.includes(extensionOf(p)));
    if (media.length > 0) navigate("/import/manual", { state: { files: media } });
  };

  const overSubtitle = useFileDrop(subtitleZone, (paths) => openSubtitle(paths[0]));
  const overManual = useFileDrop(manualZone, openManual);

  const browseSubtitle = async () => {
    const picked = await open({
      multiple: false,
      filters: [{ name: t("main.subtitleFilter"), extensions: SUBTITLE_EXTENSIONS }],
    });
    if (typeof picked === "string") openSubtitle(picked);
  };
  const browseManual = async () => {
    const picked = await open({
      multiple: true,
      filters: [{ name: t("main.mediaFilter"), extensions: SOURCE_EXTENSIONS }],
    });
    if (Array.isArray(picked)) openManual(picked);
  };

  return (
    <section className="main-page">
      <h1 className="main-title pg-anim-title">{t("main.title")}</h1>
      <div className="main-columns">
        <div className="main-column">
          <div className="main-column__head">
            <div className="main-column__title">{t("main.fromSubtitle")}</div>
            <div className="main-column__formats">{t("main.subtitleFormats")}</div>
          </div>
          <div ref={subtitleZone} className={`main-zone main-zone--subtitle${overSubtitle ? " is-over" : ""}`}>
            <span className="main-zone__art main-zone__art--subtitles" aria-hidden="true">
              <MaterialIcon name="subtitles" size={230} />
            </span>
            <div className="main-zone__content">
              <div className="main-zone__title">{t("import.dropHere")}</div>
              <div className="main-zone__or">{t("import.or")}</div>
              <button type="button" className="main-zone__browse" onClick={() => void browseSubtitle()}>
                {t("import.browse")}
              </button>
            </div>
          </div>
        </div>

        <div className="main-column">
          <div className="main-column__head">
            <div className="main-column__title">{t("main.manual")}</div>
            <div className="main-column__formats">{t("main.mediaFormats")}</div>
          </div>
          <div ref={manualZone} className={`main-zone main-zone--manual${overManual ? " is-over" : ""}`}>
            <span className="main-zone__art main-zone__art--movie" aria-hidden="true">
              <MaterialIcon name="movie" size={130} />
            </span>
            <span className="main-zone__art main-zone__art--wave" aria-hidden="true">
              <MaterialIcon name="graphic_eq" size={130} />
            </span>
            <div className="main-zone__content">
              <div className="main-zone__title">{t("import.dropHere")}</div>
              <div className="main-zone__or">{t("import.or")}</div>
              <button type="button" className="main-zone__browse" onClick={() => void browseManual()}>
                {t("import.browse")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <LibraryUnavailableToast />
    </section>
  );
}

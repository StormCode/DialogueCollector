import { open } from "@tauri-apps/plugin-dialog";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { LibraryUnavailableToast } from "../components/LibraryUnavailableToast";
import { MaterialIcon } from "../components/icons/Icon";
import { extensionOf, useFileDrop } from "../components/ui/useFileDrop";
import { useUiStore } from "../stores/uiStore";
import type { SubtitleImportState } from "./import/SubtitleImportPage";
import "./main.css";

const SUBTITLE_EXTENSIONS = ["ass", "srt"];
/** Videos the subtitle path cuts from (字幕匯入改版 2026-10-02: MKV、MP4、WEBM). */
export const VIDEO_EXTENSIONS = ["mkv", "mp4", "webm"];

/**
 * The subtitle zone takes a subtitle file with its video, or a video alone (embedded subtitles).
 * Returns them with the count of files of neither kind.
 */
export function sortSubtitleDrop(paths: string[]) {
  const ext = (p: string) => extensionOf(p);
  const subtitles = paths.filter((p) => SUBTITLE_EXTENSIONS.includes(ext(p)));
  const videos = paths.filter((p) => VIDEO_EXTENSIONS.includes(ext(p)));
  return { subtitles, videos, skipped: paths.length - subtitles.length - videos.length };
}
/** 直接匯入: videos have their audio encoded; WAV, M4A and MP3 are kept as they are (user 2026-09-29). */
export const MANUAL_EXTENSIONS = ["mkv", "mp4", "webm", "wav", "m4a", "mp3"];

/**
 * Splits dropped files into the supported ones and a message for the rest: 尚未支援此格式 for a
 * single file, 尚未支援此格式，略過了 n 個檔案 when several were dropped (user 2026-09-29).
 */
export function sortDropped(
  paths: string[],
  extensions: string[],
): { supported: string[]; skipped: number } {
  const supported = paths.filter((p) => extensions.includes(extensionOf(p)));
  return { supported, skipped: paths.length - supported.length };
}

// Board: design/boards/Main.dc.html — two drop zones, one per intake path.
export function MainPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const subtitleZone = useRef<HTMLDivElement>(null);
  const manualZone = useRef<HTMLDivElement>(null);

  const showNotice = useUiStore((st) => st.showNotice);

  // Shown before navigating, so it stays up on the next page (the layout owns it).
  const reportSkipped = (dropped: number, skipped: number) => {
    if (skipped === 0) return;
    showNotice({
      tone: "negative",
      text: dropped === 1 ? t("main.unsupported") : t("main.unsupportedSkipped", { count: skipped }),
      // MainUnsupportedFormat / MainUnsupportedMulti: sized to the text, at least 360px.
      minWidth: 360,
    });
  };

  const openSubtitle = async (paths: string[]) => {
    const { subtitles, videos, skipped } = sortSubtitleDrop(paths);
    reportSkipped(paths.length, skipped);
    if (subtitles.length > 1 || videos.length > 1) {
      showNotice({ tone: "negative", text: t("main.tooMany"), minWidth: 360 });
      return;
    }
    let video = videos[0];
    if (!video) {
      if (subtitles.length === 0) return;
      // A subtitle alone: ask for its video (user 2026-10-02).
      const picked = await open({
        multiple: false,
        title: t("main.pickVideo"),
        filters: [{ name: t("main.videoFilter"), extensions: VIDEO_EXTENSIONS }],
      });
      if (typeof picked !== "string") return;
      video = picked;
    }
    navigate("/import/subtitle", {
      state: { video, subtitle: subtitles[0] } satisfies SubtitleImportState,
    });
  };
  const openManual = (paths: string[]) => {
    const { supported, skipped } = sortDropped(paths, MANUAL_EXTENSIONS);
    reportSkipped(paths.length, skipped);
    if (supported.length > 0) navigate("/import/manual", { state: { files: supported } });
  };

  const overSubtitle = useFileDrop(subtitleZone, (paths) => void openSubtitle(paths));
  const overManual = useFileDrop(manualZone, openManual);

  const browseSubtitle = async () => {
    const picked = await open({
      multiple: true,
      filters: [{ name: t("main.subtitleFilter"), extensions: [...SUBTITLE_EXTENSIONS, ...VIDEO_EXTENSIONS] }],
    });
    if (Array.isArray(picked)) await openSubtitle(picked);
  };
  const browseManual = async () => {
    const picked = await open({
      multiple: true,
      filters: [{ name: t("main.mediaFilter"), extensions: MANUAL_EXTENSIONS }],
    });
    if (Array.isArray(picked)) openManual(picked);
  };

  return (
    <section className="main-page">
      <h1 className="main-title pg-anim-title">{t("main.title")}</h1>
      <div className="main-columns">
        <div className="main-column pg-anim-up" style={{ animationDelay: "450ms" }}>
          <div className="main-column__head">
            <div className="main-column__title">{t("main.fromSubtitle")}</div>
            <div className="main-column__formats">{t("main.subtitleFormats")}</div>
          </div>
          <div ref={subtitleZone} className={`main-zone main-zone--subtitle${overSubtitle ? " is-over" : ""}`}>
            <span className="main-zone__art main-zone__art--subtitles" aria-hidden="true">
              <MaterialIcon name="subtitles" size={230} />
            </span>
            <div className="main-zone__content">
              <div className="main-zone__titles">
                <div className="main-zone__title">{t("main.subtitleDrop")}</div>
                <div className="main-zone__hint">{t("main.subtitleDropHint")}</div>
              </div>
              <div className="main-zone__or">{t("import.or")}</div>
              <button type="button" className="main-zone__browse" onClick={() => void browseSubtitle()}>
                {t("import.browse")}
              </button>
            </div>
          </div>
        </div>

        <div className="main-column pg-anim-up" style={{ animationDelay: "800ms" }}>
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

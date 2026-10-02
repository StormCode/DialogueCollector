import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { BentoIcon, MaterialIcon } from "../../components/icons/Icon";
import { useSubtitleImportStore } from "../../stores/subtitleImportStore";
import { DoneMedallion, EqualizerMedallion, ImportButton, Medallion, OopsMedallion, StatusCard } from "./ImportParts";
import { PartialScreen } from "./PartialScreen";
import { SelectScreen } from "./SelectScreen";
import { TrackScreen, type CardRect } from "./TrackScreen";
import "./import.css";

/** `navigate("/import/subtitle", { state })` from the main page's drop zone. */
export interface SubtitleImportState {
  video: string;
  /** Absent when the video carries its subtitles (內嵌字幕). */
  subtitle?: string;
}

// The subtitle path (canvas page 3, 字幕匯入改版 2026-10-02). With a subtitle file:
// SubtitleImporting → AudioExtracting → SubtitleSelect (Step 2). A video alone: AudioExtracting
// → TrackSelect (Step 2) → SubtitleImporting → SubtitleSelect (Step 3). Then VideoCutting →
// VideoImportingIndex → VideoComplete | VideoPartial | VideoFailed; SubtitleFailed
// (字幕讀取失敗) when no subtitle can be read.
export function SubtitleImportPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const s = useSubtitleImportStore();
  const requested = location.state as SubtitleImportState | null;
  /** The track card's place, for the select card to grow from; used once. */
  const [growFrom, setGrowFrom] = useState<CardRect | null>(null);

  useEffect(() => {
    if (requested?.video && requested.video !== useSubtitleImportStore.getState().videoPath) {
      void useSubtitleImportStore.getState().open(requested.video, requested.subtitle ?? null);
    }
  }, [requested]);

  useEffect(() => {
    if (s.screen === "aborted") {
      s.reset();
      navigate("/");
    }
  }, [s, navigate]);

  const home = () => {
    s.reset();
    navigate("/");
  };

  if (!s.videoPath) {
    // Opened without a file (e.g. from history): the main page is where one is chosen.
    return (
      <div className="imp-page">
        <StatusCard
        medallion={<OopsMedallion />}
        title={t("import.readFailed.title")}
        hint={t("import.oops")}
        entrance="shake"
        actions={
          <ImportButton kind="neutral" icon={<BentoIcon name="Home" size={24} />} onClick={home}>
            {t("import.home")}
          </ImportButton>
          }
        />
      </div>
    );
  }

  switch (s.screen) {
    case "reading":
      return (
        <div className="imp-page">
          <StatusCard
            medallion={<Medallion icon="subtitles" motion="streak" />}
            title={t("import.reading.title")}
            hint={t("import.reading.hint")}
            actions={
              <ImportButton kind="secondary" icon={<MaterialIcon name="close" />} onClick={() => void s.abort()}>
                {t("import.cancel")}
              </ImportButton>
            }
          />
        </div>
      );
    case "extracting":
      return (
        <div className="imp-page">
          <StatusCard
            medallion={<EqualizerMedallion />}
            title={t("import.extracting.title")}
            hint={t("import.extracting.hint")}
            actions={
              <ImportButton kind="secondary" icon={<MaterialIcon name="close" />} onClick={() => void s.abort()}>
                {t("import.cancel")}
              </ImportButton>
            }
          />
        </div>
      );
    case "tracks":
      return (
        <TrackScreen
          tracks={s.tracks}
          onBack={home}
          onNext={(track, from) => {
            setGrowFrom(from);
            void s.pickTrack(track);
          }}
        />
      );
    case "aborted":
      return <div className="imp-page" />;
    case "readFailed":
      return (
        <div className="imp-page">
          <StatusCard
            medallion={<OopsMedallion />}
            title={t("import.readFailed.title")}
            hint={t("import.oops")}
            entrance="shake"
            actions={
              <>
                <ImportButton kind="neutral" icon={<BentoIcon name="Home" size={24} />} onClick={home}>
                  {t("import.home")}
                </ImportButton>
                <ImportButton kind="primary" icon={<MaterialIcon name="refresh" />} onClick={() => void s.retryRead()}>
                  {t("import.retry")}
                </ImportButton>
              </>
            }
          />
        </div>
      );
    case "select":
      return (
        <SelectScreen
          onBack={() => {
            if (!s.backFromSelect()) home();
          }}
          growFrom={growFrom}
          onGrown={() => setGrowFrom(null)}
        />
      );
    case "cutting":
    case "indexing": {
      const cutting = s.screen === "cutting";
      return (
        <div className="imp-page">
          <StatusCard
            key={s.screen}
            medallion={<Medallion icon={cutting ? "content_cut" : "domain_add"} motion="streak" />}
            title={t(cutting ? "import.cutting.title" : "import.indexing.title")}
            hint={t(cutting ? "import.cutting.hint" : "import.indexing.hint")}
            actions={
              <ImportButton kind="secondary" icon={<MaterialIcon name="close" />} onClick={() => void s.cancel()}>
                {t("import.cancel")}
              </ImportButton>
            }
          />
        </div>
      );
    }
    case "complete":
      return (
        <div className="imp-page">
          <StatusCard
            medallion={<DoneMedallion />}
            title={t("import.complete.title")}
            entrance="celebrate"
            actions={
              <ImportButton
                kind="secondary"
                icon={<MaterialIcon name="book_2" />}
                onClick={() => {
                  s.reset();
                  navigate("/characters");
                }}
              >
                {t("import.complete.toScriptBook")}
              </ImportButton>
            }
          />
        </div>
      );
    case "partial":
      return s.outcome ? (
        <PartialScreen outcome={s.outcome} onHome={home} onRetry={() => void s.retry()} />
      ) : null;
    case "failed":
      return (
        <div className="imp-page">
          <StatusCard
            medallion={<OopsMedallion />}
            title={t("import.failed.title")}
            hint={t("import.oops")}
            entrance="shake"
            actions={
              <>
                <ImportButton kind="neutral" icon={<BentoIcon name="Home" size={24} />} onClick={home}>
                  {t("import.home")}
                </ImportButton>
                <ImportButton kind="primary" icon={<MaterialIcon name="refresh" />} onClick={() => void s.retry()}>
                  {t("import.retry")}
                </ImportButton>
              </>
            }
          />
        </div>
      );
  }
}

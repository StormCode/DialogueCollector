import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { BentoIcon, MaterialIcon } from "../../components/icons/Icon";
import { useSubtitleImportStore } from "../../stores/subtitleImportStore";
import { DoneMedallion, ImportButton, Medallion, OopsMedallion, StatusCard } from "./ImportParts";
import { PartialScreen } from "./PartialScreen";
import { SelectScreen } from "./SelectScreen";
import { SourceScreen } from "./SourceScreen";
import "./import.css";

/** `navigate("/import/subtitle", { state })` from the main page's drop zone. */
export interface SubtitleImportState {
  subtitle: string;
}

// The subtitle path (canvas page 3): SubtitleImporting → SubtitleSelect → VideoSelect →
// VideoCutting → VideoImportingIndex → VideoComplete | VideoPartial | VideoFailed, with
// SubtitleFailed when the file cannot be read.
export function SubtitleImportPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const s = useSubtitleImportStore();
  const requested = (location.state as SubtitleImportState | null)?.subtitle;

  useEffect(() => {
    if (requested && requested !== useSubtitleImportStore.getState().subtitlePath) {
      void useSubtitleImportStore.getState().openSubtitle(requested);
    }
  }, [requested]);

  const home = () => {
    s.reset();
    navigate("/");
  };

  if (!s.subtitlePath) {
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
              <ImportButton kind="secondary" icon={<MaterialIcon name="close" />} onClick={home}>
                {t("import.cancel")}
              </ImportButton>
            }
          />
        </div>
      );
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
      return <SelectScreen onBack={home} />;
    case "source":
      return <SourceScreen onBack={s.toSelect} onPick={(path) => void s.startImport(path)} />;
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

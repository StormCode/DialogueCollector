import { open } from "@tauri-apps/plugin-dialog";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { MaterialIcon } from "../../components/icons/Icon";
import { Toast } from "../../components/feedback/Toast";
import { extensionOf, useFileDrop } from "../../components/ui/useFileDrop";
import { ImportButton, Stepper } from "./ImportParts";

/** Step 3 board: MKV、MP4、WEBM、OGG、M4A、MP3 (media::SOURCE_EXTENSIONS). */
export const SOURCE_EXTENSIONS = ["mkv", "mp4", "webm", "ogg", "m4a", "mp3"];

// Board: VideoSelect.dc.html (Step 3). Picking or dropping a file starts the import.
export function SourceScreen({ onPick, onBack }: { onPick: (path: string) => void; onBack: () => void }) {
  const { t } = useTranslation();
  const zone = useRef<HTMLDivElement>(null);
  const [unsupported, setUnsupported] = useState(false);

  const take = (path: string) => {
    if (!SOURCE_EXTENSIONS.includes(extensionOf(path))) {
      setUnsupported(true);
      return;
    }
    onPick(path);
  };
  const hovering = useFileDrop(zone, (paths) => take(paths[0]));

  const browse = async () => {
    const picked = await open({
      multiple: false,
      filters: [{ name: t("import.source.filter"), extensions: SOURCE_EXTENSIONS }],
    });
    if (typeof picked === "string") take(picked);
  };

  return (
    <div className="imp-page imp-page--list imp-page--centered">
      <header className="imp-header">
        <h1 className="imp-title">{t("import.source.title")}</h1>
        <Stepper current={3} />
      </header>
      <div className="src-card">
        <div ref={zone} className={`src-drop${hovering ? " is-over" : ""}`}>
          <span className="src-drop__art" aria-hidden="true">
            <MaterialIcon name="movie" size={230} />
          </span>
          <div className="src-drop__content">
            <div className="src-drop__title">{t("import.dropHere")}</div>
            <div className="src-drop__or">{t("import.or")}</div>
            <button type="button" className="src-browse" onClick={() => void browse()}>
              {t("import.browse")}
            </button>
            <div className="src-drop__formats">{t("import.source.formats")}</div>
          </div>
        </div>
        <div className="src-actions">
          <ImportButton kind="neutral" icon={<MaterialIcon name="arrow_back" />} onClick={onBack}>
            {t("import.back")}
          </ImportButton>
        </div>
      </div>
      {unsupported && (
        <Toast tone="negative" onDismiss={() => setUnsupported(false)} autoDismissMs={5000}>
          {t("import.source.unsupported")}
        </Toast>
      )}
    </div>
  );
}

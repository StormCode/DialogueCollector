import { open } from "@tauri-apps/plugin-dialog";
import { forwardRef, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { unavailableMessageKey } from "../../components/LibraryUnavailableToast";
import { Toast } from "../../components/feedback/Toast";
import { formatBytes, formatCount } from "../../lib/format";
import { errorKind } from "../../lib/ipc";
import { useLibraryStore } from "../../stores/libraryStore";

/** Toast copy for a rejected 瀏覽 choice, keyed by `CommandError.kind` from Rust. */
function chooseErrorKey(kind: string): string {
  switch (kind) {
    case "Library.UnsupportedVolume.CloudSync":
      return "library.choose.cloudSyncDenied";
    case "Library.UnsupportedVolume.Network":
      return "library.choose.networkDriveDenied";
    case "Library.TargetNotEmpty":
      return "library.choose.targetNotEmpty";
    case "Library.TargetInsideLibrary":
      return "library.choose.targetInsideLibrary";
    case "Library.SchemaTooNew":
      return "library.unavailable.schemaTooNew";
    case "Library.Busy":
      return "library.choose.busy";
    default:
      return "library.choose.failed";
  }
}

// Board: Settings.dc.html → 檔案管理 (data-sec="files"), plus its libraryNotFound and
// networkDriveDenied toasts. The heading is focusable so the 找不到收藏庫 toast on the main page
// can land the user here (DD3).
export const FileManagementSection = forwardRef<HTMLHeadingElement>(function FileManagementSection(
  _props,
  headingRef,
) {
  const { t, i18n } = useTranslation();
  const status = useLibraryStore((s) => s.status);
  const relocating = useLibraryStore((s) => s.relocating);
  const progress = useLibraryStore((s) => s.progress);
  const chooseLocation = useLibraryStore((s) => s.chooseLocation);
  const [error, setError] = useState<string | null>(null);
  const [unavailableDismissed, setUnavailableDismissed] = useState(false);
  const dismissError = useCallback(() => setError(null), []);

  const browse = async () => {
    const picked = await open({
      directory: true,
      multiple: false,
      defaultPath: status?.path ?? undefined,
    });
    if (typeof picked !== "string") return;
    try {
      await chooseLocation(picked);
      setUnavailableDismissed(true);
    } catch (e) {
      setError(t(chooseErrorKey(errorKind(e))));
    }
  };

  const reason = status?.reason;
  const showUnavailable =
    !unavailableDismissed && !relocating && status && !status.ready && reason && reason.code !== "moving";
  const percent =
    progress && progress.total > 0 ? Math.floor((progress.done / progress.total) * 100) : null;

  return (
    <section className="st-section" aria-labelledby="st-h-files">
      <h2 className="st-h2" id="st-h-files" ref={headingRef} tabIndex={-1}>
        {t("settings.files.title")}
      </h2>

      <div className="st-row">
        <label className="st-label" htmlFor="st-audio-path">
          {t("settings.files.location")}
        </label>
        <div className="st-control st-control--path">
          <input
            id="st-audio-path"
            className="ro-input"
            type="text"
            readOnly
            value={status?.path ?? ""}
            placeholder={t("settings.files.noLocation")}
          />
          <button type="button" className="btn btn--outline" onClick={() => void browse()} disabled={relocating}>
            {t("settings.files.browse")}
          </button>
        </div>
      </div>

      <div className="st-row">
        <div className="st-label">{t("settings.files.storage")}</div>
        <div className="st-control st-control--stats">
          <div className="stat-box">
            <span className="stat-num">
              {status?.stats ? formatCount(status.stats.clipCount, i18n.language) : "—"}
            </span>
            <span className="stat-cap">{t("settings.files.clipCount")}</span>
          </div>
          <div className="stat-box">
            <span className="stat-num">
              {status?.stats ? formatBytes(status.stats.bytes, i18n.language) : "—"}
            </span>
            <span className="stat-cap">{t("settings.files.diskUsage")}</span>
          </div>
        </div>
      </div>

      {relocating && (
        <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="st-moving-title">
          <div className="modal-backdrop" aria-hidden="true" />
          <div className="modal-card" role="status" aria-live="polite">
            <div className="modal-card__title" id="st-moving-title">
              {t("settings.files.moving")}
            </div>
            <div className="modal-card__body">{t("settings.files.movingHint")}</div>
            {percent !== null && (
              <div
                className="progress"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
              >
                <div className="progress__bar" style={{ width: `${percent}%` }} />
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <Toast tone="negative" onDismiss={dismissError} autoDismissMs={4000}>
          {error}
        </Toast>
      )}
      {!error && showUnavailable && (
        <Toast tone="negative" onDismiss={() => setUnavailableDismissed(true)}>
          {reason.code === "notFound" || reason.code === "noPointer" || reason.code === "notALibrary"
            ? t("library.choose.libraryNotFound")
            : t(
                unavailableMessageKey(reason),
                reason.code === "schemaTooNew" ? { found: reason.found, supported: reason.supported } : {},
              )}
        </Toast>
      )}
    </section>
  );
});

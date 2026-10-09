import { downloadDir, join } from "@tauri-apps/api/path";
import { open, save } from "@tauri-apps/plugin-dialog";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { unavailableMessageKey } from "../../components/LibraryUnavailableToast";
import { Toast } from "../../components/feedback/Toast";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { useBusyReveal } from "../../hooks/useBusyReveal";
import { formatBytes, formatCount } from "../../lib/format";
import { errorKind, ipc } from "../../lib/ipc";
import type { BackupPreview, MissingFile } from "../../lib/types";
import { useBackupStore } from "../../stores/backupStore";
import { useLibraryStore } from "../../stores/libraryStore";
import { MaterialIcon } from "../../components/icons/Icon";
import { MissingFilesModal } from "./MissingFilesModal";

type ToastState = { tone: "positive" | "negative" | "informative"; text: string } | null;

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

/** A specific reason after 匯出失敗／匯入失敗, when the error names one. */
function backupReasonKey(kind: string): string | null {
  switch (kind) {
    case "Backup.InsufficientSpace":
      return "settings.files.reason.noSpace";
    case "Backup.NotOurArchive":
      return "settings.files.reason.notOurArchive";
    case "Backup.SchemaTooNew":
    case "Backup.FormatTooNew":
      return "settings.files.reason.tooNew";
    case "Backup.PathTraversal":
      return "settings.files.reason.unsafe";
    case "Library.Busy":
      return "settings.files.reason.busy";
    default:
      return null;
  }
}

function dirOf(path: string): string {
  const cut = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
  return cut > 0 ? path.slice(0, cut) : path;
}

function backupFileName(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
  return `DialogueCollector-${stamp}.zip`;
}

// Board: Settings.dc.html → 檔案管理, plus SettingsExporting, SettingsImportConfirm and the
// export/import/library toasts. The heading is focusable so the 找不到收藏庫 toast on the main
// page can land the user here (DD3).
export const FileManagementSection = forwardRef<HTMLHeadingElement>(function FileManagementSection(
  _props,
  headingRef,
) {
  const { t, i18n } = useTranslation();
  const status = useLibraryStore((s) => s.status);
  const relocating = useLibraryStore((s) => s.relocating);
  const moveProgress = useLibraryStore((s) => s.progress);
  const chooseLocation = useLibraryStore((s) => s.chooseLocation);
  const exporting = useBackupStore((s) => s.exporting);
  const exportProgress = useBackupStore((s) => s.exportProgress);
  const importing = useBackupStore((s) => s.importing);
  const { exportTo, cancelExport, inspect, importFrom } = useBackupStore.getState();

  const [toast, setToast] = useState<ToastState>(null);
  const [unavailableDismissed, setUnavailableDismissed] = useState(false);
  const [pendingImport, setPendingImport] = useState<{ path: string; preview: BackupPreview } | null>(null);
  const [missing, setMissing] = useState<MissingFile[]>([]);
  const [missingOpen, setMissingOpen] = useState(false);
  const dismissToast = useCallback(() => setToast(null), []);
  const busy = relocating || exporting || importing;
  const stats = status?.stats;
  // 匯出中 shows only once the export runs past BUSY_CARD_DELAY_MS.
  const showExporting = useBusyReveal(exporting);

  // 驗證收藏庫: re-run whenever the library or its contents change (move, import).
  useEffect(() => {
    if (!status?.ready) {
      setMissing([]);
      return;
    }
    let live = true;
    ipc
      .verifyLibrary()
      .then((report) => live && setMissing(report.missing))
      .catch(() => live && setMissing([]));
    return () => {
      live = false;
    };
  }, [status]);

  const browse = async () => {
    const picked = await open({ directory: true, multiple: false, defaultPath: status?.path ?? undefined });
    if (typeof picked !== "string") return;
    try {
      await chooseLocation(picked);
      setUnavailableDismissed(true);
    } catch (e) {
      setToast({ tone: "negative", text: t(chooseErrorKey(errorKind(e))) });
    }
  };

  const failure = (base: string, e: unknown) => {
    const reason = backupReasonKey(errorKind(e));
    return reason ? `${t(base)}：${t(reason)}` : t(base);
  };

  const startExport = async () => {
    const dest = await save({
      defaultPath: await join(await downloadDir(), backupFileName()),
      filters: [{ name: "ZIP", extensions: ["zip"] }],
    });
    if (!dest) return;
    try {
      await exportTo(dest);
      setToast({ tone: "positive", text: t("settings.files.exportSuccess", { dir: dirOf(dest) }) });
    } catch (e) {
      if (errorKind(e) === "Backup.Cancelled") return;
      setToast({ tone: "negative", text: failure("settings.files.exportFailed", e) });
    }
  };

  const pickImport = async () => {
    const path = await open({ multiple: false, filters: [{ name: "ZIP", extensions: ["zip"] }] });
    if (typeof path !== "string") return;
    try {
      setPendingImport({ path, preview: await inspect(path) });
    } catch (e) {
      setToast({ tone: "negative", text: failure("settings.files.importFailed", e) });
    }
  };

  const confirmImport = async () => {
    if (!pendingImport) return;
    const { path } = pendingImport;
    setPendingImport(null);
    try {
      await importFrom(path);
      setUnavailableDismissed(true);
      setToast({ tone: "positive", text: t("settings.files.importSuccess") });
    } catch (e) {
      setToast({ tone: "negative", text: failure("settings.files.importFailed", e) });
    }
  };

  const reason = status?.reason;
  const showUnavailable =
    !unavailableDismissed && !busy && status && !status.ready && reason && reason.code !== "moving";
  const exportPct =
    exportProgress && exportProgress.total > 0
      ? Math.floor((exportProgress.done / exportProgress.total) * 100)
      : 0;
  const movePct =
    moveProgress && moveProgress.total > 0 ? Math.floor((moveProgress.done / moveProgress.total) * 100) : null;

  return (
    <section className="st-section" data-sec="files" aria-labelledby="st-h-files">
      <h2 className="st-h2" id="st-h-files" ref={headingRef} tabIndex={-1}>
        {t("settings.files.title")}
      </h2>

      <div className="st-row">
        <label className="st-label" htmlFor="st-audio-path">
          {t("settings.files.location")}
        </label>
        <div className="st-inline">
          <input
            id="st-audio-path"
            className="ro-input"
            type="text"
            readOnly
            value={status?.path ?? ""}
            placeholder={t("settings.files.noLocation")}
          />
          <Button variant="outline" onClick={() => void browse()} disabled={busy}>
            {t("settings.files.browse")}
          </Button>
        </div>
      </div>

      <div className="st-row">
        <div className="st-label">
          {t("settings.files.backup")}
          <span className="st-sub">{t("settings.files.backupHint")}</span>
        </div>
        <div className="st-inline st-inline--split">
          <Button variant="solid" fullWidth onClick={() => void startExport()} disabled={busy || !status?.ready}>
            {t("settings.files.export")}
          </Button>
          <Button variant="outline" fullWidth onClick={() => void pickImport()} disabled={busy}>
            {t("settings.files.import")}
          </Button>
        </div>
      </div>

      <div className="st-row">
        <div className="st-label">{t("settings.files.storage")}</div>
        <div className="st-inline st-inline--stats">
          {/* Settings board: clips / images, and the space they take together with each part. */}
          <div className="stat-box">
            <span className="stat-num">
              {stats ? (
                <>
                  {formatCount(stats.clipCount, i18n.language)} <span className="stat-sep">/</span>{" "}
                  {formatCount(stats.imageCount, i18n.language)}
                </>
              ) : (
                "—"
              )}
            </span>
            <span className="stat-cap">{t("settings.files.clipCount")}</span>
          </div>
          <div className="stat-box">
            <span className="stat-num">
              {stats ? (
                <>
                  {formatBytes(stats.bytes + stats.imageBytes, i18n.language)}{" "}
                  <span className="stat-sub">
                    ({formatBytes(stats.bytes, i18n.language)} / {formatBytes(stats.imageBytes, i18n.language)})
                  </span>
                </>
              ) : (
                "—"
              )}
            </span>
            <span className="stat-cap">{t("settings.files.diskUsage")}</span>
          </div>
          {missing.length > 0 && (
            <button
              type="button"
              className="stat-box stat-missing"
              aria-haspopup="dialog"
              onClick={() => setMissingOpen(true)}
            >
              <span className="stat-num">
                {formatCount(missing.length, i18n.language)}
              </span>
              <span className="stat-cap">
                <MaterialIcon name="error" size={16} />
                {t("settings.files.missing.count")}
              </span>
            </button>
          )}
        </div>
      </div>

      {missingOpen && (
        <MissingFilesModal
          files={missing}
          onClose={() => setMissingOpen(false)}
          onDeleteAll={async () => {
            try {
              await ipc.deleteMissingLines();
              setMissing([]);
              setMissingOpen(false);
              void useLibraryStore.getState().load();
            } catch (e) {
              setToast({ tone: "negative", text: t(backupReasonKey(errorKind(e)) ?? "settings.files.missing.deleteFailed") });
            }
          }}
        />
      )}

      {showExporting && (
        <Modal title={t("settings.files.export")}>
          <ProgressBody
            icon="sync"
            title={t("settings.files.exporting")}
            hint={t("settings.files.exportingHint")}
            pct={exportPct}
            step={
              exportProgress?.finishing
                ? t("settings.files.exportFinishing")
                : t("settings.files.exportCopying", {
                    done: formatCount(exportProgress?.done ?? 0, i18n.language),
                    total: formatCount(exportProgress?.total ?? 0, i18n.language),
                  })
            }
            label={t("settings.files.exportProgress")}
          />
          <div className="modal-actions">
            <Button variant="neutral" onClick={() => void cancelExport()} data-autofocus>
              {t("settings.files.cancelExport")}
            </Button>
          </div>
        </Modal>
      )}

      {importing && (
        <Modal title={t("settings.files.import")}>
          <ProgressBody icon="sync" title={t("settings.files.importing")} hint={t("settings.files.importingHint")} />
        </Modal>
      )}

      {relocating && (
        <Modal title={t("settings.files.location")}>
          <ProgressBody
            icon="sync"
            title={t("settings.files.moving")}
            hint={t("settings.files.movingHint")}
            pct={movePct ?? undefined}
            label={t("settings.files.moving")}
          />
        </Modal>
      )}

      {pendingImport && (
        <Modal title={t("settings.files.confirm")} onClose={() => setPendingImport(null)}>
          <div className="confirm">
            <div className="confirm__icon" aria-hidden="true">
              <MaterialIcon name="settings_backup_restore" size={32} />
            </div>
            <div className="confirm__title">{t("settings.files.importConfirmTitle")}</div>
            <div className="confirm__body">
              {t("settings.files.importConfirmBefore")}
              <strong>{t("settings.files.importConfirmStrong")}</strong>
              {t("settings.files.importConfirmAfter")}
            </div>
            {/* Name what will be lost before the irreversible replace. */}
            <div className="confirm__counts">
              {t("settings.files.importConfirmCounts", {
                characters: formatCount(pendingImport.preview.currentCharacters, i18n.language),
                clips: formatCount(pendingImport.preview.currentClips, i18n.language),
                size: formatBytes(pendingImport.preview.currentBytes, i18n.language),
              })}
            </div>
            <div className="confirm__tip">
              <MaterialIcon name="lightbulb" size={18} />
              <span>{t("settings.files.importConfirmTip")}</span>
            </div>
          </div>
          <div className="modal-actions">
            <Button variant="neutral" onClick={() => setPendingImport(null)} data-autofocus>
              {t("settings.files.cancel")}
            </Button>
            <Button variant="danger" onClick={() => void confirmImport()}>
              {t("settings.files.confirmImport")}
            </Button>
          </div>
        </Modal>
      )}

      {toast && (
        <Toast tone={toast.tone} onDismiss={dismissToast} autoDismissMs={4000}>
          {toast.text}
        </Toast>
      )}
      {!toast && showUnavailable && (
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

function ProgressBody({
  icon,
  title,
  hint,
  pct,
  step,
  label,
}: {
  icon: "sync";
  title: string;
  hint: string;
  pct?: number;
  step?: string;
  label?: string;
}) {
  return (
    <div className="progress-body" role="status" aria-live="polite">
      <div className="progress-body__icon" aria-hidden="true">
        <span className="spin">
          <MaterialIcon name={icon} size={36} />
        </span>
      </div>
      <div className="progress-body__title">{title}</div>
      <div className="progress-body__hint">{hint}</div>
      {pct !== undefined && (
        <div className="progress-body__bar">
          <div
            className="progress"
            role="progressbar"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
          >
            <div className="progress__fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="progress-body__meta">
            <span>{step}</span>
            <span className="progress-body__pct">{pct}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

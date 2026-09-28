import { listen } from "@tauri-apps/api/event";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { Toast } from "../../components/feedback/Toast";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { errorKind, inTauri, ipc } from "../../lib/ipc";
import type { UpdateProgress } from "../../lib/types";
import { useSettingsStore } from "../../stores/settingsStore";
import { BentoIcon, MaterialIcon } from "../../components/icons/Icon";

/** Must match `UPDATE_PROGRESS_EVENT` in src-tauri/src/updater.rs. */
const UPDATE_PROGRESS_EVENT = "update-progress";

type Status = "idle" | "checking" | "latest" | "updating";

function updateErrorKey(kind: string): string {
  switch (kind) {
    case "Update.Unreachable":
      return "settings.update.unreachable";
    case "Update.BadSignature":
      return "settings.update.badSignature";
    case "Update.InProgress":
      return "settings.update.inProgress";
    case "Update.Busy":
      return "settings.update.busy";
    default:
      return "settings.update.failed";
  }
}

// 目前版本 (T22). 檢查更新 either reports 已是最新版本! or downloads, installs and restarts into
// the new version, showing 更新中... meanwhile. The 自動更新 preference drives the startup check
// in src-tauri/src/updater.rs.
export function VersionSection() {
  const { t } = useTranslation();
  const autoUpdate = useSettingsStore((s) => s.settings.autoUpdate);
  const update = useSettingsStore((s) => s.update);
  const [version, setVersion] = useState("—");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState<UpdateProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dismiss = useCallback(() => setError(null), []);

  useEffect(() => {
    if (inTauri()) void ipc.appInfo().then((info) => setVersion(`v${info.version}`));
  }, []);

  const check = async () => {
    setStatus("checking");
    setError(null);
    const unlisten = await listen<UpdateProgress>(UPDATE_PROGRESS_EVENT, (e) => {
      setStatus("updating");
      setProgress(e.payload);
    });
    try {
      // Resolves only when up to date; otherwise the app restarts into the new version.
      await ipc.checkForUpdate();
      setStatus("latest");
    } catch (e) {
      setStatus("idle");
      setError(t(updateErrorKey(errorKind(e))));
    } finally {
      unlisten();
      setProgress(null);
    }
  };

  const percent =
    progress?.total ? Math.min(100, Math.round((progress.downloaded / progress.total) * 100)) : null;

  return (
    <section className="st-section" data-sec="version" aria-labelledby="st-h-version">
      <div className="st-head">
        <h2 className="st-h2" id="st-h-version">
          {t("settings.version")}
        </h2>
        <div className="st-update">
          {status === "latest" && (
            <span className="st-update__status st-update__status--latest" role="status">
              <BentoIcon name="PositiveCircle" size={18} />
              {t("settings.update.latest")}
            </span>
          )}
          {status === "updating" && (
            <span className="st-update__status" role="status">
              <span className="spin">
                <MaterialIcon name="progress_activity" size={18} />
              </span>
              {t("settings.update.updating")}
              {percent !== null && ` ${percent}%`}
            </span>
          )}
          <Button
            variant="outline"
            size="small"
            disabled={status === "checking" || status === "updating"}
            onClick={() => void check()}
          >
            {t("settings.checkUpdate")}
          </Button>
        </div>
      </div>
      <div className="st-row">
        <div className="st-label">{t("settings.versionLabel")}</div>
        <div className="st-value">
          {version} · <Link to="/diagnostics">{t("diagnostics.link")}</Link>
        </div>
      </div>
      <div className="st-row">
        <div className="st-label">{t("settings.autoUpdate")}</div>
        <Checkbox
          checked={autoUpdate}
          label={t("settings.autoUpdateLabel")}
          onChange={(v) => void update({ autoUpdate: v })}
        />
      </div>
      {error && (
        <Toast tone="negative" onDismiss={dismiss} autoDismissMs={6000}>
          {error}
        </Toast>
      )}
    </section>
  );
}

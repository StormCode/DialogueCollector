import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { Toast } from "../../components/feedback/Toast";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { inTauri, ipc } from "../../lib/ipc";
import { useSettingsStore } from "../../stores/settingsStore";

// 目前版本. The updater (T22) is not wired yet: the repository is private, so a GitHub Releases
// feed is not reachable without credentials. 檢查更新 says so instead of pretending to check;
// the 自動更新 preference is stored and will take effect once an update feed exists.
export function VersionSection() {
  const { t } = useTranslation();
  const autoUpdate = useSettingsStore((s) => s.settings.autoUpdate);
  const update = useSettingsStore((s) => s.update);
  const [version, setVersion] = useState("—");
  const [notice, setNotice] = useState(false);
  const dismiss = useCallback(() => setNotice(false), []);

  useEffect(() => {
    if (inTauri()) void ipc.appInfo().then((info) => setVersion(`v${info.version}`));
  }, []);

  return (
    <section className="st-section" data-sec="version" aria-labelledby="st-h-version">
      <div className="st-head">
        <h2 className="st-h2" id="st-h-version">
          {t("settings.version")}
        </h2>
        <Button variant="outline" size="small" onClick={() => setNotice(true)}>
          {t("settings.checkUpdate")}
        </Button>
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
      {notice && (
        <Toast tone="informative" onDismiss={dismiss} autoDismissMs={4000}>
          {t("settings.updateUnavailable")}
        </Toast>
      )}
    </section>
  );
}

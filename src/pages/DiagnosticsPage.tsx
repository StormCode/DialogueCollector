import { useState } from "react";
import { useTranslation } from "react-i18next";

import { runSmoke, type SmokeResult } from "../lib/smoke";

// Not in the nav; reached from 設定 → 目前版本. Runs the same T1 check as `--smoke`.
export function DiagnosticsPage() {
  const { t } = useTranslation();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SmokeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setRunning(true);
    setResult(null);
    setError(null);
    try {
      setResult(await runSmoke());
    } catch (e) {
      setError(typeof e === "object" && e && "message" in e ? String(e.message) : String(e));
    } finally {
      setRunning(false);
    }
  };

  return (
    <section className="page">
      <h1 className="page__title pg-anim-title">{t("diagnostics.title")}</h1>
      <button type="button" onClick={() => void run()} disabled={running}>
        {running ? t("diagnostics.running") : t("diagnostics.run")}
      </button>
      {result && (
        <div>
          <p>
            {t("diagnostics.passed")} — row {result.report.rowId}, {result.report.clipBytes} bytes,{" "}
            {result.report.cutMs} ms, {result.durationSeconds.toFixed(3)} s
          </p>
          <audio controls src={result.clipUrl} />
        </div>
      )}
      {error && (
        <p role="alert">
          {t("diagnostics.failed")}: {error}
        </p>
      )}
    </section>
  );
}

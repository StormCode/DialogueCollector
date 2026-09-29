import { useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router";

import { AppLayout } from "./components/layout/AppLayout";
import { DiagnosticsPage } from "./pages/DiagnosticsPage";
import i18n from "./i18n";
import { LinesPage } from "./pages/LinesPage";
import { MainPage } from "./pages/MainPage";
import { ScriptBookPage } from "./pages/ScriptBookPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ManualImportPage } from "./pages/import/ManualImportPage";
import { SubtitleImportPage } from "./pages/import/SubtitleImportPage";
import { inTauri } from "./lib/ipc";
import { runHeadlessSmokeIfRequested } from "./lib/smoke";
import { useLibraryStore } from "./stores/libraryStore";
import { useSettingsStore } from "./stores/settingsStore";

/** Applies portable settings that live on the document root: theme, locale, 台詞 font. */
function useApplySettings() {
  const load = useSettingsStore((s) => s.load);
  const loadLibrary = useLibraryStore((s) => s.load);
  const { theme, locale, lineFont } = useSettingsStore((s) => s.settings);

  useEffect(() => {
    void load();
    void loadLibrary();
    if (inTauri()) void runHeadlessSmokeIfRequested();
  }, [load, loadLibrary]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.lineFont = lineFont;
    void i18n.changeLanguage(locale);
  }, [theme, locale, lineFont]);
}

export default function App() {
  useApplySettings();

  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<MainPage />} />
          <Route path="import/subtitle" element={<SubtitleImportPage />} />
          <Route path="import/manual" element={<ManualImportPage />} />
          <Route path="characters" element={<ScriptBookPage />} />
          <Route path="characters/:characterId" element={<LinesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="diagnostics" element={<DiagnosticsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

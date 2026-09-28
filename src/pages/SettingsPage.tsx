import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import { useRevealScrollbar } from "../components/ui/useRevealScrollbar";
import { useLibraryStore } from "../stores/libraryStore";
import { FileManagementSection } from "./settings/FileManagementSection";
import { MaterialIcon, type MaterialIconName } from "../components/icons/Icon";
import { InterfaceSection } from "./settings/InterfaceSection";
import { LinesSection, ScriptBookSection } from "./settings/ListSections";
import { VersionSection } from "./settings/VersionSection";
import "./settings/settings.css";

type SectionId = "ui" | "book" | "lines" | "files" | "version";

const SECTIONS: { id: SectionId; labelKey: string; icon: MaterialIconName }[] = [
  { id: "ui", labelKey: "settings.interface", icon: "palette" },
  { id: "book", labelKey: "settings.book.title", icon: "book_2" },
  { id: "lines", labelKey: "settings.lines.title", icon: "chat" },
  { id: "files", labelKey: "settings.files.title", icon: "folder_open" },
  { id: "version", labelKey: "settings.version", icon: "info" },
];

// Board: design/boards/Settings.dc.html — a section index on the left and one scrolling card,
// with the index following the scroll position.
export function SettingsPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const loadLibrary = useLibraryStore((s) => s.load);
  const card = useRef<HTMLDivElement>(null);
  const filesHeading = useRef<HTMLHeadingElement>(null);
  const lockUntil = useRef(0);
  const [active, setActive] = useState<SectionId>("ui");
  useRevealScrollbar(card);

  useEffect(() => {
    void loadLibrary();
  }, [loadLibrary]);

  const goTo = useCallback((id: SectionId, focus = false) => {
    const el = card.current?.querySelector<HTMLElement>(`[data-sec="${id}"]`);
    if (!card.current || !el) return;
    // Suppress scroll-spy while the smooth scroll runs, so the index does not flicker.
    lockUntil.current = Date.now() + 700;
    setActive(id);
    card.current.scrollTo?.({ top: Math.max(0, el.offsetTop - 24), behavior: "smooth" });
    if (focus) el.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
  }, []);

  const onScroll = useCallback(() => {
    const el = card.current;
    if (!el || Date.now() < lockUntil.current) return;
    let current: SectionId = SECTIONS[0].id;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
      current = SECTIONS[SECTIONS.length - 1].id;
    } else {
      for (const s of SECTIONS) {
        const sec = el.querySelector<HTMLElement>(`[data-sec="${s.id}"]`);
        if (sec && sec.offsetTop - 60 <= el.scrollTop) current = s.id;
      }
    }
    setActive(current);
  }, []);

  // Arriving from the 找不到收藏庫 toast: bring 檔案管理 into view and focus it (DD3).
  useEffect(() => {
    if ((location.state as { focus?: string } | null)?.focus === "files") goTo("files", true);
  }, [location.state, goTo]);

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">{t("settings.title")}</h1>
      <div className="settings-page__body">
        <nav className="settings-toc" aria-label={t("settings.toc")}>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`toc-item${active === s.id ? " is-active" : ""}`}
              aria-current={active === s.id ? "true" : undefined}
              onClick={() => goTo(s.id)}
            >
              <MaterialIcon name={s.icon} size={22} />
              <span>{t(s.labelKey)}</span>
            </button>
          ))}
        </nav>
        <div className="settings-card st-scroll" ref={card} onScroll={onScroll}>
          <InterfaceSection />
          <ScriptBookSection />
          <LinesSection />
          <FileManagementSection ref={filesHeading} />
          <VersionSection />
        </div>
      </div>
    </div>
  );
}

import { convertFileSrc } from "@tauri-apps/api/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import emptyArt from "../assets/illustrations/empty.png";
import { AddCharacterModal, EditCharacterModal } from "../components/characters/AddCharacterModal";
import { Toast } from "../components/feedback/Toast";
import { BentoIcon, MaterialIcon } from "../components/icons/Icon";
import { Checkbox } from "../components/ui/Checkbox";
import { Chip } from "../components/ui/Chip";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Pagination } from "../components/ui/Pagination";
import { SearchBar } from "../components/ui/SearchBar";
import { useRevealScrollbar } from "../components/ui/useRevealScrollbar";
import { errorKind, inTauri, ipc } from "../lib/ipc";
import type { Category, Character } from "../lib/types";
import { useSettingsStore } from "../stores/settingsStore";
import "./scriptbook.css";

const CATEGORIES: Category[] = ["anime", "movie", "tv"];

// Board: ScriptBook.dc.html (+ ScriptBookEmpty, ScriptBookNoResult). Search matches 角色名稱 or
// CV/飾演 (the field's placeholder); the filter narrows by 類別 and by 作品 — the board's
// prototype lists the choices without applying them, so they are applied here.
export function ScriptBookPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pageSize = useSettingsStore((s) => s.settings.charactersPerPage);
  const [characters, setCharacters] = useState<Character[] | null>(null);
  const [query, setQuery] = useState("");
  const [cats, setCats] = useState<Category[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Character | null>(null);
  const [deleting, setDeleting] = useState<Character | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  useRevealScrollbar(useMemo(() => ({ current: scroller }), [scroller]));

  const load = useCallback(async () => {
    try {
      setCharacters(await ipc.listCharacters());
    } catch {
      setCharacters([]);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  const allSources = useMemo(
    () => [...new Set((characters ?? []).map((c) => c.source))].sort((a, b) => a.localeCompare(b)),
    [characters],
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (characters ?? []).filter(
      (c) =>
        (!q || c.name.toLowerCase().includes(q) || (c.cv ?? "").toLowerCase().includes(q)) &&
        (cats.length === 0 || cats.includes(c.category)) &&
        (sources.length === 0 || sources.includes(c.source)),
    );
  }, [characters, query, cats, sources]);

  const total = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, total);
  const shown = filtered.slice((current - 1) * pageSize, current * pageSize);
  const filtering = filterOpen || cats.length > 0 || sources.length > 0;

  const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  const narrow = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const isEmpty = characters !== null && characters.length === 0;
  const noResult = !isEmpty && characters !== null && filtered.length === 0;

  return (
    <section className="sb-page">
      <h1 className="sb-title pg-anim-title">{t("scriptBook.title")}</h1>

      <div className="sb-toolbar">
        <div className="sb-search">
          <SearchBar
            value={query}
            onChange={(v) => narrow(() => setQuery(v))}
            placeholder={t("scriptBook.search")}
          />
        </div>
        <div className="sb-filter">
          <button
            type="button"
            className={`sb-filter__btn${filtering ? " is-active" : ""}`}
            aria-label={t("scriptBook.filter")}
            aria-expanded={filterOpen}
            onClick={() => setFilterOpen((o) => !o)}
          >
            <MaterialIcon name="filter_list" />
          </button>
          {filterOpen && (
            <>
              <div className="sb-dismiss" aria-hidden="true" onClick={() => setFilterOpen(false)} />
              <div className="sb-filter__panel">
                <div className="sb-filter__col">
                  <div className="sb-filter__title">{t("scriptBook.category")}</div>
                  <div className="sb-filter__tags">
                    {cats.map((c) => (
                      <Chip
                        key={c}
                        label={t(`characters.categories.${c}`)}
                        removeLabel={t("scriptBook.removeFilter", { name: t(`characters.categories.${c}`) })}
                        onRemove={() => narrow(() => setCats(toggle(cats, c)))}
                      />
                    ))}
                  </div>
                  <div className="sb-filter__list st-scroll">
                    {CATEGORIES.map((c) => (
                      <span key={c} className="sb-filter__item">
                        <Checkbox
                          checked={cats.includes(c)}
                          label={t(`characters.categories.${c}`)}
                          onChange={() => narrow(() => setCats(toggle(cats, c)))}
                        />
                      </span>
                    ))}
                  </div>
                </div>
                <div className="sb-filter__col">
                  <div className="sb-filter__title">{t("scriptBook.source")}</div>
                  <div className="sb-filter__tags">
                    {sources.map((s) => (
                      <Chip
                        key={s}
                        label={s}
                        removeLabel={t("scriptBook.removeFilter", { name: s })}
                        onRemove={() => narrow(() => setSources(toggle(sources, s)))}
                      />
                    ))}
                  </div>
                  <div className="sb-filter__list st-scroll">
                    {allSources.map((s) => (
                      <span key={s} className="sb-filter__item">
                        <Checkbox
                          checked={sources.includes(s)}
                          label={s}
                          onChange={() => narrow(() => setSources(toggle(sources, s)))}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="sb-toolbar__gap" aria-hidden="true" />
        <button type="button" className="sb-add" onClick={() => setAdding(true)}>
          <MaterialIcon name="add" />
          {t("scriptBook.add")}
        </button>
      </div>

      {(isEmpty || noResult) && (
        <div className="sb-empty" role={noResult ? "status" : undefined}>
          <img src={emptyArt} alt="" aria-hidden="true" className={`dc-illus${noResult ? " is-noresult" : ""}`} />
          <p>{t(isEmpty ? "scriptBook.empty" : "scriptBook.noResult")}</p>
        </div>
      )}

      {shown.length > 0 && (
        <>
          <div ref={setScroller} className="sb-scroll st-scroll">
            {/* Keyed by page so each page's cards rise in again. */}
            <div className="sb-grid" key={`${current}-${query}-${cats.join()}-${sources.join()}`}>
              {shown.map((c, i) => (
                <div key={c.id} className="sb-card-wrap" style={{ animationDelay: `${Math.floor(i / 2) * 180}ms` }}>
                  <button type="button" className="sb-card" onClick={() => navigate(`/characters/${c.id}`)}>
                    <span className={`sb-card__avatar${c.portraitPath ? " has-photo" : ""}`}>
                      {c.portraitPath && inTauri() ? (
                        <img src={convertFileSrc(c.portraitPath)} alt="" />
                      ) : (
                        <MaterialIcon name="person" size={32} />
                      )}
                    </span>
                    <span className="sb-card__body">
                      <span className="sb-card__name-row">
                        <span className="sb-card__name">{c.name}</span>
                        {c.cv && <span className="sb-card__cv">{c.cv}</span>}
                      </span>
                      <span className="sb-card__source">{c.source}</span>
                    </span>
                  </button>
                  <span className="sb-card__corner" aria-hidden="true" />
                  <button
                    type="button"
                    className="sb-card__edit"
                    aria-label={t("scriptBook.edit", { name: c.name })}
                    onClick={() => setEditing(c)}
                  >
                    <BentoIcon name="PencilWeightRegular" size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <Pagination page={current} total={total} onChange={setPage} />
        </>
      )}

      {adding && (
        <AddCharacterModal
          onClose={() => setAdding(false)}
          onCreate={async (form) => {
            await ipc.createCharacter(form);
            setAdding(false);
            await load();
          }}
        />
      )}
      {editing && !deleting && (
        <EditCharacterModal
          character={editing}
          onClose={() => setEditing(null)}
          onSave={async (edit) => {
            await ipc.updateCharacter(editing.id, edit);
            setEditing(null);
            await load();
          }}
          onDelete={() => setDeleting(editing)}
        />
      )}
      {deleting && (
        // DeleteConfirm.dc.html
        <ConfirmDialog
          title={t("scriptBook.deleteTitle")}
          // the number of lines that go with the character (the count only).
          body={
            deleting.lineCount > 0
              ? t("scriptBook.deleteBody", { name: deleting.name, count: deleting.lineCount })
              : t("scriptBook.deleteBodyNoLines", { name: deleting.name })
          }
          confirmLabel={t("scriptBook.deleteConfirm")}
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            try {
              await ipc.deleteCharacter(deleting.id);
            } catch (e) {
              setToast(t(errorKind(e) === "Library.FileRemovalFailed" ? "scriptBook.fileRemovalFailed" : "scriptBook.deleteFailed"));
            }
            setDeleting(null);
            setEditing(null);
            await load();
          }}
        />
      )}
      {toast && (
        <Toast tone="negative" onDismiss={() => setToast(null)} autoDismissMs={6000}>
          {toast}
        </Toast>
      )}
    </section>
  );
}

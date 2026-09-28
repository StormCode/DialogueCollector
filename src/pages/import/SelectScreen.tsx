import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";

import { AddCharacterModal } from "../../components/characters/AddCharacterModal";
import { CharacterAvatar } from "../../components/characters/CharacterAvatar";
import { Toast } from "../../components/feedback/Toast";
import { BentoIcon, BoardArt, MaterialIcon } from "../../components/icons/Icon";
import { SearchBar } from "../../components/ui/SearchBar";
import { useRevealScrollbar } from "../../components/ui/useRevealScrollbar";
import type { Character } from "../../lib/types";
import { useSubtitleImportStore } from "../../stores/subtitleImportStore";
import { ImportButton, Stepper } from "./ImportParts";

/** 00:01:02.345 */
export function formatClock(ms: number): string {
  const pad = (n: number, w: number) => String(n).padStart(w, "0");
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)}.${pad(ms % 1000, 3)}`;
}

function matches(c: Character, query: string) {
  const q = query.trim().toLowerCase();
  return !q || c.name.toLowerCase().includes(q) || c.source.toLowerCase().includes(q);
}

// Board: SubtitleSelect.dc.html (Step 2) and SubtitleSelectEmpty.dc.html (its toast). The
// checkboxes only serve bulk assignment (D13-REV); only assigned lines are imported.
export function SelectScreen({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const s = useSubtitleImportStore();
  const card = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  useRevealScrollbar(list);

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuQuery, setMenuQuery] = useState("");
  const [picker, setPicker] = useState<{ index: number; left: number; top: number } | null>(null);
  const [pickQuery, setPickQuery] = useState("");
  /** 新增角色 opened from the menu (assign the checked rows) or a row's picker (that row). */
  const [adding, setAdding] = useState<"selected" | number | null>(null);
  const [toastDismissed, setToastDismissed] = useState(false);

  useEffect(() => {
    void useSubtitleImportStore.getState().loadCharacters().catch(() => {});
  }, []);

  const byId = useMemo(() => new Map(s.characters.map((c) => [c.id, c])), [s.characters]);
  const selectedCount = s.selected.size;
  const assignedCount = s.cues.filter((c) => s.assigned[c.index] !== undefined).length;
  const menuChars = s.characters.filter((c) => matches(c, menuQuery));
  const pickChars = s.characters.filter((c) => matches(c, pickQuery));
  const showMenu = menuOpen && selectedCount > 0;

  const openPicker = (index: number, e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const cardEl = card.current;
    let left = 160;
    let top = 120;
    if (cardEl) {
      const cr = cardEl.getBoundingClientRect();
      const br = e.currentTarget.getBoundingClientRect();
      left = br.right - cr.left + 12;
      top = Math.max(12, Math.min(br.top - cr.top - 12, cardEl.offsetHeight - 280));
    }
    setMenuOpen(false);
    setPickQuery("");
    setPicker({ index, left, top });
  };

  const pick = (characterId: number | null) => {
    if (picker) s.assignOne(picker.index, characterId);
    setPicker(null);
    setPickQuery("");
  };

  const assign = (characterId: number | null) => {
    s.assignSelected(characterId);
    setMenuOpen(false);
    setMenuQuery("");
  };

  return (
    <div className="imp-page imp-page--list">
      <header className="imp-header">
        <h1 className="imp-title">{t("import.select.title")}</h1>
        <Stepper current={2} />
      </header>

      <div className="sel-card" ref={card}>
        <div className="sel-toolbar">
          <button type="button" className="sel-btn sel-btn--outline" onClick={s.selectAll}>
            {t("import.select.selectAll")}
          </button>
          <button type="button" className="sel-btn sel-btn--neutral" onClick={s.clearAll}>
            {t("import.select.clearAll")}
          </button>
          <div className="sel-toolbar__gap" aria-hidden="true" />
          <div className="sel-assign">
            <button
              type="button"
              className="sel-assign__btn"
              aria-haspopup="menu"
              aria-expanded={showMenu}
              disabled={selectedCount === 0}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <MaterialIcon name="person_add" size={20} />
              {t("import.select.assignTo")}
              <BentoIcon name={showMenu ? "ChevronUp" : "ChevronDown"} size={20} />
            </button>
            {showMenu && (
              <>
                <div className="sel-dismiss" aria-hidden="true" onClick={() => setMenuOpen(false)} />
                <div className="sel-menu" role="menu">
                  <div className="sel-accent-inputs">
                    <SearchBar
                      value={menuQuery}
                      onChange={setMenuQuery}
                      placeholder={t("import.select.searchCharacter")}
                      autoFocus
                    />
                  </div>
                  <div className="sel-menu__items">
                    {!menuQuery.trim() && (
                      <button type="button" role="menuitem" className="sel-menu__item" onClick={() => assign(null)}>
                        <span className="sel-none sel-none--28" aria-hidden="true">
                          <MaterialIcon name="person" size={18} />
                        </span>
                        <span className="sel-menu__none">{t("import.select.unassigned")}</span>
                      </button>
                    )}
                    {menuChars.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        role="menuitem"
                        className="sel-menu__item"
                        onClick={() => assign(c.id)}
                      >
                        <CharacterAvatar id={c.id} name={c.name} portraitPath={c.portraitPath} size={28} />
                        <span className="sel-menu__name">{c.name}</span>
                        <span className="sel-menu__show">{c.source}</span>
                      </button>
                    ))}
                    {menuChars.length === 0 && menuQuery.trim() && (
                      <div className="sel-noresult">{t("import.select.noCharacter")}</div>
                    )}
                  </div>
                  <div className="sel-menu__divider" />
                  <button
                    type="button"
                    role="menuitem"
                    className="sel-menu__item sel-menu__add"
                    onClick={() => {
                      setMenuOpen(false);
                      setAdding("selected");
                    }}
                  >
                    <BoardArt name="plus" style={{ width: 16, height: 16 }} />
                    <span>{t("import.select.addCharacter")}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="sel-table">
          <div className="sel-row sel-row--head">
            <span />
            <span className="sel-avatar-cell">{t("import.select.character")}</span>
            <span>{t("import.select.time")}</span>
            <span>{t("import.select.text")}</span>
          </div>
          <div
            ref={list}
            className={`sel-list st-scroll${selectedCount > 0 ? " has-selection" : ""}`}
          >
            {s.cues.map((cue) => {
              const isSelected = s.selected.has(cue.index);
              const character = byId.get(s.assigned[cue.index]);
              return (
                <label key={cue.index} className={`sel-row${isSelected ? " is-selected" : ""}`}>
                  <span className="sel-check">
                    <input
                      type="checkbox"
                      className="sel-input"
                      aria-label={t("import.select.selectLine", { n: cue.index + 1 })}
                      checked={isSelected}
                      onChange={() => s.toggle(cue.index)}
                    />
                    <span className="sel-box-wrap">
                      <span className={`sel-box${isSelected ? " is-checked" : ""}`}>
                        {isSelected && <BentoIcon name="CheckWeightBold" size={16} />}
                      </span>
                    </span>
                  </span>
                  <span className="sel-avatar-cell">
                    <button
                      type="button"
                      className={`sel-avatar-btn${picker?.index === cue.index ? " is-open" : ""}`}
                      aria-label={t("import.select.pickFor", { n: cue.index + 1 })}
                      aria-haspopup="dialog"
                      onClick={(e) => openPicker(cue.index, e)}
                    >
                      {character ? (
                        <CharacterAvatar
                          id={character.id}
                          name={character.name}
                          portraitPath={character.portraitPath}
                          label={character.name}
                        />
                      ) : (
                        <span className="sel-none" role="img" aria-label={t("import.select.noCharacterYet")}>
                          <MaterialIcon name="person" size={20} />
                        </span>
                      )}
                    </button>
                  </span>
                  <span className="sel-time">
                    {formatClock(cue.startMs)} ~ {formatClock(cue.endMs)}
                  </span>
                  <span className="sel-text">
                    <span className="sel-text__line">{cue.text}</span>
                    {cue.translation && <span className="sel-text__translation">{cue.translation}</span>}
                  </span>
                </label>
              );
            })}
            {s.cues.length === 0 && (
              <div className="sel-empty">
                <MaterialIcon name="subtitles_off" size={40} />
                {t("import.select.empty")}
              </div>
            )}
          </div>
        </div>

        <div className="sel-footer">
          <span className="sel-counts">
            {t("import.select.total")} <b>{s.cues.length}</b> {t("import.select.lines")}
            <span className="sel-sep" aria-hidden="true">
              |
            </span>
            {t("import.select.checked")} <b className="sel-accent">{selectedCount}</b> {t("import.select.lines")}
            <span className="sel-sep" aria-hidden="true">
              |
            </span>
            {t("import.select.assigned")} <b className="sel-accent">{assignedCount}</b> {t("import.select.lines")}
          </span>
          <div className="sel-footer__actions">
            <ImportButton kind="neutral" icon={<MaterialIcon name="arrow_back" />} onClick={onBack}>
              {t("import.back")}
            </ImportButton>
            <ImportButton
              kind="primary"
              icon={<MaterialIcon name="movie" />}
              disabled={assignedCount === 0}
              onClick={s.toSource}
            >
              {t("import.select.importSource")}
            </ImportButton>
          </div>
        </div>

        {picker && (
          <>
            <div className="sel-dismiss" aria-hidden="true" onClick={() => setPicker(null)} />
            <div
              className="sel-picker"
              role="dialog"
              aria-label={t("import.select.pickCharacter")}
              style={{ left: picker.left, top: picker.top }}
            >
              <div className="sel-accent-inputs">
                <SearchBar value={pickQuery} onChange={setPickQuery} placeholder={t("import.select.searchCharacter")} autoFocus />
              </div>
              <div className="sel-pick-grid">
                {!pickQuery.trim() && (
                  <button
                    type="button"
                    className={`sel-pick sel-pick--wide${s.assigned[picker.index] === undefined ? " is-current" : ""}`}
                    aria-pressed={s.assigned[picker.index] === undefined}
                    onClick={() => pick(null)}
                  >
                    <span className="sel-none" aria-hidden="true">
                      <MaterialIcon name="person" size={20} />
                    </span>
                    <span className="sel-menu__none">{t("import.select.unassigned")}</span>
                  </button>
                )}
                {pickChars.map((c) => {
                  const current = s.assigned[picker.index] === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`sel-pick${current ? " is-current" : ""}`}
                      aria-pressed={current}
                      onClick={() => pick(c.id)}
                    >
                      <CharacterAvatar id={c.id} name={c.name} portraitPath={c.portraitPath} />
                      <span className="sel-menu__name">{c.name}</span>
                    </button>
                  );
                })}
              </div>
              {pickChars.length === 0 && pickQuery.trim() && (
                <div className="sel-noresult">{t("import.select.noCharacter")}</div>
              )}
              <div className="sel-menu__divider" />
              <button
                type="button"
                className="sel-menu__item sel-menu__add"
                onClick={() => {
                  setAdding(picker.index);
                  setPicker(null);
                }}
              >
                <BoardArt name="plus" style={{ width: 16, height: 16 }} />
                <span>{t("import.select.addCharacter")}</span>
              </button>
            </div>
          </>
        )}
      </div>

      {s.noCues && !toastDismissed && (
        <Toast tone="negative" onDismiss={() => setToastDismissed(true)} width={360}>
          {t("import.select.noCues")}
        </Toast>
      )}
      {adding !== null && (
        <AddCharacterModal
          onClose={() => setAdding(null)}
          onCreate={async (form) => {
            const created = await s.addCharacter(form);
            if (adding === "selected") s.assignSelected(created.id);
            else s.assignOne(adding, created.id);
            setAdding(null);
          }}
        />
      )}
    </div>
  );
}

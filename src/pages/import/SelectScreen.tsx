import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";

import { AddCharacterModal } from "../../components/characters/AddCharacterModal";
import { CharacterAvatar } from "../../components/characters/CharacterAvatar";
import { Toast } from "../../components/feedback/Toast";
import { BentoIcon, BoardArt, MaterialIcon } from "../../components/icons/Icon";
import { SearchBar } from "../../components/ui/SearchBar";
import { useRevealScrollbar } from "../../components/ui/useRevealScrollbar";
import { useRowPlayer } from "../../hooks/useRowPlayer";
import { spans } from "../../lib/lineEdits";
import type { Character } from "../../lib/types";
import { useSubtitleImportStore } from "../../stores/subtitleImportStore";
import { ImportButton, Stepper } from "./ImportParts";
import type { CardRect } from "./TrackScreen";

/** 00:01:02.345 */
export function formatClock(ms: number): string {
  const pad = (n: number, w: number) => String(n).padStart(w, "0");
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)}.${pad(ms % 1000, 3)}`;
}

/**
 * A merged row's 間隔秒數 (board SubtitleSelect: under its time, 0–10 s in 0.1 steps). The text
 * typed is kept until it leaves the field, so "0." or an empty field can be typed through.
 * Clicks stay here: the row is a label, and would toggle its checkbox.
 */
function GapInput({ n, gapMs, onChange }: { n: number; gapMs: number; onChange: (ms: number) => void }) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<string | null>(null);
  const keep = (e: MouseEvent) => {
    if (!(e.target instanceof HTMLInputElement)) e.preventDefault();
    e.stopPropagation();
  };
  return (
    <span className="sel-gap" onClick={keep}>
      <span aria-hidden="true">{t("import.select.gap")}</span>
      <input
        type="number"
        className="sel-gap__input"
        min={0}
        max={10}
        step={0.1}
        inputMode="decimal"
        aria-label={t("import.select.gapFor", { n })}
        value={draft ?? String(gapMs / 1000)}
        onChange={(e) => {
          setDraft(e.target.value);
          const seconds = parseFloat(e.target.value);
          if (Number.isFinite(seconds)) onChange(seconds * 1000);
        }}
        onBlur={() => setDraft(null)}
      />
    </span>
  );
}

function matches(c: Character, query: string) {
  const q = query.trim().toLowerCase();
  return !q || c.name.toLowerCase().includes(q) || c.source.toLowerCase().includes(q);
}

/**
 * The select card grows out of the track card it follows (user 2026-10-02; not on the board):
 * it starts at the small card's place and size and eases to its own, its content fading in
 * once it has. Skipped with reduced motion.
 */
function useGrowFrom(card: React.RefObject<HTMLDivElement | null>, from: CardRect | null, done: () => void) {
  useLayoutEffect(() => {
    const el = card.current;
    if (!el || !from) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      done();
      return;
    }
    const to = el.getBoundingClientRect();
    if (to.width === 0 || to.height === 0) {
      done();
      return;
    }
    el.classList.add("is-growing");
    const anim = el.animate?.(
      [
        {
          transformOrigin: "top left",
          transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`,
        },
        { transformOrigin: "top left", transform: "none" },
      ],
      { duration: 520, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
    const finish = () => {
      el.classList.remove("is-growing");
      done();
    };
    if (anim) anim.onfinish = finish;
    else finish();
    return () => anim?.cancel();
  }, [card, from, done]);
}

// Board: SubtitleSelect.dc.html (Step 2, or Step 3 after 選擇字幕軌 as SubtitleSelectEmbedded)
// and SubtitleSelectEmpty.dc.html (its toast). Checked rows are assigned in bulk (D13-REV) and
// are what 拆分／合併 act on; 調換 swaps the whole subtitle. Only assigned lines are imported.
export function SelectScreen({
  onBack,
  growFrom = null,
  onGrown = () => {},
}: {
  onBack: () => void;
  growFrom?: CardRect | null;
  onGrown?: () => void;
}) {
  const { t } = useTranslation();
  const s = useSubtitleImportStore();
  const card = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  useRevealScrollbar(list);
  useGrowFrom(card, growFrom, onGrown);
  const player = useRowPlayer(s.audioPath);
  const embedded = s.flow === "embedded";

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
  const assignedCount = s.rows.filter((r) => s.assigned[r.index] !== undefined).length;
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
        <h1 className="imp-title pg-anim-title">{t("import.select.title", { n: embedded ? 3 : 2 })}</h1>
        <Stepper embedded={embedded} current={embedded ? 3 : 2} />
      </header>

      <div className="sel-card" ref={card}>
        <div className="sel-toolbar">
          <button type="button" className="sel-btn sel-btn--outline" onClick={s.selectAll}>
            {t("import.select.selectAll")}
          </button>
          <button type="button" className="sel-btn sel-btn--neutral" onClick={s.clearAll}>
            {t("import.select.clearAll")}
          </button>
          <span className="sel-toolbar__sep" role="separator" aria-orientation="vertical" />
          <button
            type="button"
            className="sel-btn sel-btn--neutral sel-tool"
            disabled={!s.canSplit()}
            title={t("import.select.splitTip")}
            onClick={() => {
              player.stop();
              s.split();
            }}
          >
            <MaterialIcon name="call_split" size={20} />
            {t("import.select.split")}
          </button>
          <button
            type="button"
            className="sel-btn sel-btn--neutral sel-tool"
            disabled={!s.canMerge()}
            title={t("import.select.mergeTip")}
            onClick={() => {
              player.stop();
              s.merge();
            }}
          >
            <MaterialIcon name="call_merge" size={20} />
            {t("import.select.merge")}
          </button>
          <button
            type="button"
            className="sel-btn sel-btn--neutral sel-tool"
            disabled={!s.bilingual}
            title={t("import.select.swapTip")}
            onClick={s.swap}
          >
            <MaterialIcon name="swap_vert" size={20} />
            {t("import.select.swap")}
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
            {s.rows.map((cue, position) => {
              const isSelected = s.selected.has(cue.index);
              const character = byId.get(s.assigned[cue.index]);
              const n = position + 1;
              const isCurrent = player.current?.index === cue.index;
              const isPlaying = isCurrent && !player.current?.paused;
              return (
                <label
                  key={cue.index}
                  className={`sel-row${isSelected ? " is-selected" : ""}${isCurrent ? " is-playing" : ""}`}
                >
                  <span className="sel-check">
                    <input
                      type="checkbox"
                      className="sel-input"
                      aria-label={t("import.select.selectLine", { n })}
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
                      aria-label={t("import.select.pickFor", { n })}
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
                    <span>
                      {formatClock(cue.startMs)} ~ {formatClock(cue.endMs)}
                    </span>
                    {cue.segments && (
                      <GapInput n={n} gapMs={cue.gapMs ?? 0} onChange={(ms) => s.setGap(cue.index, ms)} />
                    )}
                  </span>
                  <span className="sel-text">
                    {s.audioPath && (
                      <button
                        type="button"
                        className="sel-play"
                        aria-label={t(isPlaying ? "import.select.pause" : "import.select.play", { n })}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          player.toggle(cue.index, spans(cue), cue.gapMs ?? 0);
                        }}
                      >
                        <MaterialIcon name={isPlaying ? "pause:fill1" : "play_arrow:fill1"} size={20} />
                      </button>
                    )}
                    <span className="sel-text__line">{cue.text}</span>
                    {cue.translation && <span className="sel-text__translation">{cue.translation}</span>}
                  </span>
                </label>
              );
            })}
            {s.rows.length === 0 && (
              <div className="sel-empty">
                <MaterialIcon name="subtitles_off" size={40} />
                {t("import.select.empty")}
              </div>
            )}
          </div>
        </div>

        <div className="sel-footer">
          <span className="sel-counts">
            {t("import.select.total")} <b>{s.rows.length}</b> {t("import.select.lines")}
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
              icon={<MaterialIcon name="download" />}
              disabled={assignedCount === 0}
              onClick={() => {
                player.stop();
                void s.startImport();
              }}
            >
              {t("import.select.start")}
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
                    className={`sel-pick${s.assigned[picker.index] === undefined ? " is-current" : ""}`}
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

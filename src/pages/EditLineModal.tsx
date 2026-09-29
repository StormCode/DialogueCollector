import { convertFileSrc } from "@tauri-apps/api/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { AddCharacterModal } from "../components/characters/AddCharacterModal";
import { CharacterAvatar } from "../components/characters/CharacterAvatar";
import { BentoIcon, BoardArt, MaterialIcon } from "../components/icons/Icon";
import { Field } from "../components/ui/Field";
import { Modal } from "../components/ui/Modal";
import { SearchBar } from "../components/ui/SearchBar";
import { useRevealScrollbar } from "../components/ui/useRevealScrollbar";
import { errorKind, inTauri, ipc } from "../lib/ipc";
import type { Character, Line } from "../lib/types";
import { formatDuration } from "./LinesPage";
import "./editline.css";

// Board: EditLine.dc.html, shown as a modal over the 台詞 page (user 2026-09-29: the board draws
// it full-size, but it floats). 儲存 keeps it open and says 已儲存變更 until the next edit; closing
// tells the page whether anything was saved. Moving a line to another character is a change of
// 角色 here.
export function EditLineModal({ line: initial, onClose }: { line: Line; onClose: (saved: boolean) => void }) {
  const { t } = useTranslation();
  const [line, setLine] = useState<Line>(initial);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [text, setText] = useState(initial.text);
  const [translation, setTranslation] = useState(initial.translation ?? "");
  const [owner, setOwner] = useState<number | null>(initial.characterId);
  const [attempted, setAttempted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [charQuery, setCharQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const everSaved = useRef(false);
  const body = useRef<HTMLDivElement>(null);
  useRevealScrollbar(body);

  useEffect(() => {
    ipc.listCharacters().then(setCharacters, () => setCharacters([]));
  }, []);
  const close = () => onClose(everSaved.current);

  const edited = (fn: () => void) => {
    fn();
    setSaved(false);
  };

  const shownCharacters = useMemo(() => {
    const q = charQuery.trim().toLowerCase();
    return characters.filter((c) => !q || c.name.toLowerCase().includes(q) || c.source.toLowerCase().includes(q));
  }, [characters, charQuery]);
  const selected = characters.find((c) => c.id === owner) ?? null;

  // 原文 and 譯文 are each optional, but one of them must be filled in.
  const blank = !text.trim() && !translation.trim();
  const textError = attempted && blank ? t("editLine.textRequired") : undefined;
  const charError = attempted && owner === null ? t("editLine.characterRequired") : undefined;

  const save = async () => {
    setAttempted(true);
    setSaveError(null);
    if (blank || owner === null) return;
    try {
      const updated = await ipc.updateLine(line.id, {
        text,
        translation: translation.trim() || null,
        characterId: owner,
      });
      setLine(updated);
      setSaved(true);
      everSaved.current = true;
    } catch (e) {
      setSaveError(
        t(`editLine.errors.${errorKind(e)}`, {
          defaultValue: t("editLine.errors.generic"),
        }),
      );
    }
  };

  const pick = (id: number) =>
    edited(() => {
      setOwner(id);
      setMenuOpen(false);
      setCharQuery("");
    });

  const ringClass = charError ? " is-invalid" : menuOpen ? " is-open" : "";

  return (
    <Modal title={t("editLine.title")} size="large" onClose={close} className="el-modal">
      <div ref={body} className="el-card st-scroll">
        <p className="el-subtitle">{t("editLine.subtitle")}</p>
        <div className="el-group">
          <span className="el-label">{t("editLine.preview")}</span>
          <Preview line={line} />
        </div>
        <Field
          label={t("editLine.text")}
          placeholder={t("editLine.textPlaceholder")}
          rows={7}
          value={text}
          onChange={(v) => edited(() => setText(v))}
          error={textError}
        />
        <Field
          label={t("editLine.translation")}
          placeholder={t("editLine.translationPlaceholder")}
          rows={7}
          value={translation}
          onChange={(v) => edited(() => setTranslation(v))}
          invalid={!!textError}
        />
        <div className="el-group el-character">
          <span className="el-label" id="el-character-label">
            {t("editLine.character")}
          </span>
          <button
            type="button"
            className={`el-select${ringClass}`}
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
            aria-labelledby="el-character-label"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className={`el-select__value${selected ? "" : " is-placeholder"}`}>
              {selected?.name ?? t("editLine.characterRequired")}
            </span>
            <BentoIcon name={menuOpen ? "ChevronUp" : "ChevronDown"} size={24} />
          </button>
          {menuOpen && (
            <>
              <div className="el-dismiss" aria-hidden="true" onClick={() => setMenuOpen(false)} />
              <div
                className="el-menu"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.stopPropagation();
                    setMenuOpen(false);
                  }
                }}
              >
                <div className="el-menu__search">
                  <SearchBar
                    value={charQuery}
                    onChange={setCharQuery}
                    placeholder={t("editLine.characterSearch")}
                    autoFocus
                  />
                </div>
                <div role="listbox" aria-labelledby="el-character-label" className="el-menu__list st-scroll">
                  {shownCharacters.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      role="option"
                      aria-selected={c.id === owner}
                      className={`el-option${c.id === owner ? " is-selected" : ""}`}
                      onClick={() => pick(c.id)}
                    >
                      <span className="el-option__who">
                        <CharacterAvatar id={c.id} name={c.name} portraitPath={c.portraitPath} size={28} />
                        <span className="el-option__name">{c.name}</span>
                      </span>
                      <span className="el-option__source">{c.source}</span>
                    </button>
                  ))}
                  {shownCharacters.length === 0 && charQuery.trim() !== "" && (
                    <div className="el-menu__none">{t("editLine.noCharacter")}</div>
                  )}
                </div>
                <div className="el-menu__sep" />
                <button
                  type="button"
                  className="el-menu__add"
                  onClick={() => {
                    setMenuOpen(false);
                    setAdding(true);
                  }}
                >
                  <BoardArt name="plus" style={{ width: 16, height: 16 }} />
                  <span>{t("editLine.addCharacter")}</span>
                </button>
              </div>
            </>
          )}
          {charError && <span className="el-error">{charError}</span>}
        </div>
        <div className="el-footer">
          <button type="button" className="el-cancel" onClick={close}>
            <MaterialIcon name="close" />
            {t("editLine.cancel")}
          </button>
          <div className="el-footer__end">
            {saved && (
              <span className="el-saved" role="status">
                <BentoIcon name="PositiveCircle" size={18} />
                {t("editLine.saved")}
              </span>
            )}
            {saveError && (
              <span className="el-error" role="alert">
                {saveError}
              </span>
            )}
            <button type="button" className="el-save" onClick={() => void save()}>
              <MaterialIcon name="save" />
              {t("editLine.save")}
            </button>
          </div>
        </div>
      </div>
      {adding && (
        <AddCharacterModal
          onClose={() => setAdding(false)}
          onCreate={async (form) => {
            const created = await ipc.createCharacter(form);
            setCharacters(await ipc.listCharacters());
            setAdding(false);
            pick(created.id);
          }}
        />
      )}
    </Modal>
  );
}

/** 播放預覽: the clip itself, with its own play button and progress. */
function Preview({ line }: { line: Line }) {
  const { t } = useTranslation();
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const duration = line.durationMs / 1000;

  useEffect(() => {
    const el = new Audio(inTauri() ? convertFileSrc(line.audioPath) : line.audioPath);
    el.ontimeupdate = () => setTime(el.currentTime);
    el.onended = () => setPlaying(false);
    el.onpause = () => setPlaying(false);
    el.onplay = () => setPlaying(true);
    audio.current = el;
    return () => {
      el.pause();
      audio.current = null;
    };
  }, [line.audioPath]);

  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (playing) el.pause();
    else {
      if (el.ended) el.currentTime = 0;
      void el.play().catch(() => setPlaying(false));
    }
  };

  const pct = duration > 0 ? Math.max(0, Math.min(100, (time / duration) * 100)) : 0;
  return (
    <div className="el-preview">
      <button
        type="button"
        className="el-preview__play"
        aria-label={t(playing ? "lines.pause" : "lines.play")}
        onClick={toggle}
      >
        <BoardArt name={playing ? "previewPause" : "previewPlay"} style={{ width: 18, height: 18 }} />
      </button>
      <div
        className="el-preview__track"
        role="progressbar"
        aria-valuenow={Math.round(time)}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
      >
        <div style={{ width: `${pct}%` }} />
      </div>
      <span className="el-preview__time">
        {formatDuration(time * 1000)} / {formatDuration(line.durationMs)}
      </span>
    </div>
  );
}

import { convertFileSrc } from "@tauri-apps/api/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { inTauri } from "../../lib/ipc";
import type { Character } from "../../lib/types";
import { formatDuration } from "../../pages/LinesPage";
import { CharacterAvatar } from "../characters/CharacterAvatar";
import { BentoIcon, BoardArt, MaterialIcon } from "../icons/Icon";
import { SearchBar } from "../ui/SearchBar";
import "./lineform.css";

// The parts EditLine and InputLine share: 播放預覽 and the 角色 dropdown.

/** 未指派: offered by InputLine, never importable (user 2026-09-29). */
export const UNASSIGNED = "none" as const;
export type Owner = number | typeof UNASSIGNED | null;

/**
 * 播放預覽. `resolve` returns what to play; it runs on the first press (InputLine may need to
 * encode a preview first) and its result is kept.
 */
export function AudioPreview({ resolve, durationMs }: { resolve: () => Promise<string>; durationMs: number }) {
  const { t } = useTranslation();
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(0);
  const duration = durationMs / 1000;

  // A new source (another InputLine card) starts over.
  useEffect(() => {
    setTime(0);
    setPlaying(false);
    return () => {
      audio.current?.pause();
      audio.current = null;
    };
  }, [resolve]);

  const toggle = async () => {
    if (playing) {
      audio.current?.pause();
      return;
    }
    let el = audio.current;
    if (!el) {
      setLoading(true);
      try {
        const path = await resolve();
        el = new Audio(inTauri() ? convertFileSrc(path) : path);
      } catch {
        setLoading(false);
        return;
      }
      setLoading(false);
      el.ontimeupdate = () => setTime(el!.currentTime);
      el.onended = () => setPlaying(false);
      el.onpause = () => setPlaying(false);
      el.onplay = () => setPlaying(true);
      audio.current = el;
    }
    if (el.ended) el.currentTime = 0;
    void el.play().catch(() => setPlaying(false));
  };

  const pct = duration > 0 ? Math.max(0, Math.min(100, (time / duration) * 100)) : 0;
  return (
    <div className="el-preview">
      <button
        type="button"
        className="el-preview__play"
        aria-label={t(playing ? "lines.pause" : "lines.play")}
        aria-busy={loading || undefined}
        disabled={loading}
        onClick={() => void toggle()}
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
        {formatDuration(time * 1000)} / {formatDuration(durationMs)}
      </span>
    </div>
  );
}

/** The 角色 field: a button that opens a searchable list, 新增角色 at its foot. */
export function CharacterPicker({
  characters,
  value,
  onChange,
  onAddCharacter,
  error,
  allowUnassigned = false,
}: {
  characters: Character[];
  value: Owner;
  onChange: (owner: Owner) => void;
  onAddCharacter: () => void;
  error?: string;
  allowUnassigned?: boolean;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return characters.filter((c) => !q || c.name.toLowerCase().includes(q) || c.source.toLowerCase().includes(q));
  }, [characters, query]);
  const selected = typeof value === "number" ? (characters.find((c) => c.id === value) ?? null) : null;
  const label = selected?.name ?? (value === UNASSIGNED ? t("editLine.unassigned") : t("editLine.characterRequired"));

  const pick = (owner: Owner) => {
    onChange(owner);
    setOpen(false);
    setQuery("");
  };
  const ringClass = error ? " is-invalid" : open ? " is-open" : "";

  return (
    <div className="el-group el-character">
      <span className="el-label" id="el-character-label">
        {t("editLine.character")}
      </span>
      <button
        type="button"
        className={`el-select${ringClass}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="el-character-label"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={`el-select__value${selected ? "" : " is-placeholder"}`}>{label}</span>
        <BentoIcon name={open ? "ChevronUp" : "ChevronDown"} size={24} />
      </button>
      {open && (
        <>
          <div className="el-dismiss" aria-hidden="true" onClick={() => setOpen(false)} />
          <div
            className="el-menu"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.stopPropagation();
                setOpen(false);
              }
            }}
          >
            <div className="el-menu__search">
              <SearchBar value={query} onChange={setQuery} placeholder={t("editLine.characterSearch")} autoFocus />
            </div>
            <div role="listbox" aria-labelledby="el-character-label" className="el-menu__list st-scroll">
              {allowUnassigned && !query.trim() && (
                <button
                  type="button"
                  role="option"
                  aria-selected={value === UNASSIGNED}
                  className={`el-option el-option--unassigned${value === UNASSIGNED ? " is-selected" : ""}`}
                  onClick={() => pick(UNASSIGNED)}
                >
                  <span className="el-option__who">
                    <span className="el-option__none" aria-hidden="true">
                      <MaterialIcon name="person" size={18} />
                    </span>
                    <span className="el-option__name">{t("editLine.unassigned")}</span>
                  </span>
                </button>
              )}
              {shown.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="option"
                  aria-selected={c.id === value}
                  className={`el-option${c.id === value ? " is-selected" : ""}`}
                  onClick={() => pick(c.id)}
                >
                  <span className="el-option__who">
                    <CharacterAvatar id={c.id} name={c.name} portraitPath={c.portraitPath} size={28} />
                    <span className="el-option__name">{c.name}</span>
                  </span>
                  <span className="el-option__source">{c.source}</span>
                </button>
              ))}
              {shown.length === 0 && query.trim() !== "" && <div className="el-menu__none">{t("editLine.noCharacter")}</div>}
            </div>
            <div className="el-menu__sep" />
            <button
              type="button"
              className="el-menu__add"
              onClick={() => {
                setOpen(false);
                onAddCharacter();
              }}
            >
              <BoardArt name="plus" style={{ width: 16, height: 16 }} />
              <span>{t("editLine.addCharacter")}</span>
            </button>
          </div>
        </>
      )}
      {error && <span className="el-error">{error}</span>}
    </div>
  );
}

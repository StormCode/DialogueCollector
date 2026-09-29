import { convertFileSrc } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";

import emptyArt from "../assets/illustrations/empty.png";
import { Toast } from "../components/feedback/Toast";
import { BentoIcon, MaterialIcon } from "../components/icons/Icon";
import { Checkbox } from "../components/ui/Checkbox";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Pagination } from "../components/ui/Pagination";
import { SearchBar } from "../components/ui/SearchBar";
import { Switch } from "../components/ui/Switch";
import { useRevealScrollbar } from "../components/ui/useRevealScrollbar";
import { usePlayer, type PlayMode } from "../hooks/usePlayer";
import { errorKind, inTauri, ipc } from "../lib/ipc";
import type { Line, LinesPageData } from "../lib/types";
import { useSettingsStore } from "../stores/settingsStore";
import "./lines.css";

type SortKey = "created" | "duration";
type SortDir = "asc" | "desc";
type View = "compact" | "detail";

const POSTER_EXTENSIONS = ["jpg", "jpeg", "png", "gif"];

/** The card's line of text: the 原文, or the 譯文 when a line has only that. */
export function lineTitle(line: Pick<Line, "text" | "translation">) {
  return line.text.trim() || line.translation?.trim() || "";
}

/** The gray subtitle under it (簡短 and 詳細): the 譯文, when the 原文 is already the title. */
export function lineSubtitle(line: Pick<Line, "text" | "translation">) {
  return line.text.trim() ? line.translation?.trim() || null : null;
}

export function formatDuration(ms: number) {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function formatCreated(ms: number) {
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

// Board: Lines.dc.html (+ LinesPoster, LinesEmpty, LinesNoResult, LinesMissing). Pinned lines sit
// in their own block above the list and are left out of paging; 全部播放 plays them first, then
// the rest; 依序播放 plays the checked ones in the same order. `?missing=<lineId>` comes from
// 設定 → 遺失的檔案 → 查看: the page opens where that line is and marks its card.
export function LinesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { characterId } = useParams();
  const [params] = useSearchParams();
  const missingId = Number(params.get("missing")) || null;
  const pageSize = useSettingsStore((s) => s.settings.linesPerPage);
  const gapMs = useSettingsStore((s) => s.settings.playAllGapSeconds) * 1000;

  const [data, setData] = useState<LinesPageData | null>(null);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [sortOpen, setSortOpen] = useState(false);
  const [view, setView] = useState<View>("compact");
  const [editMode, setEditMode] = useState(false);
  const [pinCollapsed, setPinCollapsed] = useState(false);
  const [checked, setChecked] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<Line | null>(null);
  const [deletingPoster, setDeletingPoster] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  useRevealScrollbar(scroller);

  const id = Number(characterId);
  const load = useCallback(async () => {
    try {
      setData(await ipc.openLines(id));
    } catch {
      navigate("/characters", { replace: true });
    }
  }, [id, navigate]);
  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = (data?.lines ?? []).filter(
      (l) => !q || l.text.toLowerCase().includes(q) || (l.translation ?? "").toLowerCase().includes(q),
    );
    const dir = sortDir === "asc" ? 1 : -1;
    const key = (l: Line) => (sortKey === "duration" ? l.durationMs : l.createdAt);
    return list.sort((a, b) => (key(a) - key(b)) * dir || (a.id - b.id) * dir);
  }, [data, query, sortKey, sortDir]);
  const pinned = filtered.filter((l) => l.pinnedAt !== null);
  const unpinned = filtered.filter((l) => l.pinnedAt === null);
  const ordered = useMemo(() => [...pinned, ...unpinned], [pinned, unpinned]);

  const total = Math.max(1, Math.ceil(unpinned.length / pageSize));
  const current = Math.min(page, total);
  const shown = unpinned.slice((current - 1) * pageSize, current * pageSize);

  // The player follows the line it moves on to: onto its page, and the pinned block open.
  const follow = useCallback(
    (lineId: number) => {
      const idx = unpinned.findIndex((l) => l.id === lineId);
      if (idx >= 0) setPage(Math.floor(idx / pageSize) + 1);
      else setPinCollapsed(false);
    },
    [unpinned, pageSize],
  );
  const player = usePlayer(gapMs, follow);
  const playing = player.currentId !== null;

  // 查看 from 遺失的檔案: open on the page holding the line and bring it into view, once.
  const revealed = useRef<number | null>(null);
  useEffect(() => {
    if (!data || !missingId || revealed.current === missingId) return;
    revealed.current = missingId;
    follow(missingId);
  }, [data, missingId, follow]);
  useEffect(() => {
    if (!data || !missingId) return;
    const card = scroller.current?.querySelector(`[data-line-id="${missingId}"]`);
    card?.scrollIntoView?.({ block: "center" });
  }, [data, missingId, current, pinCollapsed]);

  const narrow = (fn: () => void) => {
    fn();
    setPage(1);
  };
  const toggleCheck = (lineId: number) =>
    setChecked((c) => (c.includes(lineId) ? c.filter((x) => x !== lineId) : [...c, lineId]));

  const playQueue = (lines: Line[], mode: PlayMode) =>
    player.start(lines.map((l) => ({ id: l.id, audioPath: l.audioPath })), mode);
  const toggleAll = () => (playing ? player.stop() : playQueue(ordered, "all"));
  const seqPlaying = player.mode === "seq";
  const toggleSeq = () =>
    seqPlaying ? player.stop() : playQueue(ordered.filter((l) => checked.includes(l.id)), "seq");

  const switchEditMode = (on: boolean) => {
    if (on) player.stop();
    setEditMode(on);
  };

  const togglePin = async (line: Line) => {
    try {
      await ipc.setLinePinned(line.id, line.pinnedAt === null);
    } catch {
      setToast(t("lines.saveFailed"));
    }
    await load();
  };

  const pickPoster = async () => {
    const picked = await open({
      multiple: false,
      filters: [{ name: t("characters.add.imageFilter"), extensions: POSTER_EXTENSIONS }],
    });
    if (typeof picked !== "string") return;
    try {
      await ipc.setPoster(id, picked);
    } catch (e) {
      setToast(t(`characters.add.errors.${errorKind(e)}`, { defaultValue: t("characters.add.errors.generic") }));
    }
    await load();
  };

  if (!data) return <section className="ln-page" />;

  const noLines = data.lines.length === 0;
  const noResult = !noLines && filtered.length === 0;
  const seqDisabled = !seqPlaying && checked.length === 0;
  const sortSummary = `${t(sortKey === "duration" ? "lines.sort.durationShort" : "lines.sort.createdShort")} ${t(
    sortDir === "asc" ? "lines.sort.asc" : "lines.sort.desc",
  )}`;

  const playButtons = (
    <>
      <button type="button" className={`ln-btn ln-btn-primary${playing ? " is-stop" : ""}`} onClick={toggleAll}>
        <MaterialIcon name={playing ? "stop:fill1" : "play_arrow:fill1"} />
        {t(playing ? "lines.stopAll" : "lines.playAll")}
      </button>
      <button type="button" className="ln-btn ln-btn-outline" disabled={seqDisabled} onClick={toggleSeq}>
        <MaterialIcon name={seqPlaying ? "stop_circle" : "playlist_play"} />
        {t(seqPlaying ? "lines.stopSeq" : "lines.playSeq")}
        <span className="ln-count">{checked.length}</span>
      </button>
      <div className="ln-grow" aria-hidden="true" />
    </>
  );

  const card = (line: Line, idx: number) => {
    const isCurrent = player.currentId === line.id;
    const isPlaying = isCurrent && !player.paused;
    const isPinned = line.pinnedAt !== null;
    return (
      <div
        key={line.id}
        data-line-id={line.id}
        className={`ln-card${isCurrent ? " is-active" : ""}${line.id === missingId ? " is-missing" : ""}`}
        style={{ animationDelay: `${idx * 100}ms` }}
      >
        <span className="ln-check">
          <Checkbox checked={checked.includes(line.id)} onChange={() => toggleCheck(line.id)} label={t("lines.check")} hideLabel />
        </span>
        {editMode ? (
          <div className="ln-actions">
            <button
              type="button"
              className={`ln-act ln-act-pin${isPinned ? " is-pinned" : ""}`}
              aria-label={t(isPinned ? "lines.unpin" : "lines.pin")}
              title={t(isPinned ? "lines.unpin" : "lines.pin")}
              aria-pressed={isPinned}
              onClick={() => void togglePin(line)}
            >
              <MaterialIcon name={isPinned ? "keep:wght300fill1" : "keep:wght300"} />
            </button>
            <Link
              className="ln-act ln-act-edit"
              to={`/characters/${id}/lines/${line.id}/edit`}
              aria-label={t("lines.edit")}
              title={t("lines.edit")}
            >
              <BentoIcon name="PencilWeightRegular" size={22} />
            </Link>
            <button
              type="button"
              className="ln-act ln-act-del"
              aria-label={t("lines.delete")}
              title={t("lines.delete")}
              onClick={() => setDeleting(line)}
            >
              <BentoIcon name="Bin" size={24} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="ln-play"
            aria-label={t(isPlaying ? "lines.pause" : "lines.play")}
            onClick={() => player.toggle({ id: line.id, audioPath: line.audioPath })}
          >
            <MaterialIcon name={isPlaying ? "pause:fill1" : "play_arrow:fill1"} size={26} />
          </button>
        )}
        <div className="ln-card-body">
          <div className="ln-card-text" title={lineTitle(line)}>
            {lineTitle(line)}
          </div>
          {lineSubtitle(line) && (
            <div className="ln-card-trans" title={lineSubtitle(line) ?? undefined}>
              {lineSubtitle(line)}
            </div>
          )}
          <div className="ln-card-meta">
            <span className="ln-meta-item">
              <MaterialIcon name="schedule" size={16} />
              {formatDuration(line.durationMs)}
            </span>
            <span className="ln-meta-item">
              <MaterialIcon name="calendar_today" size={16} />
              {formatCreated(line.createdAt)}
            </span>
          </div>
        </div>
        {isCurrent && (
          <span className="ln-progress" aria-hidden="true" style={{ width: `${Math.round(player.progress * 1000) / 10}%` }} />
        )}
      </div>
    );
  };

  const listClass = `ln-list${checked.length ? " has-checked" : ""}${view === "compact" ? " is-compact" : ""}`;

  return (
    <section ref={scroller} className="ln-page st-scroll">
      <div className="ln-head">
        <Link className="ln-back" to="/characters">
          <MaterialIcon name="chevron_left" size={20} />
          {t("nav.scriptBook")}
        </Link>
        <h1 className="ln-title">{t("lines.title", { name: data.character.name })}</h1>
      </div>

      {data.posterPath ? (
        <div className="ln-poster">
          {inTauri() && <img src={convertFileSrc(data.posterPath)} alt={t("lines.poster")} />}
          <div className="ln-poster-bar ln-on-dark">
            {playButtons}
            <button type="button" className="ln-btn ln-btn-outline" onClick={() => void pickPoster()}>
              <MaterialIcon name="upload" />
              {t("lines.updatePoster")}
            </button>
            <button
              type="button"
              className="ln-icon-btn"
              aria-label={t("lines.deletePoster")}
              title={t("lines.deletePoster")}
              onClick={() => setDeletingPoster(true)}
            >
              <BentoIcon name="Bin" size={24} />
            </button>
          </div>
        </div>
      ) : (
        <div className="ln-bar">
          {playButtons}
          <button type="button" className="ln-btn ln-btn-outline" onClick={() => void pickPoster()}>
            <MaterialIcon name="upload" />
            {t("lines.uploadPoster")}
          </button>
        </div>
      )}

      <div className="ln-divider" aria-hidden="true" />

      <div className="ln-toolbar">
        <div className="ln-search">
          <SearchBar value={query} onChange={(v) => narrow(() => setQuery(v))} placeholder={t("lines.search")} />
        </div>
        <div className="ln-sort">
          <button
            type="button"
            className={`ln-sort-btn${sortOpen ? " is-active" : ""}`}
            aria-label={t("lines.sort.label")}
            aria-expanded={sortOpen}
            onClick={() => setSortOpen((o) => !o)}
          >
            <MaterialIcon name="filter_list" />
          </button>
          {sortOpen && (
            <>
              <div className="ln-dismiss" aria-hidden="true" onClick={() => setSortOpen(false)} />
              <div className="ln-menu">
                {(["created", "duration"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    className={`ln-menu-item${sortKey === k ? " is-selected" : ""}`}
                    onClick={() => {
                      narrow(() => setSortKey(k));
                      setSortOpen(false);
                    }}
                  >
                    <MaterialIcon name={sortKey === k ? "check" : k === "duration" ? "timer" : "calendar_today"} size={20} />
                    {t(`lines.sort.${k}`)}
                  </button>
                ))}
                <div className="ln-menu-sep" role="separator" />
                {(["asc", "desc"] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`ln-menu-item${sortDir === d ? " is-selected" : ""}`}
                    onClick={() => {
                      narrow(() => setSortDir(d));
                      setSortOpen(false);
                    }}
                  >
                    <MaterialIcon name={sortDir === d ? "check" : d === "asc" ? "arrow_upward" : "arrow_downward"} size={20} />
                    {t(`lines.sort.${d}`)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="ln-grow" aria-hidden="true" />
        <div className="ln-edit-toggle">
          <Switch checked={editMode} onChange={switchEditMode} label={t("lines.editMode")} />
        </div>
        <div className="ln-view-group" role="group" aria-label={t("lines.view.label")}>
          {(["compact", "detail"] as const).map((v) => (
            <button
              key={v}
              type="button"
              className={`ln-view-btn${view === v ? " is-selected" : ""}`}
              aria-label={t(`lines.view.${v}`)}
              title={t(`lines.view.${v}`)}
              aria-pressed={view === v}
              onClick={() => setView(v)}
            >
              <MaterialIcon name={v === "compact" ? "short_text" : "notes"} />
            </button>
          ))}
        </div>
        <span className="ln-summary">{t("lines.summary", { count: filtered.length, sort: sortSummary })}</span>
      </div>

      {noLines ? (
        <div className="ln-nothing">
          <img src={emptyArt} alt="" aria-hidden="true" />
          <p>{t("lines.empty")}</p>
          <button type="button" className="ln-btn ln-btn-primary" onClick={() => navigate("/")}>
            <MaterialIcon name="add" />
            {t("lines.import")}
          </button>
        </div>
      ) : (
        <>
          {pinned.length > 0 && (
            <section className="ln-pin-block" aria-label={t("lines.pinnedLabel")}>
              <button
                type="button"
                className={`ln-pin-head${pinCollapsed ? " is-collapsed" : ""}`}
                aria-expanded={!pinCollapsed}
                onClick={() => setPinCollapsed((c) => !c)}
              >
                <MaterialIcon name="keep:wght300fill1" size={20} className="ln-pin-glyph" />
                {t("lines.pinned")}
                <span className="ln-pin-count">{pinned.length}</span>
                <MaterialIcon name="expand_more:wght300" size={20} className="ln-pin-chevron" />
              </button>
              {!pinCollapsed && <div className={listClass}>{pinned.map(card)}</div>}
              <div className="ln-pin-sep" aria-hidden="true" />
            </section>
          )}
          {/* Keyed by page and query so each page's cards rise in again. */}
          <div className={listClass} key={`${current}-${query}-${sortKey}-${sortDir}`}>
            {shown.map(card)}
            {noResult && (
              <div className="ln-empty" role="status">
                <img src={emptyArt} alt="" aria-hidden="true" />
                <p>{t("lines.noResult")}</p>
              </div>
            )}
          </div>
          {!noResult && <Pagination page={current} total={total} onChange={setPage} />}
        </>
      )}

      {deleting && (
        // DeleteLine.dc.html
        <ConfirmDialog
          title={t("lines.deleteTitle")}
          body={t("lines.deleteBody")}
          confirmLabel={t("lines.deleteConfirm")}
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            if (player.currentId === deleting.id) player.stop();
            try {
              await ipc.deleteLine(deleting.id);
            } catch (e) {
              setToast(t(errorKind(e) === "Library.FileRemovalFailed" ? "lines.fileRemovalFailed" : "lines.deleteFailed"));
            }
            setChecked((c) => c.filter((x) => x !== deleting.id));
            setDeleting(null);
            await load();
          }}
        />
      )}
      {deletingPoster && (
        // DeletePoster.dc.html
        <ConfirmDialog
          title={t("lines.deletePosterTitle")}
          body={t("lines.deletePosterBody")}
          confirmLabel={t("lines.deleteConfirm")}
          onCancel={() => setDeletingPoster(false)}
          onConfirm={async () => {
            try {
              await ipc.setPoster(id, null);
            } catch {
              setToast(t("lines.saveFailed"));
            }
            setDeletingPoster(false);
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

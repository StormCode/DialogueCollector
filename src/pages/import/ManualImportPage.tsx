import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { AddCharacterModal } from "../../components/characters/AddCharacterModal";
import { BentoIcon, MaterialIcon } from "../../components/icons/Icon";
import { AudioPreview, CharacterPicker, UNASSIGNED, type Owner } from "../../components/lines/LineFormParts";
import { Field } from "../../components/ui/Field";
import { useRevealScrollbar } from "../../components/ui/useRevealScrollbar";
import { ipc } from "../../lib/ipc";
import type { Character, ManualOutcome, MediaInfo } from "../../lib/types";
import { useUiStore } from "../../stores/uiStore";
import { DoneMedallion, ImportButton, Medallion, OopsMedallion, StatusCard } from "./ImportParts";
import "./import.css";
import "./manual.css";

/** `navigate("/import/manual", { state })` from the main page's drop zone. */
export interface ManualImportState {
  files: string[];
}

interface Card {
  media: MediaInfo;
  text: string;
  translation: string;
  owner: Owner;
}

type Screen = "loading" | "input" | "importing" | "complete" | "failed";

/** A card is ready when it has 原文 or 譯文 and a real character (未指派 blocks, user 2026-09-29). */
export function cardReady(card: Pick<Card, "text" | "translation" | "owner">) {
  return (card.text.trim() !== "" || card.translation.trim() !== "") && typeof card.owner === "number";
}

// 直接匯入現有影音 (canvas page 2): InputLine → ImportingIndex → Complete | Failed. Every card
// must be ready before 匯入, which imports them all at once; several files add the 1/N pager.
export function ManualImportPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const showNotice = useUiStore((s) => s.showNotice);
  const files = (location.state as ManualImportState | null)?.files;

  const [screen, setScreen] = useState<Screen>("loading");
  const [cards, setCards] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [adding, setAdding] = useState(false);
  const [outcome, setOutcome] = useState<ManualOutcome | null>(null);

  // 播放預覽 of a file the webview may not decode needs an m4a made first. They are made in the
  // background, one at a time in card order, as soon as the form opens (user 2026-09-29), so
  // one is usually ready by the time 播放 is pressed; pressing it earlier joins the same work.
  const previews = useRef(new Map<string, Promise<string>>());
  const preview = useCallback((path: string) => {
    let pending = previews.current.get(path);
    if (!pending) {
      pending = ipc.preparePreview(path);
      previews.current.set(path, pending);
      // A failure is not cached: 播放 may try again.
      pending.catch(() => previews.current.delete(path));
    }
    return pending;
  }, []);
  const inputOpen = screen === "input";
  const paths = useMemo(() => cards.map((c) => c.media.path).join("\n"), [cards]);
  useEffect(() => {
    if (!inputOpen || !paths) return;
    let stopped = false;
    void (async () => {
      for (const path of paths.split("\n")) {
        if (stopped) return;
        await preview(path).catch(() => {});
      }
    })();
    return () => {
      stopped = true;
    };
  }, [inputOpen, paths, preview]);

  useEffect(() => {
    if (!files || files.length === 0) {
      navigate("/", { replace: true });
      return;
    }
    void (async () => {
      const [infos, cs] = await Promise.all([ipc.probeMedia(files), ipc.listCharacters().catch(() => [])]);
      setCharacters(cs);
      const usable = infos.filter((m) => m.hasAudio && (m.durationMs ?? 0) > 0);
      const skipped = infos.length - usable.length;
      if (skipped > 0) {
        // InputLineNoAudio / MainNoAudio: a warning, sized to its text.
        showNotice({ tone: "warning", text: t("manual.noAudio", { count: skipped }), minWidth: 360 });
      }
      if (usable.length === 0) {
        navigate("/", { replace: true });
        return;
      }
      setCards(usable.map((media) => ({ media, text: "", translation: "", owner: null })));
      setScreen("input");
    })();
  }, [files, navigate, showNotice, t]);

  const update = (patch: Partial<Card>) =>
    setCards((cs) => cs.map((c, i) => (i === index ? { ...c, ...patch } : c)));

  const startImport = async (only?: number[]) => {
    const picked = only ? cards.filter((_, i) => only.includes(i)) : cards;
    setScreen("importing");
    try {
      const result = await ipc.startManualImport(
        picked.map((c) => ({
          path: c.media.path,
          characterId: c.owner as number,
          text: c.text,
          translation: c.translation.trim() || null,
        })),
      );
      // A retry reports against the cards it was given; map back to the full list.
      const mapped = only
        ? { ...result, failures: result.failures.map((f) => ({ ...f, index: only[f.index] })) }
        : result;
      setOutcome(mapped);
      setScreen(result.status === "cancelled" ? "input" : result.status === "complete" ? "complete" : "failed");
    } catch {
      setOutcome(null);
      setScreen("failed");
    }
  };

  const home = () => navigate("/");

  switch (screen) {
    case "loading":
      return <div className="imp-page" />;
    case "input":
      return (
        <InputScreen
          cards={cards}
          index={index}
          setIndex={setIndex}
          update={update}
          characters={characters}
          preview={preview}
          onAddCharacter={() => setAdding(true)}
          onBack={home}
          onImport={() => void startImport()}
        >
          {adding && (
            <AddCharacterModal
              onClose={() => setAdding(false)}
              onCreate={async (form) => {
                const created = await ipc.createCharacter(form);
                setCharacters(await ipc.listCharacters());
                setAdding(false);
                update({ owner: created.id });
              }}
            />
          )}
        </InputScreen>
      );
    case "importing":
      return (
        <div className="imp-page">
          <StatusCard
            medallion={<Medallion icon="domain_add" motion="streak" />}
            title={t("import.indexing.title")}
            hint={t("import.indexing.hint")}
            actionsNote={t("manual.cancelNote")}
            actions={
              <ImportButton kind="secondary" icon={<MaterialIcon name="close" />} onClick={() => void ipc.cancelImport()}>
                {t("import.cancel")}
              </ImportButton>
            }
          />
        </div>
      );
    case "complete":
      return (
        <div className="imp-page">
          <StatusCard
            medallion={<DoneMedallion />}
            title={t("import.complete.title")}
            entrance="celebrate"
            actions={
              <>
                <ImportButton kind="secondary" icon={<MaterialIcon name="book_2" />} onClick={() => navigate("/characters")}>
                  {t("import.complete.toScriptBook")}
                </ImportButton>
                <ImportButton kind="primary" icon={<MaterialIcon name="forward" />} onClick={home}>
                  {t("manual.importNext")}
                </ImportButton>
              </>
            }
          />
        </div>
      );
    case "failed": {
      const failed = outcome?.failures.map((f) => f.index);
      return (
        <div className="imp-page">
          <StatusCard
            medallion={<OopsMedallion />}
            title={t("import.failed.title")}
            hint={
              outcome && outcome.imported > 0
                ? t("manual.partial", { imported: outcome.imported, failed: outcome.failures.length })
                : t("import.oops")
            }
            entrance="shake"
            footnote={
              outcome && outcome.imported > 0 ? t("manual.retryNote", { count: outcome.failures.length }) : undefined
            }
            actions={
              <>
                <ImportButton kind="neutral" icon={<BentoIcon name="Home" size={24} />} onClick={home}>
                  {t("import.home")}
                </ImportButton>
                <ImportButton
                  kind="primary"
                  icon={<MaterialIcon name="refresh" />}
                  onClick={() => void startImport(failed && failed.length > 0 ? failed : undefined)}
                >
                  {t("import.retry")}
                </ImportButton>
              </>
            }
          />
        </div>
      );
    }
  }
}

// Board: InputLine.dc.html.
function InputScreen({
  cards,
  index,
  setIndex,
  update,
  characters,
  preview,
  onAddCharacter,
  onBack,
  onImport,
  children,
}: {
  cards: Card[];
  index: number;
  setIndex: (i: number) => void;
  update: (patch: Partial<Card>) => void;
  characters: Character[];
  preview: (path: string) => Promise<string>;
  onAddCharacter: () => void;
  onBack: () => void;
  onImport: () => void;
  children?: React.ReactNode;
}) {
  const { t } = useTranslation();
  const scroller = useRef<HTMLDivElement>(null);
  useRevealScrollbar(scroller);
  const card = cards[index];
  const several = cards.length > 1;
  const path = card.media.path;
  const resolve = useCallback(() => preview(path), [preview, path]);

  const pending = useMemo(() => cards.flatMap((c, i) => (cardReady(c) ? [] : [i + 1])), [cards]);
  const hint =
    pending.length === 0
      ? ""
      : several
        ? t("manual.pendingMany", { count: pending.length, list: pending.join("、") })
        : card.owner === UNASSIGNED
          ? t("manual.pendingUnassigned")
          : t("manual.pendingOne");
  const charError = card.owner === UNASSIGNED ? t("manual.unassignedError") : undefined;

  return (
    <section className="il-page">
      <div className="il-center">
        <div className="il-heading">
          <h1 className="pg-anim-title">{t("manual.title")}</h1>
          <div>{t("manual.subtitle")}</div>
        </div>
        <div ref={scroller} className="il-card st-scroll">
          <div className="el-group">
            <span className="el-label">{t("editLine.preview")}</span>
            <AudioPreview resolve={resolve} durationMs={card.media.durationMs ?? 0} />
          </div>
          <Field
            label={t("editLine.text")}
            placeholder={t("editLine.textPlaceholder")}
            rows={7}
            value={card.text}
            onChange={(v) => update({ text: v })}
          />
          <Field
            label={t("manual.translation")}
            placeholder={t("editLine.translationPlaceholder")}
            rows={7}
            value={card.translation}
            onChange={(v) => update({ translation: v })}
          />
          <CharacterPicker
            characters={characters}
            value={card.owner}
            onChange={(owner) => update({ owner })}
            onAddCharacter={onAddCharacter}
            error={charError}
            allowUnassigned
          />
          <div className="il-footer">
            <button type="button" className="el-cancel il-back" onClick={onBack}>
              <MaterialIcon name="arrow_back" />
              {t("import.back")}
            </button>
            {several ? (
              <div className="il-pager" role="group" aria-label={t("manual.pagerLabel")}>
                <button
                  type="button"
                  className="il-pager-btn"
                  aria-label={t("manual.prev")}
                  disabled={index === 0}
                  onClick={() => setIndex(index - 1)}
                >
                  <BentoIcon name="ChevronLeft" size={20} />
                </button>
                <span className="il-pager-count" aria-live="polite">
                  {index + 1}/{cards.length}
                </span>
                <button
                  type="button"
                  className="il-pager-btn"
                  aria-label={t("manual.next")}
                  disabled={index === cards.length - 1}
                  onClick={() => setIndex(index + 1)}
                >
                  <BentoIcon name="ChevronRight" size={20} />
                </button>
              </div>
            ) : (
              <span aria-hidden="true" />
            )}
            <div className="il-footer__end">
              <button
                type="button"
                className="el-save il-import"
                disabled={pending.length > 0}
                title={hint || undefined}
                onClick={onImport}
              >
                <MaterialIcon name="download" />
                {t("manual.import")}
              </button>
              {hint && (
                <span className="il-pending" aria-live="polite">
                  {hint}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}

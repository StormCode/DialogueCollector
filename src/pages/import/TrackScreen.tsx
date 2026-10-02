import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { MaterialIcon } from "../../components/icons/Icon";
import type { SubtitleTrack } from "../../lib/types";
import { ImportButton, Stepper } from "./ImportParts";

/** ISO 639-2 codes ffprobe reports, to the 639-1 ones `Intl.DisplayNames` knows. */
const ISO_639_2: Record<string, string> = {
  jpn: "ja",
  chi: "zh",
  zho: "zh",
  eng: "en",
  kor: "ko",
  fre: "fr",
  fra: "fr",
  ger: "de",
  deu: "de",
  spa: "es",
  ita: "it",
  por: "pt",
  rus: "ru",
  tha: "th",
  vie: "vi",
  ind: "id",
  may: "ms",
  msa: "ms",
  ara: "ar",
};

/** A track's 語言 cell: the language's name in the UI's language, with the track's title. */
export function trackLabel(track: SubtitleTrack, uiLanguage: string, unknown: string): string {
  let name: string | null = null;
  if (track.language) {
    const code = ISO_639_2[track.language.toLowerCase()] ?? track.language;
    try {
      name = new Intl.DisplayNames([uiLanguage], { type: "language" }).of(code) ?? null;
    } catch {
      name = track.language;
    }
  }
  if (name && track.title && track.title !== name) return `${name} · ${track.title}`;
  return name ?? track.title ?? unknown;
}

/** Where the track card sat, for 選擇台詞's card to grow from (user 2026-10-02). */
export interface CardRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

// Board: TrackSelect.dc.html (+ TrackSelectPicked): a 360px card of radio rows, 字幕軌號 and
// 語言, then 回上一步 / 下一步.
export function TrackScreen({
  tracks,
  onBack,
  onNext,
}: {
  tracks: SubtitleTrack[];
  onBack: () => void;
  onNext: (track: SubtitleTrack, from: CardRect | null) => void;
}) {
  const { t, i18n } = useTranslation();
  const [picked, setPicked] = useState<number | null>(null);
  const card = useRef<HTMLDivElement>(null);

  const next = () => {
    const track = tracks.find((tr) => tr.index === picked);
    if (!track) return;
    const r = card.current?.getBoundingClientRect();
    onNext(track, r ? { left: r.left, top: r.top, width: r.width, height: r.height } : null);
  };

  return (
    <div className="imp-page imp-page--list">
      <header className="imp-header">
        <h1 className="imp-title pg-anim-title">{t("import.tracks.title")}</h1>
        <Stepper embedded current={2} />
      </header>
      <div className="trk-stage">
        <div className="trk-space trk-space--above" aria-hidden="true" />
        <div ref={card} className="trk-card">
          <div className="trk-head" aria-hidden="true">
            <span>{t("import.tracks.number")}</span>
            <span>{t("import.tracks.language")}</span>
          </div>
          <div className="trk-list st-scroll" role="radiogroup" aria-label={t("import.tracks.label")}>
            {tracks.map((track, i) => {
              const selected = picked === track.index;
              return (
                <button
                  key={track.index}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`trk-row${selected ? " is-selected" : ""}`}
                  onClick={() => setPicked(track.index)}
                >
                  <span className="trk-no">#{i + 1}</span>
                  <span className="trk-lang">{trackLabel(track, i18n.language, t("import.tracks.unknown"))}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="trk-space trk-space--below" aria-hidden="true" />
      </div>
      <div className="trk-footer">
        <ImportButton kind="neutral" icon={<MaterialIcon name="arrow_back" />} onClick={onBack}>
          {t("import.back")}
        </ImportButton>
        <button type="button" className="imp-btn imp-btn--primary imp-btn--next" disabled={picked === null} onClick={next}>
          {t("import.tracks.next")}
          <MaterialIcon name="arrow_forward" />
        </button>
      </div>
    </div>
  );
}

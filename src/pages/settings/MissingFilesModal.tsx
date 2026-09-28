import { convertFileSrc } from "@tauri-apps/api/core";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { useRevealScrollbar } from "../../components/ui/useRevealScrollbar";
import { inTauri } from "../../lib/ipc";
import type { MissingFile } from "../../lib/types";
import { MaterialIcon } from "../../components/icons/Icon";

// Avatar fallback colours: one data-vis ramp per character, stable across sessions.
const RAMPS = ["indigo", "jade", "pink", "orange", "blue", "violet", "red", "green"] as const;

function Avatar({ file }: { file: MissingFile }) {
  const ramp = RAMPS[file.characterId % RAMPS.length];
  return (
    <span
      className="mf-avatar"
      aria-hidden="true"
      style={{ background: `var(--bento-dv-${ramp}-10)`, color: `var(--bento-dv-${ramp}-70)` }}
    >
      {file.portraitPath && inTauri() ? (
        <img src={convertFileSrc(file.portraitPath)} alt="" />
      ) : (
        Array.from(file.characterName)[0]
      )}
    </span>
  );
}

// 遺失的檔案 (T20, board Settings.dc.html): which lines lost their clip, each with 查看 to that
// character's 台詞頁, where the line can be re-imported or deleted.
export function MissingFilesModal({ files, onClose }: { files: MissingFile[]; onClose: () => void }) {
  const { t } = useTranslation();
  const list = useRef<HTMLDivElement>(null);
  useRevealScrollbar(list);
  return (
    <Modal title={t("settings.files.missing.title")} size="large" onClose={onClose}>
      <div className="mf-body">
        <div className="mf-banner">
          <MaterialIcon name="error" size={18} />
          <span>{t("settings.files.missing.banner", { count: files.length })}</span>
        </div>
        <div className="mf-table" role="table" aria-label={t("settings.files.missing.title")}>
          <div className="mf-row mf-row--head" role="row">
            <span role="columnheader">{t("settings.files.missing.character")}</span>
            <span role="columnheader">{t("settings.files.missing.line")}</span>
            <span role="columnheader" aria-hidden="true" />
          </div>
          <div className="mf-scroll st-scroll" role="rowgroup" ref={list}>
            {files.map((file) => (
              <div className="mf-row" role="row" key={file.lineId}>
                <span className="mf-who" role="cell">
                  <Avatar file={file} />
                  <span className="mf-name">{file.characterName}</span>
                </span>
                <span className="mf-text" role="cell" title={file.text}>
                  {file.text}
                </span>
                <span role="cell">
                  <Link
                    className="mf-view"
                    to={`/characters/${file.characterId}`}
                    aria-label={t("settings.files.missing.viewLabel", { name: file.characterName })}
                  >
                    {t("settings.files.missing.view")}
                    <MaterialIcon name="chevron_right" size={18} />
                  </Link>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mf-actions">
          <Button variant="neutral" onClick={onClose} data-autofocus>
            {t("common.close")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

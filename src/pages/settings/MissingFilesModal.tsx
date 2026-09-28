import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { CharacterAvatar } from "../../components/characters/CharacterAvatar";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { useRevealScrollbar } from "../../components/ui/useRevealScrollbar";
import type { MissingFile } from "../../lib/types";
import { BentoIcon, MaterialIcon } from "../../components/icons/Icon";

// 遺失的檔案 (T20, board Settings.dc.html): which lines lost their clip, each with 查看 to that
// character's 台詞頁, where the line can be re-imported or deleted.
export function MissingFilesModal({
  files,
  onClose,
  onDeleteAll,
}: {
  files: MissingFile[];
  onClose: () => void;
  /** 全部刪除, after its confirmation. */
  onDeleteAll: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
                  <CharacterAvatar id={file.characterId} name={file.characterName} portraitPath={file.portraitPath} size={28} />
                  <span className="mf-name">{file.characterName}</span>
                </span>
                <span className="mf-text" role="cell" title={file.text}>
                  {file.text}
                </span>
                <span role="cell">
                  <Link
                    className="mf-view"
                    to={`/characters/${file.characterId}?missing=${file.lineId}`}
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
          <Button variant="dangerOutline" aria-haspopup="dialog" onClick={() => setConfirming(true)}>
            <BentoIcon name="Bin" size={18} />
            {t("settings.files.missing.deleteAll")}
          </Button>
          <Button variant="neutral" onClick={onClose} data-autofocus>
            {t("common.close")}
          </Button>
        </div>
      </div>
      {confirming && (
        // SettingsMissingDeleteAll.dc.html
        <Modal title={t("settings.files.confirm")} size="small" onClose={() => setConfirming(false)}>
          <div className="confirm">
            <div className="confirm__icon" aria-hidden="true">
              <BentoIcon name="Bin" size={32} />
            </div>
            <div className="confirm__title">
              {t("settings.files.missing.deleteAllTitle", { count: files.length })}
            </div>
            <div className="confirm__body">{t("settings.files.missing.deleteAllBody")}</div>
          </div>
          <div className="modal-actions">
            {/* DT2: a destructive dialog opens on 取消. */}
            <Button variant="neutral" onClick={() => setConfirming(false)} data-autofocus>
              {t("settings.files.cancel")}
            </Button>
            <Button
              variant="danger"
              disabled={deleting}
              onClick={async () => {
                setDeleting(true);
                try {
                  await onDeleteAll();
                } finally {
                  setDeleting(false);
                  setConfirming(false);
                }
              }}
            >
              {t("settings.files.missing.deleteAll")}
            </Button>
          </div>
        </Modal>
      )}
    </Modal>
  );
}

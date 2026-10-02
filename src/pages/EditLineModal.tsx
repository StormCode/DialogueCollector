import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { AddCharacterModal } from "../components/characters/AddCharacterModal";
import { MaterialIcon } from "../components/icons/Icon";
import { AudioPreview, CharacterPicker } from "../components/lines/LineFormParts";
import { Field } from "../components/ui/Field";
import { Modal } from "../components/ui/Modal";
import { useRevealScrollbar } from "../components/ui/useRevealScrollbar";
import { errorKind, ipc } from "../lib/ipc";
import type { Character, Line } from "../lib/types";

// Board: EditLine.dc.html, shown as a modal over the 台詞 page (user 2026-09-29: the board draws
// it full-size, but it floats). 儲存 closes it (user 2026-10-02) and tells the page to reload.
// Moving a line to another character is a change of
// 角色 here.
export function EditLineModal({ line: initial, onClose }: { line: Line; onClose: (saved: boolean) => void }) {
  const { t } = useTranslation();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [text, setText] = useState(initial.text);
  const [translation, setTranslation] = useState(initial.translation ?? "");
  const [owner, setOwner] = useState<number | null>(initial.characterId);
  const [attempted, setAttempted] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const body = useRef<HTMLDivElement>(null);
  useRevealScrollbar(body);

  useEffect(() => {
    ipc.listCharacters().then(setCharacters, () => setCharacters([]));
  }, []);
  const close = () => onClose(false);


  // 原文 and 譯文 are each optional, but one of them must be filled in.
  const blank = !text.trim() && !translation.trim();
  const textError = attempted && blank ? t("editLine.textRequired") : undefined;
  const charError = attempted && owner === null ? t("editLine.characterRequired") : undefined;

  const save = async () => {
    setAttempted(true);
    setSaveError(null);
    if (blank || owner === null) return;
    try {
      await ipc.updateLine(initial.id, {
        text,
        translation: translation.trim() || null,
        characterId: owner,
      });
      onClose(true);
    } catch (e) {
      setSaveError(
        t(`editLine.errors.${errorKind(e)}`, {
          defaultValue: t("editLine.errors.generic"),
        }),
      );
    }
  };

  const audioPath = initial.audioPath;
  const resolveAudio = useCallback(() => Promise.resolve(audioPath), [audioPath]);

  return (
    <Modal title={t("editLine.title")} size="large" onClose={close} className="el-modal">
      <div ref={body} className="el-card st-scroll">
        <p className="el-subtitle">{t("editLine.subtitle")}</p>
        <div className="el-group">
          <span className="el-label">{t("editLine.preview")}</span>
          <AudioPreview resolve={resolveAudio} durationMs={initial.durationMs} />
        </div>
        <Field
          label={t("editLine.text")}
          placeholder={t("editLine.textPlaceholder")}
          rows={7}
          value={text}
          onChange={(v) => setText(v)}
          error={textError}
        />
        <Field
          label={t("editLine.translation")}
          placeholder={t("editLine.translationPlaceholder")}
          rows={7}
          value={translation}
          onChange={(v) => setTranslation(v)}
          invalid={!!textError}
        />
        <CharacterPicker
          characters={characters}
          value={owner}
          onChange={(o) => setOwner(typeof o === "number" ? o : null)}
          onAddCharacter={() => setAdding(true)}
          error={charError}
        />
        <div className="el-footer">
          <button type="button" className="el-cancel" onClick={close}>
            <MaterialIcon name="close" />
            {t("editLine.cancel")}
          </button>
          <div className="el-footer__end">
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
            setOwner(created.id);
          }}
        />
      )}
    </Modal>
  );
}

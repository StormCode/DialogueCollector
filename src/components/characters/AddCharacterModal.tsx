import { convertFileSrc } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { errorKind, inTauri, ipc } from "../../lib/ipc";
import type { Category, NewCharacter } from "../../lib/types";
import { BentoIcon, BoardArt } from "../icons/Icon";
import { Field } from "../ui/Field";
import { Modal } from "../ui/Modal";
import { SelectField } from "../ui/SelectField";
import { extensionOf, useFileDrop } from "../ui/useFileDrop";
import "./characters.css";

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif"];
const CATEGORIES: Category[] = ["anime", "movie", "tv"];

// Board: AddCharacter.dc.html. Once an image is picked the drop zone shows it with 更換照片
// and a delete button, as EditCharacter.dc.html draws a character that has a photo.
export function AddCharacterModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (form: NewCharacter) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("anime");
  const [source, setSource] = useState("");
  const [cv, setCv] = useState("");
  const [portrait, setPortrait] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const drop = useRef<HTMLDivElement>(null);

  const usePortrait = async (path: string) => {
    if (!IMAGE_EXTENSIONS.includes(extensionOf(path))) {
      setError(t("characters.add.errors.Image.Unsupported"));
      return;
    }
    setError(null);
    if (inTauri()) await ipc.allowPreview(path).catch(() => {});
    setPortrait(path);
  };

  const hovering = useFileDrop(drop, (paths) => void usePortrait(paths[0]));

  const browse = async () => {
    const picked = await open({
      multiple: false,
      filters: [{ name: t("characters.add.imageFilter"), extensions: IMAGE_EXTENSIONS }],
    });
    if (typeof picked === "string") await usePortrait(picked);
  };

  const ready = name.trim() !== "" && source.trim() !== "" && !saving;
  const submit = async () => {
    if (!ready) return;
    setSaving(true);
    setError(null);
    try {
      await onCreate({ name, category, source, cv: cv.trim() || null, portrait });
    } catch (e) {
      const kind = errorKind(e);
      setError(t(`characters.add.errors.${kind}`, { defaultValue: t("characters.add.errors.generic") }));
      setSaving(false);
    }
  };

  return (
    <Modal
      title={t("characters.add.title")}
      size="large"
      onClose={onClose}
      className="char-form-modal"
      actions={{
        secondary: { label: t("characters.add.cancel"), onClick: onClose },
        primary: { label: t("characters.add.submit"), onClick: () => void submit(), disabled: !ready },
      }}
    >
      <div className="char-form">
        <div className="char-form__photo">
          {portrait ? (
            <>
              <div className="char-photo">
                {inTauri() && <img src={convertFileSrc(portrait)} alt="" />}
              </div>
              <div className="char-photo__actions">
                <button type="button" className="char-browse" onClick={() => void browse()}>
                  {t("characters.add.changePhoto")}
                </button>
                <button
                  type="button"
                  className="char-remove"
                  aria-label={t("characters.add.removePhoto")}
                  title={t("characters.add.removePhoto")}
                  onClick={() => setPortrait(null)}
                >
                  <BentoIcon name="Bin" size={20} />
                </button>
              </div>
            </>
          ) : (
            <div ref={drop} className={`char-drop${hovering ? " is-over" : ""}`}>
              <span className="char-drop__art" aria-hidden="true">
                <BoardArt name="portraitDrop" style={{ height: 210, width: "auto" }} />
              </span>
              <div className="char-drop__content">
                <div className="char-drop__title">{t("characters.add.dropHere")}</div>
                <div className="char-drop__or">{t("characters.add.or")}</div>
                <button type="button" className="char-browse" onClick={() => void browse()}>
                  {t("characters.add.browse")}
                </button>
                <div className="char-drop__or">{t("characters.add.formats")}</div>
              </div>
            </div>
          )}
          <div className="char-hint">
            <BentoIcon name="LightbulbWeightRegular" size={14} />
            <span>{t("characters.add.pngHint")}</span>
          </div>
          {error && (
            <div className="char-error" role="alert">
              {error}
            </div>
          )}
        </div>

        <div className="char-form__fields">
          <Field
            label={t("characters.fields.name")}
            placeholder={t("characters.fields.namePlaceholder")}
            required
            autoFocus
            value={name}
            onChange={setName}
          />
          <SelectField
            label={t("characters.fields.category")}
            value={category}
            onChange={(v) => setCategory(v as Category)}
            options={CATEGORIES.map((c) => ({ value: c, label: t(`characters.categories.${c}`) }))}
          />
          <Field
            label={t("characters.fields.source")}
            placeholder={t("characters.fields.sourcePlaceholder")}
            required
            value={source}
            onChange={setSource}
          />
          <Field
            label={t("characters.fields.cv")}
            placeholder={t("characters.fields.cvPlaceholder")}
            value={cv}
            onChange={setCv}
          />
        </div>
      </div>
    </Modal>
  );
}

import { convertFileSrc } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { errorKind, inTauri, ipc } from "../../lib/ipc";
import type { Category, Character, CharacterEdit, NewCharacter, PortraitChange } from "../../lib/types";
import { BentoIcon, BoardArt, MaterialIcon } from "../icons/Icon";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { Modal } from "../ui/Modal";
import { SelectField } from "../ui/SelectField";
import { extensionOf, useFileDrop } from "../ui/useFileDrop";
import "./characters.css";

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif"];
const CATEGORIES: Category[] = ["anime", "movie", "tv"];

type Mode =
  | { kind: "add"; onCreate: (form: NewCharacter) => Promise<void> }
  | {
      kind: "edit";
      character: Character;
      onSave: (edit: CharacterEdit) => Promise<void>;
      /** 刪除角色, which asks for confirmation itself. */
      onDelete: () => void;
    };

/** Board: AddCharacter.dc.html. */
export function AddCharacterModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (form: NewCharacter) => Promise<void>;
}) {
  return <CharacterFormModal mode={{ kind: "add", onCreate }} onClose={onClose} />;
}

/** Board: EditCharacter.dc.html. */
export function EditCharacterModal({
  character,
  onClose,
  onSave,
  onDelete,
}: {
  character: Character;
  onClose: () => void;
  onSave: (edit: CharacterEdit) => Promise<void>;
  onDelete: () => void;
}) {
  return <CharacterFormModal mode={{ kind: "edit", character, onSave, onDelete }} onClose={onClose} />;
}

// One form for both boards. They differ in the photo area (AddCharacter: a drop zone;
// EditCharacter: the photo with 更換照片 and a bin), the hint's wording, and the footer
// (Bento Actions vs 刪除角色 | 取消 編輯). Once an image is picked on AddCharacter the zone shows
// it as EditCharacter draws a character that has a photo.
function CharacterFormModal({ mode, onClose }: { mode: Mode; onClose: () => void }) {
  const { t } = useTranslation();
  const editing = mode.kind === "edit" ? mode.character : null;
  const [name, setName] = useState(editing?.name ?? "");
  const [category, setCategory] = useState<Category>(editing?.category ?? "anime");
  const [source, setSource] = useState(editing?.source ?? "");
  const [cv, setCv] = useState(editing?.cv ?? "");
  /** A newly picked image, or the character's current photo while editing. */
  const [photo, setPhoto] = useState<string | null>(editing?.portraitPath ?? null);
  const [change, setChange] = useState<PortraitChange>({ kind: "keep" });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const drop = useRef<HTMLDivElement>(null);

  const pick = async (path: string) => {
    if (!IMAGE_EXTENSIONS.includes(extensionOf(path))) {
      setError(t("characters.add.errors.Image.Unsupported"));
      return;
    }
    setError(null);
    if (inTauri()) await ipc.allowPreview(path).catch(() => {});
    setPhoto(path);
    setChange({ kind: "replace", path });
  };
  const removePhoto = () => {
    setPhoto(null);
    setChange({ kind: "remove" });
  };

  const hovering = useFileDrop(drop, (paths) => void pick(paths[0]), !photo);

  const browse = async () => {
    const picked = await open({
      multiple: false,
      filters: [{ name: t("characters.add.imageFilter"), extensions: IMAGE_EXTENSIONS }],
    });
    if (typeof picked === "string") await pick(picked);
  };

  const ready = name.trim() !== "" && source.trim() !== "" && !saving;
  const submit = async () => {
    if (!ready) return;
    setSaving(true);
    setError(null);
    try {
      const fields = { name, category, source, cv: cv.trim() || null };
      if (mode.kind === "add") {
        await mode.onCreate({ ...fields, portrait: change.kind === "replace" ? change.path : null });
      } else {
        await mode.onSave({ ...fields, portrait: change });
      }
    } catch (e) {
      const kind = errorKind(e);
      setError(t(`characters.add.errors.${kind}`, { defaultValue: t("characters.add.errors.generic") }));
      setSaving(false);
    }
  };

  const photoBlock = photo ? (
    <>
      <div className="char-photo">{inTauri() && <img src={convertFileSrc(photo)} alt="" />}</div>
      <div className="char-photo__actions">
        <button type="button" className="char-browse" onClick={() => void browse()}>
          {t("characters.add.changePhoto")}
        </button>
        <button
          type="button"
          className="char-remove"
          aria-label={t("characters.add.removePhoto")}
          title={t("characters.add.removePhoto")}
          onClick={removePhoto}
        >
          <BentoIcon name="Bin" size={20} />
        </button>
      </div>
    </>
  ) : mode.kind === "edit" ? (
    // EditCharacter without a photo: the person glyph, and the bin disabled.
    <>
      <div className="char-photo char-photo--empty">
        <MaterialIcon name="person" size={96} />
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
          disabled
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
  );

  const form = (
    <div className="char-form">
      <div className="char-form__photo">
        {photoBlock}
        <div className="char-hint">
          <BentoIcon name="LightbulbWeightRegular" size={14} />
          <span>{t(mode.kind === "edit" ? "characters.edit.photoHint" : "characters.add.photoHint")}</span>
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
  );

  if (mode.kind === "add") {
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
        {form}
      </Modal>
    );
  }

  return (
    <Modal title={t("characters.edit.title")} size="large" onClose={onClose} className="char-form-modal">
      <div className="char-edit">
        {form}
        <div className="char-edit__divider" />
        <div className="char-edit__footer">
          <Button variant="dangerOutline" className="char-edit__delete" onClick={mode.onDelete}>
            {t("characters.edit.delete")}
          </Button>
          <div className="char-edit__actions">
            <Button variant="neutral" onClick={onClose}>
              {t("characters.add.cancel")}
            </Button>
            <Button variant="solid" disabled={!ready} onClick={() => void submit()}>
              {t("characters.edit.submit")}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

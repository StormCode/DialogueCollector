import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { BentoIcon } from "../icons/Icon";
import { Button } from "./Button";
import { Modal } from "./Modal";

// The destructive confirmation the boards share (DeleteConfirm, DeleteLine, DeletePoster,
// SettingsMissingDeleteAll): small Bento Modal 「確認」, the Bin in a soft red circle, a title,
// a line of consequences, then 取消 and the danger action. Opens on 取消.
export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  body: ReactNode;
  confirmLabel: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  return (
    <Modal title={t("common.confirm")} size="small" onClose={onCancel}>
      <div className="confirm">
        <div className="confirm__icon" aria-hidden="true">
          <BentoIcon name="Bin" size={32} />
        </div>
        <div className="confirm__title">{title}</div>
        <div className="confirm__body">{body}</div>
      </div>
      <div className="modal-actions">
        <Button variant="neutral" onClick={onCancel} data-autofocus>
          {t("common.cancel")}
        </Button>
        <Button
          variant="danger"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onConfirm();
            } finally {
              setBusy(false);
            }
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

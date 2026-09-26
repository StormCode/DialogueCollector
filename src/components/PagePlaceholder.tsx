import { useTranslation } from "react-i18next";

/** Stand-in body for pages whose board has not been translated into components yet. */
export function PagePlaceholder({ title, board }: { title: string; board: string }) {
  const { t } = useTranslation();
  return (
    <section className="page">
      <h1 className="page__title">{title}</h1>
      <p className="page__note">
        {t("common.notImplemented")} — <code>design/boards/{board}</code>
      </p>
    </section>
  );
}

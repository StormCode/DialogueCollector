import { useTranslation } from "react-i18next";

import { MaterialIcon } from "../icons/Icon";
import "./ui.css";

type Item = { page: number } | { ellipsis: string };

/** First, last, and the current page's neighbours, with … for the gaps (ScriptBook board). */
export function pageItems(current: number, total: number): Item[] {
  const nums = [1];
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) nums.push(i);
  if (total > 1) nums.push(total);
  const items: Item[] = [];
  let prev = 0;
  for (const n of nums) {
    if (n - prev > 1) items.push({ ellipsis: `gap-${n}` });
    items.push({ page: n });
    prev = n;
  }
  return items;
}

// .sb-pagination on the ScriptBook and Lines boards.
export function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (page: number) => void;
}) {
  const { t } = useTranslation();
  const go = (n: number) => onChange(Math.min(Math.max(1, n), total));
  return (
    <nav className="ui-pages" aria-label={t("pagination.label")}>
      <button type="button" className="ui-page" aria-label={t("pagination.first")} disabled={page <= 1} onClick={() => go(1)}>
        <MaterialIcon name="first_page" size={20} />
      </button>
      <button type="button" className="ui-page" aria-label={t("pagination.prev")} disabled={page <= 1} onClick={() => go(page - 1)}>
        <MaterialIcon name="chevron_left" size={20} />
      </button>
      {pageItems(page, total).map((item) =>
        "ellipsis" in item ? (
          <span key={item.ellipsis} className="ui-page-gap">
            …
          </span>
        ) : (
          <button
            key={item.page}
            type="button"
            className={`ui-page${item.page === page ? " is-current" : ""}`}
            aria-label={t("pagination.page", { n: item.page })}
            aria-current={item.page === page ? "page" : undefined}
            onClick={() => go(item.page)}
          >
            {item.page}
          </button>
        ),
      )}
      <button type="button" className="ui-page" aria-label={t("pagination.next")} disabled={page >= total} onClick={() => go(page + 1)}>
        <MaterialIcon name="chevron_right" size={20} />
      </button>
      <button type="button" className="ui-page" aria-label={t("pagination.last")} disabled={page >= total} onClick={() => go(total)}>
        <MaterialIcon name="last_page" size={20} />
      </button>
    </nav>
  );
}

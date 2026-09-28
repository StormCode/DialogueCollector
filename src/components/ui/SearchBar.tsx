import { useTranslation } from "react-i18next";

import { BentoIcon } from "../icons/Icon";
import "./ui.css";

// Bento SearchBar: search glyph, input, and a clear button once there is text.
export function SearchBar({
  value,
  onChange,
  placeholder,
  label,
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  /** Accessible name when the placeholder is not enough. */
  label?: string;
  autoFocus?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="ui-search">
      <BentoIcon name="Search" size={24} className="ui-search__glyph" />
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" className="ui-search__clear" aria-label={t("common.clearSearch")} onClick={() => onChange("")}>
          <BentoIcon name="XWeightBold" size={16} />
        </button>
      )}
    </div>
  );
}

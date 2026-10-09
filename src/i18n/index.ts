import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import type { Locale } from "../lib/types";
import en from "./locales/en.json";
import ja from "./locales/ja.json";
import zhHans from "./locales/zh-Hans.json";
import zhHant from "./locales/zh-Hant.json";

export const resources = {
  "zh-Hant": { translation: zhHant },
  "zh-Hans": { translation: zhHans },
  ja: { translation: ja },
  en: { translation: en },
} satisfies Record<Locale, { translation: unknown }>;

/** Native names, shown untranslated in the language dropdown. */
export const LOCALE_NAMES: Record<Locale, string> = {
  "zh-Hant": "繁體中文",
  "zh-Hans": "简体中文",
  ja: "日本語",
  en: "English",
};

void i18n.use(initReactI18next).init({
  resources,
  lng: "zh-Hant",
  fallbackLng: "zh-Hant",
  interpolation: { escapeValue: false },
});

// The interface font is system-ui, so the document language must follow the locale or
// shared Han characters render with the wrong regional glyph forms (e.g. Japanese on Windows).
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;

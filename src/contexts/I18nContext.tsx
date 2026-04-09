/* ═══════════════════════════════════════════════════════════════
 * Lightweight i18n Context (TH/EN)
 *
 * Simple, dependency-free i18n using React Context + localStorage.
 * No react-i18next overhead — just typed keys + nested objects.
 *
 * Usage:
 *   import { useI18n } from "@/contexts/I18nContext";
 *   const { t, lang, setLang } = useI18n();
 *   return <h1>{t("nav.products")}</h1>;
 *
 * Adding new translations: edit messages.ts
 * ═══════════════════════════════════════════════════════════════ */

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { messages, type Lang, type TranslationKey } from "./messages";

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: TranslationKey, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "th",
  setLang: () => {},
  toggleLang: () => {},
  t: (k) => k,
});

export const useI18n = () => useContext(I18nContext);

const STORAGE_KEY = "ent-vision-lang";

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "th";
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "th" || saved === "en") return saved;
    // Auto-detect from browser
    const browserLang = window.navigator.language.toLowerCase();
    return browserLang.startsWith("en") ? "en" : "th";
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
      // Set document lang attribute for accessibility / SEO
      document.documentElement.lang = lang;
    } catch {
      // Ignore storage errors (private mode, etc.)
    }
  }, [lang]);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === "th" ? "en" : "th"));
  }, []);

  const t = useCallback(
    (key: TranslationKey, fallback?: string): string => {
      // Resolve nested key like "nav.products" → messages[lang].nav.products
      const parts = key.split(".");
      let cur: any = messages[lang];
      for (const part of parts) {
        if (cur && typeof cur === "object" && part in cur) {
          cur = cur[part];
        } else {
          // Fallback to TH if EN missing
          if (lang === "en") {
            let thCur: any = messages.th;
            for (const p of parts) {
              if (thCur && typeof thCur === "object" && p in thCur) thCur = thCur[p];
              else return fallback ?? key;
            }
            return typeof thCur === "string" ? thCur : (fallback ?? key);
          }
          >
          return fallback ?? key;
        }
      }
      return typeof cur === "string" ? cur : (fallback ?? key);
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

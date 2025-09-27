export const LOCALES = ["de", "it", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "de";

export const FALLBACK_LOCALE: Locale = DEFAULT_LOCALE;

export const LOCALE_LABELS: Record<Locale, string> = {
  de: "Deutsch",
  it: "Italiano",
  en: "English",
};

export const HREFLANG_MAP: Record<Locale, string> = {
  de: "de-CH",
  it: "it-CH",
  en: "en-CH",
};

export const SUPPORTED_LOCALE_PATHS: Record<Locale, string> = {
  de: "/de",
  it: "/it",
  en: "/en",
};

export function isLocale(value: string | undefined | null): value is Locale {
  if (!value) {
    return false;
  }

  return LOCALES.includes(value as Locale);
}
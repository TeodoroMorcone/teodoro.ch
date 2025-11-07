"use client";

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useMemo} from "react";

import {LOCALES, type Locale, LOCALE_LABELS} from "@/lib/i18n/locales";

const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  de: "🇩🇪",
  it: "🇮🇹",
};

type LanguageSwitcherProps = {
  currentLocale: Locale;
  label: string;
};

export function LanguageSwitcher({currentLocale, label}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const localeOptions = useMemo(
    () =>
      LOCALES.map((locale) => ({
        value: locale,
        label: `${LOCALE_FLAGS[locale] ?? ""} ${LOCALE_LABELS[locale]}`,
      })),
    [],
  );

  const onChange = (nextLocale: Locale) => {
    if (!pathname) return;

    const segments = pathname.split("/").filter(Boolean);
    const [, ...rest] = segments;
    const newPath = `/${[nextLocale, ...rest].join("/")}`;
    const query = searchParams.toString();
    router.push(query ? `${newPath}?${query}` : newPath, {scroll: false});
  };

  return (
    <label className="flex items-center gap-3 text-sm font-medium text-secondary dark:text-surface/80">
      <span className="sr-only">{label}</span>
      <select
        className="w-full rounded-full border border-secondary/30 bg-surface px-4 py-2 text-sm text-primary shadow-sm transition-colors duration-200 focus:border-accent focus:outline-none dark:border-primary/30 dark:bg-primary/40 dark:text-accent-foreground"
        value={currentLocale}
        onChange={(event) => onChange(event.target.value as Locale)}
        aria-label={label}
      >
        {localeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
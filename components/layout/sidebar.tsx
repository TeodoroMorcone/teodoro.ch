"use client";

import Link from "next/link";
import type {ReactNode} from "react";

import {useConsent} from "@/components/consent/consent-context";
import {NavLink} from "@/components/navigation/nav-link";
import type {Locale} from "@/lib/i18n/locales";

type SidebarNavItem = {
  id: string;
  href: string;
  label: string;
  targetId?: string;
};

type SidebarLegalLink = {
  label: string;
  href: string;
};

type SidebarPrivacyLink = {
  label: string;
  href: string;
};

type SidebarCtas = {
  primary: {
    label: string;
    href: string;
  };
  secondary: {
    label: string;
    href: string;
  };
  tertiary: {
    label: string;
    href: string;
    helper: string;
  };
};

type SidebarLabels = {
  navigation: string;
  home: string;
  language: string;
  theme: string;
  cookies: string;
  privacy: string;
};

type SidebarProps = {
  locale: Locale;
  navItems: SidebarNavItem[];
  legalLink: SidebarLegalLink;
  privacyLink: SidebarPrivacyLink;
  ctas: SidebarCtas;
  labels: SidebarLabels;
  activeLocaleName: string;
  themeSystemLabel: string;
  languageSwitcher?: ReactNode;
  themeToggle?: ReactNode;
};

export function Sidebar({
  locale,
  navItems,
  legalLink,
  privacyLink,
  ctas,
  labels,
  activeLocaleName,
  themeSystemLabel,
  languageSwitcher,
  themeToggle,
}: SidebarProps) {
  const consent = useConsent();
  const languageControl =
    languageSwitcher ??
    (
      <div className="flex items-center justify-between gap-3 rounded-full border border-secondary/30 px-4 py-2 text-secondary dark:border-surface/20 dark:text-surface/80">
        <span className="text-xs font-semibold uppercase tracking-[0.18em]">{labels.language}</span>
        <span className="text-xs font-medium">{activeLocaleName}</span>
      </div>
    );

  const themeControl =
    themeToggle ??
    (
      <button
        type="button"
        className="inline-flex items-center justify-between rounded-full border border-secondary/30 px-4 py-2 text-sm font-medium text-secondary transition-colors duration-200 ease-soft-sine hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-surface/20 dark:text-surface/80 dark:hover:border-accent dark:hover:text-accent"
        aria-label={labels.theme}
        disabled
      >
        <span>{labels.theme}</span>
        <span className="text-xs uppercase tracking-[0.2em]">{themeSystemLabel}</span>
      </button>
    );

  return (
    <aside
      aria-label={labels.navigation}
      className="hidden bg-surface text-primary dark:bg-primary dark:text-surface lg:sticky lg:top-0 lg:flex lg:min-h-dvh lg:max-h-dvh lg:w-80 lg:flex-col lg:justify-between lg:border-r lg:border-secondary/20 lg:overflow-y-auto lg:overscroll-contain"
    >
      <div className="flex flex-col gap-5 p-5">
        <Link
          href={`/${locale}`}
          className="inline-flex flex-col gap-1 text-left"
          aria-label={labels.home}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary dark:text-surface/80">
            Teodoro Morcone
          </span>
          <span className="text-xl font-semibold leading-tight">Nachhilfe</span>
        </Link>

        <nav aria-label={labels.navigation}>
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                href={item.href}
                label={item.label}
                {...(item.targetId ? {targetId: item.targetId} : {})}
              />
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-2">
          <a
            className="inline-flex items-center justify-center rounded-full bg-primary px-3.5 py-2 text-sm font-semibold text-surface transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:bg-accent hover:text-primary"
            href={ctas.primary.href}
          >
            {ctas.primary.label}
          </a>
          <a
            className="inline-flex items-center justify-center rounded-full border border-secondary px-3.5 py-2 text-sm font-semibold text-primary transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:border-accent hover:text-accent dark:text-surface"
            href={ctas.secondary.href}
          >
            {ctas.secondary.label}
          </a>
          <div className="space-y-0.5">
            <a
              className="inline-flex items-center justify-center rounded-full bg-primary px-3.5 py-2 text-sm font-semibold text-surface transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:bg-accent hover:text-primary"
              href={ctas.tertiary.href}
            >
              {ctas.tertiary.label}
            </a>
            <p className="text-xs text-secondary dark:text-surface/70">{ctas.tertiary.helper}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-secondary/20 p-5 text-sm">
        {languageControl}
        {themeControl}
        <button
          type="button"
          className="text-left text-sm font-medium text-secondary underline-offset-4 hover:text-accent hover:underline dark:text-surface/70 dark:hover:text-accent"
          onClick={() => consent.openPreferences()}
        >
          {labels.cookies}
        </button>
        <a
          className="text-sm font-medium text-secondary underline-offset-4 hover:text-accent hover:underline dark:text-surface/70 dark:hover:text-accent"
          href={privacyLink.href}
        >
          {privacyLink.label}
        </a>
        <a
          className="text-sm font-medium text-secondary underline-offset-4 hover:text-accent hover:underline dark:text-surface/70 dark:hover:text-accent"
          href={legalLink.href}
        >
          {legalLink.label}
        </a>
      </div>
    </aside>
  );
}
"use client";

import Link from "next/link";
import {useEffect, useRef, type ReactNode} from "react";

import {useConsent} from "@/components/consent/consent-context";
import {NavLink} from "@/components/navigation/nav-link";
import type {Locale} from "@/lib/i18n/locales";

type SidebarNavItem = {
  id: string;
  href: string;
  label: string;
  targetId?: string;
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
    helper?: string;
  };
};

type SidebarLabels = {
  navigation: string;
  home: string;
  language: string;
  theme: string;
  cookies: string;
  cookiesAction: string;
};

type SidebarProps = {
  locale: Locale;
  navItems: SidebarNavItem[];
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
  ctas,
  labels,
  activeLocaleName,
  themeSystemLabel,
  languageSwitcher,
  themeToggle,
}: SidebarProps) {
  const consent = useConsent();
  const asideRef = useRef<HTMLElement | null>(null);
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

  console.log("[Sidebar] control composition", {
    hasLanguageSwitcher: Boolean(languageSwitcher),
    hasThemeToggle: Boolean(themeToggle),
    consentPreferencesAvailable: typeof consent.openPreferences === "function",
  });
  console.log("[Sidebar] CTA copy diagnostics", {
    tertiaryLabel: ctas.tertiary.label,
    tertiaryHelper: ctas.tertiary.helper ?? null,
  });

  useEffect(() => {
    const sidebarElement = asideRef.current;

    if (!sidebarElement) {
      console.warn("[Sidebar] height instrumentation skipped: missing ref");
      return;
    }

    const logMetrics = (phase: string) => {
      const viewportHeight = window.innerHeight;
      console.log("[Sidebar] height instrumentation", {
        phase,
        targetHeight: viewportHeight,
        offsetHeight: sidebarElement.offsetHeight,
        scrollHeight: sidebarElement.scrollHeight,
        clientHeight: sidebarElement.clientHeight,
        viewportInnerHeight: viewportHeight,
      });
    };

    const handleResize = () => logMetrics("resize");

    const rafId = requestAnimationFrame(() => logMetrics("mount"));

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const cookieControl = (
    <button
      type="button"
      className="flex items-center justify-between gap-3 rounded-full border border-secondary/30 px-4 py-2 text-secondary transition-colors duration-200 ease-soft-sine hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-surface/20 dark:text-surface/80 dark:hover:border-accent dark:hover:text-accent"
      onClick={() => {
        consent.openPreferences();
        consent.announce?.(null);
      }}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.18em]">{labels.cookies}</span>
      <span className="text-xs font-medium">{labels.cookiesAction}</span>
    </button>
  );

  return (
    <aside
      aria-label={labels.navigation}
      className="hidden bg-surface text-primary dark:bg-primary dark:text-surface lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-80 lg:flex-col lg:border-r lg:border-secondary/20"
      ref={asideRef}
    >
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pt-6 pb-4 lg:overscroll-contain">
          <Link
            href={`/${locale}`}
            className="inline-flex flex-col gap-1 text-left"
            aria-label={labels.home}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-secondary dark:text-surface/80">
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

          <div className="flex flex-col items-center gap-4">
            <a
              className="inline-flex w-full max-w-xs items-center justify-center rounded-3xl border border-accent/60 bg-surface px-4 py-3 text-sm font-semibold text-primary shadow-sidebar transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:bg-primary hover:text-surface dark:border-surface/40 dark:bg-surface dark:text-primary dark:hover:bg-accent/40 dark:hover:text-primary"
              href={ctas.primary.href}
            >
              {ctas.primary.label}
            </a>
            <div className="flex w-full max-w-xs flex-col items-center space-y-2">
              <a
                className="inline-flex w-full items-center justify-center rounded-3xl border border-accent/60 bg-surface px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sidebar transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:bg-primary hover:text-surface dark:border-surface/40 dark:bg-surface dark:text-primary dark:hover:bg-accent/40 dark:hover:text-primary"
                href={ctas.tertiary.href}
              >
                {ctas.tertiary.label}
              </a>
              {ctas.tertiary.helper ? (
                <p className="text-center text-xs text-secondary dark:text-surface/70">{ctas.tertiary.helper}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-secondary/20 px-5 py-4 text-sm">
          {languageControl}
          {themeControl}
          {cookieControl}
        </div>
      </div>
    </aside>
  );
}
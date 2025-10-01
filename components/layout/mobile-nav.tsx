"use client";

import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import {Menu, X} from "lucide-react";
import Link from "next/link";
import {useCallback, useEffect, useState, type ReactNode} from "react";

import {useConsent} from "@/components/consent/consent-context";
import {NavLink} from "@/components/navigation/nav-link";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";

type MobileNavItem = {
  id: string;
  href: `#${string}`;
  label: string;
  targetId: string;
};

type MobileLegalLink = {
  label: string;
  href: string;
};

type MobilePrivacyLink = {
  label: string;
  href: string;
};

type MobileCtas = {
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

type MobileLabels = {
  navigation: string;
  home: string;
  open: string;
  close: string;
  language: string;
  theme: string;
  cookies: string;
  privacy: string;
};

type MobileNavProps = {
  locale: string;
  navItems: MobileNavItem[];
  legalLink: MobileLegalLink;
  privacyLink: MobilePrivacyLink;
  ctas: MobileCtas;
  labels: MobileLabels;
  activeLocaleName: string;
  themeSystemLabel: string;
  languageSwitcher?: ReactNode;
  themeToggle?: ReactNode;
};

export function MobileNav({
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
}: MobileNavProps) {
  const consent = useConsent();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const logViewportMetrics = () => {
      const scrollingElement = document.scrollingElement ?? document.documentElement;
      const mainElement = document.getElementById("main-content");
      const mainRect = mainElement?.getBoundingClientRect();

      console.log("[MobileNav] viewport metrics", {
        innerHeight: window.innerHeight,
        outerHeight: window.outerHeight,
        visualViewportHeight: window.visualViewport?.height ?? null,
        visualViewportScale: window.visualViewport?.scale ?? null,
        clientHeight: document.documentElement?.clientHeight ?? null,
        clientWidth: document.documentElement?.clientWidth ?? null,
        bodyClientHeight: document.body?.clientHeight ?? null,
        bodyScrollHeight: document.body?.scrollHeight ?? null,
        docScrollHeight: scrollingElement?.scrollHeight ?? null,
        docOffsetHeight:
          scrollingElement instanceof HTMLElement ? scrollingElement.offsetHeight : null,
        maxScrollable: (scrollingElement?.scrollHeight ?? 0) - (window.innerHeight ?? 0),
        mainRect: mainRect
          ? {
              top: Math.round(mainRect.top),
              bottom: Math.round(mainRect.bottom),
              height: Math.round(mainRect.height),
            }
          : null,
      });
    };

    logViewportMetrics();
    window.addEventListener("resize", logViewportMetrics);
    window.visualViewport?.addEventListener("resize", logViewportMetrics);

    return () => {
      window.removeEventListener("resize", logViewportMetrics);
      window.visualViewport?.removeEventListener("resize", logViewportMetrics);
    };
  }, []);

  const handleNavigate = useCallback(() => {
    setOpen(false);
  }, []);

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
        className="inline-flex w-full items-center justify-between rounded-full border border-secondary/30 px-4 py-2 text-sm font-medium text-secondary transition-colors duration-200 ease-soft-sine hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-surface/20 dark:text-surface/80 dark:hover:border-accent dark:hover:text-accent"
        aria-label={labels.theme}
        disabled
      >
        <span>{labels.theme}</span>
        <span className="text-xs uppercase tracking-[0.2em]">{themeSystemLabel}</span>
      </button>
    );

  return (
    <header className="sticky top-0 z-40 border-b border-secondary/30 bg-surface/95 text-primary backdrop-blur-md dark:border-surface/20 dark:bg-primary/95 dark:text-surface lg:hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href={`/${locale}`} className="flex flex-col text-left" aria-label={labels.home}>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-surface/80">
            Teodoro Morcone
          </span>
          <span className="text-lg font-semibold leading-tight">Nachhilfe</span>
        </Link>

        <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-3">
          <a
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-surface transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:bg-accent hover:text-primary sm:w-auto"
            href={ctas.primary.href}
          >
            {ctas.primary.label}
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-secondary/40 text-primary transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:border-accent hover:text-accent dark:border-surface/30 dark:text-surface sm:self-auto sm:justify-center"
              aria-label={labels.open}
            >
              <Menu aria-hidden="true" className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent className="flex h-full max-h-screen w-full max-w-xs flex-col overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary dark:text-surface/80">
                  {labels.navigation}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-secondary/40 text-primary transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:border-accent hover:text-accent dark:border-surface/30 dark:text-surface"
                  aria-label={labels.close}
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                  <VisuallyHidden>{labels.close}</VisuallyHidden>
                </button>
              </div>

              <nav aria-label={labels.navigation} className="mt-6">
                <ul className="flex flex-col gap-3">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.id}
                      href={item.href}
                      label={item.label}
                      targetId={item.targetId}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </ul>
              </nav>

              <div className="mt-8 flex flex-col gap-3">
                <a
                  className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-surface transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:bg-accent hover:text-primary"
                  href={ctas.primary.href}
                  onClick={handleNavigate}
                >
                  {ctas.primary.label}
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-full border border-secondary px-4 py-3 text-sm font-semibold text-primary transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:border-accent hover:text-accent dark:text-surface"
                  href={ctas.secondary.href}
                  onClick={handleNavigate}
                >
                  {ctas.secondary.label}
                </a>
                <div className="space-y-1">
                  <a
                    className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-surface transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:bg-accent hover:text-primary"
                    href={ctas.tertiary.href}
                    onClick={handleNavigate}
                  >
                    {ctas.tertiary.label}
                  </a>
                  <p className="text-xs text-secondary dark:text-surface/70">{ctas.tertiary.helper}</p>
                </div>
              </div>

              <div className="mt-8 space-y-3 border-t border-secondary/20 pt-6 text-sm dark:border-surface/20">
                {languageControl}
                {themeControl}
                <button
                  type="button"
                  className="w-full text-left text-sm font-medium text-secondary underline-offset-4 hover:text-accent hover:underline dark:text-surface/70 dark:hover:text-accent"
                  onClick={() => {
                    consent.openPreferences();
                    setOpen(false);
                  }}
                >
                  {labels.cookies}
                </button>
                <Link
                  className="text-sm font-medium text-secondary underline-offset-4 hover:text-accent hover:underline dark:text-surface/70 dark:hover:text-accent"
                  href={privacyLink.href}
                  onClick={handleNavigate}
                >
                  {privacyLink.label}
                </Link>
                <Link
                  className="text-sm font-medium text-secondary underline-offset-4 hover:text-accent hover:underline dark:text-surface/70 dark:hover:text-accent"
                  href={legalLink.href}
                  onClick={handleNavigate}
                >
                  {legalLink.label}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
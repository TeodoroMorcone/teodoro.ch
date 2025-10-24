"use client";

import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import {Menu, X} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {useCallback, useEffect, useState, type ReactNode} from "react";

import {useConsent} from "@/components/consent/consent-context";
import {NavLink} from "@/components/navigation/nav-link";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";

type MobileNavItem = {
  id: string;
  href: string;
  label: string;
  targetId?: string;
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
  tertiary?: {
    label: string;
    href: string;
    helper?: string;
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

    const logViewportMetrics = (reason: string) => {
      const scrollingElement = document.scrollingElement ?? document.documentElement;
      const mainElement = document.getElementById("main-content");
      const mainRect = mainElement?.getBoundingClientRect();
      const html = document.documentElement;
      const body = document.body;

      console.log("[MobileNav] viewport metrics", {
        reason,
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        outerHeight: window.outerHeight,
        outerWidth: window.outerWidth,
        visualViewportHeight: window.visualViewport?.height ?? null,
        visualViewportWidth: window.visualViewport?.width ?? null,
        visualViewportScale: window.visualViewport?.scale ?? null,
        clientHeight: html?.clientHeight ?? null,
        clientWidth: html?.clientWidth ?? null,
        bodyClientHeight: body?.clientHeight ?? null,
        bodyScrollHeight: body?.scrollHeight ?? null,
        bodyStyleOverflow: body?.style?.overflow || null,
        bodyStylePosition: body?.style?.position || null,
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

    logViewportMetrics("initial-mount");
    const resizeHandler = () => logViewportMetrics("resize");
    const visualResizeHandler = () => logViewportMetrics("visual-viewport-resize");

    window.addEventListener("resize", resizeHandler);
    window.visualViewport?.addEventListener("resize", visualResizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      window.visualViewport?.removeEventListener("resize", visualResizeHandler);
    };
  }, []);

  const handleNavigate = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const logDrawerState = (phase: "open-change" | "after-transition") => {
      const html = document.documentElement;
      const body = document.body;
      const scrollingElement = document.scrollingElement ?? html;
      const mainElement = document.getElementById("main-content");
      const mainRect = mainElement?.getBoundingClientRect();

      console.log("[MobileNav] drawer state", {
        phase,
        open,
        bodyStyleOverflow: body?.style?.overflow || null,
        bodyDatasetScrollLock: body?.dataset?.radixScrollLock || null,
        htmlStyleOverflow: html?.style?.overflow || null,
        docScrollHeight: scrollingElement?.scrollHeight ?? null,
        docClientHeight: scrollingElement?.clientHeight ?? null,
        mainRect: mainRect
          ? {
              top: Math.round(mainRect.top),
              bottom: Math.round(mainRect.bottom),
              height: Math.round(mainRect.height),
            }
          : null,
      });
    };

    logDrawerState("open-change");

    const timeout = window.setTimeout(() => {
      logDrawerState("after-transition");
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [open]);

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
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 pr-14 text-left sm:pr-0"
          aria-label={labels.home}
        >
          <span className="inline-flex items-center justify-center rounded-full bg-primary px-3 py-1 shadow-sidebar transition-colors duration-200 ease-soft-sine dark:bg-primary">
            <Image
              src="/images/white_160x48.webp"
              alt="Teodoro Morcone"
              width={160}
              height={48}
              priority
              className="h-6 w-auto"
              sizes="80px"
            />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-surface/80">
            Nachhilfe
          </span>
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
              className="absolute right-6 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-secondary/40 text-primary transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:border-accent hover:text-accent dark:border-surface/30 dark:text-surface sm:static sm:flex-shrink-0 sm:self-auto sm:justify-center"
              aria-label={open ? labels.close : labels.open}
            >
              <Menu aria-hidden="true" className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent className="flex h-full max-h-screen w-full max-w-xs flex-col overflow-hidden p-0">
              <div className="flex items-center justify-between border-b border-secondary/20 px-5 py-4 dark:border-surface/20">
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

              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pt-6 pb-4">
                  <Link
                    href={`/${locale}`}
                    className="inline-flex items-center gap-3 text-left"
                    aria-label={labels.home}
                    onClick={handleNavigate}
                  >
                    <span className="inline-flex items-center justify-center rounded-full bg-primary px-3 py-1 shadow-sidebar transition-colors duration-200 ease-soft-sine dark:bg-primary">
                      <Image
                        src="/images/white_160x48.webp"
                        alt="Teodoro Morcone"
                        width={160}
                        height={48}
                        className="h-6 w-auto"
                        sizes="80px"
                      />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.4em] text-secondary dark:text-surface/80">
                      Nachhilfe
                    </span>
                  </Link>

                  <nav aria-label={labels.navigation}>
                    <ul className="flex flex-col gap-1">
                      {navItems.map((item) => (
                        <NavLink
                          key={item.id}
                          href={item.href}
                          label={item.label}
                          {...(item.targetId ? {targetId: item.targetId} : {})}
                          onNavigate={handleNavigate}
                        />
                      ))}
                    </ul>
                  </nav>

                  <div className="flex flex-col items-center gap-4">
                    <a
                      className="inline-flex w-full items-center justify-center rounded-3xl border border-accent/60 bg-surface px-4 py-3 text-[0.79rem] font-semibold text-primary shadow-sidebar transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:bg-primary hover:text-surface dark:border-surface/40 dark:bg-surface dark:text-primary dark:hover:bg-accent/40 dark:hover:text-primary"
                      href={ctas.primary.href}
                      onClick={handleNavigate}
                    >
                      {ctas.primary.label}
                    </a>
                    <a
                      className="inline-flex w-full items-center justify-center rounded-full border border-secondary/30 px-4 py-3 text-sm font-semibold text-primary transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:border-accent hover:text-accent dark:border-surface/30 dark:text-surface"
                      href={ctas.secondary.href}
                      onClick={handleNavigate}
                    >
                      {ctas.secondary.label}
                    </a>
                    {ctas.tertiary ? (
                      <div className="flex w-full flex-col items-center space-y-2">
                        <a
                          className="inline-flex w-full items-center justify-center rounded-3xl border border-accent/60 bg-surface px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sidebar transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:bg-primary hover:text-surface dark:border-surface/40 dark:bg-surface dark:text-primary dark:hover:bg-accent/40 dark:hover:text-primary"
                          href={ctas.tertiary.href}
                          onClick={handleNavigate}
                        >
                          {ctas.tertiary.label}
                        </a>
                        {ctas.tertiary.helper ? (
                          <p className="text-center text-xs text-secondary dark:text-surface/70">{ctas.tertiary.helper}</p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col gap-3 border-t border-secondary/20 px-5 py-4 text-sm dark:border-surface/20">
                  {languageControl}
                  {themeControl}
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-full border border-secondary/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:border-accent hover:text-accent dark:border-surface/20 dark:text-surface/80 dark:hover:border-accent dark:hover:text-accent"
                    onClick={() => {
                      consent.openPreferences();
                      setOpen(false);
                    }}
                  >
                    {labels.cookies}
                  </button>
                  <Link
                    className="inline-flex w-full items-center justify-center rounded-full border border-secondary/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:border-accent hover:text-accent dark:border-surface/20 dark:text-surface/80 dark:hover:border-accent dark:hover:text-accent"
                    href={privacyLink.href}
                    onClick={handleNavigate}
                  >
                    {privacyLink.label}
                  </Link>
                </div>
              </div>

            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
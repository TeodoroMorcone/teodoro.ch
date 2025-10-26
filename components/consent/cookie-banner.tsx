"use client";

import Link from "next/link";
import {useLocale, useTranslations} from "next-intl";
import {useMemo} from "react";

import {useConsent} from "@/components/consent/consent-context";
import type {CookieBannerStrings} from "@/types/consent";

export function CookieBanner() {
  const consent = useConsent();
  const locale = useLocale();
  const t = useTranslations("cookie");

  const strings = useMemo<CookieBannerStrings>(() => {
    const banner = t.raw("banner") as CookieBannerStrings["banner"];
    const preferences = t.raw("preferences") as CookieBannerStrings["preferences"];
    const notifications = t.raw("notifications") as CookieBannerStrings["notifications"];
    const links = t.raw("links") as CookieBannerStrings["links"];
    return {banner, preferences, notifications, links};
  }, [t]);

  const privacyHref = `/${locale}/legal/privacy`;

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only" role="status">
        {consent.announcement ?? ""}
      </div>
      {consent.isReady && consent.isBannerVisible ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-banner-heading"
          aria-describedby="cookie-banner-description"
          className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-3xl rounded-3xl border border-secondary/30 bg-white px-6 py-6 text-primary shadow-sidebar transition-colors duration-200 ease-soft-sine dark:border-surface/30 dark:bg-white dark:text-primary sm:bottom-6 sm:px-7 sm:py-7 lg:inset-x-0 lg:bottom-0 lg:mx-0 lg:max-w-none lg:rounded-none lg:border-x-0 lg:border-b-0 lg:border-t lg:border-secondary/20 lg:bg-white lg:px-12 lg:py-5 lg:text-primary lg:shadow-none dark:lg:border-surface/30 dark:lg:bg-white dark:lg:text-primary"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between lg:items-center lg:gap-8">
            <div className="space-y-3 lg:max-w-3xl">
              <h2 id="cookie-banner-heading" className="text-lg font-semibold">
                {strings.banner.title}
              </h2>
              <p id="cookie-banner-description" className="text-sm text-secondary lg:text-secondary dark:text-secondary">
                {strings.banner.body}{" "}
                <Link
                  href={privacyHref}
                  className="font-medium text-primary underline-offset-4 hover:text-accent hover:underline dark:text-primary"
                >
                  {strings.links.privacy}
                </Link>
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center lg:gap-4">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-secondary/30 px-4 py-2 text-sm font-semibold text-primary transition-colors duration-200 ease-soft-sine hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-surface/30 dark:text-primary dark:hover:border-accent dark:hover:text-accent"
                onClick={() => {
                  consent.rejectAll();
                  consent.announce(strings.notifications.saved);
                }}
              >
                {strings.banner.reject}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 ease-soft-sine hover:border-accent hover:bg-accent hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-primary dark:bg-primary dark:text-white dark:hover:border-accent dark:hover:bg-accent dark:hover:text-primary"
                onClick={() => {
                  consent.acceptAll();
                  consent.announce(strings.notifications.saved);
                }}
              >
                {strings.banner.accept}
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 lg:mt-0 lg:flex-1 lg:justify-end">
            <button
              type="button"
              className="text-sm font-medium text-primary underline-offset-4 hover:text-accent hover:underline dark:text-primary"
              onClick={() => {
                consent.openPreferences();
                consent.announce(null);
              }}
            >
              {strings.banner.manage}
            </button>
            <span className="text-xs text-secondary dark:text-secondary/80">
              {strings.preferences.description}
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
}
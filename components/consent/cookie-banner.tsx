"use client";

import {FocusScope} from "@radix-ui/react-focus-scope";
import Link from "next/link";
import {useLocale, useTranslations} from "next-intl";
import {useEffect, useMemo, useState} from "react";

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

  const [analyticsEnabled, setAnalyticsEnabled] = useState(consent.consent.analytics);
  const [marketingEnabled, setMarketingEnabled] = useState(consent.consent.marketing);

  useEffect(() => {
    if (consent.isBannerOpen) {
      setAnalyticsEnabled(consent.consent.analytics);
      setMarketingEnabled(consent.consent.marketing);
    }
  }, [consent.consent.analytics, consent.consent.marketing, consent.isBannerOpen]);

  const privacyHref = `/${locale}/legal/privacy`;

  const handleSave = () => {
    if (analyticsEnabled !== consent.consent.analytics) {
      consent.updateCategory("analytics", analyticsEnabled);
    }

    if (marketingEnabled !== consent.consent.marketing) {
      consent.updateCategory("marketing", marketingEnabled);
    }

    consent.savePreferences();
    consent.announce(strings.notifications.saved);
  };

  const handleAcceptAll = () => {
    setAnalyticsEnabled(true);
    setMarketingEnabled(true);
    consent.acceptAll();
    consent.announce(strings.notifications.saved);
  };

  const handleRejectAll = () => {
    setAnalyticsEnabled(false);
    setMarketingEnabled(false);
    consent.rejectAll();
    consent.announce(strings.notifications.saved);
  };

  const actionButtonClass =
    "inline-flex flex-1 items-center justify-center rounded-full border border-secondary/40 bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors duration-200 ease-soft-sine hover:border-accent hover:bg-accent/5 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-surface/30 dark:bg-white dark:text-primary";

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only" role="status">
        {consent.announcement ?? ""}
      </div>
      {consent.isReady && consent.isBannerOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-banner-heading"
          aria-describedby="cookie-banner-description"
          className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-3xl rounded-3xl border border-secondary/30 bg-white px-6 py-6 text-primary shadow-sidebar transition-colors duration-200 ease-soft-sine dark:border-surface/30 dark:bg-white dark:text-primary sm:bottom-6 sm:px-7 sm:py-7 lg:inset-x-0 lg:bottom-0 lg:mx-0 lg:max-w-none lg:rounded-none lg:border-x-0 lg:border-b-0 lg:border-t lg:border-secondary/20 lg:bg-white lg:px-12 lg:py-6 lg:text-primary lg:shadow-none dark:lg:border-surface/30 dark:lg:bg-white dark:lg:text-primary"
        >
          <FocusScope loop autoFocus trapped={!consent.isPreferencesOpen}>
            <div className="flex flex-col gap-6" data-cookie-banner>
              <div className="space-y-3">
                <h2 id="cookie-banner-heading" className="text-lg font-semibold">
                  {strings.banner.title}
                </h2>
                <p id="cookie-banner-description" className="text-sm text-secondary dark:text-secondary">
                  {strings.banner.body}{" "}
                  <Link
                    href={privacyHref}
                    className="font-medium text-primary underline-offset-4 hover:text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-primary"
                  >
                    {strings.links.privacy}
                  </Link>
                </p>
              </div>

              <fieldset className="space-y-3" aria-label={strings.preferences.title}>
                <legend className="sr-only">{strings.preferences.title}</legend>

                <div className="flex items-start justify-between gap-4 rounded-2xl border border-secondary/20 bg-surface/60 px-4 py-4 dark:border-surface/20 dark:bg-primary/60">
                  <div className="space-y-1">
                    <span
                      id="cookie-essential-label"
                      className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary dark:text-surface/70"
                    >
                      {strings.preferences.essentialTitle}
                    </span>
                    <p
                      id="cookie-essential-description"
                      className="text-sm text-secondary dark:text-surface/80"
                    >
                      {strings.preferences.essentialDescription}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="cookie-essential-toggle"
                      type="checkbox"
                      checked
                      disabled
                      readOnly
                      className="h-5 w-5 rounded border-secondary/40 text-primary opacity-60 dark:border-surface/40 dark:bg-primary"
                      aria-labelledby="cookie-essential-label"
                      aria-describedby="cookie-essential-description"
                    />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-surface/70">
                      {strings.preferences.alwaysOn}
                    </span>
                  </div>
                </div>

                <label
                  htmlFor="cookie-analytics-toggle"
                  className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-secondary/20 bg-surface/50 px-4 py-4 transition-colors duration-200 hover:border-accent dark:border-surface/20 dark:bg-primary/50"
                >
                  <span className="space-y-1">
                    <span
                      id="cookie-analytics-label"
                      className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary dark:text-surface/70"
                    >
                      {strings.preferences.analyticsTitle}
                    </span>
                    <p
                      id="cookie-analytics-description"
                      className="text-sm text-secondary dark:text-surface/80"
                    >
                      {strings.preferences.analyticsDescription}
                    </p>
                  </span>
                  <input
                    id="cookie-analytics-toggle"
                    type="checkbox"
                    className="h-5 w-5 rounded border-secondary/40 text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-surface/40 dark:bg-primary dark:text-surface"
                    checked={analyticsEnabled}
                    onChange={(event) => setAnalyticsEnabled(event.target.checked)}
                    aria-labelledby="cookie-analytics-label"
                    aria-describedby="cookie-analytics-description"
                  />
                </label>

                <label
                  htmlFor="cookie-marketing-toggle"
                  className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-secondary/20 bg-surface/50 px-4 py-4 transition-colors duration-200 hover:border-accent dark:border-surface/20 dark:bg-primary/50"
                >
                  <span className="space-y-1">
                    <span
                      id="cookie-marketing-label"
                      className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary dark:text-surface/70"
                    >
                      {strings.preferences.marketingTitle}
                    </span>
                    <p
                      id="cookie-marketing-description"
                      className="text-sm text-secondary dark:text-surface/80"
                    >
                      {strings.preferences.marketingDescription}
                    </p>
                  </span>
                  <input
                    id="cookie-marketing-toggle"
                    type="checkbox"
                    className="h-5 w-5 rounded border-secondary/40 text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-surface/40 dark:bg-primary dark:text-surface"
                    checked={marketingEnabled}
                    onChange={(event) => setMarketingEnabled(event.target.checked)}
                    aria-labelledby="cookie-marketing-label"
                    aria-describedby="cookie-marketing-description"
                  />
                </label>
              </fieldset>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className={actionButtonClass}
                  data-autofocus
                  onClick={handleAcceptAll}
                  aria-label={strings.banner.accept}
                >
                  {strings.banner.accept}
                </button>
                <button
                  type="button"
                  className={actionButtonClass}
                  onClick={handleRejectAll}
                  aria-label={strings.banner.reject}
                >
                  {strings.banner.reject}
                </button>
                <button
                  type="button"
                  className={actionButtonClass}
                  onClick={handleSave}
                  aria-label={strings.preferences.save}
                >
                  {strings.preferences.save}
                </button>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="self-start text-sm font-medium text-primary underline-offset-4 hover:text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-primary"
                  onClick={() => {
                    consent.openPreferences();
                    consent.announce(null);
                  }}
                >
                  {strings.banner.manage}
                </button>
                <span className="text-xs text-secondary dark:text-surface/80">
                  {strings.preferences.description}
                </span>
              </div>
            </div>
          </FocusScope>
        </div>
      ) : null}
    </>
  );
}
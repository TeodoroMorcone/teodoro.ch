"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {X} from "lucide-react";
import Link from "next/link";
import {useLocale, useTranslations} from "next-intl";
import {useCallback, useEffect, useMemo, useState} from "react";

import {useConsent} from "@/components/consent/consent-context";
import type {CookieBannerStrings} from "@/types/consent";

const actionButtonClass =
  "inline-flex w-full items-center justify-center rounded-full border border-secondary/40 bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors duration-200 ease-soft-sine hover:border-accent hover:bg-accent/5 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-surface/30 dark:bg-white dark:text-primary sm:flex-1";

export function ConsentPreferences() {
  const consent = useConsent();
  const t = useTranslations("cookie");
  const locale = useLocale();

  const strings = useMemo<CookieBannerStrings>(() => {
    const banner = t.raw("banner") as CookieBannerStrings["banner"];
    const preferences = t.raw("preferences") as CookieBannerStrings["preferences"];
    const notifications = t.raw("notifications") as CookieBannerStrings["notifications"];
    const links = t.raw("links") as CookieBannerStrings["links"];
    return {banner, preferences, notifications, links};
  }, [t]);

  const consentValues = consent.consent;
  const [analyticsEnabled, setAnalyticsEnabled] = useState(consentValues.analytics);
  const [marketingEnabled, setMarketingEnabled] = useState(consentValues.marketing);

  useEffect(() => {
    if (consent.isPreferencesOpen) {
      setAnalyticsEnabled(consent.consent.analytics);
      setMarketingEnabled(consent.consent.marketing);
    }
  }, [consent.isPreferencesOpen, consent.consent.analytics, consent.consent.marketing]);

  const resetToggles = useCallback(() => {
    setAnalyticsEnabled(consent.consent.analytics);
    setMarketingEnabled(consent.consent.marketing);
  }, [consent.consent.analytics, consent.consent.marketing]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetToggles();
      consent.closePreferences();
    }
  };

  const savedMessage = strings.notifications.saved;

  const handleSave = () => {
    if (analyticsEnabled !== consent.consent.analytics) {
      consent.updateCategory("analytics", analyticsEnabled);
    }
    if (marketingEnabled !== consent.consent.marketing) {
      consent.updateCategory("marketing", marketingEnabled);
    }

    consent.savePreferences();
    consent.announce(savedMessage);
  };

  const handleAcceptAll = () => {
    setAnalyticsEnabled(true);
    setMarketingEnabled(true);
    consent.acceptAll();
    consent.announce(savedMessage);
  };

  const handleRejectAll = () => {
    setAnalyticsEnabled(false);
    setMarketingEnabled(false);
    consent.rejectAll();
    consent.announce(savedMessage);
  };

  const privacyHref = `/${locale}/legal/privacy`;

  return (
    <Dialog.Root open={consent.isPreferencesOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-primary/40 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          className="fixed inset-x-4 bottom-8 z-[80] mx-auto max-w-3xl rounded-3xl border border-secondary/30 bg-surface px-6 py-6 text-primary shadow-sidebar outline-none transition-[transform,opacity] duration-200 ease-soft-sine data-[state=closed]:translate-y-4 data-[state=closed]:opacity-0 data-[state=open]:translate-y-0 data-[state=open]:opacity-100 dark:border-surface/30 dark:bg-primary dark:text-surface sm:px-8 sm:py-7"
          aria-describedby="consent-preferences-description"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Dialog.Title className="text-xl font-semibold">{strings.preferences.title}</Dialog.Title>
              <Dialog.Description
                id="consent-preferences-description"
                className="text-sm text-secondary dark:text-surface/80"
              >
                {strings.preferences.description}{" "}
                <Link
                  href={privacyHref}
                  className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-surface"
                >
                  {strings.links.privacy}
                </Link>
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-secondary/40 text-primary transition-colors duration-200 ease-soft-sine hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-surface/30 dark:text-surface"
              aria-label={strings.banner.manage}
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <div className="mt-6 space-y-5" data-cookie-preferences>
            <fieldset className="space-y-4" aria-label={strings.preferences.title}>
              <legend className="sr-only">{strings.preferences.title}</legend>

              <div className="flex items-start justify-between gap-4 rounded-2xl border border-secondary/20 bg-surface/60 px-4 py-4 dark:border-surface/20 dark:bg-primary/60">
                <div className="space-y-1">
                  <span
                    id="preferences-essential-label"
                    className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary dark:text-surface/70"
                  >
                    {strings.preferences.essentialTitle}
                  </span>
                  <p
                    id="preferences-essential-description"
                    className="text-sm text-secondary dark:text-surface/80"
                  >
                    {strings.preferences.essentialDescription}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="preferences-essential-toggle"
                    type="checkbox"
                    checked
                    disabled
                    readOnly
                    className="h-5 w-5 rounded border-secondary/40 text-primary opacity-60 dark:border-surface/40 dark:bg-primary"
                    aria-labelledby="preferences-essential-label"
                    aria-describedby="preferences-essential-description"
                  />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-surface/70">
                    {strings.preferences.alwaysOn}
                  </span>
                </div>
              </div>

              <label
                htmlFor="preferences-analytics-toggle"
                className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-secondary/20 bg-surface/50 px-4 py-4 transition-colors duration-200 hover:border-accent dark:border-surface/20 dark:bg-primary/50"
              >
                <span className="space-y-1">
                  <span
                    id="preferences-analytics-label"
                    className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary dark:text-surface/70"
                  >
                    {strings.preferences.analyticsTitle}
                  </span>
                  <p
                    id="preferences-analytics-description"
                    className="text-sm text-secondary dark:text-surface/80"
                  >
                    {strings.preferences.analyticsDescription}
                  </p>
                </span>
                <input
                  id="preferences-analytics-toggle"
                  type="checkbox"
                  className="h-5 w-5 rounded border-secondary/40 text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-surface/40 dark:bg-primary dark:text-surface"
                  checked={analyticsEnabled}
                  onChange={(event) => setAnalyticsEnabled(event.target.checked)}
                  aria-labelledby="preferences-analytics-label"
                  aria-describedby="preferences-analytics-description"
                />
              </label>

              <label
                htmlFor="preferences-marketing-toggle"
                className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-secondary/20 bg-surface/50 px-4 py-4 transition-colors duration-200 hover:border-accent dark:border-surface/20 dark:bg-primary/50"
              >
                <span className="space-y-1">
                  <span
                    id="preferences-marketing-label"
                    className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary dark:text-surface/70"
                  >
                    {strings.preferences.marketingTitle}
                  </span>
                  <p
                    id="preferences-marketing-description"
                    className="text-sm text-secondary dark:text-surface/80"
                  >
                    {strings.preferences.marketingDescription}
                  </p>
                </span>
                <input
                  id="preferences-marketing-toggle"
                  type="checkbox"
                  className="h-5 w-5 rounded border-secondary/40 text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-surface/40 dark:bg-primary dark:text-surface"
                  checked={marketingEnabled}
                  onChange={(event) => setMarketingEnabled(event.target.checked)}
                  aria-labelledby="preferences-marketing-label"
                  aria-describedby="preferences-marketing-description"
                />
              </label>
            </fieldset>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className={actionButtonClass}
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
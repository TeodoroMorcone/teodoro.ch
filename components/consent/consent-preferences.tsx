"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {X} from "lucide-react";
import Link from "next/link";
import {useLocale, useTranslations} from "next-intl";
import {useEffect, useMemo, useState} from "react";

import {useConsent} from "@/components/consent/consent-context";
import type {CookieBannerStrings} from "@/types/consent";

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

  const [analyticsEnabled, setAnalyticsEnabled] = useState(consent.state.analytics);

  useEffect(() => {
    if (consent.isPreferencesOpen) {
      setAnalyticsEnabled(consent.state.analytics);
    }
  }, [consent.isPreferencesOpen, consent.state.analytics]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      consent.closePreferences();
    }
  };

  const handleCancel = () => {
    consent.closePreferences();
  };

  const handleSave = () => {
    consent.updatePreferences({
      analytics: analyticsEnabled,
      updatedAt: Date.now(),
    });
    consent.announce(strings.notifications.saved);
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
                  className="font-medium text-primary underline-offset-4 hover:underline dark:text-surface"
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

          <div className="mt-6 space-y-5">
            <fieldset className="space-y-4" aria-label={strings.preferences.title}>
              <legend className="sr-only">{strings.preferences.title}</legend>

              <div className="flex items-start justify-between gap-4 rounded-2xl border border-secondary/20 bg-surface/60 px-4 py-4 dark:border-surface/20 dark:bg-primary/60">
                <div className="space-y-1">
                  <span className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary dark:text-surface/70">
                    {strings.preferences.essentialTitle}
                  </span>
                  <p className="text-sm text-secondary dark:text-surface/80">
                    {strings.preferences.essentialDescription}
                  </p>
                </div>
                <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:bg-surface/20 dark:text-surface/70">
                  On
                </span>
              </div>

              <label className="flex items-start justify-between gap-4 rounded-2xl border border-secondary/20 bg-surface/60 px-4 py-4 transition-colors duration-200 dark:border-surface/20 dark:bg-primary/60">
                <div className="space-y-1">
                  <span className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary dark:text-surface/70">
                    {strings.preferences.analyticsTitle}
                  </span>
                  <p className="text-sm text-secondary dark:text-surface/80">
                    {strings.preferences.analyticsDescription}
                  </p>
                </div>
                <span className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-secondary/40 text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-surface/40 dark:bg-primary dark:text-surface"
                    checked={analyticsEnabled}
                    onChange={(event) => setAnalyticsEnabled(event.target.checked)}
                    aria-label={strings.preferences.analyticsTitle}
                  />
                </span>
              </label>
            </fieldset>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-secondary underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline dark:text-surface/70 dark:hover:text-accent"
              onClick={handleCancel}
            >
              {strings.preferences.cancel}
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-surface transition-colors duration-200 ease-soft-sine hover:bg-accent hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              onClick={handleSave}
            >
              {strings.preferences.save}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
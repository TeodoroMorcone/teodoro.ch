"use client";

import {FocusScope} from "@radix-ui/react-focus-scope";
import Link from "next/link";
import {useLocale, useTranslations} from "next-intl";
import {useMemo, type CSSProperties} from "react";

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

  const handleSave = () => {
    consent.savePreferences();
    consent.announce(strings.notifications.saved);
  };

  const handleAcceptAll = () => {
    consent.acceptAll();
    consent.announce(strings.notifications.saved);
  };

  const handleRejectAll = () => {
    consent.rejectAll();
    consent.announce(strings.notifications.saved);
  };

  const baseActionClass =
    "inline-flex h-10 w-full shrink-0 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto";
  const primaryActionClass = `${baseActionClass} bg-primary text-accent-foreground hover:bg-accent focus-visible:bg-accent`;
  const secondaryActionClass = `${baseActionClass} border border-secondary/35 bg-surface text-primary hover:border-accent hover:text-accent focus-visible:border-accent`;
  const tertiaryActionClass =
    "inline-flex h-10 w-full items-center justify-center text-sm font-semibold text-secondary underline-offset-4 transition-colors.duration-200 ease-soft-sine hover:text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto dark:text-surface/80 dark:hover:text-accent-foreground";

  const barStyle: CSSProperties = {
    paddingTop: "0.75rem",
    paddingBottom: "calc(max(env(safe-area-inset-bottom), 0px) + 0.75rem)",
  };

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only" role="status">
        {consent.announcement ?? ""}
      </div>
      {consent.isReady && consent.isBannerOpen ? (
        <div
          id="cookie-consent-banner"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-banner-heading"
          aria-describedby="cookie-banner-description"
          className="fixed inset-x-0 bottom-0 z-[60] min-h-[56px] border-t border-secondary/25 bg-surface text-secondary shadow-[0_-18px_42px_rgba(15,91,75,0.2)] transition-colors duration-300 ease-soft-sine dark:border-primary/30 dark:bg-primary/30 dark:text-surface/85 dark:shadow-[0_-16px_38px_rgba(0,133,133,0.26)]"
          style={barStyle}
        >
          <FocusScope loop autoFocus trapped={!consent.isPreferencesOpen}>
            <div
              className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:gap-4 sm:px-6"
              data-cookie-banner
            >
              <h2 id="cookie-banner-heading" className="sr-only">
                {strings.banner.title}
              </h2>
              <p
                id="cookie-banner-description"
                className="min-w-0 flex-1 text-sm text-secondary whitespace-normal sm:overflow-hidden sm:text-ellipsis sm:whitespace-nowrap dark:text-surface/85"
              >
                <span className="pr-1">{strings.banner.body}</span>
                <Link
                  href={privacyHref}
                  className="inline-flex shrink-0 items-center font-medium text-primary underline-offset-4 transition-colors duration-200 ease-soft-sine hover:text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-accent-foreground/90 dark:hover:text-accent-foreground"
                >
                  {strings.links.privacy}
                </Link>
              </p>
              <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                <button
                  type="button"
                  className={primaryActionClass}
                  data-autofocus
                  onClick={handleAcceptAll}
                  aria-label={strings.banner.accept}
                >
                  {strings.banner.accept}
                </button>
                <button
                  type="button"
                  className={secondaryActionClass}
                  onClick={handleRejectAll}
                  aria-label={strings.banner.reject}
                >
                  {strings.banner.reject}
                </button>
                <button
                  type="button"
                  className={secondaryActionClass}
                  onClick={handleSave}
                  aria-label={strings.preferences.save}
                >
                  {strings.preferences.save}
                </button>
                <button
                  type="button"
                  className={tertiaryActionClass}
                  onClick={() => {
                    consent.openPreferences();
                    consent.announce(null);
                  }}
                >
                  {strings.banner.manage}
                </button>
              </div>
            </div>
          </FocusScope>
        </div>
      ) : null}
    </>
  );
}
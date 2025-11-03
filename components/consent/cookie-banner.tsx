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
    "inline-flex h-10 w-full shrink-0 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c1c3f] sm:w-auto";
  const primaryActionClass = `${baseActionClass} bg-[#1c1c3f] text-white hover:bg-[#13132d]`;
  const secondaryActionClass = `${baseActionClass} border border-[#1c1c3f] text-[#1c1c3f] hover:bg-[#1c1c3f]/10`;
  const tertiaryActionClass =
    "inline-flex h-10 w-full items-center justify-center text-sm font-semibold text-[#1c1c3f] underline-offset-4 hover:text-[#13132d] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c1c3f] sm:w-auto";

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
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-banner-heading"
          aria-describedby="cookie-banner-description"
          className="fixed inset-x-0 bottom-0 z-[60] min-h-[56px] border-t border-[#1c1c3f]/20 bg-white text-[#1c1c3f] shadow-[0_-12px_32px_rgba(15,23,42,0.16)] backdrop-blur transition-colors duration-200 ease-soft-sine dark:border-[#1c1c3f]/20 dark:bg-white dark:text-[#1c1c3f]"
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
                className="min-w-0 flex-1 text-sm text-[#1c1c3f] whitespace-normal sm:overflow-hidden sm:text-ellipsis sm:whitespace-nowrap"
              >
                <span className="pr-1">{strings.banner.body}</span>
                <Link
                  href={privacyHref}
                  className="inline-flex shrink-0 items-center font-medium text-[#1c1c3f] underline-offset-4 hover:text-[#13132d] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c1c3f]"
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
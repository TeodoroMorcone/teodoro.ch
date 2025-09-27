"use client";

import {useConsent} from "@/components/consent/consent-context";

type CookieSettingsButtonProps = {
  label: string;
};

export function CookieSettingsButton({label}: CookieSettingsButtonProps) {
  const consent = useConsent();

  return (
    <button
      type="button"
      onClick={() => {
        consent.openPreferences();
        consent.announce(null);
      }}
      className="inline-flex items-center rounded-full border border-secondary px-5 py-3 text-sm font-semibold text-secondary transition-colors duration-200 ease-soft-sine hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {label}
    </button>
  );
}
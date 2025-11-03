"use client";

import {useEffect, useRef} from "react";

import type {Consent} from "@/lib/consent";
import {getConsent, onConsentChange} from "@/lib/consent";
import {applyAnalyticsConsent} from "@/lib/analytics/gtag";
import {getMeasurementId} from "@/config/analytics";

const MEASUREMENT_ID = getMeasurementId();

function isAnalyticsGranted(consent: Consent | null): boolean {
  return Boolean(consent?.analytics);
}

const GA4 = (): null => {
  const lastApplied = useRef<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!MEASUREMENT_ID) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[analytics] NEXT_PUBLIC_GA_MEASUREMENT_ID missing; GA4 loader inactive.");
      }
      return;
    }

    const applyConsent = (consent: Consent | null) => {
      const granted = isAnalyticsGranted(consent);
      if (lastApplied.current === granted) {
        return;
      }

      lastApplied.current = granted;
      applyAnalyticsConsent(granted);
    };

    applyConsent(getConsent());

    const unsubscribe = onConsentChange((consent) => {
      applyConsent(consent);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return null;
};

export default GA4;
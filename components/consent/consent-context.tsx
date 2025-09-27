"use client";

import {createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode} from "react";

import {DEFAULT_CONSENT, GRANTED_CONSENT, getMeasurementId} from "@/config/analytics";
import {isGaReady, loadGaScript, setGaReady} from "@/lib/analytics/gtag";

type ConsentState = {
  analytics: boolean;
  updatedAt: number | null;
};

type ConsentContextValue = {
  state: ConsentState;
  isReady: boolean;
  isBannerVisible: boolean;
  isPreferencesOpen: boolean;
  announcement: string | null;
  acceptAll: () => void;
  rejectAll: () => void;
  openBanner: () => void;
  openPreferences: () => void;
  closePreferences: () => void;
  updatePreferences: (next: ConsentState) => void;
  announce: (message: string | null) => void;
};

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

const CONSENT_STORAGE_KEY = "theodors.consents.v1";

const defaultState: ConsentState = {
  analytics: false,
  updatedAt: null,
};

type ConsentProviderProps = {
  children: ReactNode;
};

function pushConsentUpdate(consent: Record<string, "granted" | "denied">) {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", consent);
  }
}

export function ConsentProvider({children}: ConsentProviderProps) {
  const [state, setState] = useState<ConsentState>(defaultState);
  const [isReady, setIsReady] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const hasMeasurementId = Boolean(getMeasurementId());

  const syncAnalyticsConsent = useCallback(
    (analyticsEnabled: boolean) => {
      if (!hasMeasurementId) {
        return;
      }

      if (analyticsEnabled) {
        try {
          loadGaScript();
          pushConsentUpdate(GRANTED_CONSENT);
        } catch (error) {
          console.warn("[ConsentProvider] Unable to load GA script", error);
        }
      } else {
        if (isGaReady()) {
          setGaReady(false);
        }
        pushConsentUpdate(DEFAULT_CONSENT);
      }
    },
    [hasMeasurementId],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<ConsentState>;
        const restored: ConsentState = {
          analytics: Boolean(parsed.analytics),
          updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : null,
        };
        setState(restored);
        setIsBannerVisible(false);
      } else {
        setState(defaultState);
        setIsBannerVisible(true);
      }
    } catch (error) {
      console.warn("[ConsentProvider] Failed to parse stored consent state", error);
      setState(defaultState);
      setIsBannerVisible(true);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady || typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("[ConsentProvider] Failed to persist consent state", error);
    }
  }, [isReady, state]);

  const openBanner = useCallback(() => {
    setIsBannerVisible(true);
  }, []);

  const acceptAll = useCallback(() => {
    const next: ConsentState = {
      analytics: true,
      updatedAt: Date.now(),
    };
    setState(next);
    setIsBannerVisible(false);
    syncAnalyticsConsent(true);
  }, [syncAnalyticsConsent]);

  const rejectAll = useCallback(() => {
    const next: ConsentState = {
      analytics: false,
      updatedAt: Date.now(),
    };
    setState(next);
    setIsBannerVisible(false);
    syncAnalyticsConsent(false);
  }, [syncAnalyticsConsent]);

  const openPreferences = useCallback(() => {
    setIsPreferencesOpen(true);
    setAnnouncement(null);
  }, []);

  const closePreferences = useCallback(() => {
    setIsPreferencesOpen(false);
  }, []);

  const updatePreferences = useCallback((next: ConsentState) => {
    setState({
      analytics: next.analytics,
      updatedAt: Date.now(),
    });
    setIsBannerVisible(false);
    setIsPreferencesOpen(false);
    syncAnalyticsConsent(next.analytics);
  }, [syncAnalyticsConsent]);

  const announce = useCallback((message: string | null) => {
    setAnnouncement(message);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      state,
      isReady,
      isBannerVisible,
      isPreferencesOpen,
      announcement,
      acceptAll,
      rejectAll,
      openBanner,
      openPreferences,
      closePreferences,
      updatePreferences,
      announce,
    }),
    [
      state,
      isReady,
      isBannerVisible,
      isPreferencesOpen,
      announcement,
      acceptAll,
      rejectAll,
      openBanner,
      openPreferences,
      closePreferences,
      updatePreferences,
      announce,
    ],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
}
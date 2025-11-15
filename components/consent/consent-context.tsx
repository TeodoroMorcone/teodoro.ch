"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  createDefaultConsent,
  getConsent,
  migrateLegacyConsent,
  onConsentChange,
  setConsent,
  type Consent,
} from "@/lib/consent";
import type {ConsentState} from "@/types/consent";

type UpdatableCategory = "analytics" | "marketing";

type ConsentContextValue = {
  consent: ConsentState;
  isReady: boolean;
  isBannerOpen: boolean;
  isPreferencesOpen: boolean;
  announcement: string | null;
  updateCategory: (category: UpdatableCategory, value: boolean) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: () => void;
  openBanner: () => void;
  openPreferences: () => void;
  closePreferences: () => void;
  announce: (message: string | null) => void;
};

type ConsentProviderProps = {
  children: ReactNode;
};

type NormalizableConsent =
  | Consent
  | ConsentState
  | ReturnType<typeof createDefaultConsent>
  | null
  | undefined;

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

const normalizeConsent = (consent: NormalizableConsent): ConsentState => {
  return {
    essential: true,
    analytics: Boolean(consent?.analytics),
    marketing: Boolean(consent?.marketing),
  };
};

const createInitialConsentState = () => normalizeConsent(createDefaultConsent());

const isBrowser = () => typeof window !== "undefined";

export function ConsentProvider({children}: ConsentProviderProps) {
  const [consent, setConsentState] = useState<ConsentState>(createInitialConsentState);
  const [isReady, setIsReady] = useState(false);
  const [isBannerOpen, setIsBannerOpen] = useState(true);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const isLocalUpdate = useRef(false);

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    migrateLegacyConsent();

    const stored = getConsent();
    if (stored) {
      setConsentState(normalizeConsent(stored));
      setIsBannerOpen(false);
    } else {
      setIsBannerOpen(true);
    }

    const unsubscribe = onConsentChange((next) => {
      if (isLocalUpdate.current) {
        return;
      }
      setConsentState(normalizeConsent(next));
    });

    setIsReady(true);

    return unsubscribe;
  }, []);

  const persistConsent = useCallback((next: ConsentState) => {
    setConsentState(next);

    if (!isBrowser()) {
      return;
    }

    isLocalUpdate.current = true;
    try {
      setConsent({
        essential: true,
        analytics: next.analytics,
        marketing: next.marketing,
      });
    } finally {
      isLocalUpdate.current = false;
    }
  }, []);

  const updateCategory = useCallback(
    (category: UpdatableCategory, value: boolean) => {
      if (consent[category] === value) {
        return;
      }

      const next: ConsentState =
        category === "analytics"
          ? {
              ...consent,
              analytics: value,
            }
          : {
              ...consent,
              marketing: value,
            };

      persistConsent(next);
    },
    [consent, persistConsent],
  );

  const acceptAll = useCallback(() => {
    const next: ConsentState = {
      essential: true,
      analytics: true,
      marketing: true,
    };
  
    persistConsent(next);
    setIsBannerOpen(false);
    setIsPreferencesOpen(false);
  }, [persistConsent]);

  const rejectAll = useCallback(() => {
    const next: ConsentState = {
      essential: true,
      analytics: false,
      marketing: false,
    };
  
    persistConsent(next);
    setIsBannerOpen(false);
    setIsPreferencesOpen(false);
  }, [persistConsent]);

  const savePreferences = useCallback(() => {
    setIsBannerOpen(false);
    setIsPreferencesOpen(false);
  }, []);

  const openBanner = useCallback(() => {
    setIsBannerOpen(true);
  }, []);

  const openPreferences = useCallback(() => {
    setIsPreferencesOpen(true);
    setAnnouncement(null);
  }, []);

  const closePreferences = useCallback(() => {
    setIsPreferencesOpen(false);
  }, []);

  const announce = useCallback((message: string | null) => {
    setAnnouncement(message);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      isReady,
      isBannerOpen,
      isPreferencesOpen,
      announcement,
      updateCategory,
      acceptAll,
      rejectAll,
      savePreferences,
      openBanner,
      openPreferences,
      closePreferences,
      announce,
    }),
    [
      consent,
      isReady,
      isBannerOpen,
      isPreferencesOpen,
      announcement,
      updateCategory,
      acceptAll,
      rejectAll,
      savePreferences,
      openBanner,
      openPreferences,
      closePreferences,
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
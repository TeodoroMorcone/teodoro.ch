export type Consent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  ts: number;
};

const KEY = "consent.v1";
const LEGACY_KEY = "theodors.consents.v1";

const listeners = new Set<(consent: Consent) => void>();

const isBrowser = () => typeof window !== "undefined";

const hasDocument = () => typeof document !== "undefined";

export const createDefaultConsent = (): Omit<Consent, "ts"> => ({
  essential: true,
  analytics: false,
  marketing: false,
});

export const getConsent = (): Consent | null => {
  if (!isBrowser()) return null;
  try {
    const stored = window.localStorage.getItem(KEY);
    return stored ? (JSON.parse(stored) as Consent) : null;
  } catch {
    return null;
  }
};

export const onConsentChange = (cb: (consent: Consent) => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

const notifyListeners = (value: Consent) => {
  listeners.forEach((listener) => {
    try {
      listener(value);
    } catch (error) {
      console.warn("[consent] listener threw", error);
    }
  });
};

export const setConsent = (consent: Omit<Consent, "ts">): Consent | null => {
  if (!isBrowser()) return null;

  const value: Consent = {
    ...consent,
    ts: Date.now(),
  };

  try {
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch (error) {
    console.warn("[consent] Failed to persist consent", error);
  }

  if (hasDocument()) {
    try {
      document.cookie = [
        "consent_state=",
        encodeURIComponent(JSON.stringify({a: consent.analytics, m: consent.marketing})),
        "; Path=/",
        `; Max-Age=${60 * 60 * 24 * 365}`,
        "; SameSite=Lax",
      ].join("");
    } catch (error) {
      console.warn("[consent] Failed to persist consent cookie", error);
    }
  }

  notifyListeners(value);
  return value;
};

export const migrateLegacyConsent = () => {
  if (!isBrowser()) return;

  try {
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (!legacy) return;

    const parsed = JSON.parse(legacy) as {analytics?: boolean} | null;
    const analytics = Boolean(parsed?.analytics);

    setConsent({
      essential: true,
      analytics,
      marketing: false,
    });

    window.localStorage.removeItem(LEGACY_KEY);
  } catch (error) {
    console.warn("[consent] Failed to migrate legacy consent", error);
  }
};

export const ensureConsent = (): Consent => {
  const existing = getConsent();
  if (existing) return existing;

  const defaults = createDefaultConsent();
  return (
    setConsent(defaults) ?? {
      ...defaults,
      ts: Date.now(),
    }
  );
};
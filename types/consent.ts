export type ConsentCategory = "necessary" | "analytics" | "marketing";

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
};

export type ConsentInput = Omit<ConsentState, "timestamp" | "version">;

export type CookieBannerStrings = {
  banner: {
    title: string;
    body: string;
    accept: string;
    reject: string;
    save: string;
    manage: string;
  };
  preferences: {
    title: string;
    description: string;
    essentialTitle: string;
    essentialDescription: string;
    analyticsTitle: string;
    analyticsDescription: string;
    marketingTitle: string;
    marketingDescription: string;
    alwaysOn: string;
    save: string;
    cancel: string;
  };
  notifications: {
    saved: string;
  };
  links: {
    privacy: string;
  };
};

export type {Consent} from "@/lib/consent";
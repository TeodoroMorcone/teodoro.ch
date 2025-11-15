export type ConsentCategory = "essential" | "analytics" | "marketing";

export type ConsentState = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentInput = ConsentState;

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
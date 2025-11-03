export type CookieTechnology = {
  key: string;
  name: string;
  provider: string;
  purpose: string;
  lifetime: string;
};

export type CookieCategory = "essential" | "analytics" | "marketing";

export const COOKIE_TECHNOLOGIES: Record<CookieCategory, CookieTechnology[]> = {
  essential: [
    {
      key: "consent_state",
      name: "consent_state",
      provider: "Teodoro Morcone Nachhilfe",
      purpose: "Stores your cookie consent decisions so the site can honour them on future visits.",
      lifetime: "12 months",
    },
  ],
  analytics: [
    {
      key: "_ga",
      name: "_ga",
      provider: "Google Ireland Limited",
      purpose: "Generates anonymised statistics about how visitors use the site to improve content and performance.",
      lifetime: "14 months",
    },
    {
      key: "_ga_*",
      name: "_ga_*",
      provider: "Google Ireland Limited",
      purpose: "Maintains anonymised session state for Google Analytics 4 to measure engagement after consent.",
      lifetime: "14 months",
    },
  ],
  marketing: [
    {
      key: "_fbp",
      name: "_fbp",
      provider: "Meta Platforms Ireland Ltd.",
      purpose: "Measures marketing performance on Meta services and attributes visits after advertising campaigns.",
      lifetime: "3 months",
    },
  ],
};
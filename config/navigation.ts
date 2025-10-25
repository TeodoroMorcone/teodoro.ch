import type {Locale} from "@/lib/i18n/locales";

export type NavKey =
  | "tldr"
  | "services"
  | "howItWorks"
  | "results"
  | "about"
  | "pricing"
  | "faq"
  | "howTo"
  | "comparison"
  | "glossary"
  | "contact"
  | "impressum"
  | "terms"
  | "privacy";

export type SectionNavKey = NavKey;

export type SectionLink = {
  id: SectionNavKey;
  navKey: SectionNavKey;
  targetId: string;
  href: `#${string}`;
};

export type LegalLink = {
  id: "legal";
  navKey: "legal";
  href(locale: Locale): string;
};

export const SECTION_LINKS: SectionLink[] = [
  {id: "results", navKey: "results", targetId: "results", href: "#results"},
  {id: "tldr", navKey: "tldr", targetId: "tldr", href: "#tldr"},
  {id: "services", navKey: "services", targetId: "services", href: "#services"},
  {id: "howItWorks", navKey: "howItWorks", targetId: "how-it-works", href: "#how-it-works"},
  {id: "about", navKey: "about", targetId: "about", href: "#about"},
  {id: "pricing", navKey: "pricing", targetId: "pricing", href: "#pricing"},
  {id: "faq", navKey: "faq", targetId: "faq", href: "#faq"},
  {id: "howTo", navKey: "howTo", targetId: "how-to", href: "#how-to"},
  {id: "comparison", navKey: "comparison", targetId: "comparison", href: "#comparison"},
  {id: "glossary", navKey: "glossary", targetId: "glossary", href: "#glossary"},
  {id: "contact", navKey: "contact", targetId: "contact", href: "#contact"},
  {id: "impressum", navKey: "impressum", targetId: "impressum", href: "#impressum"},
  {id: "terms", navKey: "terms", targetId: "terms", href: "#terms"},
  {id: "privacy", navKey: "privacy", targetId: "privacy", href: "#privacy"},
];

export const LEGAL_LINK: LegalLink = {
  id: "legal",
  navKey: "legal",
  href(locale) {
    return `/${locale}/legal/impressum`;
  },
};
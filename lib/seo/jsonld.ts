import type {Locale} from "@/lib/i18n/locales";
import {SITE_URL} from "@/lib/seo/meta";
import type {
  FAQContent,
  HowToContent,
  LandingContent,
  PricingContent,
  PricingPlan,
  TLDRContent,
} from "@/types/landing";

type JsonLd = Record<string, unknown>;

const PROFESSIONAL_SERVICE_ID = `${SITE_URL}/#professional-service`;
const PERSON_ID = `${SITE_URL}/#person-teodoro`;
const SERVICE_OVERVIEW_ID = `${SITE_URL}/#service-overview`;
const DEFAULT_IMAGE_PATH = "/images/white_160x48.webp";
const DEFAULT_LOGO_PATH = "/images/64x64.webp";
const HOW_TO_ID_SUFFIX = "#how-to";
const FAQ_ID_SUFFIX = "#faq";
const SPEAKABLE_ID_SUFFIX = "#speakable";
const BREADCRUMB_ID_SUFFIX = "#breadcrumb";

const DEFAULT_ADDRESS = {
  streetAddress: "Eichbühlstrasse 33",
  addressLocality: "Zürich",
  postalCode: "8004",
  addressRegion: "ZH",
  addressCountry: "CH",
};

const AREA_SERVED = [
  {"@type": "AdministrativeArea", "name": "Zurich, Switzerland"},
  {"@type": "Country", "name": "Switzerland"},
];

const LANGUAGE_CODES = ["de-CH", "it-CH", "en-CH"];

type OfferBundle = {
  offers: JsonLd[];
  aggregateOffer: JsonLd;
  priceRange?: string;
};

type ContactSnapshot = {
  email?: string;
  telephone?: string;
};

function toAbsoluteUrl(path?: string): string | undefined {
  if (!path) {
    return undefined;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

function extractPriceNumber(value: string): number | undefined {
  const normalized = value.replace(/[^\d.,]/g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function formatPriceRange(numbers: number[]): string | undefined {
  if (numbers.length === 0) {
    return undefined;
  }

  const min = Math.min(...numbers);
  const max = Math.max(...numbers);

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return undefined;
  }

  if (min === max) {
    return `CHF ${min.toFixed(0)}`;
  }

  return `CHF ${min.toFixed(0)}–${max.toFixed(0)}`;
}

function sanitizeTelephone(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const normalized = trimmed.replace(/[\s().-]/g, "");
  if (!normalized.startsWith("+") && /^\d+$/.test(normalized)) {
    return `+${normalized}`;
  }

  if (normalized.startsWith("+")) {
    return normalized;
  }

  return undefined;
}

function findImpressumValueByType(
  content: LandingContent["impressum"],
  type: "email" | "tel" | "url",
): string | undefined {
  return content.entries.find((entry) => entry.type === type)?.value;
}

function findContactDetailByLabel(
  details: LandingContent["contact"]["details"],
  tokens: string[],
): string | undefined {
  const lowerTokens = tokens.map((token) => token.toLowerCase());
  const match = details.find((detail) =>
    lowerTokens.some((token) => detail.label.toLowerCase().includes(token)),
  );

  return match?.value;
}

function extractContactSnapshot(content: LandingContent): ContactSnapshot {
  const email =
    findImpressumValueByType(content.impressum, "email") ??
    findContactDetailByLabel(content.contact.details, ["mail"]);

  const telephoneRaw =
    findImpressumValueByType(content.impressum, "tel") ??
    findContactDetailByLabel(content.contact.details, ["phone", "telefon", "whatsapp", "tel"]);

  const telephone = sanitizeTelephone(telephoneRaw);

  const snapshot: ContactSnapshot = {};
  if (email) {
    snapshot.email = email;
  }
  if (telephone) {
    snapshot.telephone = telephone;
  }

  return snapshot;
}

function buildOfferBundle(locale: Locale, pricing: PricingContent): OfferBundle {
  const offers: JsonLd[] = pricing.plans.map((plan: PricingPlan) => {
    const priceNumber = extractPriceNumber(plan.price);

    const offer: JsonLd = {
      "@type": "Offer",
      name: plan.name,
      priceCurrency: "CHF",
      url: `${SITE_URL}/${locale}#pricing-${plan.id}`,
      availability: "https://schema.org/InStock",
      description: plan.features.join("; "),
    };

    if (Number.isFinite(priceNumber)) {
      offer.price = priceNumber!.toFixed(2);
    }

    if (plan.badge) {
      offer.category = plan.badge;
    }

    return offer;
  });

  const priceNumbers = offers
    .map((offer) => (typeof offer.price === "string" ? Number.parseFloat(offer.price) : undefined))
    .filter((value): value is number => Number.isFinite(value));

  const aggregateOffer: JsonLd = {
    "@type": "AggregateOffer",
    priceCurrency: "CHF",
    offerCount: offers.length,
    offers,
    availability: "https://schema.org/InStock",
  };

  if (priceNumbers.length > 0) {
    aggregateOffer.lowPrice = Math.min(...priceNumbers).toFixed(2);
    aggregateOffer.highPrice = Math.max(...priceNumbers).toFixed(2);
  }

  const priceRange = formatPriceRange(priceNumbers);

  const bundle: OfferBundle = {
    offers,
    aggregateOffer,
  };

  if (priceRange) {
    bundle.priceRange = priceRange;
  }

  return bundle;
}

function buildProfessionalServiceJsonLd(
  locale: Locale,
  content: LandingContent,
  offerBundle: OfferBundle,
  contact: ContactSnapshot,
): JsonLd {
  const heroImage = content.hero.illustration?.src ?? DEFAULT_IMAGE_PATH;
  const address = {
    "@type": "PostalAddress",
    ...DEFAULT_ADDRESS,
  };

  const contactPoint =
    contact.email || contact.telephone
      ? [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            ...(contact.email ? {email: contact.email} : {}),
            ...(contact.telephone ? {telephone: contact.telephone} : {}),
            availableLanguage: ["de", "it", "en"],
            areaServed: "CH",
          },
        ]
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": PROFESSIONAL_SERVICE_ID,
    name: "Teodoro Morcone Nachhilfe",
    description: content.hero.subheading,
    url: `${SITE_URL}/${locale}`,
    image: toAbsoluteUrl(heroImage),
    logo: toAbsoluteUrl(DEFAULT_LOGO_PATH),
    areaServed: AREA_SERVED,
    serviceType: content.sections.services.items.map((item) => item.name),
    inLanguage: locale,
    offers: offerBundle.aggregateOffer,
    ...(offerBundle.priceRange ? {priceRange: offerBundle.priceRange} : {}),
    address,
    ...(contact.email ? {email: contact.email} : {}),
    ...(contact.telephone ? {telephone: contact.telephone} : {}),
    ...(contactPoint ? {contactPoint} : {}),
    sameAs: [SITE_URL],
    knowsLanguage: LANGUAGE_CODES,
  };
}

function buildPersonJsonLd(locale: Locale, contact: ContactSnapshot): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Teodoro Morcone",
    jobTitle: "Mathematik Tutor",
    worksFor: {"@id": PROFESSIONAL_SERVICE_ID},
    url: `${SITE_URL}/${locale}`,
    knowsLanguage: LANGUAGE_CODES,
    ...(contact.email ? {email: contact.email} : {}),
    ...(contact.telephone ? {telephone: contact.telephone} : {}),
  };
}

function buildServiceOverviewJsonLd(
  locale: Locale,
  content: LandingContent,
  offerBundle: OfferBundle,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": SERVICE_OVERVIEW_ID,
    name: content.sections.services.title,
    description: content.sections.services.description,
    provider: {"@id": PROFESSIONAL_SERVICE_ID},
    serviceType: content.sections.services.items.map((item) => item.name),
    inLanguage: locale,
    areaServed: AREA_SERVED,
    offers: offerBundle.aggregateOffer,
  };
}

function buildServiceDetailJsonLd(
  locale: Locale,
  content: LandingContent,
  offerBundle: OfferBundle,
): JsonLd[] {
  return content.sections.services.items.map((item) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/${locale}#service-${item.id}`,
    name: item.name,
    description: item.copy,
    provider: {"@id": PROFESSIONAL_SERVICE_ID},
    serviceType: item.name,
    inLanguage: locale,
    areaServed: AREA_SERVED,
    offers: offerBundle.offers,
  }));
}

export function buildFaqJsonLd(locale: Locale, faq: FAQContent): JsonLd {
  const baseId = `${SITE_URL}/${locale}${FAQ_ID_SUFFIX}`;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": baseId,
    url: `${SITE_URL}/${locale}#faq`,
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      "@id": `${baseId}-${item.id}`,
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildSpeakableJsonLd(tldr: TLDRContent, faq: FAQContent, locale: Locale): JsonLd {
  const selectors = ["#tldr", "#faq-cancellation", "#faq-response"];

  const questionLookup = Object.fromEntries(faq.items.map((item) => [item.id, item]));

  const speakableTexts = [
    tldr.items[0]?.description,
    questionLookup["faq-cancellation"]?.answer,
    questionLookup["faq-response"]?.answer,
  ].filter((value): value is string => Boolean(value));

  return {
    "@context": "https://schema.org",
    "@type": "SpeakableSpecification",
    "@id": `${SITE_URL}/${locale}${SPEAKABLE_ID_SUFFIX}`,
    cssSelector: selectors,
    ...(speakableTexts.length > 0 ? {speakableText: speakableTexts} : {}),
  };
}

export function buildHowToJsonLd(locale: Locale, howTo: HowToContent): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${SITE_URL}/${locale}${HOW_TO_ID_SUFFIX}`,
    name: howTo.title,
    description: howTo.intro,
    inLanguage: locale,
    step: howTo.steps.map((step, index) => {
      const supplies =
        step.materials.length > 0
          ? step.materials.map((material) => ({
              "@type": "HowToSupply",
              name: material,
            }))
          : undefined;

      const tools =
        step.notes.length > 0
          ? step.notes.map((note) => ({
              "@type": "HowToTool",
              name: note,
            }))
          : undefined;

      return {
        "@type": "HowToStep",
        position: index + 1,
        name: step.name,
        text: step.description,
        ...(step.duration ? {timeRequired: step.duration} : {}),
        ...(supplies ? {supply: supplies} : {}),
        ...(tools ? {tool: tools} : {}),
      };
    }),
  };
}

export function buildBreadcrumbJsonLd(locale: Locale, content: LandingContent): JsonLd {
  const pageUrl = `${SITE_URL}/${locale}`;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}${BREADCRUMB_ID_SUFFIX}`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: content.hero.heading,
        item: pageUrl,
      },
    ],
  };
}

export function buildLandingJsonLd(params: {locale: Locale; content: LandingContent}): JsonLd[] {
  const {locale, content} = params;
  const offerBundle = buildOfferBundle(locale, content.sections.pricing);
  const contact = extractContactSnapshot(content);

  const professionalService = buildProfessionalServiceJsonLd(locale, content, offerBundle, contact);
  const person = buildPersonJsonLd(locale, contact);
  const serviceOverview = buildServiceOverviewJsonLd(locale, content, offerBundle);
  const serviceDetails = buildServiceDetailJsonLd(locale, content, offerBundle);
  const faq = buildFaqJsonLd(locale, content.sections.faq);
  const howTo = buildHowToJsonLd(locale, content.sections.howTo);
  const speakable = buildSpeakableJsonLd(content.tldr, content.sections.faq, locale);
  const breadcrumb = buildBreadcrumbJsonLd(locale, content);

  return [
    professionalService,
    person,
    serviceOverview,
    ...serviceDetails,
    faq,
    howTo,
    speakable,
    breadcrumb,
  ];
}
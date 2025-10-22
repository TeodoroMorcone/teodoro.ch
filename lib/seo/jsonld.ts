import type {LandingContent} from "@/types/landing";

type JsonLd = Record<string, unknown>;

type ServiceJsonLdInput = {
  hero: LandingContent["hero"];
  services: LandingContent["sections"]["services"];
  pricing: LandingContent["sections"]["pricing"];
};

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": "https://teodoro.ch/#organization",
    "name": "Teodoro Morcone Nachhilfe",
    "url": "https://teodoro.ch",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Eichbühlstrasse 33",
      "addressLocality": "Zürich",
      "postalCode": "8004",
      "addressCountry": "CH",
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+41 76 244 02 59",
      "contactType": "customer service",
      "availableLanguage": ["de", "it", "en"],
    },
    "areaServed": [
      {"@type": "AdministrativeArea", "name": "Zürich"},
      {"@type": "AdministrativeArea", "name": "Switzerland"},
    ],
  } satisfies JsonLd;
}

export function buildServiceJsonLd(locale: string, data: ServiceJsonLdInput) {
  const inLanguage = `${locale}-CH`;
  const {hero, services, pricing} = data;

  const offers = pricing.plans.map((plan) => {
    const normalizedPrice = plan.price.replace(/[^\d.,]/g, "").replace(",", ".");
    const priceNumber = Number.parseFloat(normalizedPrice);
    const baseOffer: Record<string, unknown> = {
      "@type": "Offer",
      "name": plan.name,
      "priceCurrency": "CHF",
      "availability": "https://schema.org/InStock",
      "url": `https://teodoro.ch/${locale}#pricing-${plan.id}`,
      "description": plan.features.join("; "),
    };

    if (Number.isFinite(priceNumber)) {
      baseOffer.price = priceNumber.toFixed(2);
    }

    return baseOffer;
  });

  const priceNumbers = offers
    .map((offer) => {
      const price = offer.price;
      return typeof price === "string" ? Number.parseFloat(price) : undefined;
    })
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

  const aggregateOffer: Record<string, unknown> = {
    "@type": "AggregateOffer",
    "priceCurrency": "CHF",
    "offerCount": offers.length,
    "offers": offers,
    "availability": "https://schema.org/InStock",
  };

  if (priceNumbers.length > 0) {
    aggregateOffer.lowPrice = Math.min(...priceNumbers).toFixed(2);
    aggregateOffer.highPrice = Math.max(...priceNumbers).toFixed(2);
  }

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://teodoro.ch/${locale}#service`,
    "name": services.title,
    "description": hero.subheading,
    "provider": {"@id": "https://teodoro.ch/#organization"},
    "serviceType": services.items.map((item) => item.name),
    "offers": aggregateOffer,
    "areaServed": [
      {"@type": "AdministrativeArea", "name": "Zürich"},
      {"@type": "AdministrativeArea", "name": "Switzerland"},
    ],
    "inLanguage": inLanguage,
    "url": `https://teodoro.ch/${locale}`,
  } satisfies JsonLd;
}

export function buildFaqJsonLd(faq: LandingContent["sections"]["faq"]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  } satisfies JsonLd;
}

export function buildSpeakableJsonLd(tldr: LandingContent["tldr"]) {
  const firstItems = tldr.items.slice(0, 3).map((item) => `${item.label}: ${item.description}`);

  return {
    "@context": "https://schema.org",
    "@type": "SpeakableSpecification",
    "cssSelector": [
      "#hero-heading",
      "#tldr",
    ],
    "xpath": [],
    "speakableText": firstItems,
  } satisfies JsonLd;
}

export function buildHowToJsonLd(howTo: LandingContent["sections"]["howTo"]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": howTo.title,
    "description": howTo.intro,
    "step": howTo.steps.map((step) => ({
      "@type": "HowToStep",
      "name": step.name,
      "text": step.description,
      "timing": step.duration,
      "itemListElement": step.materials?.map((material) => ({
        "@type": "HowToItem",
        "name": material,
      })),
    })),
  } satisfies JsonLd;
}
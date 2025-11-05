import Script from "next/script";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";

import {AboutSection} from "@/components/sections/about-section";
import {ComparisonSection} from "@/components/sections/comparison-section";
import {ContactSection} from "@/components/sections/contact-section";
import {FAQSection} from "@/components/sections/faq-section";
import {GlossarySection} from "@/components/sections/glossary-section";
import {HeroSection} from "@/components/sections/hero-section";
import {HowItWorksSection} from "@/components/sections/how-it-works-section";
import {HowToSection} from "@/components/sections/how-to-section";
import {ImpressumSection} from "@/components/sections/impressum-section";
import {TermsSection} from "@/components/sections/terms-section";
import {PrivacySection} from "@/components/sections/privacy-section";
import {PricingSection} from "@/components/sections/pricing-section";
import {ResultsSection} from "@/components/sections/results-section";
import {ServicesSection} from "@/components/sections/services-section";
import {TLDRSection} from "@/components/sections/tldr-section";
import {CalendeskEmbed, DEFAULT_CALENDESK_EMBED_URL} from "@/components/ui/calendesk-embed";
import {getGoogleReviews} from "@/lib/reviews/google";
import {buildLandingJsonLd} from "@/lib/seo/jsonld";
import {buildPageMetadata} from "@/lib/seo/meta";
import {LOCALES, type Locale, isLocale} from "@/lib/i18n/locales";
import type {LandingContent} from "@/types/landing";

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({locale}));
}

type LocalePageProps = {
  params: {
    locale: string;
  };
};


export async function generateMetadata({params}: LocalePageProps): Promise<Metadata> {
  const {locale: localeParam} = params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;

  const t = await getTranslations({locale, namespace: "common.meta"});

  return buildPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
  });
}

export default async function LocaleLandingPage({params}: LocalePageProps) {
  const localeParam = params.locale;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;

  const tCommon = await getTranslations({locale, namespace: "common"});
  const tLanding = await getTranslations({locale, namespace: "landing"});

  const landingSectionsRaw = tLanding.raw("sections");
  const landingSectionsRecord =
    landingSectionsRaw && typeof landingSectionsRaw === "object" && !Array.isArray(landingSectionsRaw)
      ? (landingSectionsRaw as Record<string, unknown>)
      : undefined;

  console.log("[LocaleLandingPage] landing sections snapshot", {
    locale,
    sectionKeys: landingSectionsRecord ? Object.keys(landingSectionsRecord) : [],
    hasAgbSection: landingSectionsRecord ? "agb" in landingSectionsRecord : false,
    hasPrivacySection: landingSectionsRecord ? "privacy" in landingSectionsRecord : false,
  });

  const hero = tLanding.raw("hero") as LandingContent["hero"];
  const tldr = tLanding.raw("tldr") as LandingContent["tldr"];
  const intentClusters = tLanding.raw("intentClusters") as LandingContent["intentClusters"];
  const services = tLanding.raw("sections.services") as LandingContent["sections"]["services"];
  const howItWorks = tLanding.raw("sections.howItWorks") as LandingContent["sections"]["howItWorks"];
  const results = tLanding.raw("sections.results") as LandingContent["sections"]["results"];
  const about = tLanding.raw("sections.about") as LandingContent["sections"]["about"];
  const pricing = tLanding.raw("sections.pricing") as LandingContent["sections"]["pricing"];
  const faq = tLanding.raw("sections.faq") as LandingContent["sections"]["faq"];
  const howTo = tLanding.raw("sections.howTo") as LandingContent["sections"]["howTo"];
  const comparison = tLanding.raw("sections.comparison") as LandingContent["sections"]["comparison"];
  const glossary = tLanding.raw("sections.glossary") as LandingContent["sections"]["glossary"];
  const contactRaw = tLanding.raw("contact");
  const contact = contactRaw as LandingContent["contact"];
  const impressum = tLanding.raw("impressum") as LandingContent["impressum"];
  const terms = tLanding.raw("sections.terms") as LandingContent["sections"]["terms"];
  const privacy = tLanding.raw("sections.privacy") as LandingContent["sections"]["privacy"];
  const outboundLinks = tLanding.raw("outboundLinks") as LandingContent["outboundLinks"];

  const contactDetails = (contactRaw as {details?: unknown})?.details;
  console.log("[LocaleLandingPage] contact payload", {
    locale,
    hasContact: Boolean(contactRaw),
    detailsType: Array.isArray(contactDetails) ? "array" : typeof contactDetails,
    detailsCount: Array.isArray(contactDetails) ? contactDetails.length : undefined,
    detailsKeys: contactDetails && !Array.isArray(contactDetails) && typeof contactDetails === "object" ? Object.keys(contactDetails as Record<string, unknown>) : undefined,
  });

  const googleReviews = await getGoogleReviews(18);


  const heroCtas = {
    primary: {label: tCommon("cta.primary"), href: "#contact"},
    secondary: {label: tCommon("cta.secondary"), href: "#services"},
  };

  const bookingFrameTitle =
    hero?.bookingFrameTitle ??
    contact?.bookingFrameTitle ??
    tLanding("contact.bookingFrameTitle", {defaultMessage: "Book a lesson online"});
  const bookingAvailabilityNote =
    hero?.bookingAvailabilityNote ??
    contact?.bookingAvailabilityNote ??
    tLanding("contact.bookingAvailabilityNote", {
      defaultMessage: "Pick a convenient slot directly in the calendar widget.",
    });
  const bookingActivationLabel =
    hero?.bookingActivationLabel ??
    contact?.bookingActivationLabel ??
    tLanding("contact.bookingActivationLabel", {defaultMessage: "Load the booking calendar"});
  const bookingLoadingLabel =
    hero?.bookingLoadingLabel ??
    contact?.bookingLoadingLabel ??
    tLanding("contact.bookingLoadingLabel", {defaultMessage: "Calendesk availability is loading…"});
  const bookingEmbedUrl = contact?.bookingEmbedUrl ?? DEFAULT_CALENDESK_EMBED_URL;

  const landingContent: LandingContent = {
    hero,
    tldr,
    intentClusters,
    sections: {
      services,
      howItWorks,
      results,
      about,
      pricing,
      faq,
      howTo,
      comparison,
      glossary,
      terms,
      privacy,
    },
    contact,
    impressum,
    outboundLinks,
  };

  const jsonLdPayloads = buildLandingJsonLd({locale, content: landingContent});

  return (
    <>
      <main id="main-content" className="min-h-screen bg-surface text-primary dark:bg-primary dark:text-surface">
        <article className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 py-16 lg:px-12">
          <HeroSection hero={hero} ctas={heroCtas} />

          <ResultsSection results={results} reviews={googleReviews} />

          <div className="flex flex-col gap-4">
            <CalendeskEmbed
              title={bookingFrameTitle}
              activationLabel={bookingActivationLabel}
              loadingLabel={bookingLoadingLabel}
              src={bookingEmbedUrl}
              className="w-full"
              iframeClassName="rounded-3xl"
            />
            <p className="text-sm text-secondary dark:text-surface/70">{bookingAvailabilityNote}</p>
          </div>

          <TLDRSection tldr={tldr} intentClusters={intentClusters} />

          <ServicesSection services={services} />

          <HowItWorksSection howItWorks={howItWorks} />

          <AboutSection about={about} />

          <PricingSection pricing={pricing} />

          <FAQSection faq={faq} />

          <HowToSection howTo={howTo} />

          <ComparisonSection comparison={comparison} />

          <GlossarySection glossary={glossary} />

          <ContactSection contact={contact} />

          <ImpressumSection impressum={impressum} />

          <TermsSection terms={terms} />

          <PrivacySection privacy={privacy} />
        </article>
      </main>

      {jsonLdPayloads.map((payload, index) => (
        <Script
          key={`jsonld-${index}`}
          id={`jsonld-${index}`}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{__html: JSON.stringify(payload)}}
        />
      ))}
    </>
  );
}
import Script from "next/script";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";
import {renderToString} from "katex";

import {AboutSection} from "@/components/sections/about-section";
import {ComparisonSection} from "@/components/sections/comparison-section";
import {ContactSection} from "@/components/sections/contact-section";
import {FAQSection} from "@/components/sections/faq-section";
import {GlossarySection} from "@/components/sections/glossary-section";
import {HeroSection} from "@/components/sections/hero-section";
import {HowItWorksSection} from "@/components/sections/how-it-works-section";
import {HowToSection} from "@/components/sections/how-to-section";
import {PricingSection} from "@/components/sections/pricing-section";
import {ResultsSection} from "@/components/sections/results-section";
import {ServicesSection} from "@/components/sections/services-section";
import {TLDRSection} from "@/components/sections/tldr-section";
import {buildFaqJsonLd, buildHowToJsonLd, buildOrganizationJsonLd, buildServiceJsonLd, buildSpeakableJsonLd} from "@/lib/seo/jsonld";
import {DEFAULT_LOCALE, LOCALES, type Locale, isLocale} from "@/lib/i18n/locales";
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

  const t = await getTranslations({locale: localeParam, namespace: "common.meta"});

  const url = `https://theodors.ch/${localeParam}`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        LOCALES.map((loc) => [loc, `https://theodors.ch/${loc}`]).concat([
          ["x-default" as const, `https://theodors.ch/${DEFAULT_LOCALE}`],
        ]),
      ),
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url,
      type: "website",
      locale: `${localeParam}-CH`,
      siteName: "Teodoro Morcone Nachhilfe",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function LocaleLandingPage({params}: LocalePageProps) {
  const localeParam = params.locale;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;

  const tCommon = await getTranslations({locale, namespace: "common"});
  const tLanding = await getTranslations({locale, namespace: "landing"});

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
  const outboundLinks = tLanding.raw("outboundLinks") as LandingContent["outboundLinks"];

  const contactDetails = (contactRaw as {details?: unknown})?.details;
  console.log("[LocaleLandingPage] contact payload", {
    locale,
    hasContact: Boolean(contactRaw),
    detailsType: Array.isArray(contactDetails) ? "array" : typeof contactDetails,
    detailsCount: Array.isArray(contactDetails) ? contactDetails.length : undefined,
    detailsKeys: contactDetails && !Array.isArray(contactDetails) && typeof contactDetails === "object" ? Object.keys(contactDetails as Record<string, unknown>) : undefined,
  });

  let heroMathHtml: string | undefined;
  if (hero.mathSnippet) {
    try {
      heroMathHtml = renderToString(hero.mathSnippet, {
        throwOnError: false,
        output: "html",
        trust: false,
      });
    } catch {
      heroMathHtml = hero.mathSnippet;
    }
  }

  const heroCtas = {
    primary: {label: tCommon("cta.primary"), href: "#contact"},
    secondary: {label: tCommon("cta.secondary"), href: "#services"},
  };

  const organizationJsonLd = buildOrganizationJsonLd();
  const serviceJsonLd = buildServiceJsonLd(locale, {hero, services, pricing});
  const faqJsonLd = buildFaqJsonLd(faq);
  const speakableJsonLd = buildSpeakableJsonLd(tldr);
  const howToJsonLd = buildHowToJsonLd(howTo);

  const jsonLdPayloads = [organizationJsonLd, serviceJsonLd, faqJsonLd, speakableJsonLd, howToJsonLd];

  return (
    <>
      <main id="main-content" className="min-h-screen bg-surface text-primary dark:bg-primary dark:text-surface">
        <article className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 py-16 lg:px-12">
          <HeroSection
            hero={hero}
            ctas={heroCtas}
            zoom={{
              labels: {
                consultation: tCommon("zoom.consultation"),
                lesson: tCommon("zoom.lesson"),
                fallback: tCommon("zoom.fallback"),
                helper: tCommon("zoom.helper"),
                passcode: tCommon("zoom.passcode"),
              },
              helper: tCommon("cta.tertiaryHelper"),
            }}
            {...(heroMathHtml ? {mathHtml: heroMathHtml} : {})}
          />

          <TLDRSection tldr={tldr} intentClusters={intentClusters} />

          <ServicesSection services={services} />

          <HowItWorksSection howItWorks={howItWorks} />

          <ResultsSection results={results} outboundLinks={outboundLinks} />

          <AboutSection about={about} />

          <PricingSection pricing={pricing} />

          <FAQSection faq={faq} />

          <HowToSection howTo={howTo} />

          <ComparisonSection comparison={comparison} />

          <GlossarySection glossary={glossary} />

          <ContactSection
            contact={contact}
            zoomLabels={{
              consultation: tCommon("zoom.consultation"),
              lesson: tCommon("zoom.lesson"),
              fallback: tCommon("zoom.fallback"),
              helper: tCommon("zoom.helper"),
              passcode: tCommon("zoom.passcode"),
            }}
          />
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
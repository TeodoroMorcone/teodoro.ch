import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";

import {CookieSettingsButton} from "@/components/legal/cookie-settings-button";
import {CookieTable, type CookieTableStrings} from "@/components/legal/cookie-table";
import {COOKIE_TECHNOLOGIES} from "@/config/cookies";
import {buildPageMetadata} from "@/lib/seo/meta";
import {LOCALES, type Locale, isLocale} from "@/lib/i18n/locales";

type LegalPageProps = {
  params: {
    locale: string;
  };
};

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({locale}));
}

export async function generateMetadata({params}: LegalPageProps): Promise<Metadata> {
  const localeParam = params.locale;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const t = await getTranslations({locale, namespace: "common.meta"});

  return buildPageMetadata({
    locale,
    path: "legal/privacy",
    title: t("title"),
    description: t("description"),
    robotsIndex: false,
  });
}

export default async function PrivacyPage({params}: LegalPageProps) {
  const localeParam = params.locale;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const tPrivacy = await getTranslations({locale: localeParam, namespace: "legal.privacy"});
  const tLegal = await getTranslations({locale: localeParam, namespace: "legal"});
  const sections = tPrivacy.raw("sections") as Array<
    | {id: string; heading: string; body: string[]}
    | {id: string; heading: string; list: string[]}
  >;
  const cookieTableStrings = tPrivacy.raw("cookieTable") as CookieTableStrings;
  const cancellation = tLegal.raw("cancellation") as {title: string; body: string[]};
  const minors = tLegal.raw("minors") as {title: string; body: string[]};

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-[rgb(255_241_214_/_0.8)]">
      <header>
        <p className="text-sm !text-[rgb(255_241_214_/_0.8)]">{tPrivacy("lastUpdated")}</p>
        <h1 className="mt-2 text-3xl font-semibold !text-[rgb(255_241_214_/_0.8)]">{tPrivacy("title")}</h1>
        <p className="mt-4 !text-[rgb(255_241_214_/_0.8)]">{tPrivacy("intro")}</p>
      </header>

      <div id="privacy-main-sections" className="mt-10 space-y-8">
        {sections.map((section, sectionIndex) => {
          const sectionIdentifier =
            "id" in section && typeof section.id === "string" && section.id.length > 0
              ? section.id
              : `section-${sectionIndex}`;
          const sectionId = `privacy-${sectionIdentifier}`;

          return (
            <section id={sectionId} key={sectionId}>
              <h2 className="text-xl font-semibold !text-[rgb(255_241_214_/_0.8)]">{section.heading}</h2>
              {"body" in section ? (
                <ul className="mt-3 space-y-2 !text-[rgb(255_241_214_/_0.8)]">
                  {section.body.map((line, lineIndex) => (
                    <li key={`${sectionIdentifier}-body-${lineIndex}`}>{line}</li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-3 list-disc space-y-2 pl-5 !text-[rgb(255_241_214_/_0.8)]">
                  {section.list.map((item, itemIndex) => (
                    <li key={`${sectionIdentifier}-list-${itemIndex}`}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
        <CookieTable strings={cookieTableStrings} data={COOKIE_TECHNOLOGIES} />
      </div>

      <aside id="privacy-rights" className="mt-12 rounded-2xl border border-secondary/20 px-6 py-6 shadow-sm">
        <h2 className="text-lg font-semibold !text-[rgb(255_241_214_/_0.8)]">{tPrivacy("rights.title")}</h2>
        <p className="mt-2 !text-[rgb(255_241_214_/_0.8)]">
          <a className="!text-[rgb(255_241_214_/_0.8)] underline" href={`mailto:${tPrivacy("rights.email")}`}>
            {tPrivacy("rights.email")}
          </a>
        </p>
        <p className="!text-[rgb(255_241_214_/_0.8)]">{tPrivacy("rights.reference")}</p>
        <div id="privacy-cookie-settings" className="mt-4">
          <CookieSettingsButton label={tPrivacy("cookieLink")} />
        </div>
      </aside>

      <div id="privacy-retention" className="mt-12 space-y-12">
        <section id="privacy-retention-cancellation">
          <h2 className="text-lg font-semibold !text-[rgb(255_241_214_/_0.8)]">{cancellation.title}</h2>
          <ul className="mt-3 space-y-2 !text-[rgb(255_241_214_/_0.8)]">
            {cancellation.body.map((line, index) => (
              <li key={`cancellation-${index}`}>{line}</li>
            ))}
          </ul>
        </section>

        <section id="privacy-retention-minors">
          <h2 className="text-lg font-semibold !text-[rgb(255_241_214_/_0.8)]">{minors.title}</h2>
          <ul className="mt-3 space-y-2 !text-[rgb(255_241_214_/_0.8)]">
            {minors.body.map((line, index) => (
              <li key={`minors-${index}`}>{line}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
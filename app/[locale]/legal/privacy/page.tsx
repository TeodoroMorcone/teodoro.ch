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
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header>
        <p className="text-sm text-secondary">{tPrivacy("lastUpdated")}</p>
        <h1 className="mt-2 text-3xl font-semibold text-primary">{tPrivacy("title")}</h1>
        <p className="mt-4 text-secondary">{tPrivacy("intro")}</p>
      </header>

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-semibold text-primary">{section.heading}</h2>
            {"body" in section ? (
              <ul className="mt-3 space-y-2 text-secondary">
                {section.body.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-secondary">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <CookieTable strings={cookieTableStrings} data={COOKIE_TECHNOLOGIES} />
      </div>

      <aside className="mt-12 rounded-2xl border border-secondary/20 px-6 py-6 shadow-sm">
        <h2 className="text-lg font-semibold text-primary">{tPrivacy("rights.title")}</h2>
        <p className="mt-2 text-secondary">
          <a className="text-primary underline" href={`mailto:${tPrivacy("rights.email")}`}>
            {tPrivacy("rights.email")}
          </a>
        </p>
        <p className="text-secondary">{tPrivacy("rights.reference")}</p>
        <div className="mt-4">
          <CookieSettingsButton label={tPrivacy("cookieLink")} />
        </div>
      </aside>

      <div className="mt-12 space-y-12">
        <section>
          <h2 className="text-lg font-semibold text-primary">{cancellation.title}</h2>
          <ul className="mt-3 space-y-2 text-secondary">
            {cancellation.body.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-primary">{minors.title}</h2>
          <ul className="mt-3 space-y-2 text-secondary">
            {minors.body.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
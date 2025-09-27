import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";

import {LOCALES, isLocale} from "@/lib/i18n/locales";

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

  const t = await getTranslations({locale: localeParam, namespace: "common.meta"});

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ImpressumPage({params}: LegalPageProps) {
  const localeParam = params.locale;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const t = await getTranslations({locale: localeParam, namespace: "legal.impressum"});

  const sections = t.raw("sections") as Array<{
    heading: string;
    body: string[];
  }>;

  const toSlug = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9äöüàèéìòùáóúâêîôûçß ]/gi, "")
      .trim()
      .replace(/\s+/g, "-");

  const renderLine = (line: string) => {
    const trimmed = line.trim();

    if (trimmed.toLowerCase().startsWith("e-mail") || trimmed.toLowerCase().startsWith("email")) {
      const email = trimmed.split(":")[1]?.trim() ?? "";
      return (
        <a key={line} className="text-primary underline" href={`mailto:${email}`}>
          {line}
        </a>
      );
    }

    if (trimmed.toLowerCase().startsWith("tel")) {
      const phone = trimmed.split(":")[1]?.trim().replace(/\s+/g, "") ?? "";
      return (
        <a key={line} className="text-primary underline" href={`tel:${phone}`}>
          {line}
        </a>
      );
    }

    if (trimmed.toLowerCase().startsWith("web")) {
      const url = trimmed.split(":")[1]?.trim() ?? "";
      return (
        <a key={line} className="text-primary underline" href={`https://${url}`} rel="noreferrer noopener" target="_blank">
          {line}
        </a>
      );
    }

    return <span key={line}>{line}</span>;
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-primary">{t("title")}</h1>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.heading} id={toSlug(section.heading)}>
            <h2 className="text-xl font-semibold text-primary">{section.heading}</h2>
            <dl className="mt-3 space-y-3 text-secondary">
              {section.body.map((line) => (
                <div key={line} className="flex flex-col">
                  <span>{renderLine(line)}</span>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </main>
  );
}
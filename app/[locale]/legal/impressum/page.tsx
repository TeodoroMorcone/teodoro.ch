import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";

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
    path: "legal/impressum",
    title: t("title"),
    description: t("description"),
    robotsIndex: false,
  });
}

export default async function ImpressumPage({params}: LegalPageProps) {
  const localeParam = params.locale;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const t = await getTranslations({locale: localeParam, namespace: "legal.impressum"});

  const intro = t.has("intro") ? t("intro") : null;
  const sections = t.raw("sections") as Array<{
    heading: string;
    entries: Array<{
      label: string;
      value: string;
      type?: "email" | "tel" | "url";
    }>;
  }>;
  const notesTitle = t.has("notesTitle") ? t("notesTitle") : null;
  const notes = t.has("notes") ? (t.raw("notes") as string[]) : [];

  const toSlug = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9äöüàèéìòùáóúâêîôûçß ]/gi, "")
      .trim()
      .replace(/\s+/g, "-");

  const formatHref = (value: string, type?: "email" | "tel" | "url") => {
    if (!type) return undefined;

    if (type === "email") {
      return `mailto:${value}`;
    }

    if (type === "tel") {
      const digitsOnly = value.replace(/\s+|\(|\)|-/g, "");
      return `tel:${digitsOnly}`;
    }

    if (type === "url") {
      const normalized = value.startsWith("http") ? value : `https://${value}`;
      return normalized;
    }

    return undefined;
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-primary">{t("title")}</h1>

      {intro ? <p className="mt-4 text-base text-secondary">{intro}</p> : null}

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.heading} id={toSlug(section.heading)} className="rounded-xl border border-secondary/30 bg-surface p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary">{section.heading}</h2>
            <dl className="mt-4 space-y-4 text-secondary">
              {section.entries.map((entry) => {
                const href = formatHref(entry.value, entry.type);

                return (
                  <div key={`${section.heading}-${entry.label}`} className="grid gap-1 sm:grid-cols-[12rem_auto] sm:items-start">
                    <dt className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{entry.label}</dt>
                    <dd className="text-base font-normal text-secondary">
                      {href ? (
                        <a className="text-primary underline underline-offset-2" href={href} rel={entry.type === "url" ? "noreferrer noopener" : undefined} target={entry.type === "url" ? "_blank" : undefined}>
                          {entry.value}
                        </a>
                      ) : (
                        entry.value
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        ))}
      </div>

      {notes.length > 0 ? (
        <aside className="mt-10 rounded-lg border border-secondary/25 bg-accent-muted p-5 text-sm text-secondary">
          {notesTitle ? <h3 className="text-base font-semibold text-primary">{notesTitle}</h3> : null}
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </aside>
      ) : null}
    </main>
  );
}
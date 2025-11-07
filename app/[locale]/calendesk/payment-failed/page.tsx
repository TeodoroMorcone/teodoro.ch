import type {Metadata} from "next";
import Image from "next/image";
import {notFound} from "next/navigation";

import {buildPageMetadata} from "@/lib/seo/meta";
import {LOCALES, type Locale, isLocale} from "@/lib/i18n/locales";
import sadIllustration from "@/public/images/longhairsad.webp";

type CalendeskRedirectPageProps = {
  params: {
    locale: string;
  };
};

const LOCALE_LABELS: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  it: "Italiano",
};

const META_COPY: Record<Locale, {title: string; description: string}> = {
  de: {
    title: "Zahlung nicht bestätigt",
    description: "Die Calendesk-Zahlung wurde nicht abgeschlossen. Wähle einen neuen Termin oder kontaktiere uns für Unterstützung.",
  },
  en: {
    title: "Payment not confirmed",
    description: "The Calendesk payment was not completed. Please pick a new slot or get in touch so we can help.",
  },
  it: {
    title: "Pagamento non confermato",
    description: "Il pagamento Calendesk non è andato a buon fine. Scegli un nuovo orario o contattaci per ricevere supporto.",
  },
};

const STATEMENTS: Record<
  Locale,
  {
    headline: string;
    body: string;
    followUp: string;
  }
> = {
  de: {
    headline: "Ups! Die Zahlung ist fehlgeschlagen.",
    body: "Calendesk konnte die Zahlung nicht abschließen. Deine Buchung wurde deshalb nicht bestätigt.",
    followUp: "Wähle denselben oder einen neuen Slot im Kalender oder melde dich direkt per WhatsApp beziehungsweise E-Mail.",
  },
  en: {
    headline: "Something went wrong with the payment.",
    body: "Calendesk could not confirm the payment, so the booking did not go through.",
    followUp: "Try the same or another slot in the calendar, or reach out over WhatsApp or email and we will sort it out together.",
  },
  it: {
    headline: "Pagamento non riuscito.",
    body: "Calendesk non è riuscito a completare il pagamento, quindi la prenotazione non è stata confermata.",
    followUp: "Scegli lo stesso slot o un nuovo orario nel calendario, oppure scrivici su WhatsApp o via e-mail per trovare subito una soluzione.",
  },
};

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({locale}));
}

export async function generateMetadata({params}: CalendeskRedirectPageProps): Promise<Metadata> {
  const localeParam = params.locale;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const meta = META_COPY[locale];

  return buildPageMetadata({
    locale,
    path: "calendesk/payment-failed",
    title: meta.title,
    description: meta.description,
    imagePath: "/images/longhairsad.webp",
    imageAlt: "Teodoro reacts with disappointment because the payment was not completed.",
    robotsIndex: false,
  });
}

export default function CalendeskPaymentFailedPage({params}: CalendeskRedirectPageProps) {
  const localeParam = params.locale;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const primaryStatement = STATEMENTS[locale];
  const secondaryLocales = LOCALES.filter((code) => code !== locale);

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-surface px-6 py-24">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[32px] border border-secondary/30 bg-secondary/85 text-accent-foreground shadow-[0_45px_120px_-45px_rgba(24,32,48,0.65)] backdrop-blur-xl">
        <div className="grid gap-10 p-8 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-16 md:p-16">
          <div className="relative flex justify-center">
            <Image
              src={sadIllustration}
              alt="Teodoro reacts with disappointment because the payment was not completed."
              priority
              className="h-auto w-full max-w-xs rounded-3xl bg-surface/55 object-cover shadow-[0_30px_70px_-45px_rgba(0,133,133,0.45)] outline outline-1 outline-primary/20"
            />
          </div>

          <div className="space-y-12 text-left">
            <header className="space-y-5 text-center md:text-left">
              <span className="inline-flex items-center justify-center rounded-full border border-primary/45 bg-primary/70 px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.48em] text-accent-foreground shadow-sm shadow-primary/35">
                {LOCALE_LABELS[locale]}
              </span>
              <h1 className="text-balance text-3xl font-semibold leading-tight text-accent-foreground md:text-4xl md:leading-tight">
                {primaryStatement.headline}
              </h1>
              <p className="text-balance text-base leading-relaxed text-accent-foreground/90 md:text-lg">{primaryStatement.body}</p>
              <p className="text-balance text-base font-medium leading-relaxed text-accent-foreground/85 md:text-lg">
                {primaryStatement.followUp}
              </p>
            </header>

            <section className="space-y-6 rounded-3xl border border-secondary/25 bg-secondary/65 p-8 shadow-inner shadow-primary/20">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.42em] text-accent-foreground/90">
                Weitere Sprachen · Other languages · Altre lingue
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {secondaryLocales.map((statementLocale) => {
                  const statement = STATEMENTS[statementLocale];

                  return (
                    <article
                      key={statementLocale}
                      className="group relative overflow-hidden rounded-2xl border border-secondary/25 bg-secondary/55 p-5 text-sm leading-relaxed text-accent-foreground transition duration-300 ease-out hover:-translate-y-1 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-accent-foreground/85">
                        {LOCALE_LABELS[statementLocale]}
                      </p>
                      <p className="mt-3 font-semibold text-accent-foreground">{statement.headline}</p>
                      <p className="mt-2 leading-relaxed text-accent-foreground/90">{statement.body}</p>
                      <p className="mt-2 font-medium text-accent-foreground/85">{statement.followUp}</p>
                    </article>
                  );
                })}
              </div>
            </section>

            <footer className="space-y-4 rounded-3xl border border-secondary/25 bg-secondary/60 p-6 text-sm leading-relaxed text-center text-accent-foreground">
              <p>
                Falls du weiterhin Probleme hast, erreichst du uns direkt unter{" "}
                <a className="font-medium text-accent-foreground underline underline-offset-2 hover:text-accent-foreground/80" href="mailto:info@teodoro.ch">
                  info@teodoro.ch
                </a>{" "}
                oder per WhatsApp unter{" "}
                <a className="font-medium text-accent-foreground underline underline-offset-2 hover:text-accent-foreground/80" href="https://wa.me/41789175085">
                  +41 78 917 50 85
                </a>
                .
              </p>
              <p>
                If the issue repeats, contact us at{" "}
                <a className="font-medium text-accent-foreground underline underline-offset-2 hover:text-accent-foreground/80" href="mailto:info@teodoro.ch">
                  info@teodoro.ch
                </a>{" "}
                or WhatsApp{" "}
                <a className="font-medium text-accent-foreground underline underline-offset-2 hover:text-accent-foreground/80" href="https://wa.me/41789175085">
                  +41 78 917 50 85
                </a>
                .
              </p>
              <p>
                Se il problema persiste, scrivici su{" "}
                <a className="font-medium text-accent-foreground underline underline-offset-2 hover:text-accent-foreground/80" href="mailto:info@teodoro.ch">
                  info@teodoro.ch
                </a>{" "}
                oppure su WhatsApp{" "}
                <a className="font-medium text-accent-foreground underline underline-offset-2 hover:text-accent-foreground/80" href="https://wa.me/41789175085">
                  +41 78 917 50 85
                </a>
                .
              </p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
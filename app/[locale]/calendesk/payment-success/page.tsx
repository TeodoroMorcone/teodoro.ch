import type {Metadata} from "next";
import Image from "next/image";
import {notFound} from "next/navigation";

import {buildPageMetadata} from "@/lib/seo/meta";
import {LOCALES, type Locale, isLocale} from "@/lib/i18n/locales";
import happyIllustration from "@/public/images/teodoro_happy.webp";

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
    title: "Zahlung bestätigt – wir sehen uns im Unterricht!",
    description: "Die Calendesk-Zahlung war erfolgreich. Wir freuen uns auf die Session – check deinen Posteingang für alle Details.",
  },
  en: {
    title: "Payment confirmed – see you in class!",
    description: "The Calendesk payment succeeded. We are excited for the session – check your inbox for all details.",
  },
  it: {
    title: "Pagamento confermato – a presto a lezione!",
    description: "Il pagamento Calendesk è andato a buon fine. Controlla la tua casella di posta per tutti i dettagli.",
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
    headline: "Yes! Deine Zahlung ist eingegangen.",
    body: "Calendesk hat die Zahlung bestätigt. Dein Termin steht fest und du erhältst gleich eine Bestätigung per E-Mail.",
    followUp: "Speichere den Kalendereintrag, prüfe bitte auch deinen Spam-Ordner und sag Bescheid, wenn du Fragen hast.",
  },
  en: {
    headline: "Great news, the payment went through.",
    body: "Calendesk confirmed your payment. Your session is booked and a confirmation email is on the way.",
    followUp: "Save the calendar invite, keep an eye on spam just in case, and reach out if you need anything beforehand.",
  },
  it: {
    headline: "Fantastico, il pagamento è andato a buon fine.",
    body: "Calendesk ha confermato il pagamento. La tua lezione è prenotata e riceverai subito un’email di conferma.",
    followUp: "Salva l’appuntamento in calendario, controlla anche la posta indesiderata e scrivici se hai domande.",
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
    path: "calendesk/payment-success",
    title: meta.title,
    description: meta.description,
    imagePath: "/images/teodoro_happy.webp",
    imageAlt: "Teodoro celebrates because the payment succeeded.",
    robotsIndex: false,
  });
}

export default function CalendeskPaymentSuccessPage({params}: CalendeskRedirectPageProps) {
  const localeParam = params.locale;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const primaryStatement = STATEMENTS[locale];
  const secondaryLocales = LOCALES.filter((code) => code !== locale);

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-6 py-24">

      <div className="relative w-full max-w-5xl overflow-hidden rounded-[32px] border border-border/40 bg-card/95 shadow-[0_45px_120px_-45px_rgba(24,48,72,0.65)] backdrop-blur-xl">
        <div className="grid gap-10 p-8 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-16 md:p-16">
          <div className="relative flex justify-center">
            <Image
              src={happyIllustration}
              alt="Teodoro celebrates because the payment succeeded."
              priority
              className="h-auto w-full max-w-xs rounded-3xl bg-surface/50 object-cover shadow-[0_30px_70px_-40px_rgba(16,94,89,0.55)] outline outline-1 outline-primary/25"
            />
          </div>

          <div className="space-y-12 text-left">
            <header className="space-y-5 text-center md:text-left">
              <span className="inline-flex items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10 px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.55em] text-white">
                {LOCALE_LABELS[locale]}
              </span>
              <h1 className="text-balance text-3xl font-semibold leading-tight text-white md:text-[2.75rem] md:leading-tight">
                {primaryStatement.headline}
              </h1>
              <p className="text-balance text-base leading-relaxed text-white md:text-lg">{primaryStatement.body}</p>
              <p className="text-balance text-base font-medium leading-relaxed text-white md:text-lg">
                {primaryStatement.followUp}
              </p>
            </header>

            <section className="space-y-6 rounded-3xl border border-border/40 bg-card/90 p-8 shadow-inner shadow-emerald-500/10">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.45em] text-white">
                Weitere Sprachen · Other languages · Altre lingue
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {secondaryLocales.map((statementLocale) => {
                  const statement = STATEMENTS[statementLocale];

                  return (
                    <article
                      key={statementLocale}
                      className="group relative overflow-hidden rounded-2xl border border-border/40 bg-background/85 p-5 text-sm leading-relaxed text-white transition duration-300 ease-out hover:-translate-y-1 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-400/20"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-white">
                        {LOCALE_LABELS[statementLocale]}
                      </p>
                      <p className="mt-3 font-semibold text-white">{statement.headline}</p>
                      <p className="mt-2 leading-relaxed text-white">{statement.body}</p>
                      <p className="mt-2 font-medium text-white">{statement.followUp}</p>
                    </article>
                  );
                })}
              </div>
            </section>

            <footer className="space-y-4 rounded-3xl border border-border/40 bg-background/75 p-6 text-sm leading-relaxed text-center text-white">
              <p>
                Für Fragen vor dem Termin erreichst du uns jederzeit unter{" "}
                <a className="font-medium text-white underline underline-offset-2 hover:text-white/80" href="mailto:info@teodoro.ch">
                  info@teodoro.ch
                </a>{" "}
                oder via WhatsApp{" "}
                <a className="font-medium text-white underline underline-offset-2 hover:text-white/80" href="https://wa.me/41789175085">
                  +41 78 917 50 85
                </a>
                .
              </p>
              <p>
                Have questions before we meet? Email{" "}
                <a className="font-medium text-white underline underline-offset-2 hover:text-white/80" href="mailto:info@teodoro.ch">
                  info@teodoro.ch
                </a>{" "}
                or send a WhatsApp message to{" "}
                <a className="font-medium text-white underline underline-offset-2 hover:text-white/80" href="https://wa.me/41789175085">
                  +41 78 917 50 85
                </a>
                .
              </p>
              <p>
                Hai dubbi prima della lezione? Scrivici a{" "}
                <a className="font-medium text-white underline underline-offset-2 hover:text-white/80" href="mailto:info@teodoro.ch">
                  info@teodoro.ch
                </a>{" "}
                oppure su WhatsApp{" "}
                <a className="font-medium text-white underline underline-offset-2 hover:text-white/80" href="https://wa.me/41789175085">
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
"use client";

import {useTranslations} from "next-intl";

import {CalendlyInlineEmbed} from "@/components/ui/calendly-inline-embed";
import {SectionHeading} from "@/components/ui/section-heading";
import type {ContactContent, ContactDetail} from "@/types/landing";

type ContactSectionProps = {
  contact: ContactContent;
};

const CALENDLY_EVENT_URL = "https://calendly.com/teo6oro/new-meeting";

export function ContactSection({contact}: ContactSectionProps) {
  const t = useTranslations("landing");
  const detailItems = Array.isArray(contact.details) ? contact.details : [];

  const emailDetail = detailItems.find((detail) => detail.href?.startsWith("mailto:"));
  const phoneDetail = detailItems.find((detail) => detail.href?.startsWith("tel:"));
  const ctaDetails: ContactDetail[] = [emailDetail, phoneDetail].filter(
    (detail): detail is ContactDetail => Boolean(detail),
  );
  const policy = contact.policy;

  if (ctaDetails.length === 0 && detailItems.length > 0) {
    const fallbackPrimary = detailItems[0];
    if (fallbackPrimary) {
      ctaDetails.push(fallbackPrimary);
    }
  }

  if (ctaDetails.length === 1) {
    const fallbackDetail = detailItems.find((detail) => !ctaDetails.includes(detail));
    if (fallbackDetail) {
      ctaDetails.push(fallbackDetail);
    }
  }

  const calendlyLoadingLabel =
    contact.calendlyLoadingFallback ??
    t("hero.calendlyLoadingFallback", {defaultMessage: "Calendly scheduling is loading…"});
  const calendlyTriggerLabel =
    contact.calendlyTriggerLabel ??
    t("hero.calendlyTriggerLabel", {defaultMessage: "Open booking calendar"});
  const calendlyPlaceholder =
    contact.calendlyPlaceholder ??
    t("contact.calendlyPlaceholder", {
      defaultMessage: "Open the booking calendar only when you’re ready to choose a slot.",
    });
  const calendlyFrameTitle = t("contact.calendlyFrameTitle", {defaultMessage: "Calendly booking"});

  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-28">
      <SectionHeading id="contact-heading" title={contact.title} description={contact.description} />

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <ul className="space-y-3 text-sm">
            {detailItems.map((detail: ContactDetail) => (
              <li key={detail.label} className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary dark:text-surface/70">
                  {detail.label}
                </span>
                <a
                  href={detail.href}
                  className="text-lg font-semibold text-primary underline-offset-4 hover:underline dark:text-surface"
                >
                  {detail.value}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-secondary/20 bg-surface px-6 py-6 shadow-sm dark:border-surface/20 dark:bg-primary/40">
          <div className="flex h-full flex-col gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary dark:text-surface/70">
                {contact.responseTime}
              </p>
              <p className="mt-2 text-sm text-secondary dark:text-surface/70">{contact.officeHours}</p>
            </div>

            {ctaDetails.length > 0 ? (
              <div className="flex flex-col gap-3">
                {ctaDetails.map((detail) => (
                  <a
                    key={detail.href ?? detail.label}
                    href={detail.href ?? "#"}
                    className="group flex flex-col rounded-2xl border border-secondary/20 bg-primary/5 px-5 py-4 transition hover:border-primary/40 hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-surface/20 dark:bg-primary/30 dark:hover:border-surface/40 dark:hover:bg-primary/40"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary dark:text-surface/70">
                      {detail.label}
                    </span>
                    <span className="text-lg font-semibold text-primary transition group-hover:text-accent dark:text-surface dark:group-hover:text-surface">
                      {detail.value}
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-secondary dark:text-surface/80">{contact.description}</p>
            )}

            {policy ? (
              <div className="space-y-5 rounded-2xl bg-primary/5 p-4 text-sm text-secondary dark:bg-primary/20 dark:text-surface/85">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary dark:text-surface/70">
                    {policy.cancellationTitle}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-4">
                    {policy.cancellationItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary dark:text-surface/70">
                    {policy.minorsTitle}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-4">
                    {policy.minorsItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <CalendlyInlineEmbed
          eventUrl={CALENDLY_EVENT_URL}
          buttonLabel={calendlyTriggerLabel}
          loadingLabel={calendlyLoadingLabel}
          placeholderLabel={calendlyPlaceholder}
          title={calendlyFrameTitle}
          className="w-full"
          iframeClassName="rounded-3xl"
          height={700}
        />
      </div>
    </section>
  );
}
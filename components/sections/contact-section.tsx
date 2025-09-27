import {ContactForm} from "@/components/sections/contact-form";
import {SectionHeading} from "@/components/ui/section-heading";
import {ZoomQuickLaunch, type ZoomLaunchLabels} from "@/components/ui/zoom-quick-launch";
import type {ContactContent, ContactDetail} from "@/types/landing";

type ContactSectionProps = {
  contact: ContactContent;
  zoomLabels: ZoomLaunchLabels;
};

export function ContactSection({contact, zoomLabels}: ContactSectionProps) {
  const detailItems = Array.isArray(contact.details) ? contact.details : [];

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
          <div className="text-xs text-secondary dark:text-surface/70">
            <p>{contact.responseTime}</p>
            <p>{contact.officeHours}</p>
          </div>

          <ZoomQuickLaunch labels={zoomLabels} />
        </div>

        <div className="rounded-3xl border border-secondary/20 bg-surface px-6 py-6 shadow-sm dark:border-surface/20 dark:bg-primary/40">
          <h3 className="text-lg font-semibold text-primary dark:text-surface">{contact.form.title}</h3>
          <ContactForm form={contact.form} />
        </div>
      </div>
    </section>
  );
}
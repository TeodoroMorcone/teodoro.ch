import {SectionHeading} from "@/components/ui/section-heading";
import type {PrivacyContent, PrivacySection as PrivacySectionItem} from "@/types/landing";

type PrivacySectionProps = {
  privacy: PrivacyContent;
};

export function PrivacySection({privacy}: PrivacySectionProps) {
  const hasSections = Array.isArray(privacy.sections) && privacy.sections.length > 0;

  return (
    <section id="privacy" aria-labelledby="privacy-heading" className="scroll-mt-28">
      <SectionHeading
        id="privacy-heading"
        title={privacy.title}
        description={
          privacy.intro ? <p className="text-base leading-relaxed">{privacy.intro}</p> : undefined
        }
      />

      {hasSections ? (
        <div className="mt-8 space-y-6">
          {privacy.sections.map((section: PrivacySectionItem) => (
            <article
              key={section.id}
              className="rounded-3xl border border-secondary/20 bg-surface px-6 py-6 shadow-sm transition-colors duration-200 ease-soft-sine hover:border-accent hover:shadow-sidebar dark:border-surface/20 dark:bg-primary/40"
            >
              <h3 className="text-lg font-semibold text-primary dark:text-surface">
                {section.heading}
              </h3>

              {Array.isArray(section.body) ? (
                <div className="mt-3 space-y-2 text-sm leading-relaxed text-secondary dark:text-surface/75">
                  {section.body.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              ) : null}

              {Array.isArray(section.bullets) ? (
                <ul className="mt-3 list-disc space-y-1 pl-6 text-sm text-secondary dark:text-surface/80">
                  {section.bullets.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}

      {privacy.contact ? (
        <div className="mt-10 rounded-3xl border border-secondary/30 bg-primary/5 px-6 py-6 text-sm text-secondary dark:border-surface/30 dark:bg-surface/10 dark:text-surface/85">
          <h3 className="text-base font-semibold uppercase tracking-[0.22em] text-primary dark:text-surface">
            {privacy.contact.heading}
          </h3>
          <ul className="mt-3 space-y-1">
            {privacy.contact.lines.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
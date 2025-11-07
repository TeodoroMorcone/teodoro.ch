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
          privacy.intro ? <p className="text-base leading-relaxed text-secondary dark:text-accent-foreground/85">{privacy.intro}</p> : undefined
        }
      />

      {hasSections ? (
        <div className="mt-8 space-y-6 rounded-3xl border border-secondary/30 bg-surface p-8 text-primary shadow-[0_26px_70px_-38px_rgba(15,91,75,0.28)] transition-colors duration-300 ease-soft-sine dark:border-primary/25 dark:bg-primary/25 dark:text-accent-foreground/90 dark:shadow-[0_26px_70px_-38px_rgba(0,133,133,0.32)]">
          {privacy.sections.map((section: PrivacySectionItem) => (
            <article
              key={section.id}
              className="rounded-3xl border border-secondary/25 bg-surface px-6 py-6 text-primary shadow-sm shadow-secondary/10 transition-transform transition-colors duration-300 ease-soft-sine hover:-translate-y-1 hover:border-accent hover:bg-accent-muted hover:shadow-lg hover:shadow-accent/25 dark:border-primary/30 dark:bg-primary/30 dark:text-accent-foreground/90 dark:hover:border-accent dark:hover:bg-accent/55 dark:hover:shadow-accent/35"
            >
              <h3 className="text-lg font-semibold text-primary transition-colors duration-200 ease-soft-sine dark:text-accent-foreground">
                {section.heading}
              </h3>

              {Array.isArray(section.body) ? (
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-secondary transition-colors duration-200 ease-soft-sine dark:text-accent-foreground/85">
                  {section.body.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              ) : null}

              {Array.isArray(section.bullets) ? (
                <ul className="mt-4 space-y-2 text-sm text-secondary transition-colors duration-200 ease-soft-sine dark:text-accent-foreground/85">
                  {section.bullets.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-2 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-primary ring-2 ring-primary/20 transition-colors duration-300 dark:bg-accent-foreground/80 dark:ring-accent-foreground/35" />
                      <span className="flex-1 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}

      {privacy.contact ? (
        <div className="mt-12 rounded-3xl border border-secondary/30 bg-accent-muted px-7 py-6 text-sm text-secondary shadow-[0_26px_70px_-38px_rgba(15,91,75,0.35)] transition-colors duration-300 ease-soft-sine dark:border-primary/30 dark:bg-primary/30 dark:text-accent-foreground/90 dark:shadow-[0_26px_70px_-38px_rgba(0,133,133,0.4)]">
          <h3 className="text-xs font-semibold uppercase tracking-[0.26em] text-secondary transition-colors duration-200 ease-soft-sine dark:text-accent-foreground/80">
            {privacy.contact.heading}
          </h3>
          <ul className="mt-4 space-y-2">
            {privacy.contact.lines.map((line, index) => (
              <li key={index} className="flex items-start gap-3 leading-relaxed">
                <span className="mt-2 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-primary ring-2 ring-primary/25 transition-colors.duration-300 dark:bg-accent/80 dark:ring-accent/35" />
                <span className="flex-1 text-secondary transition-colors duration-200 dark:text-accent-foreground/85">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
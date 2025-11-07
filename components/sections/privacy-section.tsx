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
        <div className="mt-8 space-y-6 rounded-3xl border border-secondary/30 bg-white p-8 text-primary shadow-[0_26px_70px_-38px_rgba(15,91,75,0.28)] transition-colors duration-300 ease-soft-sine dark:border-surface/25 dark:bg-surface/18 dark:text-surface/85 dark:shadow-[0_26px_70px_-38px_rgba(0,133,133,0.32)]">
          {privacy.sections.map((section: PrivacySectionItem) => (
            <article
              key={section.id}
              className="group rounded-2xl border border-secondary/25 bg-white px-6 py-6 shadow-sm shadow-secondary/10 transition-transform transition-colors duration-300 ease-soft-sine hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/90 hover:text-white hover:shadow-lg hover:shadow-primary/35 dark:border-surface/25 dark:bg-surface/20 dark:text-surface/85 dark:hover.border-accent/50 dark:hover:bg-secondary/80 dark:hover:text-white dark:shadow-primary/15"
            >
              <h3 className="text-lg font-semibold text-secondary-strong transition-colors.duration-200 ease-soft-sine group-hover:text-white dark:text-white">
                {section.heading}
              </h3>

              {Array.isArray(section.body) ? (
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-primary-strong transition-colors duration-200 ease-soft-sine group-hover:text-white/90 dark:text-surface/80">
                  {section.body.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              ) : null}

              {Array.isArray(section.bullets) ? (
                <ul className="mt-4 space-y-2 text-primary-strong transition-colors duration-200 ease-soft-sine group-hover:text-white/90 dark:text-surface/80 dark:group-hover:text-white/85">
                  {section.bullets.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm text-primary-strong transition-colors duration-200 ease-soft-sine group-hover:text-white/90 dark:text-surface/80 dark:group-hover:text-white/85"
                    >
                      <span className="mt-2 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-primary ring-2 ring-primary/20 transition-colors duration-300 group-hover:bg-white group-hover:ring-white/40 dark:bg-surface/80 dark:ring-surface/40 dark:group-hover:bg-white/80" />
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
        <div className="mt-12 rounded-3xl border border-secondary/30 bg-white px-7 py-6 text-sm text-primary-strong shadow-[0_26px_70px_-38px_rgba(15,91,75,0.35)] transition-colors duration-300 ease-soft-sine dark:border-surface/25 dark:bg-surface/18 dark:text-surface/85 dark:shadow-[0_26px_70px_-38px_rgba(0,133,133,0.4)]">
          <h3 className="text-xs font-semibold uppercase tracking-[0.26em] text-secondary-strong transition-colors duration-200 ease-soft-sine dark:text-surface/80">
            {privacy.contact.heading}
          </h3>
          <ul className="mt-4 space-y-2">
            {privacy.contact.lines.map((line, index) => (
              <li key={index} className="flex items-start gap-3 leading-relaxed">
                <span className="mt-2 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-primary ring-2 ring-primary/25 transition-colors.duration-300 dark:bg-accent/80 dark:ring-accent/35" />
                <span className="flex-1 text-primary transition-colors duration-200 dark:text-surface/85">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
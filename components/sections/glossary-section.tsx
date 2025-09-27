import {SectionHeading} from "@/components/ui/section-heading";
import type {GlossaryContent, GlossaryEntry} from "@/types/landing";

type GlossarySectionProps = {
  glossary: GlossaryContent;
};

export function GlossarySection({glossary}: GlossarySectionProps) {
  return (
    <section id="glossary" aria-labelledby="glossary-heading" className="scroll-mt-28">
      <SectionHeading id="glossary-heading" title={glossary.title} />
      <dl className="mt-8 space-y-6">
        {glossary.entries.map((entry: GlossaryEntry) => (
          <div
            key={entry.term}
            className="group rounded-3xl border border-secondary/20 bg-surface px-6 py-6 text-primary shadow-sm transition-transform transition-colors duration-200 ease-soft-sine hover:-translate-y-1 hover:bg-primary hover:text-surface hover:shadow-sidebar dark:border-surface/20 dark:bg-primary/40 dark:text-surface dark:hover:bg-surface dark:hover:text-primary"
          >
            <dt className="text-lg font-semibold text-primary transition-colors duration-200 group-hover:text-surface dark:text-surface dark:group-hover:text-primary">
              {entry.term}
            </dt>
            <dd className="mt-2 text-secondary transition-colors duration-200 group-hover:text-surface/85 dark:text-surface/75 dark:group-hover:text-primary/85">
              {entry.definition}
            </dd>
            {entry.relatedLinks && entry.relatedLinks.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-3">
                {entry.relatedLinks.map((link) => (
                  <span
                    key={link}
                    className="rounded-full border border-dashed border-secondary/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.1em] text-secondary transition-colors duration-200 group-hover:border-surface group-hover:text-surface dark:border-surface/30 dark:text-surface/60 dark:group-hover:border-primary dark:group-hover:text-primary"
                  >
                    {link}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </dl>
    </section>
  );
}
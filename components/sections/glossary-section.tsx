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
            className="rounded-3xl border border-secondary/20 bg-surface px-6 py-6 shadow-sm dark:border-surface/20 dark:bg-primary/40"
          >
            <dt className="text-lg font-semibold text-primary dark:text-surface">{entry.term}</dt>
            <dd className="mt-2 text-secondary dark:text-surface/75">{entry.definition}</dd>
            {entry.relatedLinks && entry.relatedLinks.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-3">
                {entry.relatedLinks.map((link) => (
                  <span
                    key={link}
                    className="rounded-full border border-dashed border-secondary/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.1em] text-secondary dark:border-surface/30 dark:text-surface/60"
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
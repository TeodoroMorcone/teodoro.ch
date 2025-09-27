import {SectionHeading} from "@/components/ui/section-heading";
import type {OutboundLink, ResultsContent} from "@/types/landing";

type ResultsSectionProps = {
  results: ResultsContent;
  outboundLinks: OutboundLink[];
};

export function ResultsSection({results, outboundLinks}: ResultsSectionProps) {
  return (
    <section id="results" aria-labelledby="results-heading" className="scroll-mt-28">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div>
          <SectionHeading id="results-heading" title={results.title} description={results.description} />
          <div className="mt-8 space-y-4">
            {results.placeholders.map((placeholder) => (
              <div
                key={placeholder.type}
                className="flex items-center justify-between rounded-3xl border border-dashed border-secondary/40 px-6 py-4 text-sm text-secondary dark:border-surface/30 dark:text-surface/70"
              >
                <span>{placeholder.label}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-secondary/70 dark:text-surface/50">TODO</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-secondary/20 bg-surface p-6 shadow-sm dark:border-surface/20 dark:bg-primary/40">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary dark:text-surface/70">
            Authority Links
          </h3>
          <ul className="mt-4 space-y-3">
            {outboundLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.url}
                  className="flex flex-col rounded-2xl border border-secondary/20 px-4 py-3 text-sm transition-colors duration-200 ease-soft-sine hover:border-accent hover:text-accent"
                >
                  <span className="font-semibold">{link.name}</span>
                  <span className="text-xs text-secondary dark:text-surface/70">{link.description}</span>
                  <span className="mt-1 text-xs uppercase tracking-[0.2em] text-secondary/70 dark:text-surface/60">
                    {link.category}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
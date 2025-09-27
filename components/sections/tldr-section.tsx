import {SectionHeading} from "@/components/ui/section-heading";
import type {IntentCluster, TLDRContent} from "@/types/landing";

type TLDRSectionProps = {
  tldr: TLDRContent;
  intentClusters: IntentCluster[];
};

export function TLDRSection({tldr, intentClusters}: TLDRSectionProps) {
  return (
    <section id="tldr" aria-labelledby="tldr-heading" className="scroll-mt-28">
      <SectionHeading id="tldr-heading" title={tldr.title} />
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tldr.items.map((item) => (
          <article
            key={item.label}
            className="rounded-3xl border border-secondary/20 bg-surface px-6 py-6 shadow-sm transition-shadow duration-200 hover:shadow-sidebar dark:border-surface/20 dark:bg-primary/40"
          >
            <h3 className="text-lg font-semibold">{item.label}</h3>
            <p className="mt-2 text-secondary dark:text-surface/75">{item.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {intentClusters.map((cluster) => (
          <article
            key={cluster.id}
            className="flex flex-col gap-3 rounded-3xl border border-secondary/15 bg-surface px-6 py-6 shadow-sm dark:border-surface/20 dark:bg-primary/40"
          >
            <h3 className="text-base font-semibold uppercase tracking-[0.1em] text-secondary dark:text-surface/80">
              {cluster.title}
            </h3>
            <p className="text-secondary dark:text-surface/70">{cluster.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
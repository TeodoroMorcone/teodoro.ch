import {SectionHeading} from "@/components/ui/section-heading";
import type {ComparisonContent, ComparisonRow} from "@/types/landing";

type ComparisonSectionProps = {
  comparison: ComparisonContent;
};

export function ComparisonSection({comparison}: ComparisonSectionProps) {
  return (
    <section id="comparison" aria-labelledby="comparison-heading" className="scroll-mt-28">
      <SectionHeading
        id="comparison-heading"
        title={comparison.title}
        description={comparison.description}
      />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden">
        {comparison.columns.map((column) => (
          <article
            key={column.key}
            className="group flex h-full flex-col gap-5 rounded-3xl border border-secondary/20 bg-surface px-6 py-6 text-primary shadow-sm transition-transform transition-colors duration-200 ease-soft-sine hover:-translate-y-1 hover:bg-primary hover:text-surface hover:shadow-sidebar dark:border-surface/20 dark:bg-primary/40 dark:text-surface dark:hover:bg-surface dark:hover:text-primary"
          >
            <header>
              <h3 className="text-xl font-semibold text-primary transition-colors duration-200 group-hover:text-surface dark:text-surface dark:group-hover:text-primary">
                {column.label}
              </h3>
            </header>
            <dl className="space-y-3 text-sm">
              {comparison.rows.map((row: ComparisonRow) => (
                <div
                  key={row.metric}
                  className="rounded-2xl border border-secondary/10 bg-primary/5 p-4 transition-colors duration-200 group-hover:border-transparent group-hover:bg-primary/30 dark:border-surface/20 dark:bg-surface/20 dark:group-hover:bg-surface/70"
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary dark:text-surface/70">
                    {row.metric}
                  </dt>
                  <dd className="mt-2 text-sm text-primary group-hover:text-surface dark:text-surface dark:group-hover:text-primary">
                    {row.values[column.key]}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>

      <div className="mt-8 hidden lg:block rounded-3xl border border-secondary/20 bg-surface shadow-sm dark:border-surface/20 dark:bg-primary/40">
        <div className="overflow-hidden rounded-3xl">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-primary/10 text-left uppercase tracking-[0.2em] text-secondary dark:bg-surface/10 dark:text-surface/70">
                <th className="px-6 py-4 text-xs font-semibold text-primary dark:text-surface">Metric</th>
                {comparison.columns.map((column) => (
                  <th key={column.key} className="px-6 py-4 text-xs font-semibold text-primary dark:text-surface">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row: ComparisonRow, index) => (
                <tr
                  key={row.metric}
                  className={index % 2 === 0 ? "bg-surface dark:bg-primary/30" : "bg-surface/80 dark:bg-primary/20"}
                >
                  <th scope="row" className="px-6 py-4 text-left text-sm font-semibold text-primary dark:text-surface">
                    {row.metric}
                  </th>
                  {comparison.columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 text-sm text-secondary dark:text-surface/75">
                      {row.values[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-4 text-xs text-secondary dark:text-surface/70">{comparison.footnote}</p>
    </section>
  );
}
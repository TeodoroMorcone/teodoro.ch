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
      <div className="mt-8 overflow-hidden rounded-3xl border border-secondary/20 bg-surface shadow-sm dark:border-surface/20 dark:bg-primary/40">
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
      <p className="mt-4 text-xs text-secondary dark:text-surface/70">{comparison.footnote}</p>
    </section>
  );
}
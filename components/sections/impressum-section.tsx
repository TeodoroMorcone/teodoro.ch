import {SectionHeading} from "@/components/ui/section-heading";
import type {ImpressumContent, ImpressumEntry} from "@/types/landing";

type ImpressumSectionProps = {
  impressum: ImpressumContent;
};

export function ImpressumSection({impressum}: ImpressumSectionProps) {
  const entries = Array.isArray(impressum.entries) ? impressum.entries : [];
  const notes = Array.isArray(impressum.notes) ? impressum.notes : [];

  const renderEntryValue = (entry: ImpressumEntry) => {
    if (!entry.href) {
      return entry.value;
    }

    return (
      <a
        href={entry.href}
        className="text-secondary transition-colors duration-200 ease-soft-sine underline-offset-4 hover:text-primary hover:underline dark:text-surface/90 dark:hover:text-white"
        rel={entry.type === "url" ? "noopener noreferrer" : undefined}
        target={entry.type === "url" ? "_blank" : undefined}
      >
        {entry.value}
      </a>
    );
  };

  return (
    <section id="impressum" aria-labelledby="impressum-heading" className="scroll-mt-28">
      <SectionHeading
        id="impressum-heading"
        title={impressum.title}
        description={impressum.description}
      />

      <div className="mt-10 space-y-8 rounded-3xl border border-secondary/25 bg-primary/5 p-8 shadow-[0_30px_80px_-40px_rgba(15,91,75,0.55)] backdrop-blur-sm transition-colors duration-300 ease-soft-sine dark:border-surface/25 dark:bg-surface/10 dark:shadow-[0_30px_80px_-40px_rgba(0,133,133,0.45)]">
        {entries.length > 0 ? (
          <dl className="grid gap-6 md:grid-cols-2">
            {entries.map((entry, index) => (
              <div
                key={`${entry.label}-${index}`}
                className="rounded-2xl border border-secondary/25 bg-surface/95 px-5 py-4 shadow-sm shadow-secondary/10 transition-all duration-300 ease-soft-sine hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary/25 dark:border-surface/25 dark:bg-surface/20 dark:shadow-primary/15"
              >
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary/75 dark:text-surface/70">
                  {entry.label}
                </dt>
                <dd className="mt-3 text-lg font-semibold text-primary/95 transition-colors duration-200 ease-soft-sine dark:text-white">
                  {renderEntryValue(entry)}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {notes.length > 0 ? (
          <ul className="space-y-3 rounded-2xl border border-secondary/20 bg-surface/80 px-6 py-5 text-sm leading-relaxed text-secondary/90 shadow-inner shadow-secondary/10 transition-colors duration-300 ease-soft-sine dark:border-surface/25 dark:bg-surface/20 dark:text-surface/85">
            {notes.map((note, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-2 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-secondary/60 ring-2 ring-secondary/10 transition-colors duration-300 dark:bg-surface/80 dark:ring-surface/40" />
                <span className="flex-1 leading-relaxed text-secondary/90 dark:text-surface/85">{note}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
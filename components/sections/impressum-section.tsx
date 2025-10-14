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
        className="underline-offset-4 hover:underline"
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

      <div className="mt-10 space-y-8">
        {entries.length > 0 ? (
          <dl className="grid gap-6 md:grid-cols-2">
            {entries.map((entry, index) => (
              <div
                key={`${entry.label}-${index}`}
                className="rounded-2xl border border-secondary/20 bg-surface px-5 py-4 shadow-sm transition-colors duration-200 ease-soft-sine dark:border-surface/20 dark:bg-primary/40"
              >
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary dark:text-surface/70">
                  {entry.label}
                </dt>
                <dd className="mt-2 text-base font-semibold text-primary dark:text-surface">
                  {renderEntryValue(entry)}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {notes.length > 0 ? (
          <ul className="space-y-2 text-sm text-secondary dark:text-surface/80">
            {notes.map((note, index) => (
              <li key={index} className="flex gap-3">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary/50 dark:bg-surface/60" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
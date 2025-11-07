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
        className="text-primary transition-colors duration-200 ease-soft-sine underline-offset-4 hover:text-accent hover:underline dark:text-accent-foreground dark:hover:text-accent-foreground/85"
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

      <div className="mt-10 space-y-8 rounded-3xl border border-secondary/25 bg-surface p-8 shadow-[0_30px_80px_-40px_rgba(15,91,75,0.35)] backdrop-blur-sm transition-colors duration-300 ease-soft-sine dark:border-primary/30 dark:bg-primary/25 dark:shadow-[0_30px_80px_-40px_rgba(0,133,133,0.45)]">
        {entries.length > 0 ? (
          <dl className="grid gap-6 md:grid-cols-2">
            {entries.map((entry, index) => (
              <div
                key={`${entry.label}-${index}`}
                className="rounded-2xl border border-secondary/20 bg-surface px-5 py-4 shadow-sm shadow-secondary/10 transition-all duration-300 ease-soft-sine hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary/20 dark:border-primary/25 dark:bg-primary/35 dark:shadow-primary/20"
              >
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary dark:text-accent-foreground/75">
                  {entry.label}
                </dt>
                <dd className="mt-3 text-lg font-semibold text-primary transition-colors duration-200 ease-soft-sine dark:text-accent-foreground">
                  {renderEntryValue(entry)}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {notes.length > 0 ? (
          <ul className="space-y-3 rounded-2xl border border-secondary/20 bg-accent-muted px-6 py-5 text-sm leading-relaxed text-secondary shadow-inner shadow-secondary/10 transition-colors duration-300 ease-soft-sine dark:border-primary/25 dark:bg-primary/35 dark:text-accent-foreground/90">
            {notes.map((note, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-2 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-secondary ring-2 ring-secondary/10 transition-colors duration-300 dark:bg-accent-foreground/80 dark:ring-accent-foreground/35" />
                <span className="flex-1 leading-relaxed text-secondary dark:text-accent-foreground/85">{note}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
import {SectionHeading} from "@/components/ui/section-heading";
import type {HowToContent} from "@/types/landing";

type HowToSectionProps = {
  howTo: HowToContent;
};

export function HowToSection({howTo}: HowToSectionProps) {
  return (
    <section id="how-to" aria-labelledby="how-to-heading" className="scroll-mt-28">
      <SectionHeading id="how-to-heading" title={howTo.title} description={howTo.intro} />
      <ol className="mt-8 space-y-6">
        {howTo.steps.map((step, index) => (
          <li
            key={step.name}
            className="rounded-3xl border border-secondary/20 bg-surface px-6 py-6 shadow-sm dark:border-surface/20 dark:bg-primary/40"
          >
            <header className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary dark:text-surface/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="rounded-full bg-accent/50 px-3 py-1 text-xs font-medium text-primary">
                {step.duration}
              </span>
            </header>
            <h3 className="mt-3 text-lg font-semibold text-primary dark:text-surface">{step.name}</h3>
            <p className="mt-2 text-secondary dark:text-surface/75">{step.description}</p>
            <div className="mt-4 flex flex-wrap gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary dark:text-surface/70">
                  Materials
                </p>
                <ul className="mt-2 space-y-1 text-sm text-secondary dark:text-surface/70">
                  {step.materials.map((material) => (
                    <li key={material}>• {material}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary dark:text-surface/70">
                  Notes
                </p>
                <ul className="mt-2 space-y-1 text-sm text-secondary dark:text-surface/70">
                  {step.notes.map((note) => (
                    <li key={note}>• {note}</li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-xs text-secondary dark:text-surface/60">{howTo.disclaimer}</p>
    </section>
  );
}
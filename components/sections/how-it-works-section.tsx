import {SectionHeading} from "@/components/ui/section-heading";
import type {HowItWorksContent, MiniPlanItem} from "@/types/landing";

const BADGE_CLASSES: Record<string, string> = {
  primary: "bg-primary text-surface",
  secondary: "bg-secondary text-primary",
  accent: "bg-accent text-primary",
};

type HowItWorksSectionProps = {
  howItWorks: HowItWorksContent;
};

export function HowItWorksSection({howItWorks}: HowItWorksSectionProps) {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-28">
      <SectionHeading id="how-heading" title={howItWorks.title} />
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {howItWorks.steps.map((step) => (
          <article
            key={step.id}
            className="rounded-3xl border border-secondary/20 bg-surface px-6 py-6 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-sidebar dark:border-surface/20 dark:bg-primary/40"
          >
            <header className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary dark:text-surface/70">
                {step.id.toUpperCase()}
              </span>
            </header>
            <h3 className="mt-4 text-lg font-semibold text-primary dark:text-surface">{step.title}</h3>
            <p className="mt-3 text-secondary dark:text-surface/75">{step.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 grid gap-4 rounded-3xl bg-primary/5 p-6 dark:bg-surface/10 md:grid-cols-3">
        {howItWorks.miniPlan.map((item: MiniPlanItem) => (
          <div key={item.label} className="flex flex-col gap-2">
            <span
              className={`inline-flex w-fit rounded-full px-4 py-1 text-xs font-semibold ${
                BADGE_CLASSES[item.badgeVariant] ?? BADGE_CLASSES.primary
              }`}
            >
              {item.label}
            </span>
            <p className="text-sm text-secondary dark:text-surface/75">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
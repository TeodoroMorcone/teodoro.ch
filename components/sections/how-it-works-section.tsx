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
            className="group rounded-3xl border border-secondary/20 bg-surface px-6 py-6 text-primary shadow-sm transition-transform transition-colors duration-200 ease-soft-sine hover:-translate-y-1 hover:bg-primary hover:text-surface hover:shadow-sidebar dark:border-surface/20 dark:bg-primary/40 dark:text-surface dark:hover:bg-surface dark:hover:text-primary"
          >
            <header className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary transition-colors duration-200 group-hover:text-surface dark:text-surface/70 dark:group-hover:text-primary">
                {step.id.toUpperCase()}
              </span>
            </header>
            <h3 className="mt-4 text-lg font-semibold text-primary transition-colors duration-200 group-hover:text-surface dark:text-surface dark:group-hover:text-primary">
              {step.title}
            </h3>
            <p className="mt-3 text-secondary transition-colors duration-200 group-hover:text-surface/80 dark:text-surface/75 dark:group-hover:text-primary/80">
              {step.description}
            </p>
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
import {SectionHeading} from "@/components/ui/section-heading";
import type {HowItWorksContent, MiniPlanItem} from "@/types/landing";

const BADGE_CLASSES: Record<string, string> = {
  primary: "bg-primary text-surface",
  secondary: "bg-secondary text-primary",
  accent: "bg-accent text-accent-foreground",
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
            className="group rounded-3xl border border-secondary/25 bg-surface/90 px-6 py-6 text-primary shadow-[0_18px_45px_-35px_rgba(0,133,133,0.45)] backdrop-blur-sm transition-all duration-300 ease-soft-sine hover:-translate-y-2 hover:border-accent/40 hover:bg-accent-muted/85 hover:text-primary"
          >
            <header className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-accent/20 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent-foreground shadow-sm transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                {step.id.toUpperCase()}
              </span>
            </header>
            <h3 className="mt-4 text-lg font-semibold text-primary transition-colors duration-300 group-hover:text-primary">
              {step.title}
            </h3>
            <p className="mt-3 text-secondary opacity-90 transition-colors duration-300 group-hover:text-primary/85">
              {step.description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-10 grid gap-4 rounded-3xl border border-secondary/30 bg-secondary/15 p-6 shadow-[0_18px_60px_-45px_rgba(196,83,53,0.45)] backdrop-blur-sm dark:border-primary/30 dark:bg-primary/40 md:grid-cols-3">
        {howItWorks.miniPlan.map((item: MiniPlanItem) => (
          <div key={item.label} className="flex flex-col gap-2">
            <span
              className={`inline-flex w-fit rounded-full px-4 py-1 text-xs font-semibold shadow-sm shadow-secondary/30 ${
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
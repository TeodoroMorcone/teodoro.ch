import {SectionHeading} from "@/components/ui/section-heading";
import {CTAButton} from "@/components/ui/cta-button";
import type {PricingContent, PricingPlan} from "@/types/landing";

type PricingSectionProps = {
  pricing: PricingContent;
};

export function PricingSection({pricing}: PricingSectionProps) {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="scroll-mt-28">
      <SectionHeading
        id="pricing-heading"
        title={pricing.title}
        description={
          <div className="space-y-2 text-sm">
            <p className="text-secondary dark:text-surface/70">{pricing.note.vat}</p>
            <CTAButton href={pricing.note.customPlan.href} variant="secondary" className="w-fit px-4 py-2 text-xs">
              {pricing.note.customPlan.label}
            </CTAButton>
          </div>
        }
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {pricing.plans.map((plan: PricingPlan) => (
          <article
            key={plan.id}
            className="flex h-full flex-col gap-5 rounded-3xl border border-secondary/20 bg-surface px-6 py-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-sidebar dark:border-surface/20 dark:bg-primary/40"
          >
            <header className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-primary dark:text-surface">{plan.name}</h3>
                <p className="mt-1 text-sm text-secondary dark:text-surface/70">
                  {plan.price} · {plan.unit}
                </p>
              </div>
              {plan.badge ? (
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {plan.badge}
                </span>
              ) : null}
            </header>

            <ul className="space-y-2 text-sm text-secondary dark:text-surface/75">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-accent" aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <CTAButton href="#contact" className="mt-auto w-full justify-center">
              {plan.cta}
            </CTAButton>
          </article>
        ))}
      </div>
    </section>
  );
}
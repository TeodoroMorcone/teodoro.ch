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

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pricing.plans.map((plan: PricingPlan) => (
          <article
            key={plan.id}
            className="group flex h-full flex-col gap-5 rounded-3xl border border-secondary/30 bg-surface px-6 py-6 text-secondary-strong shadow-[0_22px_55px_-40px_rgba(15,91,75,0.45)] transition-all duration-300 ease-soft-sine hover:-translate-y-2 hover:border-primary hover:bg-primary-strong hover:text-white dark:border-surface/30 dark:bg-surface/18 dark:text-surface/85 dark:hover:border-accent dark:hover:bg-secondary-strong dark:hover:text-white"
          >
            <header className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-primary transition-colors duration-200 group-hover:text-white dark:text-surface dark:group-hover:text-white">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-secondary transition-colors duration-200 group-hover:text-white/85 dark:text-surface/70 dark:group-hover:text-white/85">
                  {plan.price} = {plan.unit}
                </p>
              </div>
              {plan.badge ? (
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-md shadow-accent/50 transition-colors duration-300 group-hover:bg-white group-hover:text-primary">
                  {plan.badge}
                </span>
              ) : null}
            </header>

            <ul className="space-y-2 text-sm text-secondary transition-colors duration-300 group-hover:text-white/90">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span
                    className="mt-1 h-2 w-2 rounded-full bg-primary transition-colors duration-300 group-hover:bg-white"
                    aria-hidden
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <CTAButton
              href="#contact"
              className="mt-auto w-full justify-center transition-colors duration-300 group-hover:bg-white group-hover:text-primary-strong"
            >
              {plan.cta}
            </CTAButton>
          </article>
        ))}
      </div>
    </section>
  );
}
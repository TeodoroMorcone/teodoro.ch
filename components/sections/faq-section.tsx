import {SectionHeading} from "@/components/ui/section-heading";
import type {FAQContent, FAQItem} from "@/types/landing";

type FAQSectionProps = {
  faq: FAQContent;
};

export function FAQSection({faq}: FAQSectionProps) {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-28">
      <SectionHeading id="faq-heading" title={faq.title} />
      <div className="mt-6 space-y-4">
        {faq.items.map((item: FAQItem) => (
          <details
            key={item.id}
            className="group rounded-3xl border border-secondary/20 bg-surface px-6 py-4 text-sm text-primary shadow-sm transition-transform transition-colors duration-200 ease-soft-sine hover:-translate-y-1 hover:bg-primary hover:text-surface hover:border-primary hover:shadow-sidebar dark:border-surface/20 dark:bg-primary/40 dark:text-surface dark:hover:bg-surface dark:hover:text-primary"
          >
            <summary className="cursor-pointer list-none font-semibold text-primary transition-colors duration-200 ease-soft-sine group-open:text-accent group-hover:text-surface dark:text-surface dark:group-hover:text-primary">
              {item.question}
            </summary>
            <p className="mt-3 text-secondary transition-colors duration-200 group-hover:text-surface/85 dark:text-surface/75 dark:group-hover:text-primary/85">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
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
            className="group rounded-3xl border border-secondary/20 bg-surface px-6 py-4 text-sm shadow-sm transition-colors duration-200 ease-soft-sine hover:border-accent dark:border-surface/20 dark:bg-primary/40"
          >
            <summary className="cursor-pointer list-none font-semibold text-primary transition-colors duration-200 ease-soft-sine group-open:text-accent dark:text-surface">
              {item.question}
            </summary>
            <p className="mt-3 text-secondary dark:text-surface/75">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
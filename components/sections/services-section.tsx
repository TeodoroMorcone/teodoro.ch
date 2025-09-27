import {SectionHeading} from "@/components/ui/section-heading";
import type {ServiceItem, ServicesContent} from "@/types/landing";

type ServicesSectionProps = {
  services: ServicesContent;
};

export function ServicesSection({services}: ServicesSectionProps) {
  return (
    <section id="services" aria-labelledby="services-heading" className="scroll-mt-28">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading id="services-heading" title={services.title} description={services.description} />
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {services.items.map((service: ServiceItem) => (
          <article
            key={service.id}
            className="flex flex-col gap-3 rounded-3xl border border-secondary/20 bg-surface px-6 py-6 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-sidebar dark:border-surface/20 dark:bg-primary/40"
          >
            <h3 className="text-xl font-semibold text-primary dark:text-surface">{service.name}</h3>
            <p className="text-secondary dark:text-surface/75">{service.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
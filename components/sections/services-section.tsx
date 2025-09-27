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
            className="group flex flex-col gap-3 rounded-3xl border border-secondary/20 bg-surface px-6 py-6 text-primary shadow-sm transition-transform transition-colors duration-200 ease-soft-sine hover:-translate-y-1 hover:bg-primary hover:text-surface hover:shadow-sidebar dark:border-surface/20 dark:bg-primary/40 dark:text-surface dark:hover:bg-surface dark:hover:text-primary"
          >
            <h3 className="text-xl font-semibold text-primary transition-colors duration-200 group-hover:text-surface dark:text-surface dark:group-hover:text-primary">
              {service.name}
            </h3>
            <p className="text-secondary transition-colors duration-200 group-hover:text-surface/80 dark:text-surface/75 dark:group-hover:text-primary/80">
              {service.copy}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
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
            className="group flex flex-col gap-3 rounded-3xl border border-secondary/25 bg-surface/90 px-6 py-6 text-primary shadow-[0_18px_45px_-35px_rgba(0,133,133,0.55)] backdrop-blur-sm transition-all duration-300 ease-soft-sine hover:-translate-y-2 hover:border-accent/40 hover:bg-accent-muted/90 hover:text-primary"
          >
            <h3 className="text-xl font-semibold text-primary transition-colors duration-300 group-hover:text-primary">
              {service.name}
            </h3>
            <p className="text-secondary opacity-90 transition-colors duration-300 group-hover:text-primary/85">
              {service.copy}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
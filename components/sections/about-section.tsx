import {SectionHeading} from "@/components/ui/section-heading";
import type {AboutContent} from "@/types/landing";

type AboutSectionProps = {
  about: AboutContent;
};

export function AboutSection({about}: AboutSectionProps) {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-28">
      <SectionHeading id="about-heading" title={about.title} />
      <p className="mt-6 max-w-4xl text-lg leading-relaxed text-secondary dark:text-surface/80">{about.body}</p>
    </section>
  );
}
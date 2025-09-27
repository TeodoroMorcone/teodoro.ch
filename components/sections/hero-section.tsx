import Image from "next/image";

import {CTAButton} from "@/components/ui/cta-button";
import {SectionHeading} from "@/components/ui/section-heading";
import {ZoomQuickLaunch, type ZoomLaunchLabels} from "@/components/ui/zoom-quick-launch";
import type {HeroContent} from "@/types/landing";

type HeroSectionProps = {
  hero: HeroContent;
  ctas: {
    primary: {label: string; href: string};
    secondary: {label: string; href: string};
  };
  zoom: {
    labels: ZoomLaunchLabels;
    helper?: string;
  };
};

export function HeroSection({hero, ctas, zoom}: HeroSectionProps) {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]"
    >
      <div>
        <span className="inline-flex items-center rounded-full bg-accent/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary dark:bg-accent/50">
          {hero.badge}
        </span>
        <h1 id="hero-heading" className="mt-6 text-4xl font-semibold leading-tight lg:text-5xl">
          {hero.heading}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-secondary dark:text-surface/80">{hero.subheading}</p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <CTAButton href={ctas.primary.href}>{ctas.primary.label}</CTAButton>
          <CTAButton href={ctas.secondary.href} variant="secondary">
            {ctas.secondary.label}
          </CTAButton>
        </div>
        <ZoomQuickLaunch
          labels={zoom.labels}
          helperText={zoom.helper ?? zoom.labels.helper}
          includeLesson={false}
          variant="inline"
          className="mt-6"
        />
      </div>
      <div className="flex flex-col gap-6 rounded-3xl bg-primary/5 p-8 shadow-sidebar backdrop-blur-sm dark:bg-surface/10">
        <SectionHeading
          eyebrow={hero.illustration ? "Momentaufnahme" : "Hero"}
          title=""
          description={
            <p className="text-sm text-secondary dark:text-surface/70">
              {hero.illustration?.caption ??
                "Ein Blick hinter die Kulissen: so sehen unsere Online-Sessions aus."}
            </p>
          }
        />
        {hero.illustration ? (
          <figure className="overflow-hidden">
            <Image
              src={hero.illustration.src}
              alt={hero.illustration.alt}
              width={hero.illustration.width ?? 800}
              height={hero.illustration.height ?? 600}
              className="h-auto w-full object-cover"
              priority
            />
            {hero.illustration.caption ? (
              <figcaption className="mt-3 text-xs uppercase tracking-[0.2em] text-secondary/70 dark:text-surface/60">
                {hero.illustration.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-secondary/40 text-sm text-secondary dark:border-surface/30 dark:text-surface/70">
            Füge über den Hero-Inhalt ein Bild hinzu, um die Sitzungen zu zeigen.
          </div>
        )}
      </div>
    </section>
  );
}
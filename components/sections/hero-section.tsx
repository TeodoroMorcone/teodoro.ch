"use client";

import Image from "next/image";
import {useTranslations} from "next-intl";

import {CTAButton} from "@/components/ui/cta-button";
import {SectionHeading} from "@/components/ui/section-heading";
import type {HeroContent} from "@/types/landing";

type HeroSectionProps = {
  hero: HeroContent;
  ctas: {
    primary: {label: string; href: string};
    secondary: {label: string; href: string};
  };
};


export function HeroSection({hero, ctas}: HeroSectionProps) {
  const t = useTranslations("landing");
  const expertName = hero.expertName ?? "Teodoro Morcone";

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
      </div>
      <div className="flex flex-col gap-6 rounded-3xl bg-primary/5 p-8 shadow-sidebar backdrop-blur-sm dark:bg-surface/10">
        <SectionHeading
          eyebrow={hero.illustration ? "Portrait" : "Hero"}
          title=""
          description={
            <p className="text-sm text-secondary dark:text-surface/70">
              {hero.illustration?.caption ??
                "Ein Blick hinter die Kulissen: so sehen unsere Online-Sessions aus."}
            </p>
          }
        />
        <figure className="flex flex-col items-center gap-4">
          <div className="flex w-full flex-col items-center gap-3 rounded-3xl border border-primary/15 bg-primary/5 p-6 shadow-xl backdrop-blur-sm dark:border-primary/30 dark:bg-surface/25">
            <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 shadow-lg ring-1 ring-primary/10 dark:from-surface/20 dark:via-surface/10 dark:to-primary/30">
              <Image
                src="/images/avatar.webp"
                alt={t("hero.avatarAlt")}
                width={640}
                height={640}
                priority
                sizes="(min-width: 1024px) 28rem, 80vw"
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>
            <p className="text-base font-semibold tracking-wide text-primary dark:text-accent">
              {expertName}
            </p>
          </div>
          {hero.illustration?.caption ? (
            <figcaption className="text-xs uppercase tracking-[0.2em] text-secondary/70 dark:text-surface/60">
              {hero.illustration.caption}
            </figcaption>
          ) : null}
        </figure>
      </div>
    </section>
  );
}
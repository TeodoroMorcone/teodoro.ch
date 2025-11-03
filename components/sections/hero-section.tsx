"use client";

import Image from "next/image";
import {useTranslations} from "next-intl";

import {CTAButton} from "@/components/ui/cta-button";
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
  const portraitSrc = hero.illustration?.src ?? "/images/chalkbacsk.webp";
  const portraitAlt = hero.illustration?.alt ?? t("hero.avatarAlt");
  const defaultPortraitCaption = "Ich sehe etwa so aus.";
  const rawPortraitCaption = hero.illustration?.caption?.trim() ?? "";
  const portraitCaption =
    rawPortraitCaption.length > 0 ? rawPortraitCaption : defaultPortraitCaption;

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]"
    >
      <div>
        <span className="inline-flex items-center rounded-full bg-accent/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white dark:bg-accent/50 dark:text-white">
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
      <div className="relative flex flex-col gap-6 overflow-hidden rounded-3xl bg-primary/5 p-8 shadow-sidebar backdrop-blur-sm dark:bg-surface/10 sm:p-10 min-h-[22rem] sm:min-h-[26rem]">
        <div className="absolute -inset-8 sm:-inset-10">
          <Image
            src={portraitSrc}
            alt={portraitAlt}
            fill
            priority
            sizes="(min-width: 1024px) 32rem, 100vw"
            className="hero-portrait-object hero-portrait-scale h-full w-full object-cover"
          />
        </div>
        <div className="relative z-10 mt-auto flex flex-col gap-3 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]">
          <span className="inline-flex w-fit items-center rounded-full bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm">
            Portrait
          </span>
          <div className="max-w-md space-y-2 rounded-2xl bg-black/25 p-6 backdrop-blur-md">
            <p className="text-lg font-semibold tracking-wide text-white sm:text-xl">{expertName}</p>
            <p className="text-sm leading-relaxed text-white/85 sm:text-base">{portraitCaption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

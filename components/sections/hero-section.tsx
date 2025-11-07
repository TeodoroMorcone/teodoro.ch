"use client";

import Image from "next/image";
import {useTranslations} from "next-intl";
import type {MouseEventHandler} from "react";

import {CTAButton} from "@/components/ui/cta-button";
import type {HeroContent, HeroCta} from "@/types/landing";

type CalendeskWidget = {
  openModal: (options: {url: string}) => void;
};

type CalendeskWindow = Window & {
  Calendesk?: CalendeskWidget;
};

type HeroSectionProps = {
  hero: HeroContent;
  ctas: {
    primary: HeroCta;
    secondary: HeroCta;
  };
};


export function HeroSection({hero, ctas}: HeroSectionProps) {
  const t = useTranslations("landing");
  const expertName = hero.expertName ?? "Teodoro Morcone";
  const portraitSrc = hero.illustration?.src ?? "/images/teodoro_happy.webp";
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
      <div className="flex flex-col gap-6 rounded-3xl border border-secondary/20 bg-surface/85 p-8 shadow-sidebar backdrop-blur-sm dark:border-secondary/30 dark:bg-primary/60">
        <span className="inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent-foreground shadow-sm shadow-accent/40 dark:bg-accent/90">
          {hero.badge}
        </span>
        <h1 id="hero-heading" className="mt-6 text-4xl font-semibold leading-tight text-primary lg:text-5xl dark:text-accent-foreground">
          {hero.heading}
        </h1>
        {hero.disclaimer ? (
          <p className="mt-2 text-sm text-secondary/85 dark:text-accent-foreground/80">
            {hero.disclaimer}
          </p>
        ) : null}
        <p className="mt-6 max-w-2xl text-lg text-secondary opacity-90 dark:text-accent-foreground dark:opacity-80">{hero.subheading}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {[ctas.primary, ctas.secondary].map((cta, index) => {
            const trimmedHref = cta.href.trim();
            const href = trimmedHref.length > 0 ? trimmedHref : "#";
            const variant = cta.variant ?? (index === 0 ? "primary" : "secondary");

            const handleClick: MouseEventHandler<HTMLAnchorElement> | undefined =
              cta.mode === "calendeskModal"
                ? (event) => {
                    event.preventDefault();

                    if (typeof window === "undefined") {
                      return;
                    }

                    const calendesk = (window as CalendeskWindow).Calendesk;

                    if (calendesk?.openModal) {
                      calendesk.openModal({url: href});
                    } else {
                      window.open(href, "_blank", "noopener,noreferrer");
                    }
                  }
                : undefined;

            const buttonProps: {
              target?: "_blank" | "_self";
              rel?: string;
              onClick?: MouseEventHandler<HTMLAnchorElement>;
            } = {};

            if (cta.target) {
              buttonProps.target = cta.target;
            }

            if (cta.rel) {
              buttonProps.rel = cta.rel;
            }

            if (handleClick) {
              buttonProps.onClick = handleClick;
            }

            return (
              <div key={`${cta.label}-${index}`} className="flex min-w-[15rem] flex-col items-center gap-2">
                {cta.helper ? (
                  <span className="text-sm font-semibold text-secondary opacity-80 dark:text-accent-foreground dark:opacity-75">
                    {cta.helper}
                  </span>
                ) : null}
                <CTAButton href={href} variant={variant} className="w-auto" {...buttonProps}>
                  {cta.label}
                </CTAButton>
              </div>
            );
          })}
        </div>
      </div>
      <div className="relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-secondary/30 bg-secondary/70 p-8 text-accent-foreground shadow-[0_32px_110px_-48px_rgba(15,91,75,0.65)] backdrop-blur-md dark:border-primary/40 dark:bg-primary/70 sm:p-10 min-h-[22rem] sm:min-h-[26rem]">
        <div className="absolute -inset-8 sm:-inset-10">
          <Image
            src={portraitSrc}
            alt={portraitAlt}
            fill
            priority
            sizes="(min-width: 1024px) 32rem, 100vw"
            className="hero-portrait-object hero-portrait-scale h-full w-full object-cover z-[1]"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/45 to-transparent" />
        <div className="relative z-10 mt-auto flex flex-col gap-3 drop-shadow-[0_1px_6px_rgba(0,0,0,0.25)]">
          <span className="inline-flex w-fit items-center rounded-full bg-accent/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent-foreground shadow-sm shadow-accent/40 backdrop-blur-sm">
            Portrait
          </span>
          <div className="max-w-md space-y-2 rounded-2xl bg-secondary/35 p-6 backdrop-blur-md shadow-inner shadow-secondary/40">
            <p className="text-lg font-semibold tracking-wide text-accent-foreground sm:text-xl">{expertName}</p>
            <p className="text-sm leading-relaxed text-accent-foreground opacity-90 sm:text-base">{portraitCaption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

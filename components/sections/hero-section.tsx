"use client";

import {useEffect, useRef, useState} from "react";
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

const CALENDLY_EVENT_URL = "https://calendly.com/teo6oro/new-meeting";
const DEFAULT_EMBED_DOMAIN = "theodors.ch";

export function HeroSection({hero, ctas}: HeroSectionProps) {
  const t = useTranslations("landing");
  const calendlyFrameRef = useRef<HTMLIFrameElement | null>(null);
  const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null);
  const expertName = hero.expertName ?? "Teodoro Morcone";
  const calendlyLoadingLabel =
    hero.calendlyLoadingFallback ??
    t("hero.calendlyLoadingFallback", {defaultMessage: "Calendly scheduling is loading…"});

  useEffect(() => {
    const hasWindow = typeof window !== "undefined";
    const host = hasWindow && window.location.hostname ? window.location.hostname : DEFAULT_EMBED_DOMAIN;

    if (!hasWindow) {
      console.info("[HeroSection] Calendly iframe deferred", {
        heading: hero.heading,
        hasWindow,
        host,
      });
      return;
    }

    const url = new URL(CALENDLY_EVENT_URL);
    url.searchParams.set("embed_domain", host);
    url.searchParams.set("embed_type", "Inline");
    url.searchParams.set("hide_event_type_details", "1");
    url.searchParams.set("hide_gdpr_banner", "1");

    const nextUrl = url.toString();

    setCalendlyUrl((prev) => (prev !== nextUrl ? nextUrl : prev));

    console.info("[HeroSection] Calendly iframe ready", {
      heading: hero.heading,
      hasWindow,
      host,
      url: nextUrl,
    });
  }, [hero.heading]);

  useEffect(() => {
    if (typeof window === "undefined") {
      console.info("[HeroSection] Calendly width instrumentation skipped", {phase: "ssr"});
      return;
    }

    if (!calendlyUrl) {
      console.info("[HeroSection] Calendly width instrumentation pending", {phase: "awaiting-src"});
      return;
    }

    const logMetrics = (phase: string) => {
      const iframeEl = calendlyFrameRef.current;

      if (!iframeEl) {
        console.warn("[HeroSection] Calendly width instrumentation", {phase, hasElement: false});
        return;
      }

      const rect = iframeEl.getBoundingClientRect();
      const parentRect = iframeEl.parentElement?.getBoundingClientRect() ?? null;

      console.info("[HeroSection] Calendly width instrumentation", {
        phase,
        iframeWidth: rect.width,
        parentWidth: parentRect?.width ?? null,
      });
    };

    const handleResize = () => logMetrics("resize");
    const rafId = requestAnimationFrame(() => logMetrics("mount"));

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [calendlyUrl]);


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
      <div className="mt-10 lg:col-span-2">
        {calendlyUrl ? (
          <iframe
            ref={calendlyFrameRef}
            className="w-full rounded-3xl border border-secondary/20 bg-surface shadow-sm dark:border-surface/30 dark:bg-primary/30"
            src={calendlyUrl}
            style={{width: "100%", minWidth: 320, height: 700}}
            frameBorder={0}
            title="Calendly Booking"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-[700px] w-full items-center justify-center rounded-3xl border border-secondary/20 bg-surface text-sm text-secondary shadow-sm dark:border-surface/30 dark:bg-primary/30 dark:text-surface/80"
            role="status"
            aria-live="polite"
          >
            <span>{calendlyLoadingLabel}</span>
          </div>
        )}
      </div>
    </section>
  );
}
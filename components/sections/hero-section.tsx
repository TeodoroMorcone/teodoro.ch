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
        <figure className="flex flex-col gap-4">
          <div
            className="hero-wave"
            role="img"
            aria-label={hero.illustration?.alt ?? "Animated sinusoidal wave pattern inspired by mathematics"}
          >
            <span className="hero-wave__grid" aria-hidden="true" />
            <svg className="hero-wave__svg" viewBox="-200 0 2400 400" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="wavePrimary" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#19183B" stopOpacity="0.65" />
                  <stop offset="50%" stopColor="#19183B" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#19183B" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="waveSecondary" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#708993" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#708993" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#708993" stopOpacity="0.55" />
                </linearGradient>
                <linearGradient id="waveAccent" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#A1C2BD" stopOpacity="0.55" />
                  <stop offset="50%" stopColor="#A1C2BD" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#A1C2BD" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <path
                className="hero-wave__path hero-wave__path--primary"
                d="M-200 210 C -80 30 140 390 360 210 C 580 30 800 390 1020 210 C 1240 30 1460 390 1680 210 C 1900 30 2120 390 2340 210"
                fill="url(#wavePrimary)"
              />
              <path
                className="hero-wave__path hero-wave__path--secondary"
                d="M-220 250 C -20 430 200 70 420 250 C 640 430 860 70 1080 250 C 1300 430 1520 70 1740 250 C 1960 430 2180 70 2400 250"
                fill="url(#waveSecondary)"
              />
              <path
                className="hero-wave__path hero-wave__path--accent"
                d="M-240 170 C -60 -10 160 370 380 170 C 600 -10 820 370 1040 170 C 1260 -10 1480 370 1700 170 C 1920 -10 2140 370 2360 170"
                fill="url(#waveAccent)"
              />
            </svg>
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
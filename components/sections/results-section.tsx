import {SectionHeading} from "@/components/ui/section-heading";
import type {ResultsContent} from "@/types/landing";
import type {GoogleReview} from "@/lib/reviews/google";

import {ReviewsCarousel} from "./reviews-carousel";

type ResultsSectionProps = {
  results: ResultsContent;
  reviews?: GoogleReview[];
};

export function ResultsSection({results, reviews = []}: ResultsSectionProps) {
  const hasReviews = reviews.length > 0;
  const summary = results.reviewSummary;
  const hasSummary = Boolean(summary?.body?.length);
  const placeholders =
    !hasReviews && Array.isArray(results.placeholders) ? results.placeholders : [];
  const showPlaceholders = placeholders.length > 0;

  return (
    <section id="results" aria-labelledby="results-heading" className="scroll-mt-28">
      <div className="space-y-10">
        <SectionHeading id="results-heading" title={results.title} description={results.description} />

        {hasSummary ? (
          <div className="rounded-3xl border border-accent/30 bg-accent/10 p-6 shadow-sm dark:border-accent/40 dark:bg-primary/40">
            <div className="space-y-4">
              {summary?.badge ? (
                <span className="inline-flex items-center rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent dark:bg-accent/30 dark:text-primary">
                  {summary.badge}
                </span>
              ) : null}

              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-primary dark:text-surface">{summary?.headline}</h3>
                {summary?.body?.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-base leading-relaxed text-secondary dark:text-surface/80"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {summary?.ctaLabel && summary?.ctaHref ? (
                <a
                  href={summary.ctaHref}
                  className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-accent transition-colors duration-200 hover:text-primary hover:underline dark:text-accent dark:hover:text-surface"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {summary.ctaLabel} →
                </a>
              ) : null}
            </div>
          </div>
        ) : null}

        {hasReviews ? (
          <ReviewsCarousel reviews={reviews} />
        ) : showPlaceholders ? (
          <div className="space-y-4">
            {placeholders.map((placeholder) => (
              <div
                key={`${placeholder.type}-${placeholder.label}`}
                className="group flex items-center justify-between rounded-3xl border border-dashed border-secondary/40 bg-surface px-6 py-4 text-sm text-secondary transition-transform transition-colors duration-200 ease-soft-sine hover:-translate-y-1 hover:bg-primary hover:text-surface hover:shadow-sidebar dark:border-surface/30 dark:bg-primary/30 dark:text-surface/70 dark:hover:bg-surface dark:hover:text-primary"
              >
                <span>{placeholder.label}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-secondary/70 transition-colors duration-200 group-hover:text-surface/80 dark:text-surface/50 dark:group-hover:text-primary/80">
                  TODO
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
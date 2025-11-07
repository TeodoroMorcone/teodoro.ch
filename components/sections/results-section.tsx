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
          <div className="rounded-3xl border border-secondary/30 bg-accent-muted/85 p-6 shadow-[0_24px_65px_-45px_rgba(196,83,53,0.55)] backdrop-blur-sm dark:border-primary/30 dark:bg-primary/50">
            <div className="space-y-4">
              {summary?.badge ? (
                <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground shadow-sm shadow-accent/40 dark:bg-accent/90">
                  {summary.badge}
                </span>
              ) : null}

              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-primary dark:text-accent-foreground">{summary?.headline}</h3>
                {summary?.body?.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-base leading-relaxed text-secondary opacity-90 dark:text-accent-foreground/85"
                  >
                    {paragraph}
                  </p>
                ))}
                {summary?.stand ? (
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary/80 dark:text-accent-foreground/75">
                    {summary.stand}
                  </p>
                ) : null}
                {summary?.note ? (
                  <p className="text-sm text-secondary/85 italic dark:text-accent-foreground/80">{summary.note}</p>
                ) : null}
              </div>
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
                className="group flex items-center justify-between rounded-3xl border border-secondary/30 bg-surface/90 px-6 py-4 text-sm text-secondary opacity-90 shadow-[0_18px_45px_-40px_rgba(0,133,133,0.45)] transition-all duration-300 ease-soft-sine hover:-translate-y-2 hover:border-accent/40 hover:bg-accent-muted/85 hover:text-primary"
              >
                <span>{placeholder.label}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-primary/70 transition-colors duration-300 group-hover:text-primary">
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
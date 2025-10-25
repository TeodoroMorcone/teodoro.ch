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
  const placeholders = hasReviews ? [] : results.placeholders;

  return (
    <section id="results" aria-labelledby="results-heading" className="scroll-mt-28">
      <div className="space-y-10">
        <SectionHeading id="results-heading" title={results.title} description={results.description} />

        {hasReviews ? (
          <ReviewsCarousel reviews={reviews} />
        ) : (
          <div className="space-y-4">
            {placeholders.map((placeholder) => (
              <div
                key={placeholder.type}
                className="group flex items-center justify-between rounded-3xl border border-dashed border-secondary/40 bg-surface px-6 py-4 text-sm text-secondary transition-transform transition-colors duration-200 ease-soft-sine hover:-translate-y-1 hover:bg-primary hover:text-surface hover:shadow-sidebar dark:border-surface/30 dark:bg-primary/30 dark:text-surface/70 dark:hover:bg-surface dark:hover:text-primary"
              >
                <span>{placeholder.label}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-secondary/70 transition-colors duration-200 group-hover:text-surface/80 dark:text-surface/50 dark:group-hover:text-primary/80">
                  TODO
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
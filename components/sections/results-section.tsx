import {SectionHeading} from "@/components/ui/section-heading";
import type {OutboundLink, ResultsContent} from "@/types/landing";
import type {GoogleReview} from "@/lib/reviews/google";

type ResultsSectionProps = {
  results: ResultsContent;
  outboundLinks: OutboundLink[];
  reviews?: GoogleReview[];
};

export function ResultsSection({results, outboundLinks, reviews = []}: ResultsSectionProps) {
  const hasReviews = reviews.length > 0;
  const placeholders = hasReviews ? [] : results.placeholders;

  return (
    <section id="results" aria-labelledby="results-heading" className="scroll-mt-28">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div>
          <SectionHeading id="results-heading" title={results.title} description={results.description} />

          <div className="mt-8 space-y-4">
            {hasReviews ? (
              reviews.map((review) => (
                <article
                  key={`${review.authorName}-${review.relativeTimeDescription}`}
                  className="flex flex-col gap-3 rounded-3xl border border-secondary/20 bg-surface px-6 py-5 text-sm shadow-sm transition-shadow duration-200 ease-soft-sine hover:shadow-md dark:border-surface/20 dark:bg-primary/30"
                >
                  <header className="flex flex-wrap items-center gap-3">
                    {review.profilePhotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={review.profilePhotoUrl}
                        alt={`Avatar of ${review.authorName}`}
                        className="h-9 w-9 rounded-full border border-secondary/30 object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/30 text-xs font-semibold uppercase text-primary dark:text-surface">
                        {review.authorName.slice(0, 2)}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-semibold text-primary dark:text-surface">{review.authorName}</span>
                      <span className="text-xs uppercase tracking-[0.2em] text-secondary/70 dark:text-surface/60">
                        {review.relativeTimeDescription}
                      </span>
                    </div>
                    <div className="ml-auto flex items-center gap-1 text-xs font-semibold text-accent">
                      {Array.from({length: 5}).map((_, index) => (
                        <span key={index}>{index < Math.round(review.rating) ? "★" : "☆"}</span>
                      ))}
                    </div>
                  </header>

                  <p className="text-sm text-secondary dark:text-surface/80">{review.text}</p>

                  {review.url ? (
                    <a
                      href={review.url}
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-accent hover:underline"
                    >
                      View on Google
                    </a>
                  ) : null}
                </article>
              ))
            ) : (
              placeholders.map((placeholder) => (
                <div
                  key={placeholder.type}
                  className="flex items-center justify-between rounded-3xl border border-dashed border-secondary/40 px-6 py-4 text-sm text-secondary dark:border-surface/30 dark:text-surface/70"
                >
                  <span>{placeholder.label}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-secondary/70 dark:text-surface/50">
                    TODO
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <aside className="rounded-3xl border border-secondary/20 bg-surface p-6 shadow-sm dark:border-surface/20 dark:bg-primary/40">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary dark:text-surface/70">
            Authority Links
          </h3>
          <ul className="mt-4 space-y-3">
            {outboundLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.url}
                  className="flex flex-col rounded-2xl border border-secondary/20 px-4 py-3 text-sm transition-colors duration-200 ease-soft-sine hover:border-accent hover:text-accent"
                >
                  <span className="font-semibold">{link.name}</span>
                  <span className="text-xs text-secondary dark:text-surface/70">{link.description}</span>
                  <span className="mt-1 text-xs uppercase tracking-[0.2em] text-secondary/70 dark:text-surface/60">
                    {link.category}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
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
                  className="group flex flex-col gap-3 rounded-3xl border border-secondary/20 bg-surface px-6 py-5 text-sm text-primary shadow-sm transition-transform transition-colors duration-200 ease-soft-sine hover:-translate-y-1 hover:bg-primary hover:text-surface hover:shadow-sidebar dark:border-surface/20 dark:bg-primary/30 dark:text-surface dark:hover:bg-surface dark:hover:text-primary"
                >
                  <header className="flex flex-wrap items-center gap-3">
                    {review.profilePhotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={review.profilePhotoUrl}
                        alt={`Avatar of ${review.authorName}`}
                        className="h-9 w-9 rounded-full border border-secondary/30 object-cover transition-colors duration-200 group-hover:border-surface dark:group-hover:border-primary"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/30 text-xs font-semibold uppercase text-primary transition-colors duration-200 group-hover:bg-surface group-hover:text-primary dark:text-surface dark:group-hover:bg-primary dark:group-hover:text-surface">
                        {review.authorName.slice(0, 2)}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-semibold text-primary transition-colors duration-200 group-hover:text-surface dark:text-surface dark:group-hover:text-primary">
                        {review.authorName}
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em] text-secondary/70 transition-colors duration-200 group-hover:text-surface/80 dark:text-surface/60 dark:group-hover:text-primary/80">
                        {review.relativeTimeDescription}
                      </span>
                    </div>
                    <div className="ml-auto flex items-center gap-1 text-xs font-semibold text-accent transition-colors duration-200 group-hover:text-surface dark:group-hover:text-primary">
                      {Array.from({length: 5}).map((_, index) => (
                        <span key={index}>{index < Math.round(review.rating) ? "★" : "☆"}</span>
                      ))}
                    </div>
                  </header>

                  <p className="text-sm text-secondary transition-colors duration-200 group-hover:text-surface/85 dark:text-surface/80 dark:group-hover:text-primary/85">
                    {review.text}
                  </p>

                  {review.url ? (
                    <a
                      href={review.url}
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-accent transition-colors duration-200 hover:underline group-hover:text-surface dark:group-hover:text-primary"
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
                  className="group flex items-center justify-between rounded-3xl border border-dashed border-secondary/40 bg-surface px-6 py-4 text-sm text-secondary transition-transform transition-colors duration-200 ease-soft-sine hover:-translate-y-1 hover:bg-primary hover:text-surface hover:shadow-sidebar dark:border-surface/30 dark:bg-primary/30 dark:text-surface/70 dark:hover:bg-surface dark:hover:text-primary"
                >
                  <span>{placeholder.label}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-secondary/70 transition-colors duration-200 group-hover:text-surface/80 dark:text-surface/50 dark:group-hover:text-primary/80">
                    TODO
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <aside className="rounded-3xl border border-secondary/20 bg-surface p-6 shadow-sm transition-colors duration-200 dark:border-surface/20 dark:bg-primary/40">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary dark:text-surface/70">
            Authority Links
          </h3>
          <ul className="mt-4 space-y-3">
            {outboundLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.url}
                  className="group flex flex-col rounded-2xl border border-secondary/20 bg-surface/60 px-4 py-3 text-sm text-primary transition-transform transition-colors duration-200 ease-soft-sine hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-surface dark:border-surface/30 dark:bg-primary/20 dark:text-surface dark:hover:border-surface dark:hover:bg-surface dark:hover:text-primary"
                >
                  <span className="font-semibold">{link.name}</span>
                  <span className="text-xs text-secondary transition-colors duration-200 group-hover:text-surface/85 dark:text-surface/70 dark:group-hover:text-primary/85">
                    {link.description}
                  </span>
                  <span className="mt-1 text-xs uppercase tracking-[0.2em] text-secondary/70 transition-colors duration-200 group-hover:text-surface/80 dark:text-surface/60 dark:group-hover:text-primary/80">
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
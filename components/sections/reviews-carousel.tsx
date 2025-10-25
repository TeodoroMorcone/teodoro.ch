"use client";

import {useCallback, useEffect, useMemo, useState} from "react";

import type {GoogleReview} from "@/lib/reviews/google";

const DESKTOP_CHUNK_SIZE = 6;
const MOBILE_CHUNK_SIZE = 1;
const MOBILE_BREAKPOINT_QUERY = "(max-width: 639px)";

type ReviewsCarouselProps = {
  reviews: GoogleReview[];
};

type ReviewSlide = GoogleReview[];

function chunkReviews(reviews: GoogleReview[], size: number): ReviewSlide[] {
  const chunks: ReviewSlide[] = [];
  for (let index = 0; index < reviews.length; index += size) {
    chunks.push(reviews.slice(index, index + size));
  }
  return chunks;
}

export function ReviewsCarousel({reviews}: ReviewsCarouselProps) {
  const [chunkSize, setChunkSize] = useState(DESKTOP_CHUNK_SIZE);
  const slides = useMemo(() => chunkReviews(reviews, chunkSize), [reviews, chunkSize]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY);

    const applyChunkSize = (matches: boolean) => {
      const nextSize = matches ? MOBILE_CHUNK_SIZE : DESKTOP_CHUNK_SIZE;

      setChunkSize((current) => {
        if (current === nextSize) {
          return current;
        }

        setActiveIndex(0);
        return nextSize;
      });
    };

    applyChunkSize(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      applyChunkSize(event.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const totalSlides = slides.length;
  const canNavigate = totalSlides > 1;

  const goTo = useCallback(
    (nextIndex: number) => {
      if (!canNavigate) {
        return;
      }

      const normalized = (nextIndex + totalSlides) % totalSlides;
      setActiveIndex(normalized);
    },
    [canNavigate, totalSlides],
  );

  const goToPrevious = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const goToNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  if (slides.length === 0) {
    return null;
  }

  const activeSlide = slides[activeIndex] ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-3xl border border-secondary/20 bg-surface p-6 shadow-sm dark:border-surface/20 dark:bg-primary/20">
        <div className="grid gap-5 sm:grid-cols-2">
          {activeSlide.map((review) => (
            <article
              key={`${review.authorName}-${review.text.slice(0, 32)}`}
              className="group flex h-full flex-col gap-3 rounded-3xl border border-secondary/20 bg-surface px-5 py-4 text-sm text-primary shadow-sm transition-transform transition-colors duration-200 ease-soft-sine hover:-translate-y-1 hover:bg-primary hover:text-surface hover:shadow-sidebar dark:border-surface/20 dark:bg-primary/30 dark:text-surface dark:hover:bg-surface dark:hover:text-primary"
            >
              <header className="flex items-center gap-3">
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

                <div className="flex flex-1 items-center gap-2">
                  <span className="font-semibold text-primary transition-colors duration-200 group-hover:text-surface dark:text-surface dark:group-hover:text-primary">
                    {review.authorName}
                  </span>
                  <div className="ml-auto flex items-center gap-1 text-xs font-semibold text-[#f6c343] transition-colors duration-200 group-hover:text-[#ffd76f] dark:text-[#f6c343] dark:group-hover:text-[#ffd76f]">
                    {Array.from({length: 5}).map((_, index) => (
                      <span key={index}>{index < Math.round(review.rating) ? "★" : "☆"}</span>
                    ))}
                  </div>
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
                  View review source
                </a>
              ) : null}
            </article>
          ))}
        </div>

      </div>

      {canNavigate ? (
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-surface px-4 py-2 text-sm font-semibold text-secondary transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-surface/30 dark:bg-primary/40 dark:text-surface dark:hover:border-accent dark:hover:text-accent"
            onClick={goToPrevious}
            aria-label="Show previous testimonials"
          >
            ‹ Previous
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-surface px-4 py-2 text-sm font-semibold text-secondary transition-colors	duration-200 hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-surface/30 dark:bg-primary/40 dark:text-surface dark:hover:border-accent dark:hover:text-accent"
            onClick={goToNext}
            aria-label="Show next testimonials"
          >
            Next ›
          </button>
        </div>
      ) : null}

      {canNavigate ? (
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                type="button"
                className="h-2.5 w-9 rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                style={{
                  backgroundColor: isActive ? "var(--color-accent)" : "var(--color-secondary)",
                  opacity: isActive ? 1 : 0.3,
                }}
                onClick={() => goTo(index)}
                aria-label={`Show testimonials ${index + 1}`}
                aria-pressed={isActive}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
import "server-only";

import {readFile} from "node:fs/promises";
import path from "node:path";

import {publicSettings} from "@/config/public-settings";

export type GoogleReview = {
  authorName: string;
  rating: number;
  text: string;
  profilePhotoUrl?: string;
  url?: string;
};

type GooglePlaceReview = {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url?: string;
  author_url?: string;
};

type GooglePlaceDetailsResponse = {
  result?: {
    reviews?: GooglePlaceReview[];
    url?: string;
  };
  status?: string;
  error_message?: string;
};

type StaticReviewsPayload =
  | GoogleReview[]
  | {
      reviews?: GoogleReview[];
      locales?: Record<string, GoogleReview[] | undefined>;
    };

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY?.trim() ?? "";
const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID?.trim() ?? "";

const reviewsSettings = publicSettings.reviews ?? {};
const STATIC_FEED_PATH = reviewsSettings.staticFeedPath ?? "/data/google-reviews.json";
const FALLBACK_LOCALE = reviewsSettings.fallbackLocale ?? "de";
const REVIEWS_MODE = reviewsSettings.mode ?? "static";

function normalizeStaticPath(): string | null {
  if (!STATIC_FEED_PATH) {
    return null;
  }

  const trimmed = STATIC_FEED_PATH.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
}

async function readStaticReviews(limit: number): Promise<GoogleReview[]> {
  const normalizedPath = normalizeStaticPath();

  if (!normalizedPath) {
    return [];
  }

  const absolutePath = path.join(process.cwd(), "public", normalizedPath);

  try {
    const fileContent = await readFile(absolutePath, "utf-8");
    const parsed = JSON.parse(fileContent) as StaticReviewsPayload;

    const extractReviews = (payload: StaticReviewsPayload): GoogleReview[] => {
      if (Array.isArray(payload)) {
        return payload;
      }

      if (payload && typeof payload === "object") {
        if (Array.isArray(payload.reviews)) {
          return payload.reviews;
        }

        if (payload.locales && typeof payload.locales === "object") {
          const localized =
            payload.locales[FALLBACK_LOCALE] ??
            Object.values(payload.locales).find((value): value is GoogleReview[] =>
              Array.isArray(value),
            );

          if (Array.isArray(localized)) {
            return localized;
          }
        }
      }

      return [];
    };

    const reviews = extractReviews(parsed);

    if (!reviews.length) {
      console.warn(
        "[getGoogleReviews] Static reviews feed parsed successfully but contained no reviews.",
      );
    }

    return reviews.slice(0, limit);
  } catch (error) {
    console.warn(
      "[getGoogleReviews] Unable to load static reviews feed",
      STATIC_FEED_PATH,
      error,
    );
    return [];
  }
}

async function fetchApiReviews(limit: number): Promise<GoogleReview[]> {
  if (!GOOGLE_PLACES_API_KEY || !GOOGLE_PLACE_ID) {
    console.warn(
      "[getGoogleReviews] Places API keys missing. Falling back to static reviews (if available).",
    );
    return [];
  }

  const params = new URLSearchParams({
    place_id: GOOGLE_PLACE_ID,
    fields: "reviews,url",
    key: GOOGLE_PLACES_API_KEY,
  });

  const url = `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60 * 60 * 6,
      },
    });

    if (!response.ok) {
      console.error(
        "[getGoogleReviews] Failed to fetch reviews",
        response.status,
        response.statusText,
      );
      return [];
    }

    const data = (await response.json()) as GooglePlaceDetailsResponse;

    if (data.status !== "OK") {
      console.error(
        "[getGoogleReviews] Google Places API returned non-OK status",
        data.status,
        data.error_message,
      );
      return [];
    }

    const reviews = data.result?.reviews ?? [];

    return reviews.slice(0, limit).map((review) => {
      const mapped: GoogleReview = {
        authorName: review.author_name,
        rating: review.rating,
        text: review.text,
      };

      if (review.profile_photo_url) {
        mapped.profilePhotoUrl = review.profile_photo_url;
      }

      const reviewUrl = review.author_url ?? data.result?.url;
      if (reviewUrl) {
        mapped.url = reviewUrl;
      }

      return mapped;
    });
  } catch (error) {
    console.error("[getGoogleReviews] Unexpected error fetching reviews", error);
    return [];
  }
}

export async function getGoogleReviews(limit = 4): Promise<GoogleReview[]> {
  if (REVIEWS_MODE === "static") {
    return readStaticReviews(limit);
  }

  const apiReviews = await fetchApiReviews(limit);
  if (apiReviews.length) {
    return apiReviews;
  }

  const staticFallback = await readStaticReviews(limit);
  if (staticFallback.length === 0) {
    console.warn("[getGoogleReviews] No reviews available from API or static fallback.");
  }
  return staticFallback;
}
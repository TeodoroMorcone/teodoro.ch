import "server-only";

import {readFile} from "node:fs/promises";
import path from "node:path";

import {publicSettings} from "@/config/public-settings";

export type ReviewSource = {
  label: string;
  url: string | null;
};

export type GoogleReview = {
  authorName: string;
  rating: number;
  text: string;
  profilePhotoUrl?: string;
  socialIcon?: string;
  socialUrl?: string;
  source: ReviewSource;
  collectedAt?: string;
  locale?: string;
  contextNote?: string;
  sourceType?: string | null;
  sourceUrl?: string | null;
  sourceNote?: string | null;
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

type RawStaticReview = {
  authorName: string;
  rating: number;
  text: string;
  profilePhotoUrl?: string;
  socialIcon?: string;
  socialUrl?: string;
  source?: {
    label?: string;
    url?: string | null;
  };
  sourceType?: string | null;
  sourceUrl?: string | null;
  sourceNote?: string | null;
  collectedAt?: string;
  locale?: string;
  contextNote?: string;
};

type StaticReviewsDocument = {
  updatedAt?: string;
  reviews?: RawStaticReview[];
  locales?: Record<string, RawStaticReview[] | undefined>;
};

type StaticReviewsPayload = GoogleReview[] | StaticReviewsDocument;

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

function mapStaticReview(raw: RawStaticReview): GoogleReview {
  const label = raw.source?.label?.trim() || "Quelle hinterlegt";
  const url = raw.source?.url ?? null;

  const review: GoogleReview = {
    authorName: raw.authorName,
    rating: raw.rating,
    text: raw.text,
    source: {
      label,
      url,
    },
    sourceType: raw.sourceType ?? null,
    sourceUrl: raw.sourceUrl ?? null,
    sourceNote: raw.sourceNote ?? null,
  };

  if (typeof raw.profilePhotoUrl === "string" && raw.profilePhotoUrl.trim()) {
    review.profilePhotoUrl = raw.profilePhotoUrl;
  }

  if (typeof raw.socialIcon === "string" && raw.socialIcon.trim()) {
    review.socialIcon = raw.socialIcon;
  }

  if (typeof raw.socialUrl === "string" && raw.socialUrl.trim()) {
    review.socialUrl = raw.socialUrl;
  }

  if (typeof raw.collectedAt === "string" && raw.collectedAt.trim()) {
    review.collectedAt = raw.collectedAt;
  }

  if (typeof raw.locale === "string" && raw.locale.trim()) {
    review.locale = raw.locale;
  }

  if (typeof raw.contextNote === "string" && raw.contextNote.trim()) {
    review.contextNote = raw.contextNote;
  }

  return review;
}

async function readStaticReviews(limit: number): Promise<GoogleReview[]> {
  const normalizedPath = normalizeStaticPath();

  if (!normalizedPath) {
    return [];
  }

  const candidatePaths = [
    path.join(process.cwd(), normalizedPath),
    path.join(process.cwd(), "public", normalizedPath),
  ];

  let fileContent: string | null = null;

  for (const candidate of candidatePaths) {
    try {
      fileContent = await readFile(candidate, "utf-8");
      break;
    } catch {
      continue;
    }
  }

  if (!fileContent) {
    console.warn("[getGoogleReviews] Static reviews feed could not be located at", candidatePaths);
    return [];
  }

  try {
    const parsed = JSON.parse(fileContent) as StaticReviewsPayload;

    const extractReviews = (payload: StaticReviewsPayload): GoogleReview[] => {
      if (Array.isArray(payload)) {
        return payload;
      }

      if (payload && typeof payload === "object") {
        const document = payload as StaticReviewsDocument;

        if (Array.isArray(document.reviews)) {
          return document.reviews.map(mapStaticReview);
        }

        if (document.locales && typeof document.locales === "object") {
          const localized =
            document.locales[FALLBACK_LOCALE] ??
            Object.values(document.locales).find(
              (value): value is RawStaticReview[] => Array.isArray(value),
            );

          if (Array.isArray(localized)) {
            return localized.map(mapStaticReview);
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
      const reviewUrl = review.author_url ?? data.result?.url ?? null;

      const mapped: GoogleReview = {
        authorName: review.author_name,
        rating: review.rating,
        text: review.text,
        source: {
          label: "Google Rezension",
          url: reviewUrl,
        },
      };

      if (typeof review.profile_photo_url === "string" && review.profile_photo_url.trim()) {
        mapped.profilePhotoUrl = review.profile_photo_url;
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
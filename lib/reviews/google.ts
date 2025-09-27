import "server-only";

export type GoogleReview = {
  authorName: string;
  rating: number;
  text: string;
  relativeTimeDescription: string;
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

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID;

export async function getGoogleReviews(limit = 4): Promise<GoogleReview[]> {
  if (!GOOGLE_PLACES_API_KEY || !GOOGLE_PLACE_ID) {
    console.warn(
      "[getGoogleReviews] Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID. Returning empty reviews list.",
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
      // Cache for 6 hours; adjust as needed.
      next: {
        revalidate: 60 * 60 * 6,
      },
    });

    if (!response.ok) {
      console.error("[getGoogleReviews] Failed to fetch reviews", response.status, response.statusText);
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
        relativeTimeDescription: review.relative_time_description,
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
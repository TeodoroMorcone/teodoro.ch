const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

type ConsentCategory =
  | "ad_storage"
  | "analytics_storage"
  | "ad_user_data"
  | "ad_personalization";

export const CONSENT_CATEGORIES: ConsentCategory[] = [
  "ad_storage",
  "analytics_storage",
  "ad_user_data",
  "ad_personalization",
];

export const DEFAULT_CONSENT: Record<ConsentCategory, "denied" | "granted"> = {
  ad_storage: "denied",
  analytics_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

export const GRANTED_CONSENT: Record<ConsentCategory, "denied" | "granted"> = {
  ...DEFAULT_CONSENT,
  analytics_storage: "granted",
};

export function getMeasurementId(): string | null {
  return GA_MEASUREMENT_ID.length > 0 ? GA_MEASUREMENT_ID : null;
}

export function assertMeasurementId(): string {
  if (!GA_MEASUREMENT_ID) {
    throw new Error(
      "NEXT_PUBLIC_GA_MEASUREMENT_ID is required to enable Google Analytics 4.",
    );
  }

  return GA_MEASUREMENT_ID;
}
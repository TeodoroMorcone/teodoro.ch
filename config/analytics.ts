import {publicSettings} from "./public-settings";

type ConsentCategory =
  | "ad_storage"
  | "analytics_storage"
  | "ad_user_data"
  | "ad_personalization";

type MeasurementIdSource = "environment" | "public-config" | "unset";

const PUBLIC_MEASUREMENT_ID =
  typeof publicSettings.analytics?.gaMeasurementId === "string"
    ? publicSettings.analytics.gaMeasurementId.trim()
    : "";

const ENV_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
const GA_MEASUREMENT_ID = ENV_MEASUREMENT_ID || PUBLIC_MEASUREMENT_ID;

export const measurementIdSource: MeasurementIdSource = ENV_MEASUREMENT_ID
  ? "environment"
  : PUBLIC_MEASUREMENT_ID
    ? "public-config"
    : "unset";

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
  const measurementId = getMeasurementId();

  if (!measurementId) {
    throw new Error(
      "Analytics measurement ID missing. Set NEXT_PUBLIC_GA_MEASUREMENT_ID or update config/public-settings.json.",
    );
  }

  return measurementId;
}
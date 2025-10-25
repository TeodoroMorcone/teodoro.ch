import rawPublicSettings from "./public-settings.json";

export type PublicSettings = {
  analytics?: {
    gaMeasurementId?: string | null;
  };
  reviews?: {
    mode?: "api" | "static";
    staticFeedPath?: string | null;
    fallbackLocale?: string | null;
  };
  zoom?: {
    enabled?: boolean;
    consultation?: {
      deepLink?: string | null;
      fallback?: string | null;
      requiresPasscode?: boolean;
    };
    lesson?: {
      deepLink?: string | null;
      fallback?: string | null;
      requiresPasscode?: boolean;
    };
    requiresPasscode?: boolean;
  };
};

export const publicSettings: PublicSettings =
  rawPublicSettings && typeof rawPublicSettings === "object"
    ? (rawPublicSettings as PublicSettings)
    : {};
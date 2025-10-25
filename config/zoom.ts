import {publicSettings} from "./public-settings";

export type ZoomLink = {
  deepLink: string | null;
  fallback: string | null;
  requiresPasscode: boolean;
};

type ZoomSettings = NonNullable<typeof publicSettings.zoom>;

const ENV_KEYS = [
  "NEXT_PUBLIC_ZOOM_CONSULTATION_DEEP_LINK",
  "NEXT_PUBLIC_ZOOM_CONSULTATION_FALLBACK",
  "NEXT_PUBLIC_ZOOM_LESSON_DEEP_LINK",
  "NEXT_PUBLIC_ZOOM_LESSON_FALLBACK",
] as const;

const resolveValue = (value: string | null | undefined) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
};

function readEnv(key: (typeof ENV_KEYS)[number]): string | null {
  return resolveValue(process.env[key] ?? null);
}

const zoomSettings: ZoomSettings = publicSettings.zoom ?? {};

const consultationDeepLink =
  readEnv("NEXT_PUBLIC_ZOOM_CONSULTATION_DEEP_LINK") ??
  resolveValue(zoomSettings.consultation?.deepLink);
const consultationFallback =
  readEnv("NEXT_PUBLIC_ZOOM_CONSULTATION_FALLBACK") ??
  resolveValue(zoomSettings.consultation?.fallback);
const lessonDeepLink =
  readEnv("NEXT_PUBLIC_ZOOM_LESSON_DEEP_LINK") ?? resolveValue(zoomSettings.lesson?.deepLink);
const lessonFallback =
  readEnv("NEXT_PUBLIC_ZOOM_LESSON_FALLBACK") ?? resolveValue(zoomSettings.lesson?.fallback);

const consultationRequiresPasscode =
  zoomSettings.consultation?.requiresPasscode ?? zoomSettings.requiresPasscode ?? true;
const lessonRequiresPasscode =
  zoomSettings.lesson?.requiresPasscode ?? zoomSettings.requiresPasscode ?? true;

const hasAnyLink =
  Boolean(consultationDeepLink) ||
  Boolean(consultationFallback) ||
  Boolean(lessonDeepLink) ||
  Boolean(lessonFallback);

export const isZoomEnabled = zoomSettings.enabled ?? hasAnyLink;

if (process.env.NODE_ENV !== "production" && isZoomEnabled && !hasAnyLink) {
  console.warn(
    "[config/zoom] Zoom quick launch is enabled but no links are configured. Buttons will remain hidden until configured via public-settings.json or env vars.",
  );
}

export const ZOOM_LINKS: Readonly<{
  consultation: ZoomLink;
  lesson: ZoomLink;
}> = {
  consultation: {
    deepLink: consultationDeepLink,
    fallback: consultationFallback,
    requiresPasscode: consultationRequiresPasscode,
  },
  lesson: {
    deepLink: lessonDeepLink,
    fallback: lessonFallback,
    requiresPasscode: lessonRequiresPasscode,
  },
};
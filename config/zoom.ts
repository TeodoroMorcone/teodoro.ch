export type ZoomLink = {
  deepLink: string | null;
  fallback: string | null;
  requiresPasscode: boolean;
};

const ENV_KEYS = [
  "NEXT_PUBLIC_ZOOM_CONSULTATION_DEEP_LINK",
  "NEXT_PUBLIC_ZOOM_CONSULTATION_FALLBACK",
  "NEXT_PUBLIC_ZOOM_LESSON_DEEP_LINK",
  "NEXT_PUBLIC_ZOOM_LESSON_FALLBACK",
] as const;

function readEnv(key: (typeof ENV_KEYS)[number]): string | null {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : null;
}

const consultationDeepLink = readEnv("NEXT_PUBLIC_ZOOM_CONSULTATION_DEEP_LINK");
const consultationFallback = readEnv("NEXT_PUBLIC_ZOOM_CONSULTATION_FALLBACK");
const lessonDeepLink = readEnv("NEXT_PUBLIC_ZOOM_LESSON_DEEP_LINK");
const lessonFallback = readEnv("NEXT_PUBLIC_ZOOM_LESSON_FALLBACK");

if (process.env.NODE_ENV === "production") {
  const missing = ENV_KEYS.filter((key) => readEnv(key) === null);
  if (missing.length > 0) {
    throw new Error(`[config/zoom] Missing required environment variables: ${missing.join(", ")}`);
  }
} else {
  const missing = ENV_KEYS.filter((key) => readEnv(key) === null);
  if (missing.length > 0) {
    console.warn(
      "[config/zoom] Zoom deep links are not fully configured. Buttons will be hidden until variables are provided:",
      missing,
    );
  }
}

export const ZOOM_LINKS: Readonly<{
  consultation: ZoomLink;
  lesson: ZoomLink;
}> = {
  consultation: {
    deepLink: consultationDeepLink,
    fallback: consultationFallback,
    requiresPasscode: true,
  },
  lesson: {
    deepLink: lessonDeepLink,
    fallback: lessonFallback,
    requiresPasscode: true,
  },
};
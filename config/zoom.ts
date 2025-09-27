export type ZoomLink = {
  deepLink: string;
  fallback: string;
  requiresPasscode: boolean;
};

const DEFAULT_CONSULTATION_DEEP_LINK = "zoommtg://zoom.us/j/00000000000?pwd=TODO";
const DEFAULT_CONSULTATION_FALLBACK = "https://zoom.us/j/00000000000?pwd=TODO";
const DEFAULT_LESSON_DEEP_LINK = "zoommtg://zoom.us/j/00000000001?pwd=TODO";
const DEFAULT_LESSON_FALLBACK = "https://zoom.us/j/00000000001?pwd=TODO";

export const ZOOM_LINKS: Readonly<{
  consultation: ZoomLink;
  lesson: ZoomLink;
}> = {
  consultation: {
    deepLink: process.env.NEXT_PUBLIC_ZOOM_CONSULTATION_DEEP_LINK ?? DEFAULT_CONSULTATION_DEEP_LINK,
    fallback: process.env.NEXT_PUBLIC_ZOOM_CONSULTATION_FALLBACK ?? DEFAULT_CONSULTATION_FALLBACK,
    requiresPasscode: true,
  },
  lesson: {
    deepLink: process.env.NEXT_PUBLIC_ZOOM_LESSON_DEEP_LINK ?? DEFAULT_LESSON_DEEP_LINK,
    fallback: process.env.NEXT_PUBLIC_ZOOM_LESSON_FALLBACK ?? DEFAULT_LESSON_FALLBACK,
    requiresPasscode: true,
  },
};
import type {Metadata} from "next";

import {DEFAULT_LOCALE, HREFLANG_MAP, LOCALES, SUPPORTED_LOCALE_PATHS, type Locale} from "@/lib/i18n/locales";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://teodoro.ch").replace(/\/+$/, "");

const DEFAULT_OG_IMAGE_PATH = "/images/chalkbacsk.webp";

const OG_IMAGE_ALT: Record<Locale, string> = {
  de: "Kreidetafel-Hintergrund mit Mathe-Skizzen für Teodoro Morcone Nachhilfe.",
  it: "Sfondo a lavagna con schizzi matematici per il tutoring di Teodoro Morcone.",
  en: "Chalkboard backdrop with maths sketches for Teodoro Morcone tutoring.",
};

const OG_IMAGE_DIMENSIONS = {
  width: 1200,
  height: 630,
};

function toAbsoluteUrl(source: string): string {
  if (source.startsWith("http://") || source.startsWith("https://")) {
    return source;
  }

  return `${SITE_URL}${source.startsWith("/") ? "" : "/"}${source}`;
}

function normalizePath(path?: string): string {
  if (!path) {
    return "";
  }

  return path.replace(/^\//, "").replace(/\/$/, "");
}

function buildCanonical(locale: Locale, path: string): string {
  const localeBase = SUPPORTED_LOCALE_PATHS[locale] ?? `/${locale}`;
  const suffix = path ? `/${path}` : "";

  return `${SITE_URL}${localeBase}${suffix}`;
}

function buildHrefLangMap(path: string): Record<string, string> {
  const entries = LOCALES.map((locale) => {
    const hrefLang = HREFLANG_MAP[locale] ?? locale;
    return [hrefLang, buildCanonical(locale, path)];
  });

  return {
    ...Object.fromEntries(entries),
    "x-default": buildCanonical(DEFAULT_LOCALE, path),
  };
}

type OpenGraphImageOptions = {
  locale: Locale;
  imagePath?: string;
  alt?: string;
};

export function getOpenGraphImage({locale, imagePath, alt}: OpenGraphImageOptions) {
  const resolvedPath = imagePath ?? DEFAULT_OG_IMAGE_PATH;
  const resolvedAlt = alt ?? OG_IMAGE_ALT[locale];

  return {
    url: toAbsoluteUrl(resolvedPath),
    alt: resolvedAlt,
    ...OG_IMAGE_DIMENSIONS,
  };
}

type BuildPageMetadataOptions = {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  imagePath?: string;
  imageAlt?: string;
  robotsIndex?: boolean;
};

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  imagePath,
  imageAlt,
  robotsIndex = true,
}: BuildPageMetadataOptions): Metadata {
  const normalizedPath = normalizePath(path);
  const canonical = buildCanonical(locale, normalizedPath);
  const hrefLang = HREFLANG_MAP[locale] ?? locale;
  const alternates = buildHrefLangMap(normalizedPath);
  const openGraphImage = getOpenGraphImage({
    locale,
    ...(imagePath ? {imagePath} : {}),
    ...(imageAlt ? {alt: imageAlt} : {}),
  });

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: hrefLang,
      siteName: "Teodoro Morcone Nachhilfe",
      images: [openGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [openGraphImage.url],
    },
  };

  if (!robotsIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}
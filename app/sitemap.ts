import type {MetadataRoute} from "next";

import {LOCALES, SUPPORTED_LOCALE_PATHS} from "@/lib/i18n/locales";

const DEFAULT_SITE_URL = "https://teodoro.ch";

const STATIC_SEGMENTS = ["", "/legal/impressum", "/legal/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "");
  const lastModified = new Date();

  const localizedEntries: Array<MetadataRoute.Sitemap[number]> = LOCALES.flatMap((locale) => {
    const basePath = SUPPORTED_LOCALE_PATHS[locale];

    return STATIC_SEGMENTS.map((segment) => {
      const isLandingPage = segment === "";
      const changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = isLandingPage ? "weekly" : "yearly";
      const priority: MetadataRoute.Sitemap[number]["priority"] = isLandingPage ? 0.8 : 0.5;

      return {
        url: `${siteUrl}${basePath}${segment}`,
        lastModified,
        changeFrequency,
        priority,
      } satisfies MetadataRoute.Sitemap[number];
    });
  });

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...localizedEntries,
  ];
}
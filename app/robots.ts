import type {MetadataRoute} from "next";

const DEFAULT_SITE_URL = "https://teodoro.ch";
const DISALLOWED_IMAGES = ["/images/sad.webp", "/images/teodoro_happy.webp"];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED_IMAGES,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
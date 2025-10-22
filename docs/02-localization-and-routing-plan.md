# Localization & Routing Plan

## Goals
- Provide localized routes at /de, /it, /en with / redirecting to /de by default (and locale detection option).
- Ensure consistent translation keys across locales, stored under content/i18n/{locale}/.
- Configure middleware for Accept-Language negotiation, canonical/hreflang output, and x-default pointing to /de.
- Integrate next-intl with App Router for server & client components, including locale-aware metadata and JSON-LD.

## 1. Locale Configuration
- Supported locales: ["de","it","en"]; defaultLocale = "de".
- Represent locales in canonical form (lowercase) but include region-specific hreflang (de-CH, it-CH, en-CH) for SEO.
- Provide type Locale = "de" | "it" | "en" in types/i18n.d.ts for static typing.

## 2. Directory Structure
```
app/
├─ [locale]/
│  ├─ (landing)/page.tsx       // default segment for landing
│  ├─ layout.tsx               // wraps locale-specific providers
│  ├─ legal/
│  │  ├─ impressum/page.tsx
│  │  └─ privacy/page.tsx
│  └─ (components per section if needed)
middleware.ts
lib/i18n/
└─ content/i18n/
   ├─ de/
   │  ├─ common.json
   │  ├─ landing.json
   │  └─ legal.json
   ├─ it/
   │  ├─ common.json
   │  ├─ landing.json
   │  └─ legal.json
   └─ en/
      ├─ common.json
      ├─ landing.json
      └─ legal.json
```
- Optional segmentation: app/[locale]/(legal)/..., app/[locale]/(marketing)/... for route grouping while keeping layout manageable.

## 3. Translation Strategy
- Maintain shared keys across locales: top-level namespaces (common, landing, legal, cookie).
- Content sections in landing.json. Example key structure:
  ```
  {
    "hero": {...},
    "tldr": {...},
    "sections": {
      "services": {...},
      "howItWorks": {...},
      "pricing": {...},
      ...
    },
    "faq": [...],
    "glossary": [...]
  }
  ```
- Use Zod schema to validate translation structure for each locale at build time:
  - Provide schema files under content/schema/landing.ts.
  - Run a build-step script (optional) to validate (or integrate into tests).
- Provide TypeScript helper: getTranslations(locale, namespace) returning typed resources.

## 4. next-intl Integration
- Install next-intl@3 with App Router support.
- Create lib/i18n/locale.ts for locale metadata (name, path, native label).
- Create lib/i18n/get-dictionary.ts using import(`../../content/i18n/${locale}/${namespace}.json`) with dynamic segments to keep code splitting.
- Use NextIntlClientProvider in app/[locale]/layout.tsx, passing dictionary.
- Provide server-side helper createTranslatorFromServer in lib/i18n/translator.ts to fetch strings within RSC.
- For metadata, use generateMetadata in each page to produce locale-specific meta tags (title, description, canonical). Use translator inside to fetch strings.

## 5. Middleware & Routing
- middleware.ts uses createIntlMiddleware from next-intl/middleware with locales & default locale.
- Accept-Language negotiation:
  - Use Negotiator to parse `request.headers.get("accept-language")`.
  - Provide fallback to default if unsupported.
- Behavior:
  - Root "/" → 302 to user-preferred locale (if Accept-Language matches) else default /de.
  - Missing locale segments (like /legal) redirect to default.
- Exclude static assets (/_next/…) from middleware.

## 6. Locale Detection & Switcher
- Language switcher component should use locale-specific <Link> with `href={withLocalePath(targetLocale, pathname)}`.
- Provide helper in lib/i18n/routing.ts to rewrite current path to new locale while preserving segments & hashes.
- Use `useSelectedLayoutSegment()` to highlight active section.
- On server, use `unstable_setRequestLocale(locale)` inside layout to align Next metadata.

## 7. Hreflang & Canonicals
- In lib/seo/meta.ts create helper taking current locale path and returning <link rel="alternate"> for:
  - de-CH pointing to /de (and /de/...).
  - it-CH pointing to /it.
  - en-CH pointing to /en.
  - x-default pointing to /de.
- Ensure canonical for each locale uses full URL (https://teodoro.ch/{locale}/{slug}).
- Provide metadata.base in root layout to simplify building canonical URLs.

## 8. JSON-LD Localization
- Build JSON-LD through lib/seo/jsonld.ts.
- Each schema entity includes @language or inLanguage with locale-specific variants.
- Provide function `getLocalizedSpeakable(locale)` to include TL;DR and FAQ question IDs per locale.

## 9. Static Generation Strategy
- Use Next.js SSG for each locale:
  - Export `generateStaticParams` in app/[locale]/page.tsx returning locales.
  - For legal pages, same approach.
- Preload translations at build time to avoid runtime fetching.

## 10. Locale-aware Assets
- Provide metadata for open graph with per-locale text.
- For images (e.g., hero), ensure alt text translations are in translation files.

## 11. Cookie & Consent UX
- Cookie banner text stored under content/i18n/{locale}/cookie.json.
- Provide `CookieBanner` component receiving locale to display correct copy.
- Manage persistent cookie settings link (e.g., footer) referencing locale route /{locale}/legal/privacy#cookies.

## 12. Testing & Validation
- Add unit tests (Jest or Vitest optional later) verifying translation integrity.
- Add lighthouse checks verifying hreflang presence.
- Provide docs/03-l10n-routing-checklist.md (later) summarizing runtime checks.

## Dependencies / Tools
- next-intl/middleware and server library.
- @formatjs/intl-localematcher combined with negotiator.
- For typed translations: Use `zod` to enforce shape.

## Follow-up Actions
- Build layout plan (todo #3) to integrate locale switcher and navigation.
- Populate translation scaffolding with placeholder keys in each locale.
- Connect metadata generation and JSON-LD once content plan is finalized.
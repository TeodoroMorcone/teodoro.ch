# SEO & Structured Data Plan

## Objectives
- Deliver AEO-ready metadata across DE/IT/EN locales with hreflang and canonical management.
- Provide rich, localized JSON-LD schemas (ProfessionalService, Person, Service, FAQPage, HowTo, BreadcrumbList, SpeakableSpecification).
- Maintain minimal head footprint while ensuring consistent translation and cross-linking.

## 1. Metadata Strategy
- Use Next.js `generateMetadata` in each locale page.
- Title pattern:
  - DE: "Mathe sicher meistern | Teodoro Morcone Nachhilfe Zürich"
  - IT: "Domina la matematica | Ripetizioni Online Teodoro Morcone"
  - EN: "Master math with personalized tutoring | Teodoro Morcone Zurich"
- Description pulled from translations (80–155 chars).
- OG tags:
  - `og:title`, `og:description`, `og:url`, `og:locale` (de_CH, it_CH, en_CH).
  - `og:image`: hero image (1200x630, WebP) per locale if text differs; alt text localized.
- Twitter Card: summary_large_image with same image.

## 2. Canonical & Hreflang
- Base URL: https://theodors.ch.
- For each locale page:
  - Canonical: `/de`, `/it`, `/en`.
  - `<link rel="alternate" hreflang="de-CH" href="/de">`
  - `<link rel="alternate" hreflang="it-CH" href="/it">`
  - `<link rel="alternate" hreflang="en-CH" href="/en">`
  - `<link rel="alternate" hreflang="x-default" href="/de">`
- Legal pages follow same pattern with appended path (e.g., `/de/legal/impressum`).
- Provide helper `getAlternateLinks(locale, slug)` returning array.

## 3. Sitemap Planning
- Generate sitemap at build time using `next-sitemap` or custom route:
  - `/sitemap.xml` listing all locale pages and legal pages.
  - `/robots.txt` referencing sitemap.
- Ensure `priority` high for landing pages (0.8), lower for legal (0.5).
- Implementation optional but recommended; plan to add.

## 4. Structured Data JSON-LD
Define modules in `lib/seo/jsonld/`:

### 4.1 ProfessionalService (or EducationalOrganization)
- `@type`: ProfessionalService
- `name`: "Teodoro Morcone Nachhilfe"
- `image`: hero image URL
- `areaServed`: { "@type": "AdministrativeArea", "name": "Zurich, Switzerland" }
- `serviceType`: array for Gymnasium prep, BMS/HMS/FMS exam prep.
- `inLanguage`: current locale
- `url`, `telephone`, `email`
- `address`: PostalAddress with address fields.
- `priceRange`: "CHF 150-135" (approx; maintain truthful range or remove until confirmed).

### 4.2 Person
- `@type`: Person
- `name`: "Teodoro Morcone"
- `jobTitle`: "Math Tutor"
- `worksFor`: reference to ProfessionalService node via `@id`.
- `sameAs`: include Instagram (if public; else omit or placeholder? Provided as private, so skip to avoid linking private profile).
- `knowsLanguage`: ["de-CH","it-CH","en-CH"].

### 4.3 Service Nodes
- For each service, create `Service` schema with:
  - `name`, `description`
  - `provider`: reference to ProfessionalService `@id`.
  - `serviceType`: e.g., "Gymiprüfung Vorbereitung".
  - `areaServed`: same as above.
  - `offers`: `Offer` nodes if including pricing (ensure truthful). Provide price from plan (Single, 5-Pack, 10-Pack) with currency CHF.

### 4.4 FAQPage
- Align with FAQ data; each `mainEntity` includes `name` and `acceptedAnswer@type=Answer`.
- Guarantee identical question IDs across locales for cross referencing.

### 4.5 HowTo
- For mini how-to steps; include:
  - `name`
  - `description`
  - `supply` or `tool` if relevant (e.g., "Mock exams PDF").
  - Each `HowToStep` with textual instructions.

### 4.6 BreadcrumbList
- Items:
  1. Homepage (`/@locale`)
  2. Section anchored? For main page focus on root only.
  - For legal pages: index (Home) -> Legal -> Page.

### 4.7 SpeakableSpecification
- Provide speakable selectors referencing TL;DR heading and two top FAQ questions:
  - `@type`: SpeakableSpecification
  - `cssSelector`: ["#tldr", "#faq-cancellation", "#faq-response"].

### 4.8 Implementation Notes
- Compose JSON-LD as array and inject via `<script type="application/ld+json">`.
- Use `JSON.stringify` with replacer to remove undefined.
- Provide `getJsonLd(locale, content)` to map from translations to schema.

## 5. Metadata Helpers
- `lib/seo/meta.ts` includes:
  - `getDefaultMetadata(locale)`
  - `buildPageMetadata({ locale, path, titleKey, descriptionKey, imageKey })`.
  - `getOpenGraphImage(locale)` referencing image path.

## 6. AEO Considerations
- TL;DR section answers top-level queries with multi-lingual keywords.
- Intent clusters include headings aligning with user search (e.g., "Gymiprüfung Vorbereitung Zürich").
- Provide anchor links for each intent cluster; ensure `id` readable for search.

## 7. Internal Linking
- CTA buttons reference anchors (#services, #contact).
- Footer includes quick links to sections and legal pages.
- Outbound links (placeholders) open in new tab, use descriptive link text.

## 8. Head Tags
- Additional meta:
  - `meta name="viewport" content="width=device-width, initial-scale=1"`
  - `meta name="theme-color"` dynamic per theme (use `ThemeColor` Next metadata).
  - `meta name="format-detection" content="telephone=no"` to avoid auto hyperlink.
- Provide `link rel="icon"` referencing brand color icon (monochrome to stay within palette).
- Preload hero image in head.

## 9. Analytics & SEO Integration
- Ensure consent banner does not block crawling (non-intrusive).
- Use `next/head` metadata to avoid duplication.
- GA should not interfere with structured data (scripts placed after JSON-LD). JSON-LD kept lean (<10KB).

## 10. Sitemap & Robots Implementation Steps
1. Add `next-sitemap` dependency or create custom `app/sitemap.ts`.
2. Provide `generateSitemaps()` returning array with locale routes.
3. `robots.txt` allow all, disallow nothing, include sitemap URL.

## 11. Testing & Validation
- Use Google Rich Results Test for each locale (structured data).
- Validate hreflang via Search Console (manual).
- Use Screaming Frog or Sitebulb to verify canonical/hreflang combos.
- Lighthouse SEO target 100.
- Schema lint via `npm run lint:schema` (future script) or `yarn test:schema`.

## 12. Content & Keyword Alignment
- Ensure headings include localized keywords:
  - DE: "Gymiprüfung Vorbereitung Zürich (Online via Zoom)".
  - IT: "Preparazione esami BMS/HMS/FMS online (Zurigo)".
  - EN: "Gymnasium entrance exam coaching (Zurich) online".
- Include synonyms within copy to support search queries (without keyword stuffing).
- Provide meta keywords? Not necessary; omit.

## 13. Follow-Up Actions
- QA plan (Todo #10) to include automated structured data checks.
- Once real testimonials available, update structured data (e.g., `Review` nodes) ensuring compliance.

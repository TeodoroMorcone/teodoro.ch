# Teodoro Morcone Nachhilfe – Multilingual Math Tutor Landing Page

High-performance Next.js 14 (App Router) landing experience for Teodoro Morcone Nachhilfe. The site delivers a fully localized, accessibility-first funnel for German (default), Italian, and English learners with Swiss-compliant legal content, consent-aware GA4 analytics, and Zoom quick-launch actions.

## 1. Tech Stack & Principles

- **Framework**: Next.js 14 App Router (React Server Components first)
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS + shadcn/ui primitives, palette locked to brand colours (#19183B, #708993, #A1C2BD, #E7F2EF)
- **Localization**: `next-intl` with `/[locale]` routes (`/de`, `/it`, `/en`)
- **Forms**: `react-hook-form` + `zod`
- **Math Rendering**: KaTeX clientless rendering for hero snippet
- **Stateful Clients**: Theme toggle, consent banner, mobile drawer, language switcher, contact form
- **Analytics**: GA4 + Consent Mode v2 (default denied) via custom consent context

Performance targets (mobile, production): **LCP ≤ 1.8 s**, **INP ≤ 150 ms**, **CLS ≤ 0.05**, **Total JS ≤ 120 kB gz**, **CSS ≤ 35 kB gz**, **Fonts ≤ 100 kB**.

## 2. Getting Started

```bash
npm install
npm run dev
```

App serves at `http://localhost:3000`. Locale detection redirects `/` to `/de` unless a valid locale cookie exists.

### Required Environment Variables

Create `.env.local` (never commit):

```ini
NEXT_PUBLIC_ZOOM_CONSULTATION_DEEP_LINK=zoommtg://zoom.us/j/XXXXXXXXXXX?pwd=XXXXXXXX
NEXT_PUBLIC_ZOOM_CONSULTATION_FALLBACK=https://zoom.us/j/XXXXXXXXXXX?pwd=XXXXXXXX
NEXT_PUBLIC_ZOOM_LESSON_DEEP_LINK=zoommtg://zoom.us/j/YYYYYYYYYYY?pwd=YYYYYYYY
NEXT_PUBLIC_ZOOM_LESSON_FALLBACK=https://zoom.us/j/YYYYYYYYYYY?pwd=YYYYYYYY
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_PLACES_API_KEY=AIzaSyXXXXXX
GOOGLE_PLACE_ID=ChIJxxxxxxxxxxxxxxxx
CONTACT_FORM_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/XXXXXXX/XXXXXXXXX
CONTACT_FORM_WEBHOOK_SECRET=super-secure-token
```

- **Zoom links** must point to waiting-room enabled meetings with passcodes (no raw PMI).
- **Contact webhook** (optional) forwards submissions to your CRM/automation tool. If unset, submissions are accepted but only logged server-side.
- GA ID is optional locally; analytics loads only after consent.

## 3. Available Scripts

| Command                | Description |
| ---------------------- | ----------- |
| `npm run dev`          | Start dev server (hot reload). |
| `npm run build`        | Production build with type checks. |
| `npm run start`        | Serve production build (used by LHCI). |
| `npm run lint`         | ESLint (App Router + TypeScript rules). |
| `npm run lint:fix`     | Auto-fix lint issues. |
| `npm run typecheck`    | TypeScript `--noEmit`. |
| `npm run check`        | Lint + typecheck. |
| `npm run format`       | Prettier formatting. |
| `npm run analyze`      | Bundle analyzer (requires `BUNDLE_ANALYZE=true`). |
| `npm run perf:ci`      | Lighthouse CI with budgets (see §5). |
| `npm run qa`           | `check` + `perf:ci` – the recommended pre-deploy gate. |

Husky/lint-staged are prepared for future Git hooks (install via `npm run prepare`).

## 4. Localization Workflow

- Source copy lives in `content/i18n/{de,it,en}` with parallel JSON structures.
- Add new content keys across **all** locales before usage.
- `next-intl` middleware handles locale routing; update `lib/i18n/locales.ts` when adding languages.
- TL;DR, FAQ, Glossary, How-To remain semantically aligned between locales. Use placeholders marked `TODO` until client supplies evidence/social proof.
- Structured data (JSON-LD) reads localized content automatically (e.g., Service schema uses the current locale’s pricing strings).

## 5. Performance Tooling

- Lighthouse CI is configured via [`lighthouserc.json`](./lighthouserc.json) with budgets defined in [`lighthouse-budgets.json`](./lighthouse-budgets.json).
- Run `npm run perf:ci` to build, start the production server, and audit `/de`, `/it`, `/en` under mobile throttling. Assertions fail if budgets are exceeded (Performance ≥ 0.95, LCP/TBT/CLS/INP thresholds enforced).
- Review detailed guidance in [`docs/performance-budgets.md`](./docs/performance-budgets.md).
- Use `npm run analyze` to inspect bundle composition whenever dependencies change.

## 6. Consent & Analytics

- Consent defaults to **denied** for all categories until the user accepts via the cookie banner.
- Banner provides localized Accept / Reject / Manage actions with focus trap and keyboard support.
- GA4 loads lazily only after acceptance; see `components/consent` and `lib/analytics/gtag.ts`.
- `generate_lead`, `select_content`, `view_item_list`, and `view_promotion` events dispatch only when consented.
- Ensure `NEXT_PUBLIC_GA_MEASUREMENT_ID` is configured in production; `config/analytics.ts` will throw if GA is required but missing.

## 7. Zoom Quick Launch

- Zoom configuration resides in [`config/zoom.ts`](./config/zoom.ts); prefer env variables in production.
- Consultation CTA appears in hero and contact sections; lesson CTA optional but present.
- Buttons expose deep link + HTTP fallback URLs with localized ARIA labels and helper note about passcode/waiting room.

## 8. Legal & Compliance

- Impressum and Privacy pages exist for each locale under `app/[locale]/legal/...`.
- Contact/booking sections include VAT note (`Umsatz < CHF 100’000`), cancellation policy, and minors policy per locale.
- Cookie banner text matches Swiss/EU consent expectations and can be reopened via footer link.
- Documentation for compliance processes is tracked in `docs/08-legal-compliance-plan.md`.

## 9. QA Process

- Follow [`docs/qa-checklist.md`](./docs/qa-checklist.md) prior to deploy:
  - Verify navigation/drawer accessibility, consent flows, localized copy, analytics gating, performance budgets, structured data validation, and legal content accuracy.
- Optional monitoring placeholders outlined in `docs/10-quality-assurance-and-monitoring-plan.md`.

## 10. Deployment Notes

1. Run `npm run qa` locally; address any failures.
2. Provide `.env.production` with Zoom + GA values.
3. Deploy (e.g., Vercel). After first deploy, execute production Lighthouse audits and share report URLs.
4. Confirm consent flow on live domain and submit sitemap / hreflang via Google Search Console if applicable. The sitemap is available at `/sitemap.xml` and is generated dynamically at request time using the localized routes. Optionally set `NEXT_PUBLIC_SITE_URL` to override the default canonical host (`https://teodoro.ch`) when running in other environments.

### Render.com Deployment Checklist

1. **Create Web Service**
   - Blueprint: *Web Service*
   - Runtime: **Node 20 (LTS)**
   - Build command: `npm run build`
   - Start command: `npm run start`
   - Instance type: pick at least a Starter/Standard plan for consistent cold starts (middleware + SSR).

2. **Environment Variables**
   In the Render dashboard (`Settings → Environment`), add the variables listed in the *Required Environment Variables* section above. Recommended values:
   | Key | Notes |
   | --- | ----- |
   | `NEXT_PUBLIC_ZOOM_CONSULTATION_DEEP_LINK` | Zoom deep link for consultation meeting (passcode-protected). |
   | `NEXT_PUBLIC_ZOOM_CONSULTATION_FALLBACK` | HTTPS fallback URL (same meeting). |
   | `NEXT_PUBLIC_ZOOM_LESSON_DEEP_LINK` | Optional second meeting (leave empty to hide). |
   | `NEXT_PUBLIC_ZOOM_LESSON_FALLBACK` | HTTPS fallback for lesson. |
   | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 ID (omit in staging if not needed). |
   | `GOOGLE_PLACES_API_KEY` & `GOOGLE_PLACE_ID` | Required for reviews fetch. Restrict key to Places API + Render IP ranges if possible. |
   | `CONTACT_FORM_WEBHOOK_URL` (optional) | CRM/Zapier endpoint for contact submissions. |
   | `CONTACT_FORM_WEBHOOK_SECRET` (optional) | Bearer token Render will send in the `Authorization` header. |

   *Render automatically restarts the service when environment variables change; no additional configuration is needed.*

3. **Headers & Networking**
   - No custom header configuration is necessary—security headers & CSP are injected by `middleware.ts`.
   - Ensure the Render service is behind HTTPS (default). HSTS will instruct browsers to reuse TLS.
   - If deploying multiple instances, be aware the contact rate limiter is in-memory per instance. For higher traffic, add an external store (Redis) and update the limiter accordingly.

4. **Runtime Considerations**
   - Enable automatic deploys from your main branch or trigger manual redeploys after merging.
   - Turn on health checks (`/`) with sensible timeouts; the landing page is static and should respond quickly.
   - Optionally attach Render’s CDN (Static Outbound) for edge caching—CSP permits only the listed third-party domains.

5. **Post-deploy QA**
   - Visit your Render URL, accept/decline cookies, and verify GA requests respect consent.
  - Submit the contact form; confirm the 202 response, webhook delivery (if configured), and the success message.
  - Validate Zoom buttons appear only when links are provided.
  - Re-run Lighthouse (Render exposes deploy previews to test before switching DNS).

For further architectural context see the `docs/` folder (plans 01–10) covering scaffolding, localization, accessibility, analytics, SEO, and QA strategy.

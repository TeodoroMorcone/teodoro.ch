# Analytics & Consent Architecture Plan

## Objectives
- Integrate Google Analytics 4 with Consent Mode v2 and Swiss privacy compliance.
- Ensure GA4 loads only after explicit consent while preserving performance budgets.
- Provide localized cookie banner, consent management, and event taxonomy.

## 1. Consent Model Overview
- Default state: `denied` for analytics, ad_storage, ad_user_data, ad_personalization.
- Consent surfaces:
  1. Initial cookie banner (localized).
  2. Persistent "Cookie-Einstellungen" link in footer to reopen preferences.
- Decisions stored in localStorage (`consent-state`) and synchronized across tabs via StorageEvent.
- Provide `ConsentContext` to expose current status and actions.

## 2. GA4 Loading Strategy
- Use direct GA4 (gtag.js) integration for minimal overhead.
- Sequence:
  1. Inline script in `<head>` sets `window.dataLayer=[]` and `gtag` stub.
  2. Immediately call `gtag('consent', 'default', {...denied})`.
  3. When user accepts analytics, call `gtag('consent','update', {...granted})`.
  4. Only after accept, inject GA4 script via `next/script` with `strategy="lazyOnload"`.
  5. `gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true, transport_url: '', allow_google_signals: false, allow_ad_personalization_signals: false })`.
- Provide util `loadGaScript()` to append script tag once (guarded).
- Hide measurement ID in server runtime config (e.g., process.env.NEXT_PUBLIC_GA_ID sanitized). Use `config/analytics.ts` to fetch from env and assert presence.

## 3. Consent Categories & UI
- Categories:
  - Essential (always enabled, not toggled).
  - Analytics (covers GA4).
  - (Optional future marketing).
- Cookie banner copy from content/i18n/{locale}/cookie.json.
- Buttons:
  - Accept all → update to granted, load GA.
  - Essential only → keep denied (no GA).
  - Settings → open detailed preferences dialog with toggles.

## 4. Consent Data Flow
- `ConsentProvider` (client) actions:
  - `initialize()` reads localStorage. If previously accepted, load GA immediately (but still respect to re-apply consent update).
  - On `acceptAll()`: set analytics true, update GA, load script.
  - On `rejectAll()`: ensure GA script not loaded (if previously loaded, call `gtag('consent','update', { analytics_storage: 'denied' })` and disable event sending via custom flag).
  - On `updatePreferences()`: selective toggles—currently just analytics.
- Provide fallback to queue events until GA ready (see Section 6).

## 5. GA Event Taxonomy
| Event | Trigger | Params |
|-------|---------|--------|
| `page_view` | Automatic on route change (Next.js built-in). Ensure send to GA once loaded. | `page_location`, `page_title`, `language`. |
| `view_item_list` | When services section enters viewport (ActiveSection). | `item_list_id: "services"`, `item_list_name`, `items:[{ item_id, item_name }]`. |
| `select_content` | Zoom Quick Launch button click. | `content_type: "zoom_quick_launch"`, `content_id`, `locale`. |
| `generate_lead` | Contact form submit success. | `method: "contact_form"`, `locale`. |
| `view_promotion` | Hero CTA visible on load (once per session). | `promotion_id: "hero_cta"`, `creative_name`. |

- Ensure events do not include PII (no names, emails). Only IDs and locale strings.

## 6. Event Dispatch Implementation
- Provide `lib/analytics/gtag.ts`:
  ```
  export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
  export const sendEvent = (name: string, params?: GtagParams) => {
    if (!isGaReady()) return queueEvent({ name, params });
    window.gtag("event", name, params);
  };
  ```
- `isGaReady()` returns true once GA script loaded and consent granted.
- `queueEvent()` stores events in array; flush when ready.
- `useAnalytics` hook returns `trackEvent` referencing sendEvent.
- On route transitions (app router), use `useEffect` to send page_view if GA ready.

## 7. Consent Mode Implementation Details
- Use `gtag('set', 'ads_data_redaction', true)` to ensure IP anonymization and no advanced matching.
- Provide server component injecting `<script id="ga-consent-init">` with default consent snippet:
  ```
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied'
  });
  ```
- Provide aggregator to call `gtag('consent','update', ...)` when user toggles.

## 8. Compliance Considerations
- Document in README:
  - GA measurement ID stored in `.env.local` (not version controlled).
  - On reject, ensure GA script never fetched (for performance).
  - Provide instructions to delete stored consent by clearing localStorage key.
- Data privacy:
  - `anonymize_ip` true.
  - `allow_google_signals` false.
  - No linking of GA to other Google products.
  - Provide note in privacy policy about pseudonymous analytics only with consent.

## 9. Cookie Banner UX
- Layout:
  - Desktop: bottom left card using Surface background (#E7F2EF) with Primary text.
  - Buttons: Primary color for Accept, Secondary border for Essential, text button for Settings.
- Mobile: full-width bottom sheet (sheet component).
- Provide `aria-describedby` linking to body text.
- Manage button opens `ConsentPreferences` overlay with toggles (Switch component from shadcn).
- Provide `aria-live="assertive"` on banner container to announce appearance.

## 10. Performance Safeguards
- GA script inserted with `async` attribute once consent granted.
- `next/script` to inject with `strategy="afterInteractive"` or `lazyOnload` (choose `lazyOnload` to reduce initial load).
- Ensure no blocking of LCP; banner should be light (<5kb).
- Use `requestIdleCallback` to process queued events once GA ready (if available).

## 11. Environment & Config
- `.env.local`:
  ```
  NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXX
  ```
- `config/analytics.ts`:
  - Export `measurementId`, `consentDefaults`, `events`.
  - Provide `assertAnalyticsEnv()` to throw if missing when analytics enabled.
- In production, measurement ID required; in development, GA disabled (skip script load).

## 12. Testing Strategy
- Write unit tests for ConsentProvider:
  - Accept flow loads script (mock document.createElement).
  - Reject flow never loads.
  - Preferences update toggles localStorage.
- Integration test in Cypress (future) to ensure banner focus trap.
- CLI script to verify `ga.js` network not loaded without consent (Pa11y or Playwright test).
- Add manual QA checklist entry.

## 13. Documentation
- README section referencing:
  - How to configure measurement ID.
  - How to test consent flows.
  - How to add new events (update event map).
- Provide `docs/consent-testing-checklist.md` (future) with steps.

## 14. Follow-Up Tasks
- Performance strategy (Todo #7) to ensure GA integration stays within budgets.
- Legal deliverable plan (Todo #8) referencing consent text.
- SEO plan (Todo #9) to ensure no conflicting scripts in head.

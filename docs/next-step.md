# Next Implementation Step

## Focus: Todo #5 – GA4 Integration with Consent Mode v2

Interactive scaffolding (language switcher, theme toggle, consent banner, contact form, Zoom launch) is complete. The next milestone is to wire Google Analytics 4 with Consent Mode v2, introduce analytics event hooks, and ensure performance/privacy safeguards.

### 1. Analytics Configuration
- Create `config/analytics.ts` exporting measurement ID, consent defaults, and helper assertions (pull from `process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID`).
- Add `lib/analytics/gtag.ts` with `loadGaScript`, `gtag()` wrapper, ready flag, and event queue.
- Ensure GA code stays tree-shakeable and guarded behind consent checks.

### 2. Consent Provider Enhancements
- Update `ConsentProvider` to call `gtag('consent','default'| 'update', …)` using Consent Mode v2 categories (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` set to denied by default).
- Integrate GA script loading on accept and disable/keep denied on reject/preferences updates.
- Persist GA readiness flag for other components (e.g., via context or analytics util).

### 3. Event Hooks & Instrumentation
- Create `useAnalytics()` hook exposing `trackEvent` (no-op until GA ready).
- Instrument required events:
  - `view_promotion` on hero load (once) for CTAs.
  - `select_content` on Zoom quick launch buttons.
  - `view_item_list` when services section enters viewport (hook into ActiveSectionProvider or IntersectionObserver).
  - `generate_lead` on successful contact form submission.
- Ensure no PII (IDs/string enums only; include locale param where useful).

### 4. Script Placement & Performance
- Inject default consent inline script in `app/layout.tsx` `<head>` (server component) with minimal payload.
- Load GA via `next/script` or dynamic `loadGaScript` after consent (`strategy="lazyOnload"`), maintaining budgets (defer non-critical scripts).
- Respect dark/light classes and ensure no CLS introduced by banner or scripts.

### 5. Documentation & QA
- Update README and `docs/status-update.md` detailing analytics configuration steps, env requirements, and testing instructions.
- Document manual QA checklist for consent flows (accept/reject/manage) and verify GA requests only fire after consent.
- Prepare follow-up todos for legal copy/SEO/performance once analytics integration validated.

After GA4 integration is stable, proceed with Todo #6–#8 (legal refinements, SEO/JSON-LD, performance tooling & docs).
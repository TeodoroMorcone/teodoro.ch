# QA Checklist

Run this checklist before each release to ensure the landing page meets quality, accessibility, and compliance requirements.

## Localization & Routing
- [ ] `/de`, `/it`, `/en` render with correct locale strings and date/number formats where applicable.
- [ ] Hreflang tags include `de-CH`, `it-CH`, `en-CH`, and `x-default`.
- [ ] Language switcher changes locale without layout shift and preserves scroll position.
- [ ] Sidebar and section links reflect the active locale.

## Navigation & Accessibility
- [ ] Skip-to-content link is visible on focus and jumps to main region.
- [ ] Desktop sidebar is keyboard navigable; mobile drawer traps focus, closes with `Esc`, and restores focus.
- [ ] IntersectionObserver highlights the active section while scrolling.
- [ ] All interactive elements have visible focus outlines and ARIA labels where required.
- [ ] `prefers-reduced-motion` is respected (no flashing animations).

## Content Integrity
- [ ] TZ, pricing, cancellation, and minors policies match the latest stakeholder copy across locales.
- [ ] Services section includes Gymnasium and BMS/HMS/FMS variants in each language.
- [ ] About the Tutor text matches the approved translation in all locales.
- [ ] Zoom quick launch helper text references waiting room, passcode, and fallback URL.

## Consent & Analytics
- [ ] Cookie banner renders in DE/IT/EN with Accept / Reject / Manage options.
- [ ] Default consent denies GA4 storage; network tab shows no GA requests before acceptance.
- [ ] Accepting cookies loads GA4 once and tracks `page_view`; rejecting keeps GA disabled.
- [ ] Cookie settings link in footer reopens the banner (focusable & accessible).

## Contact & Forms
- [ ] Contact form validation messages are localized; submission shows success/error states.
- [ ] `generate_lead` GA event fires only after consent and successful submission.
- [ ] Zoom quick launch buttons trigger deep link on supported devices and fall back to https URL in browser.
- [ ] Contact details (email, phone, Instagram) match Impressum.

## Structured Data & SEO
- [ ] JSON-LD passes tests for EducationalOrganization, Service, FAQPage, HowTo, Speakable.
- [ ] Metadata titles/descriptions are localized; Open Graph/Twitter tags resolve.
- [ ] Outbound authority links are updated or marked TODO if awaiting client content.

## Performance & Budgets
- [ ] `npm run perf:ci` passes all assertions (Performance ≥ 0.95, LCP ≤ 1.8s, TBT ≤ 150ms, CLS ≤ 0.05, INP ≤ 150ms).
- [ ] Bundle analysis (`npm run analyze`) shows total JS ≤ 120 kB gz, CSS ≤ 35 kB gz, fonts ≤ 100 kB.
- [ ] Hero assets respect ≤ 120 kB size and use AVIF/WebP.

## Legal & Compliance
- [ ] Impressum and Privacy pages exist for each locale with correct address, contact, VAT note, minors policy.
- [ ] Cookie banner text aligns with Swiss consent requirements; reject path is non-blocking.
- [ ] Zoom links use waiting room + passcode; no PMI printed.

## Regression & Monitoring
- [ ] `npm run qa` completes successfully (lint, typecheck, perf).
- [ ] Performance report URLs saved in release notes or monitoring dashboard.
- [ ] Known issues or TODO placeholders documented for follow-up.

Record outcomes and noted issues in `docs/status-update.md` or the project tracking sheet.
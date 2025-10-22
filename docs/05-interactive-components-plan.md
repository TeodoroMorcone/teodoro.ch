# Interactive Components & Accessibility Plan

## Objectives
- Specify component responsibilities, props, and client/server boundaries for interactive features.
- Ensure all interactions (language switcher, theme toggle, forms, Zoom launch, cookie banner) meet WCAG 2.1 AA.
- Minimize client-side footprint by isolating dynamic logic into focused client components.

## 1. Component Inventory & Classification
| Component | Type | Purpose | Key Dependencies |
|-----------|------|---------|------------------|
| `LanguageSwitcher` | Client | Change locale, preserve current route/hash | next-intl, Router |
| `ThemeToggle` | Client | Toggle between light/dark/system | next-themes |
| `ZoomQuickLaunch` | Client | Trigger Zoom deep link with fallback | Zoom config, analytics |
| `CookieBanner` | Client | Consent Mode v2 manager | next/script, GA4 loader |
| `ConsentPreferences` | Client | Manage consent after initial choice | Local storage, GA4 |
| `ActiveSectionProvider` | Client | IntersectionObserver for nav | IntersectionObserver API |
| `MobileDrawer` | Client | Sidebar replication for small screens | shadcn/ui Sheet, radix |
| `SkipToContentLink` | Server | Provide skip link in layout | none |
| `CTAButton` | Server/Client (Hybrid) | Consistent CTA styling, variants | Tailwind classes |

## 2. Language Switcher
- Presentation: segmented control or dropdown inside sidebar/drawer.
- Props: `currentLocale`, `availableLocales`, `onLocaleChange`, `className`.
- Behavior:
  - On selection, push new locale route using `router.replace(withLocalePath(target))`.
  - Preserve hash when navigating to anchor sections.
  - Add aria-live polite announcement after switch for screen readers.
- Accessibility:
  - `<fieldset>` with `<legend>` (visually hidden) describing purpose.
  - Keyboard: arrow keys if segmented control (use roving tabindex). Dropdown fallback uses native select.
- Performance:
  - Client component but minimal logic; wrap with `React.memo`.

## 3. Theme Toggle
- Use next-themes `useTheme`.
- Render two-state toggle (icon button) with tooltip text.
- Control:
  - `onClick` cycles between light/dark (system accessible via context menu or extra button).
  - Persist via CSS class on `<html>` (class strategy, no flash).
- Accessibility:
  - Provide `aria-label` switch text localised.
  - Focus ring using Tailwind accent color.
- Performance:
  - Keep toggle lightweight (<2kb). Import only needed lucide icons (Sun, Moon) via direct import.

## 4. Mobile Drawer
- Implementation: shadcn/ui `Sheet` component with minimal variants.
- Trigger:
  - `HamburgerButton` with `aria-controls`, `aria-expanded`.
  - Use lucide `Menu` and `X`.
- Drawer Content:
  - Mirror sidebar sections, CTAs, language switcher, theme toggle.
  - Use `ActiveSectionProvider` to highlight current section.
- Accessibility:
  - Focus trap using Radix.
  - `aria-modal="true" role="dialog"` with labelledby referencing header.
  - Esc key closes; clicking overlay closes.
  - On open, body scroll lock (shadcn handles). On close, focus returns to trigger.
- Performance:
  - Lazy import `MobileDrawer` only when viewport < lg (optional use `useMediaQuery` to control mount).
  - No heavy animations (simple transform + transition).

## 5. Active Section Tracking
- `ActiveSectionProvider` (client):
  - Context storing active section ID.
  - Use IntersectionObserver with `threshold: [0.4]`.
  - Accept list of section IDs from parent.
  - Provide hook `useActiveSection()` consumed by nav links.
  - Debounce updates to avoid rapid state changes.
- Accessibility:
  - Visual indicator on nav items (border-left or accent dot).
  - `aria-current="true"` on active nav link.

## 6. Zoom Quick Launch
- `ZoomQuickLaunch` component:
  - Receives `links` from config (consultation, lesson).
  - Render primary deep link button (zoommtg://) and fallback button (https link).
  - Helper text referencing waiting room, passcode policy.
  - On click, dispatch analytics `select_content` event (only after consent).
- Accessibility:
  - Buttons with `aria-label` describing action + fallback.
  - Provide icon (lucide Video) with `aria-hidden`.
  - Include tooltip or helper chip referencing fallback.
- Performance:
  - Client component to handle analytics; static markup otherwise.

## 7. Contact Section (No Form)
- Implementation:
  - Present key contact details (email, phone, Instagram) with clear labels and links.
  - Embed Calendly inline via iframe; ensure fallback messaging while loading.
  - Provide optional policy block outlining cancellations and working with minors.
- Accessibility:
  - Maintain semantic headings and list structure for contact details.
  - Ensure Calendly iframe has descriptive title and `aria-live` fallback messaging.
  - Keep link targets descriptive and accessible (underline on hover, sufficient contrast).
- Performance:
  - Defer Calendly iframe initialization until client-side to avoid blocking SSR.
  - Reuse existing contact data shape to avoid extra client bundles.

## 8. Cookie Banner & Consent Manager
- `CookieBanner`:
  - Renders bottom sheet or corner card with Accept all, Essential only, Settings.
  - Consent state stored in `ConsentContext`.
  - On Accept: set consent via `gtag('consent','update',...)` and load GA4 (lazy script).
  - On Reject: keep denied; store decision.
  - On Manage: opens `ConsentPreferences` modal.
- Accessibility:
  - `role="dialog"` with focus trap.
  - Buttons keyboard accessible; default focus on Accept? Use first element.
  - Provide description text referencing privacy policy link.
  - Manage button triggers preferences overlay.
- Performance:
  - Hydrated once; but banner minimal.
  - GA script loaded via `next/script` with `strategy="lazyOnload"` only after consent.

- `ConsentPreferences`:
  - Local storage to persist choices.
  - Provide toggles for each consent category (analytics, marketing).
  - Submit updates `gtag`.
  - Provide link to reopen from footer (persisted `cookieSettings` link triggers context method).

## 9. Analytics Event Hooks
- Provide hook `useAnalytics()` returning methods to send events (no-ops until GA ready).
- Components:
  - Zoom Quick Launch button uses hook.
  - Services section view event triggered via IntersectionObserver or on section view (server hooking to route? optional).
- Ensure events sanitized (no PII). Event parameters localized keys (IDs) not user input.

## 10. Accessibility Enhancements
- Skip Link: `<a class="sr-only focus:not-sr-only" href="#main">` translatable label.
- Focus states: define consistent ring in Tailwind.
- Reduced motion: wrap smooth scroll with `if (prefers-reduced-motion) return`.
- Provide `aria-live` updates when toast messages appear (use accessible alert role).
- Drawer `SheetClose` ensures focus returns.
- Language switcher update uses polite region.

## 11. Component-Level Props & Types
- `LanguageSwitcherProps = { locale: Locale; locales: LocaleInfo[]; className?: string }`.
- `ThemeToggleProps = { className?: string }`.
- `ZoomQuickLaunchProps = { links: ZoomLink[]; layout?: "horizontal" | "vertical"; variant?: "hero" | "contact" }`.
- `CookieBannerProps = { locale: Locale; strings: CookieStrings }`.
- Provide `ZoomLink = { type: "consultation" | "lesson"; label: string; ariaLabel: string; deepLink: string; fallbackLink: string; helper?: string }`.

## 12. State Management
- Avoid global state libraries.
- `ConsentContext` using React context provider (client). Provide `consentState` and `setConsent`.
- `ActiveSectionContext` for nav.
- `AnalyticsContext` to flag GA readiness.

## 13. Imports & Tree Shaking
- Use `import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"` (shadcn).
- Use `import { Menu, X, Sun, Moon, Video } from "lucide-react"` and rely on Next.js tree shaking.
- No default lucide imports.

## 14. Testing Plans
- Use React Testing Library (future) to validate:
  - Language switch updates URL.
  - Theme toggle toggles class.
  - Cookie banner updates consent state.
- For IntersectionObserver, provide mock in tests.

## 15. Follow-Up Work
- GA4 + Consent architecture (Todo #6).
- Performance & asset optimization strategy (Todo #7).
- Implementation guidelines for legal content (Todo #8).
- Provide README instructions for interactive behavior.

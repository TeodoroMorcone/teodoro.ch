# Accessibility & Performance Optimization Plan

## Objectives
- Guarantee WCAG 2.1 AA compliance across layout, interactions, and content.
- Meet strict Core Web Vitals and asset budgets (LCP ≤1.8s, INP ≤150ms, CLS ≤0.05, JS ≤120kB gz, CSS ≤35kB gz, fonts ≤100kB).
- Establish build-time and runtime optimizations to keep the site blazing fast.

## 1. Accessibility Foundations
- Use semantic HTML structures (nav, main, section, header, footer).
- Provide skip-to-content link inside layout, focusing on main container.
- All sections have descriptive headings with hierarchical order (H1: hero, H2 sections).
- Ensure `aria-label` on nav landmarks: `<nav aria-label="Primary">`.
- Language attribute `<html lang={locale}>` set via layout.
- Provide consistent focus outlines using Tailwind `focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`.
- Ensure color contrast: Primary (#19183B) on Surface (#E7F2EF) passes AA; verify all combinations using Stark or color contrast tool.
- For KaTeX content, ensure `aria-hidden` on decorative equations and provide textual description.

## 2. Keyboard Navigation
- Sidebar links accessible sequentially; use `tabIndex` defaults.
- Drawer uses focus trap; pressing Escape closes and returns focus to trigger.
- Language switcher segmented control respects arrow keys (roving tab index).
- Theme toggle accessible via keyboard and screen reader (aria-pressed).
- Contact form fields follow natural order; submit button reachable via keyboard.

## 3. ARIA & Live Regions
- IntersectionObserver updates should add `aria-current="true"` on active nav item.
- Cookie banner uses role="dialog" with `aria-modal` and labelled by title text.
- Form validation errors announced via `aria-live="polite"`.
- Success/toast messages use `role="status"` to inform assistive technologies.

## 4. Reduced Motion & Animations
- Only utilize CSS transitions for hover/focus.
- Use `@media (prefers-reduced-motion: reduce)` to disable smooth scroll and drawer transitions.
- No parallax or heavy animations.

## 5. Image & Media Handling
- Use Next.js Image with `priority` for hero image, `placeholder="blur"` with blurred data URL.
- Provide explicit width/height to avoid CLS.
- Serve AVIF first, fallback to WebP.
- All decorative icons use `aria-hidden="true"`; meaningful icons have titles.

## 6. Font Strategy
- Prefer system font stack: `font-sans: ["Inter var",-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",sans-serif]`.
- If custom font required, limit to ≤2 weights and use `swap`.
- No web font preloads unless absolutely necessary.
- Keep total font payload ≤100kB gz; ideally 0 due to system fonts.

## 7. JavaScript Budget Enforcement
- Avoid heavy client libraries; ensure only necessary client components.
- Use Next.js App Router RSC for sections to avoid hydration.
- Configure bundle analyzer script to verify <120kB gz.
- Use dynamic imports for client-only components (e.g., cookie banner, contact form) with `suspense` fallback (loading skeleton).
- Use `optimizePackageImports` for lucide React to tree-shake icons.

## 8. CSS Optimization
- Tailwind JIT ensures tree-shaking; configure `content` globs properly.
- Keep `globals.css` minimal (variables, base styles).
- Use CSS variables for colors to avoid duplication.
- Avoid custom frameworks; rely on Tailwind utilities.

## 9. Performance Budgets & Monitoring
- Establish Lighthouse CI baseline with budgets:
  ```
  "performance": { "minScore": 0.95 },
  "budgets": [
    { "path": "/*", "timings": [{ "metric": "interactive", "budget": 1500 }] },
    { "path": "/*", "resourceSizes": [{ "resourceType": "script", "budget": 120 }] }
  ]
  ```
- Integrate GitHub Action (later) running `npx lhci autorun` on PRs.
- Manual QA: run `npm run analyze` to check bundle size.

## 10. LCP Optimization
- Hero section minimal: `H1`, `p`, CTA buttons, hero image using `priority`.
- Preload hero image via `<link rel="preload" as="image">` in head (with correct type).
- Defer non-critical CSS (only Tailwind compiled CSS). Ensure no blocking scripts.

## 11. INP Optimization
- Keep event handlers minimal; throttle IntersectionObserver updates.
- Avoid large synchronous work on route transitions (use server components).
- Contact form validation using zod (should be quick). Debounce heavy operations.

## 12. CLS Prevention
- Reserve heights for images, drawer overlays, and sections.
- Avoid dynamic content insertion above fold.
- Lazy load placeholder data with reserved space (for testimonials slider).
- Use Next Image `sizes` attribute to ensure responsive behavior.

## 13. Network Optimization
- Use Next.js automatic static optimization (SSG). All locale pages statically generated.
- Ensure caching headers:
  - Static assets: `cache-control: public, max-age=31536000, immutable`.
  - JSON translations (if served via route) use `stale-while-revalidate`.
- Provide `next.config.mjs` image domains if remote images used.
- Preconnect only to Zoom domain if necessary? Not needed due to deep link.

## 14. Head & Metadata
- Minimal `<head>` entries: meta tags, canonical/hreflang, JSON-LD script, analytics stub.
- Avoid extra preconnect/preload except hero image and optional font.

## 15. Observability
- Provide placeholder doc for Core Web Vitals monitoring vendor (e.g., `config/observability.ts` with TODO).
- Consider hooking GA4 to send web vitals events only after consent (if necessary, optional).

## 16. QA Checklist
- Manual testing steps:
  1. Keyboard navigation from top to bottom.
  2. Screen reader reading order (NVDA/VoiceOver).
  3. Lighthouse mobile Performance 95+, Access 100.
  4. LCP screenshot verifying hero image/time <1.8s on 4G.
  5. INP check using Chrome extension (target <150ms).
  6. CLS verifying no layout shifts on load/resizing.
  7. Validate color contrast with tooling.
  8. Check cookie banner focus trap and close behavior.

## 17. Dependencies & Tools
- `@axe-core/react` optional for dev debugging (import conditionally in dev).
- `next/font/google` avoided unless necessary; prefer system.
- `next/script` for GA with lazy loading.

## 18. Follow-Up Tasks
- Legal compliance plan (Todo #8) to ensure content aligns with privacy/performance disclaimers.
- SEO strategy (Todo #9) to coordinate JSON-LD with performance goals.
- QA plan (Todo #10) to integrate budgets into CI.

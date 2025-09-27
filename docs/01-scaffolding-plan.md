# Scaffolding Plan

## Objectives
- Create a clean Next.js 14 App Router baseline tailored to a tri-lingual landing page.
- Install and configure core UI/UX libraries (Tailwind, next-themes, shadcn/ui, lucide) in a modular way.
- Prepare infrastructure for localization, analytics consent, Zoom config, and strict performance targets.

## 1. Project bootstrap
1. In c:/Users/Tmorc/Desktop/theodors.ch, run:
   ```
   npx create-next-app@14.2.7 . --ts --app --tailwind --eslint --use-npm --no-src-dir --import-alias "@/*"
   ```
   - Accept prompts for Turbopack when available; decline example content.
2. Remove generated example routes/components to keep surface minimal.
3. Initialize Git repository with main branch (if not already) and create first commit after baseline lint passes.

## 2. Base directory layout
```
.
├─ app/
│  ├─ [locale]/
│  │  ├─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ legal/
│  │  │  ├─ impressum/page.tsx
│  │  │  └─ privacy/page.tsx
│  │  └─ (section folders as needed)
│  ├─ api/
│  │  └─ form/route.ts (contact form submission handler)
│  ├─ global-error.tsx
│  └─ not-found.tsx
├─ components/
│  ├─ layout/
│  ├─ sections/
│  ├─ shared/
│  └─ ui/ (shadcn primitives)
├─ config/
│  ├─ analytics.ts
│  ├─ zoom.ts
│  └─ site.ts
├─ content/
│  └─ i18n/
│     ├─ de/
│     │  └─ landing.json
│     ├─ it/
│     │  └─ landing.json
│     └─ en/
│        └─ landing.json
├─ lib/
│  ├─ analytics/
│  ├─ i18n/
│  ├─ seo/
│  ├─ ui/
│  └─ utils/
├─ public/
│  └─ images/
├─ styles/
│  └─ globals.css
└─ types/
   └─ content.d.ts
```
- Keep static assets in public/images/ with AVIF/WebP variants.
- The lib/seo/ folder will hold JSON-LD helpers and meta builders.

## 3. Dependencies
### Runtime
- next, react, react-dom
- next-intl for locale routing + translations
- @formatjs/intl-localematcher and negotiator for locale negotiation in middleware
- next-themes using class strategy
- react-hook-form, zod, @hookform/resolvers/zod
- katex, rehype-katex (if markdown needed) and clsx for class merging
- lucide-react (tree-shaken icons), @radix-ui/react-* packages only when a shadcn component needs them
- tailwind-merge and class-variance-authority for design tokens
- framer-motion is avoided; use CSS transitions only

### Dev / Build
- typescript, @types/node, @types/react, @types/react-dom
- eslint, eslint-config-next, @typescript-eslint/eslint-plugin, @typescript-eslint/parser, eslint-config-prettier
- prettier, prettier-plugin-tailwindcss
- tailwindcss, postcss, autoprefixer
- lint-staged, husky
- @next/bundle-analyzer (optional script to verify JS budget)
- msw (optional later for form testing)

## 4. Package.json scripts
- "dev": "next dev"
- "build": "next build"
- "start": "next start"
- "lint": "next lint"
- "lint:fix": "next lint --fix"
- "typecheck": "tsc --noEmit"
- "analyze": "BUNDLE_ANALYZE=true next build"
- "prepare": "husky install"
- "format": "prettier --cache --write ."

Add lint-staged block:
```
"lint-staged": {
  "*.{ts,tsx}": ["prettier --write", "next lint --fix --file"],
  "*.{js,jsx,json,css,md}": ["prettier --write"]
}
```

## 5. Global configuration files
- [next.config.mjs](./next.config.mjs)
  - Wrap with withNextIntl() plugin for locale-aware routing.
  - Enable experimental.optimizePackageImports to trim lucide-react.
  - Configure images.formats = ["image/avif","image/webp"] and compress = true.
  - Set redirects to route / → /de.
  - Expose GA measurement ID through runtime config (server only).
- [middleware.ts](./middleware.ts)
  - Use next-intl/middleware with locales ["de","it","en"] and default de.
  - Add x-default rewrite logic for root path.
  - Provide locale detection using next-intl helper with Negotiator.
- [tailwind.config.ts](./tailwind.config.ts)
  - Configure content globs for app, components, lib.
  - Extend theme with brand palette, focus ring, spacing tokens, typography.
  - Register fontFamily stack (system default + optional custom).
  - Add plugin for radix states if needed.
- [postcss.config.mjs](./postcss.config.mjs) standard Tailwind pipeline.
- [tsconfig.json](./tsconfig.json)
  - Set baseUrl to . and path alias @/*.
  - Enable strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes.
  - Include next-env.d.ts, app, components, lib, config, content.
- [eslint.config.mjs](./eslint.config.mjs)
  - Extend next/core-web-vitals, add custom rules for a11y, import ordering, and forbid default exports in components.

## 6. Styling foundation
- Use Tailwind global CSS in [styles/globals.css](./styles/globals.css) to define CSS variables for light/dark tokens and KaTeX overrides.
- Insert @font-face only if a single external font is approved; otherwise stick to system-ui.
- Configure dark mode using next-themes ThemeProvider at app/[locale]/layout.tsx with attribute="class" and defaultTheme="system".

## 7. Localization assets
- content/i18n/{de,it,en}/common.json for shared strings (nav, footer, metadata).
- content/i18n/{de,it,en}/landing.json for page content clusters.
- Additional files (legal.json, cookie.json) to keep sections manageable.
- Introduce type-safe translation helper via createTranslator and generated key types using zod schema for content.

## 8. Config modules
- [config/site.ts](./config/site.ts): base URLs, business metadata, hreflang map.
- [config/zoom.ts](./config/zoom.ts): consultation and lesson deep links + fallback, waiting room notes, localized labels fetch.
- [config/analytics.ts](./config/analytics.ts): GA4 measurement ID loader, consent defaults per locale, event names.
- Provide environment contracts in [types/env.d.ts](./types/env.d.ts) and validate using zod in lib/utils/env.ts.

## 9. Boilerplate providers
- app/[locale]/layout.tsx wraps html with lang, next-intl NextIntlClientProvider, ThemeProvider, ConsentProvider, AnalyticsBoundary.
- Create providers/ directory if clarity needed, but avoid unnecessary nesting.

## 10. Git hooks & automation
- Run npx husky add .husky/pre-commit "npm run lint-staged" after dependencies.
- Optional GitHub Actions workflow for lint + typecheck on push (add later in QA task).

## 11. Deployment & environment
- Target Vercel for hosting; configure VERCEL_ENV aware analytics toggles.
- Ensure .gitignore includes .env*, .next, node_modules, coverage temp.

## 12. Immediate follow-up tasks
- Populate localization architecture (Todo #2).
- Implement sidebar and layout skeleton components.
- Wire consent and GA placeholders before shipping.
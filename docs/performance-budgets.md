# Performance Budgets & Lighthouse CI

This project enforces aggressive performance targets focused on Core Web Vitals and transfer budgets to keep the landing page extremely fast across locales.

## 1. Lighthouse CI Configuration

Lighthouse CI is configured via [`lighthouserc.json`](../lighthouserc.json). Key parameters:

- **Preset**: Mobile
- **Throttling**: Simulated Slow 4G (75 ms RTT, ~1.6 Mbps throughput, 4× CPU slowdown)
- **Runs**: 1 per locale (`/de`, `/it`, `/en`)
- **Budgets**: Loaded from [`lighthouse-budgets.json`](../lighthouse-budgets.json)
- **Assertions**:
  - Performance category ≥ 0.95
  - Largest Contentful Paint ≤ 1.8 s
  - Total Blocking Time ≤ 150 ms
  - Cumulative Layout Shift ≤ 0.05
  - Experimental Interaction to Next Paint ≤ 150 ms

Run locally with:

```bash
npm run perf:ci
```

This builds the Next.js app, starts it on port 3000, and executes `lhci autorun`. Reports upload to temporary public storage for quick sharing.

## 2. Transfer Budgets

[`lighthouse-budgets.json`](../lighthouse-budgets.json) enforces gzipped resource limits per page:

| Resource Type | Budget |
| ------------- | ------ |
| JavaScript    | 120 kB |
| CSS           | 35 kB  |
| Fonts         | 100 kB |
| Images        | 400 kB |

Timings enforced via budgets:

| Metric                    | Budget  |
| ------------------------- | ------- |
| First Contentful Paint    | 1.2 s   |
| Largest Contentful Paint  | 1.8 s   |
| Total Blocking Time       | 150 ms  |
| Cumulative Layout Shift   | 0.05    |
| Time to Interactive       | 3.5 s   |

## 3. Additional Recommendations

- Use `npm run analyze` to inspect webpack bundle composition when dependencies change.
- Monitor component hydration footprints—prefer React Server Components where possible.
- Keep hero image ≤ 120 kB and always serve WebP/AVIF with explicit sizing.

## 4. CI Integration (Future)

When a CI pipeline is introduced:

1. Install dependencies (`npm ci`).
2. Run `npm run qa` (lint + typecheck + perf audit).
3. Parse Lighthouse CI output and fail the workflow if any assertion breaches the budgets.

Document Lighthouse result URLs in release notes or upload to your monitoring dashboard to track regressions over time.
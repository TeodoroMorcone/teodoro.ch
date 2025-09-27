# Content Architecture & Data Modeling Plan

## Goals
- Define structured, locale-aware content schemas for all landing sections ensuring parity across DE/IT/EN.
- Provide modular JSON structures that support Server Components with minimal client hydration.
- Ensure placeholders for social proof adhere to policy (marked TODO) and translations stay synchronized.

## 1. Content Source Strategy
- Store primary content in JSON files under content/i18n/{locale}/.
- Separate namespaces for maintainability:
  - `common.json` — global nav labels, footer, CTA texts, meta defaults.
  - `landing.json` — hero, TL;DR, sections, FAQs, how-to steps, glossary, structured data strings.
  - `legal.json` — impressum, privacy policy sections, cookie settings copy.
  - `cookie.json` — cookie banner plus consent management labels.
- Provide TypeScript types in [types/content.d.ts](types/content.d.ts) to describe schema.

## 2. Section Data Model
Example (landing.json):
```
{
  "hero": {
    "heading": "...",
    "subheading": "...",
    "cta": {
      "primary": "...",
      "secondary": "...",
      "tertiary": {
        "label": "...",
        "ariaLabel": "...",
        "helper": "..."
      }
    },
    "mathSnippet": "\\frac{1}{x} + ...",
    "image": {
      "src": "/images/hero/math-tutor.avif",
      "alt": "...",
      "width": 1200,
      "height": 900
    }
  },
  "tldr": {
    "title": "...",
    "items": [
      { "label": "...", "description": "..." }
    ]
  },
  "sections": {
    "services": {
      "title": "...",
      "description": "...",
      "items": [
        {
          "id": "gymnasium",
          "name": "...",
          "copy": "...",
          "ctaLabel": "...",
          "zoomHint": "..."
        }
      ]
    },
    "howItWorks": {
      "title": "...",
      "steps": [
        { "id": "diagnose", "title": "...", "description": "...", "badge": "..." },
        ...
      ],
      "miniPlan": [
        { "label": "...", "detail": "...", "badgeVariant": "success" }
      ]
    },
    "results": {
      "title": "...",
      "description": "...",
      "placeholders": [
        { "type": "testimonial", "label": "TODO" },
        { "type": "logo", "label": "TODO" }
      ]
    },
    "about": {
      "title": "...",
      "body": "...",
      "bullets": [...]
    },
    "pricing": {
      "title": "...",
      "plans": [
        {
          "id": "single",
          "name": "...",
          "price": "...",
          "unit": "...",
          "features": ["..."],
          "cta": "..."
        }
      ],
      "note": {
        "vat": "Nicht MWST-pflichtig ...",
        "customPlan": { "label": "...", "href": "#contact" }
      }
    },
    "faq": {
      "title": "...",
      "items": [
        { "question": "...", "answer": "...", "id": "faq-cancellation" }
      ]
    },
    "howTo": {
      "title": "...",
      "intro": "...",
      "steps": [
        {
          "name": "...",
          "description": "...",
          "duration": "...",
          "materials": ["..."],
          "notes": ["..."]
        }
      ],
      "disclaimer": "..."
    },
    "comparison": {
      "title": "...",
      "description": "...",
      "columns": [
        { "key": "services", "label": "..." },
        ...
      ],
      "rows": [
        {
          "metric": "...",
          "values": {
            "single": "...",
            "fivePack": "...",
            "tenPack": "..."
          }
        }
      ],
      "footnote": "..."
    },
    "glossary": {
      "title": "...",
      "entries": [
        { "term": "...", "definition": "...", "relatedLinks": ["..."] }
      ]
    },
    "contact": {
      "title": "...",
      "description": "...",
      "details": [
        { "label": "Email", "value": "info@theodors.ch", "href": "mailto:..." }
      ],
      "form": {
        "title": "...",
        "fields": [
          { "id": "name", "label": "...", "placeholder": "...", "type": "text", "required": true }
        ],
        "privacyNote": "...",
        "submitLabel": "...",
        "success": "...",
        "error": "..."
      },
      "zoom": {
        "title": "...",
        "helper": "...",
        "buttons": [
          {
            "type": "consultation",
            "label": "...",
            "ariaLabel": "...",
            "deepLink": "zoommtg://...",
            "fallbackLink": "https://zoom.us/..."
          },
          {
            "type": "lesson",
            "label": "...",
            "ariaLabel": "...",
            "deepLink": "zoommtg://...",
            "fallbackLink": "https://zoom.us/..."
          }
        ]
      },
      "responseTime": "...",
      "officeHours": "..."
    }
  },
  "outboundLinks": [
    { "name": "...", "url": "https://...", "description": "...", "category": "authority" }
  ],
  "schema": {
    "organization": {
      "name": "...",
      "description": "...",
      "services": ["Gymnasium", "BMS/HMS/FMS"],
      "keywords": ["..."]
    },
    "faq": { "mainEntity": ["faq-cancellation", ...] },
    "howTo": { "id": "howto-gymipruefung" }
  }
}
```

## 3. TL;DR Content
- 3–5 bullet points per locale capturing Who/What/Where/Price/How to start.
- Use 60-character limit per bullet for readability.
- Store in `tldr.items`; highlight with icons in UI (icons mapped by ID key).

## 4. Intent Clusters
- Each cluster 60–90 words.
- categories: audience, inclusions, gymiprüfung process, pricing, Zurich online-only, booking & response time.
- Represent as `sections.services.intents` array to map in hero or TL;DR (optional callout component).
- Provide tokens for highlight badges (e.g., `badge: "Gymiprüfung"`).

## 5. FAQ
- 6–8 entries; include cancellation policy, materials provided, Zoom online-only, response time, payment terms, data privacy, BMS/HMS/FMS logistics.
- IDs stable per locale (e.g., `faq-cancellation`).
- Provide optional `isHighlighted` flag for speakable schema.

## 6. Mini How-To
- Steps for Gymnasium/BMS/HMS/FMS prep (3–4 steps).
- Each step includes `duration`, `owner` (tutor/student) for future use.
- Optionally embed KaTeX expression per step; store as string.

## 7. Comparison Table
- Columns: Single, 5-Pack, 10-Pack, plus "Custom".
- Metrics: Session length, Price per lesson, Total value, Included extras (progress reports, mock exams, homework support).
- Represent values as string to maintain localization (e.g., "CHF 150 / 60 Minuten").
- Provide `badge` for recommended plan (e.g., 5-Pack). UI will highlight.

## 8. Glossary
- Terms relevant to Swiss education (Gymiprüfung, Aufnahmeprüfung, BMS, HMS, FMS, Lernziele, Prüfungsaufgaben).
- `relatedLinks` with placeholder TODO to insert credible sources later.
- Provide short definitions (≤ 35 words), referencing Zurich context.

## 9. Outbound Links
- Provide placeholders with `label: "TODO"`, `url: "https://example.com"` until real data available.
- categorize by type (authority, resource).

## 10. Forms & Validation Copy
- Contact form fields: name, email, phone (optional), student level, message.
- Provide error messages under `form.validation` (e.g., `required`, `invalidEmail`, `consentRequired`).
- Provide success and failure toast messages.
- Provide consent checkbox label referencing privacy policy.

## 11. Zoom Quick Launch
- Config stored in config/zoom.ts, referencing env-supplied deep links.
- Translations include labels, aria labels, and helper text referencing fallback.
- Provide `availabilityNote` string to mention waiting room + passcode requirement.

## 12. Social Proof Placeholders
- Under `results.placeholders`, include arrays with `label: "TODO - Case study pending"` etc.
- UI should render consistent skeleton placeholders with TODO badges.

## 13. Legal & Compliance Content
- `legal.json` structure:
  ```
  {
    "impressum": {
      "title": "...",
      "sections": [
        { "heading": "...", "body": ["paragraph 1", "paragraph 2"] }
      ]
    },
    "privacy": {
      "title": "...",
      "intro": "...",
      "sections": [
        {
          "id": "controller",
          "heading": "...",
          "body": "...",
          "list": ["..."]
        }
      ],
      "rights": { "title": "...", "items": [...] },
      "contact": {...}
    },
    "cookieSettings": {
      "title": "...",
      "description": "...",
      "categories": [
        {
          "id": "essential",
          "label": "...",
          "description": "...",
          "cookies": ["..."]
        },
        ...
      ]
    }
  }
  ```
- Provide minors policy, cancellation terms, and VAT note as explicit sections.

## 14. JSON-LD Content Keys
- Under `schema`, provide localized strings for:
  - `organizationLegalName`, `organizationDescription`, `serviceDescriptions`.
  - `tutorName`, `tutorBio`.
  - `serviceArea`: "Remote (Zurich-based)" etc.
  - `faqQuestions` referencing IDs to ensure consistent JSON-LD generation.
  - `howToSteps` replicating mini how-to.

## 15. Data Access Patterns
- Create `lib/content/getContent.ts` returning strongly typed object per locale and namespace.
- For heavy sections (FAQ, glossary), lazy load using dynamic import from server component to reduce initial bundle (server side still).
- Provide `transformers` to compute derived lists (e.g., CTA arrays with localized labels).

## 16. Content Governance
- Document process in README: update all locales simultaneously; run `npm run lint:content` (future script) to validate via Zod.
- Include comment block in translation files about placeholder data policy.
- Provide JSON schema-level comments (if using JSONC) or maintain separate MD doc describing keys.

## 17. Next Steps
- Elaborate interactive component specs (Todo #5) referencing data structures.
- Map legal compliance content (Todo #8) with more detailed outlines per section.
- Connect content to SEO plan (Todo #9) for metadata entries.
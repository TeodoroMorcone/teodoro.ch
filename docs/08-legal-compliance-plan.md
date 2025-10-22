# Legal & Compliance Plan

## Objectives
- Deliver locale-specific Impressum and Privacy Policy compliant with Swiss revDSG/FADP.
- Embed VAT note, minors policy, cancellation terms, and cookie management references throughout the site.
- Ensure consent handling, data processing, and contractual information align with Swiss and EU expectations.

## 1. Legal Pages Structure
- Routes:
  - `/[locale]/legal/impressum`
  - `/[locale]/legal/privacy`
- Both generated statically per locale with translated content from `content/i18n/{locale}/legal.json`.
- Layout: keep same sidebar/main shell to preserve navigation consistency; highlight legal section.

## 2. Impressum Requirements
- Mandatory data:
  - Business owner: Teodoro Morcone (Teodoro Morcone Nachhilfe)
  - Address: Eichbühlstrasse 33, 8004 Zürich, Schweiz
  - Email: info@teodoro.ch
  - Phone/WhatsApp: +41 76 244 02 59
  - Website: teodoro.ch
  - Statement: Umsatz < CHF 100’000/Jahr → nicht MWST-pflichtig (translated).
  - Lessons exclusively online via Zoom.
- Layout:
  - Title + definition list (label/value) for clarity.
  - Provide linkable contact details (mailto, tel).
  - Add note on business hours or response time if desired.

## 3. Privacy Policy Outline
- Sections (mirrored across locales):
  1. Introduction & scope.
  2. Controller & contact information.
  3. Purposes and processing activities (contact inquiries, booking, lessons, website security, optional statistics).
  4. Data categories handled.
  5. Legal bases (contract/pre-contract, legitimate interest, consent).
  6. Processors/recipients (hosting, email, Zoom, analytics).
  7. International transfers & safeguards (mention SCCs).
  8. Retention periods (lesson records, accounting per law).
  9. Rights of data subjects (access, rectification, deletion, etc.).
 10. Cookies & tracking (link to consent manager).
 11. Zoom usage (waiting room, no recording by default, consent needed).
 12. Newsletter policy (optional, double opt-in, unsubscribe).
 13. Minors handling (guardian consent required).
 14. Contact for data requests.
 15. Link to FDPIC (Bundesamt für Datenschutz) on DE version.

- Provide anchors for each section to support internal linking (e.g., `#rights`).
- Include last-updated date at top.

## 4. Cookie & Consent References
- Privacy policy references to cookie banner and ability to reopen via footer link.
- Provide instructions: `Cookie-Einstellungen` link triggers `ConsentPreferences`.
- Document categories (essential, analytics) and describe analytics only after consent.

## 5. VAT & Billing Note
- Pricing section: include note `Nicht MWST-pflichtig (Umsatz < CHF 100’000/Jahr)`.
- Reiterate in Impressum or legal page.
- Provide translation equivalents (IT: "non soggetta a IVA", EN: "not VAT-registered").

## 6. Minors Policy
- Landing page (contact section) include note: sessions for minors require guardian involvement/consent.
- Privacy policy dedicated section describing data minimization, no child names in Zoom display.

## 7. Cancellation & No-Show Terms
- Outline optional but recommended policy:
  - Cancellation ≥24h: free.
  - Late cancellations/no-show: 1 lesson billed.
  - Payment: invoice/transfer within 10 days.
- Include in pricing section, contact section, and optionally legal page (Terms snippet).
- Mark as placeholder if user wants to adjust later.

## 8. Zoom Usage Compliance
- Document in privacy policy:
  - Zoom with waiting room + passcode.
  - No default recordings; explicit consent required.
  - Meeting IDs use generated IDs (no PMI).
- Include helper text near Zoom Quick Launch.

## 9. Data Processing Agreements (DPAs)
- Document in README (and legal policy) list of processors requiring DPAs:
  - Hosting provider (TBD).
  - Email provider / newsletter.
  - Zoom.
  - Google (Analytics).
  - WhatsApp Business (if used).
  - Any CRM/contact-form vendors.

## 10. Outbound Authority Links
- Provide placeholders referencing authoritative Swiss education resources.
- Ensure links open in new tab with `rel="noopener noreferrer"`.

## 11. Footer Requirements
- Display contact information, legal links, language switcher, cookie settings link.
- Provide accessible text for link to privacy and impressum.

## 12. Consent & Privacy Copy
- Use provided starter snippets in translation files, expand as needed maintaining legal accuracy.
- Keep tone plain language, short paragraphs.

## 13. Compliance Checklist
- Add doc `docs/legal-compliance-checklist.md` later summarizing:
  - Consent banner tested.
  - Legal pages accessible.
  - Contact details correct in all locales.
  - Privacy sections align with actual processing.
  - GA4 consent updates documented.
  - Zoom deep links include passcode and waiting room settings.

## 14. Implementation Notes
- Legal pages should have structured data if necessary (Service, Organization) but keep minimal.
- Provide breadcrumbs referencing legal pages.
- Include `mailto:` button with icon (aria label).
- Add print-friendly styles (optional) to allow exporting legal pages.

## 15. Future Updates
- When real social proof provided, ensure privacy compliance (no full names without consent).
- If scheduling tool integrated (e.g., Calendly), update privacy policy and DPAs.

# Color Application Guidelines

This guide captures how the refreshed palette should be applied across the site so every surface, component, and interaction feels cohesive.

## Palette Tokens

| Token | Hex | Primary Usage |
| --- | --- | --- |
| `primary` | `#008585` | Brand-defining moments: headlines, key CTAs, primary navigation states |
| `secondary` | `#0F5B4B` | Supporting copy, secondary navigation text, subtle dividers |
| `accent` | `#C45335` | High-emphasis highlights: badges, chips, callouts, active icons |
| `accent-foreground` | `#FBF2C4` | Text/icon color sitting on top of the accent background |
| `accent-muted` | `#FFECCD` | Soft background washes for accent-driven sections and cards |
| `surface` | `#FFF1D6` | Default page background, card surfaces, neutral containers |

## Usage Rules

1. **Background tiers**
   - `surface` becomes the global page background (`body`, `main`, card shells).
   - `secondary` is a deep accent background for hero bands or high-impact sections.
   - `accent` is reserved for attention-grabbing stripes, floating action buttons, and highlights.

2. **Text hierarchy**
   - Headlines: `text-primary`.
   - Body copy / secondary text: `text-secondary`.
   - Elements on dark/secondary backgrounds switch to `text-accent-foreground` or `text-surface` for contrast.

3. **Interactive elements**
   - Primary CTA buttons: `bg-primary` with `text-accent-foreground`, hover to `bg-accent`.
   - Secondary actions: Outline buttons with `border-secondary` and `text-secondary`, hover shift to `border-accent` / `text-accent`.
   - Links in copy maintain `text-primary` and underline on focus/hover.

4. **Navigation**
   - Active states: `bg-primary` + `text-accent-foreground`.
   - Inactive states: `text-secondary` with hover `bg-accent-muted`.
   - Mobile drawer overlay: `bg-secondary/90` to deepen contrast.

5. **Cards & surfaces**
   - Default cards: `bg-surface` with `border-secondary/20`.
   - Accent cards: `bg-accent-muted` for featured content, text in `text-primary`.
   - Testimonial/review chips: `bg-primary/10`, `text-primary`.

6. **Feedback states**
   - Success / confirmation: `bg-primary/15`, `text-primary`.
   - Alert / warning: `bg-accent/10`, `text-accent`.

7. **Focus & hover**
   - Focus outlines: `outline-accent` or `ring-accent`.
   - Hover transitions dial toward accent shades (`accent` or `accent-muted`).

8. **Dark mode**
   - Global background shifts to `bg-primary`.
   - Text defaults to `text-surface`.
   - Surfaces flip: cards use `bg-secondary/30`, accents remain warm but lighten (`accent/70`).

Apply these rules while updating components so every surface, control, and state ties back to a consistent palette structure.

## Legacy utility mapping

Use this reference when migrating older utility classes to the refreshed palette tokens.

| Legacy class | Palette-aligned replacement | Notes |
| --- | --- | --- |
| `bg-background` | `bg-surface` | Default light surfaces |
| `bg-card` | `bg-surface` or `bg-accent-muted` | Choose `bg-accent-muted` for featured/spotlight cards |
| `text-white` | `text-accent-foreground` | For content on secondary or accent backgrounds |
| `text-black` | `text-primary` | For high-emphasis copy on surface backgrounds |
| `bg-white` | `bg-surface` | Neutral surface background |
| `border-border` | `border-secondary/30` | Standard border strength on light surfaces |
| `border-border/40` | `border-secondary/20` | Lighter border on translucent cards |
| `bg-emerald-500` callouts | `bg-primary` | Success/confirmation states |
| `text-emerald-500` | `text-primary` | Success messaging |
| `bg-slate-900` overlays | `bg-secondary/90` | High-contrast overlays/drawers |
| `bg-slate-800` overlays | `bg-secondary/80` | Secondary overlays/drawers |
| `border-white` | `border-accent-foreground/60` | Accent foreground outline |
| `hover:bg-white/10` | `hover:bg-accent-foreground/10` | Subtle hover on dark backgrounds |
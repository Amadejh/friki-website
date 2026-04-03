# Design System
*Read this before: writing any CSS, globals.css changes, Tailwind classes, animations, or visual components.*

---

## Colour Palette

This is a dark-only theme. There is no light mode. These are the **exact** values in `globals.css` — never use other values.

| Raw Token | CSS Variable alias | Hex | Usage |
|---|---|---|---|
| `--black` / `--background` | `bg-background` | `#0A0A0A` | Page background |
| `--surface` / `--card` | `bg-card` | `#111111` | Cards, navbar, drawers |
| `--surface-2` / `--secondary` | `bg-secondary` | `#1A1A1A` | Hover surfaces, input backgrounds |
| `--border-col` / `--border` | `border-border` | `#262626` | All borders and dividers |
| `--muted-text` / `--muted-foreground` | `text-muted-foreground` | `#525252` | Disabled, metadata, secondary labels |
| `--body-text` | `text-[var(--body-text)]` | `#A3A3A3` | Body copy, descriptions |
| `--white` / `--foreground` | `text-foreground` | `#FFFFFF` | Headings, primary text |
| `--red` / `--accent` / `--primary` | `bg-primary` / `text-primary` | `#C0392B` | CTAs, active states, category badges |

### How variables are structured in globals.css
```css
:root {
  /* Raw palette */
  --black: #0A0A0A;  --surface: #111111;  --surface-2: #1A1A1A;
  --border-col: #262626;  --muted-text: #525252;  --body-text: #A3A3A3;
  --white: #FFFFFF;  --red: #C0392B;

  /* Design token aliases (what shadcn uses) */
  --background: var(--black);       --foreground: var(--white);
  --card: var(--surface);           --border: var(--border-col);
  --primary: var(--red);            --accent: var(--red);
  --muted-foreground: var(--muted-text);
}
```

These are then mirrored into Tailwind's `@theme inline {}` block so every
`bg-background`, `text-foreground`, `border-border`, etc. class works automatically.

### Usage rules
- ALWAYS use CSS variables or Tailwind semantic classes — never hardcoded hex in component files
- Preferred: `bg-card`, `text-foreground`, `border-border`, `bg-primary`, `text-muted-foreground`
- When Tailwind class doesn't exist: `bg-[var(--surface-2)]` or `text-[var(--body-text)]`
- `#C0392B` on `#111111` has a 4.6:1 contrast ratio — WCAG AA compliant for large text; borderline for small
- `#525252` on `#0A0A0A` is below AA — use only for decorative/non-essential text
- `#A3A3A3` on `#0A0A0A` is AA compliant — use for body copy

---

## Typography

### Fonts
- **IBM Plex Sans** → `font-sans` / `var(--font-sans)` — all body text, UI, headings
- **IBM Plex Mono** → `font-mono` / `var(--font-mono)` — code, numbers, prices, event IDs

Both are loaded in `app/layout.tsx` via `next/font/google`. Font variables are on the `<html>` element.

### Fluid Type Scale
Use `clamp()` for headings to avoid breakpoint juggling:

```css
@theme {
  --text-sm: clamp(0.8rem, 0.17vw + 0.76rem, 0.9rem);
  --text-base: clamp(1rem, 0.34vw + 0.91rem, 1.19rem);
  --text-lg: clamp(1.13rem, 0.55vw + 0.99rem, 1.5rem);
  --text-xl: clamp(1.27rem, 0.85vw + 1.07rem, 1.88rem);
  --text-2xl: clamp(1.42rem, 1.23vw + 1.15rem, 2.36rem);
  --text-3xl: clamp(1.6rem, 1.75vw + 1.23rem, 2.96rem);
  --text-4xl: clamp(1.8rem, 2.44vw + 1.31rem, 3.71rem);
  --text-hero: clamp(2.5rem, 5vw + 1rem, 5.5rem);
}
```

### Hierarchy rules
- One `<h1>` per page — the page title
- `<h2>` for section headings
- `<h3>` for card titles and sub-sections
- `<p>` or `<span>` for body text
- Never skip heading levels (h1 → h3 without h2)

---

## Spacing & Layout

### Content max-width
```css
.content-wrap {
  max-width: 72rem; /* 1152px */
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2rem);
}
```

### Full-bleed sections
For sections where the background should extend edge-to-edge:
```css
.full-bleed {
  width: 100%;
  /* Children use .content-wrap for centred content inside */
}
```

### Section vertical spacing
- Hero: `100vh` or `min-h-screen`
- Regular sections: `py-16` to `py-24`
- Page body (non-hero content): `py-10` within `.page-body` wrapper

### Card spacing
- Card padding: `p-6` (compact) or `p-8` (spacious)
- Card gap in grid: `gap-4` (tight) or `gap-6` (standard)
- Cards use `--surface` background and `--border` border with `rounded-xl` or `rounded-2xl`

---

## Animation System

### Keyframes (define in globals.css)
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(1.5rem); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-2rem); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60%  { transform: translateX(-6px); }
  40%, 80%  { transform: translateX(6px); }
}
```

### Animation utility classes
```css
.animate-fade-up   { animation: fadeUp 0.5s ease-out both; }
.animate-fade-in   { animation: fadeIn 0.4s ease-out both; }
.animate-scale-in  { animation: scaleIn 0.4s ease-out both; }
.animate-slide-left { animation: slideInLeft 0.5s ease-out both; }
.animate-marquee   { animation: marquee 25s linear infinite; }
.animate-shake     { animation: shake 0.4s ease-in-out; }
```

### Stagger delays
```css
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }
.delay-500 { animation-delay: 500ms; }
.delay-600 { animation-delay: 600ms; }
.delay-700 { animation-delay: 700ms; }
```

### Reduced motion (mandatory)
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Hover Effects & Micro-interactions

### Card hover (`.card-hover`)
```css
.card-hover {
  transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
}
.card-hover:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--accent) 60%, transparent);
  box-shadow: 0 0 24px color-mix(in srgb, var(--accent) 20%, transparent);
}
```

### Gradient border on cards (`.card-border`)
Uses `::before` pseudo + mask technique to show gradient only in the border area.
```css
.card-border {
  position: relative;
}
.card-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, var(--border), transparent, var(--border));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
.card-border:hover::before {
  background: linear-gradient(135deg, var(--accent), transparent, var(--accent));
}
```

---

## Special Effects

### Film grain overlay (`.grain-overlay`)
Applied to the hero section for texture:
```css
.grain-overlay {
  position: relative;
}
.grain-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG noise */
  opacity: 0.045;
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 1;
}
```

### FRIKi logo on dark backgrounds
The logo PNG has a white logo on a transparent/black background. To prevent the visible bounding box:
```tsx
<Image
  src="/friki-logo.png"
  style={{ mixBlendMode: 'screen' }}
  alt="FRIKi"
/>
```

### Ambient logo glow
Behind the hero logo, place a blurred red ellipse:
```tsx
<div
  aria-hidden="true"
  style={{
    position: 'absolute',
    width: '50%',
    height: '30%',
    background: 'var(--accent)',
    filter: 'blur(80px)',
    opacity: 0.25,
    borderRadius: '50%',
    zIndex: 0,
  }}
/>
```

---

## Scrollbar Styling
```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--background); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--accent); }
```

## Selection Highlight
```css
::selection {
  background: color-mix(in srgb, var(--accent) 30%, transparent);
  color: var(--foreground);
}
```

## Focus Visible (Accessibility)
```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 2px;
}
```

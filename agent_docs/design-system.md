# Design System
*Read this before: writing any CSS, globals.css changes, Tailwind classes, or visual components.*
*Source of truth: `app/globals.css`. Last verified: Session 2 — April 3, 2026.*

---

## Colour Palette

This is a **light theme**. There is no dark mode. No theme toggle exists.

All raw tokens are defined in `app/globals.css` `:root {}` and aliased to shadcn semantic names.

| Raw Token | Hex | Usage |
|---|---|---|
| `--white` | `#FFFFFF` | Page background, card surfaces, modals |
| `--light-grey` | `#E8E5E0` | Section backgrounds (EventsCarousel), input fills |
| `--mid-grey` | `#B8B4AE` | All borders, dividers, placeholders |
| `--ash-grey` | `#787470` | Secondary/muted text, icons, metadata |
| `--charcoal` | `#3D3C3A` | Primary text, headings |
| `--deep-red` | `#EE352F` | CTAs, active nav pills, category badges, accent icons |

### Design token aliases (shadcn names)

```
--background      → var(--white)       → bg-background / bg-white
--foreground      → var(--charcoal)    → text-foreground
--card            → var(--light-grey)  → bg-card
--border          → var(--mid-grey)    → border-border
--muted-foreground→ var(--ash-grey)    → text-muted-foreground
--primary         → var(--deep-red)    → bg-primary / text-primary
```

### Token pipeline

```
app/globals.css
  :root {}           ← define raw vars + alias to shadcn names
  @theme inline {}   ← mirror to Tailwind's --color-* namespace
```

Raw tokens in `@theme inline` are also available as Tailwind classes:
`bg-deep-red`, `text-charcoal`, `bg-light-grey`, etc.

### Tech debt
Components currently use hardcoded hex values (e.g. `text-[#EE352F]`, `bg-[#E8E5E0]`) instead
of CSS variables or Tailwind semantic classes. This is known tech debt. A future refactor pass
should replace all hardcoded hex with `text-primary`, `bg-card`, etc. Do NOT add new hardcoded
hex to components — use semantic classes or `text-[var(--deep-red)]` instead.

---

## Typography

- **IBM Plex Sans** → `font-sans` — all body text, UI labels, headings
  Weights loaded: 300, 400, 500, 600, 700
- **IBM Plex Mono** → `font-mono` — numbers, dates, category labels, nav pills, eyebrows
  Weights loaded: 400, 500, 600

Both loaded in `app/layout.tsx` via `next/font/google`. Variables set on `<html>`.

---

## Layout

Content wrapper used consistently across all sections:
```
max-w-7xl mx-auto px-6 lg:px-8
```

Section vertical rhythm: `py-16 md:py-24`

---

## Animations

Only what actually exists in the codebase:

- **Hover transitions** — `transition-all duration-150/200/300` on nav links, cards, buttons
- **Carousel slide** — `transition-transform duration-500 ease-in-out` (EventsCarousel)
- **Archive FLIP** — CSS transitions on `left`, `top`, `width`, `height`, `border-radius`
  with `duration-[250ms] ease-out` on the modal container (Archive component)
- **Archive grid blur** — `filter blur-[2px] brightness-90 transition-[filter] duration-200`
  applied to the grid when modal is open
- **Card hover scale** — `hover:scale-[1.03] hover:-translate-y-0.5` on archive cards
- **Image hover scale** — `group-hover:scale-105 transition-all duration-500` on card images

No keyframe animations, no enter/exit animations, no marquee, no film grain.

`globals.css` includes `@custom-variant dark` (shadcn compatibility). Nothing in the app sets a
`.dark` class or mounts `ThemeProvider` — the UI is light-only.

### Tech debt
`prefers-reduced-motion` is NOT yet implemented. Users with vestibular disorders will see all
transitions. Add to `globals.css` in the Polish phase (1l):
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

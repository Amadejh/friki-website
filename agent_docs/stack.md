# Stack Details
*Read this when: checking versions, env vars, or what is actually wired up.*

---

## Versions (from `package.json`)

| | Version |
|---|---|
| Next.js | 16.2.0 |
| React / React DOM | 19.x |
| TypeScript | 5.7.3 |
| Tailwind CSS | ^4.2.0 (PostCSS pipeline via `@tailwindcss/postcss`) |

Fonts: **IBM Plex Sans** and **IBM Plex Mono** via `next/font/google` in `app/layout.tsx` (weights: Sans 300–700, Mono 400–600).

---

## Tailwind v4 (short)

- Entry: `@import 'tailwindcss'` in `app/globals.css` (not v3 `@tailwind` directives).
- Tokens: `:root` holds shadcn aliases + Friki raw palette; `@theme inline` exposes `--color-*` and maps semantic colors. Prefer this over a `tailwind.config.js` for theme values.

---

## shadcn/ui

- Style: **new-york**, CSS variables mode — see `components.json`.
- **Installed:** everything under `components/ui/` (accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb, button, button-group, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, empty, field, form, hover-card, input, input-group, input-otp, item, kbd, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, spinner, switch, table, tabs, textarea, toast, toaster, toggle, toggle-group, tooltip, use-mobile, use-toast).
- **Usage:** custom app components under `components/*.tsx` (excluding `ui/`) **do not import `@/components/ui/*` yet** — the kit is ready for future UI (forms, modals, etc.). Do not hand-edit `components/ui/`; regenerate via shadcn CLI.

---

## Dependencies: used vs installed

**Used by app routes and custom components today**

- `next`, `react`, `react-dom`
- `lucide-react` (icons)
- `react-icons` (e.g. Discord in footer)
- `clsx`, `tailwind-merge`, `class-variance-authority` — via `lib/utils.ts` (`cn`)
- `@vercel/analytics`

**Installed but not used by custom components / pages yet** (examples)

- `next-themes` — only referenced from unused `components/theme-provider.tsx` and some `components/ui/*` internals.
- `embla-carousel-react` — pulled in by `components/ui/carousel.tsx`; homepage carousel is custom CSS/transform, not this primitive.
- `recharts` — used by `components/ui/chart.tsx` only.
- `react-hook-form`, `@hookform/resolvers` — used by shadcn `components/ui/form.tsx` only.
- Large Radix suite — dependencies of shadcn primitives; no direct imports from app code yet.

---

## Environment variables

Documented in `.env.example`. **No `.env.local` in repo** — create locally when connecting services.

Placeholder fallbacks will be required for Supabase/Stripe/Resend SDK initialisation so `npm run build` works without real keys (see `SELF_IMPROVEMENT_LOG.md`).

---

## Commands

```bash
npm run dev      # localhost:3000
npm run build    # production build (types skipped while ignoreBuildErrors is on)
npx tsc --noEmit # typecheck
npm run lint     # eslint (requires eslint available on PATH)
```

---

## Phase 2 note

`next-intl` is **not** installed yet. When added, follow a dedicated routing migration — URL-based locales, not the current context-only toggle.

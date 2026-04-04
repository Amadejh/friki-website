# Architecture
*Read this when: adding routes, components, data fetching, or API boundaries.*

---

## What exists today

### Routes (`app/`)

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Homepage: Navbar, Hero, EventsCarousel, Archive, Footer |
| `/events/[slug]` | `app/events/[slug]/page.tsx` | Event detail; static params from `lib/data.ts` (`generateStaticParams`) |
| 404 | `app/not-found.tsx` | Global not-found UI |

There is **no** `/events` list page, **no** `app/api/*`, **no** `/merch`, `/past-events`, or `/tickets/success` yet.

### Root layout

- `app/layout.tsx` — IBM Plex fonts (CSS variables on `<html>`), `LanguageProvider`, Vercel Analytics, imports `app/globals.css`.

### Custom components (`components/`)

| File | Role |
|---|---|
| `navbar.tsx` | Fixed nav, mobile drawer, SL/EN toggle, section highlighting on `/` |
| `hero.tsx` | Team photo banner + about strip (copy from `lib/translations.ts`) |
| `events-carousel.tsx` | Upcoming events strip (mock data from `lib/data.ts`) |
| `archive.tsx` | Past-events grid, search, pagination, FLIP-style lightbox modal |
| `footer.tsx` | Links, socials, contact |
| `event-detail-view.tsx` | Event page layout (hero image, sidebar, breadcrumbs) |
| `theme-provider.tsx` | Wraps `next-themes` — **not used** in `layout.tsx` |

**`components/ui/`** — full shadcn/ui set (new-york). **No custom page imports these yet**; they are installed for future forms, dialogs, etc.

### Libraries (`lib/`)

| File | Role |
|---|---|
| `data.ts` | `Event` type, mock `upcomingEvents`, `archiveEvents`, `allEvents` |
| `language-context.tsx` | `LanguageProvider`, `useLang()` — default `SL`, persists `friki-lang` in `localStorage` |
| `translations.ts` | Slovenian/English strings for UI |
| `utils.ts` | `cn()` (clsx + tailwind-merge) |

No `config*`, Supabase, Stripe, or Resend clients yet.

### Data flow (current)

```
lib/data.ts (mock arrays)
  → imported directly into client components / pages
  → no fetch(), no API routes, no database
```

### Internationalisation (current)

- **Not** next-intl.
- SL/EN switching: React Context + `localStorage` only. No locale segment in the URL.

---

## Planned (not built)

- Supabase schema + clients; Stripe Checkout + webhook; Resend emails; `app/api/*` routes.
- `/events` index page; merch / past-events / ticket success pages as needed.
- **Phase 2:** next-intl with URL-based locales (replace context-only toggle).
- **Phase 3:** optional admin UI.

---

## Conventions

- **New routes:** add under `app/` using App Router file conventions.
- **Client vs server:** interactive sections use `'use client'`; keep server components default where possible for new pages.
- **Secrets:** future `lib/*.server.ts` and `app/api/*` only — never import from client components.

---

## Config worth knowing

- `next.config.mjs` — `typescript.ignoreBuildErrors: true` (tech debt), `images.unoptimized: true`, `optimizePackageImports: ['lucide-react']`.
- `tsconfig.json` — `@/*` path alias to project root.

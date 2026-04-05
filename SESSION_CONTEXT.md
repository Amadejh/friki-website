# FRIKI WEBSITE — Session Context
*Read this before every Claude Code session. Source of truth for current build state.*
*Last updated: Session 5 — April 5, 2026*

---

## CURRENT PHASE STATUS

```
Phase 0  ✅  Initial scaffold — Next.js 16, shadcn/ui, IBM Plex fonts
Phase 1a ✅  Light theme — CSS variables, globals.css, @theme inline, Tailwind v4
Phase 1b ✅  Layout & navigation — Navbar (mobile drawer, lang toggle, section observer), Footer
Phase 1c ✅  Hero — cinematic team photo + identity block + about strip
Phase 1d ✅  Homepage sections — EventsCarousel (carousel + Sanity), Archive (bento grid + modal + search + Sanity)
Phase 1e ✅  Event detail page — /events/[slug] with sidebar, breadcrumbs, hero image (Sanity)
Phase 1f ⬜  Lib scaffolding — config.ts, supabase-client/server, stripe, resend clients
Phase 1g ⬜  Events page — /events list (server component)
Phase 1h ⬜  Stripe ticket purchase flow — TicketModal + /api/checkout + /api/webhook
Phase 1i ⬜  Success page + Resend email — /tickets/success, QR code, confirmation email
Phase 1j ⬜  Remaining pages — /merch (coming-soon), past-events dedicated page
Phase 1k ✅  Connect real data — all components wired to Sanity; lib/data.ts deleted
Phase 1l ⬜  Polish — loading states, empty states, error boundaries, mobile QA, reduced motion
Phase 2  ⬜  Bilingual (SL/EN) via next-intl — URL-based routing, replace context-based toggle
Phase 3  ⬜  Admin UI — password-protected event/gallery management (future)
```

---

## GIT WORKFLOW

**Active branches:** `main` only

**Current branch:** `main`
**Remote:** `https://github.com/Amadejh/friki-website.git`

All feature branches merged and deleted. `main` is in sync with `origin/main`.

**Branch naming:** `feature/ui-*`, `feature/*`, `feature/api-*`, `fix/*`, `feature/i18n-*`, `chore/*`

**Flow:** feature branches → merge into `main` → push → Vercel deploys automatically.

---

## KEYS STRATEGY

All API keys empty until services are connected. See `.env.example`.

**Never commit any real key to git.**

---

## FILE STATUS

| File/Dir | Status | Notes |
|---|---|---|
| `CLAUDE.md` | ✅ | Entry point for Claude Code |
| `SESSION_CONTEXT.md` | ✅ | This file |
| `SELF_IMPROVEMENT_LOG.md` | ✅ | Lessons + pending gotchas |
| `PROJECT_OVERVIEW.md` | ✅ | Product + decisions |
| `NEW_CHAT_ONBOARDING.md` | ✅ | claude.ai bridge |
| `agent_docs/design-system.md` | ✅ | Light palette, typography, motion |
| `agent_docs/architecture.md` | ✅ | Routes, components, data flow |
| `agent_docs/stack.md` | ✅ | Versions, deps, env |
| `agent_docs/deployment.md` | ✅ | Vercel target, current deploy state |
| `.env.example` | ✅ | Env documentation |
| `.env.local` | ⬜ | Not in repo — create locally when needed |
| `app/globals.css` | ✅ | Light theme, `:root` + `@theme inline` |
| `app/layout.tsx` | ✅ | Fonts, `lang="sl"`, `LanguageProvider`, Analytics |
| `app/page.tsx` | ✅ | Homepage |
| `app/not-found.tsx` | ✅ | 404 |
| `app/events/[slug]/page.tsx` | ✅ | Event detail (SSG from mock data) |
| `app/events/page.tsx` | ⬜ | Events list — not built |
| `components/navbar.tsx` | ✅ | |
| `components/hero.tsx` | ✅ | |
| `components/events-carousel.tsx` | ✅ | |
| `components/archive.tsx` | ✅ | |
| `components/footer.tsx` | ✅ | |
| `components/event-detail-view.tsx` | ✅ | |
| `components/theme-provider.tsx` | ⚠️ | Present but **unused** — delete when convenient |
| `components/ui/*` | ✅ | shadcn — not imported by custom pages yet |
| `lib/data.ts` | 🗑️ | **Deleted** — replaced by Sanity queries |
| `lib/sanity/types.ts` | ✅ | `SanityEvent` interface |
| `lib/language-context.tsx` | ✅ | SL/EN + localStorage |
| `lib/translations.ts` | ✅ | Copy strings |
| `lib/utils.ts` | ✅ | `cn()` |
| `sanity.config.ts` | ✅ | Sanity Studio config — project `vwe4wudl`, dataset `production` |
| `schemas/event.ts` | ✅ | Event document schema |
| `schemas/index.ts` | ✅ | Schema barrel export |
| `lib/sanity/client.ts` | ✅ | `sanityClient` (read-only, CDN) |
| `lib/sanity/image.ts` | ✅ | `urlFor()` image URL builder |
| `lib/sanity/queries.ts` | ✅ | GROQ queries: upcoming, archive, by-slug, all-slugs |
| `app/studio/[[...tool]]/page.tsx` | ✅ | Embedded Sanity Studio at `/studio` |
| `lib/config.ts` | ⬜ | Planned |
| `lib/config.server.ts` | ⬜ | Planned |
| `lib/supabase-client.ts` | ⬜ | Planned |
| `lib/supabase-server.ts` | ⬜ | Planned |
| `lib/stripe.ts` | ⬜ | Planned |
| `lib/resend.ts` | ⬜ | Planned |
| `lib/email.ts` | ⬜ | Planned |
| `styles/globals.css` | 🗑️ | **Removed** — was unused boilerplate |
| `app/api/*` | ⬜ | No API routes yet |
| `supabase/schema.sql` | ⬜ | Planned |

---

## WHAT TO BUILD NEXT

Sanity CMS is fully wired. All components fetch live data from Sanity (`revalidate = 60`). `lib/data.ts` is deleted. Images use `urlFor()` with `/placeholder.jpg` fallback.

Next after wiring: Phase **1f** — lib scaffolding (`config`, Supabase and Stripe clients with safe placeholders, Resend wrapper) so API routes can be added without surprise build failures.

Then: `/events` index (Phase 1g), Stripe flow (1h–1i), remaining pages (1j), polish (1l).

---

## KNOWN CONSTRAINTS

- `next.config.mjs` — `typescript.ignoreBuildErrors: true` hides type errors from production builds (**remove when types are clean**).
- `images.unoptimized: true` — revisit when using optimised remote images (e.g. Supabase).
- `experimental.optimizePackageImports: ['lucide-react']` — keep.
- **Hardcoded hex in TSX** — ~~tech debt~~ **resolved** in Session 3. All components now use semantic tokens. Do not introduce new `[#hex]` values.
- **`@custom-variant dark`** in CSS — shadcn compatibility; app does not enable dark mode.
- No `output: 'export'` — full Next/Vercel deployment assumed.

---

## SESSION LOG

### Session 8 — April 5, 2026 — Carousel swipe gestures + hooks fix (`fix/carousel-hooks-swipe`)

- `components/events-carousel.tsx`: lifted `touchStartX` ref to component scope, stripped resize `useEffect` back to check/listener/cleanup only, added `handleTouchStart`/`handleTouchEnd` as `useCallback` after `next`/`prev`, wired both to overflow div via `onTouchStart`/`onTouchEnd`, changed mobile poster ratio `aspect-[3/2]` → `aspect-[3/4]`.

### Session 7 — April 5, 2026 — All feature branches merged into main

- All feature branches merged into `main` in order: `ui-palette-dimmed` → `sanity-setup` → `ui-animations` → `archive-anim-staggered`.
- Conflicts in `SESSION_CONTEXT.md` and `components/footer.tsx` resolved by keeping the newer branch's version.
- `feature/archive-anim-simultaneous` (discarded A/B variant) force-deleted locally; was never pushed to remote.
- All local feature branches deleted. `main` pushed to `origin/main`.

### Session 6 — April 5, 2026 — Final code sweep + doc update

- Fixed all regressions from Opus session: translations, text sizes, copyright.
- `lib/translations.ts`: updated all "Študentski svet" / "student council" → "Študentsko društvo" / "student association" (heading, body, footer desc).
- `components/hero.tsx`: subtitle text-xs → text-sm, eyebrow text-xs → text-sm, body text-base → text-lg, subtitle copy corrected.
- `components/events-carousel.tsx`: eyebrow text-xs → text-sm.
- `components/archive.tsx`: eyebrow text-xs → text-sm, search input bg-background → bg-card, border-border → border-muted-foreground.
- `components/footer.tsx`: all text sizes bumped, social icons w-8 h-8 → w-10 h-10 (Icon 14 → 16), copyright copy corrected to "Študentsko društvo".
- `SESSION_CONTEXT.md`: git workflow section rewritten to reflect actual branch state.
- `SELF_IMPROVEMENT_LOG.md`: added Lessons 4–7 (cache, Sanity basePath, metadata/client split, overflow-hidden clipping).
- **All feature branches still unmerged** — merge into main is the next pending action.

### Session 5 (cont.) — April 5, 2026 — UI animations (`feature/archive-anim-staggered`)

- `lib/sanity/types.ts`: `SanityEvent` interface (replaces `Event` from `lib/data.ts`).
- `app/page.tsx`: converted to async server component; fetches `upcomingEvents` + `archiveEvents` from Sanity in parallel; `revalidate = 60`.
- `components/events-carousel.tsx`: accepts `events: SanityEvent[]` prop; poster uses `urlFor().width(400).height(500).url()` with `/placeholder.jpg` fallback.
- `components/archive.tsx`: accepts `events: SanityEvent[]` prop; bento card poster uses `urlFor`; modal gallery replaced with single poster image; `getGallerySeeds` removed.
- `components/event-detail-view.tsx`: `Event` → `SanityEvent`; hero uses `urlFor().width(1400).height(840).url()`.
- `app/events/[slug]/page.tsx`: fetches by slug from Sanity; `generateStaticParams` from `allEventSlugsQuery`; `revalidate = 60`.
- `lib/data.ts`: deleted — zero remaining `@/lib/data` imports confirmed.
- `npx tsc --noEmit` passes clean.

### Session 5 — April 5, 2026 — Sanity CMS scaffold (`feature/sanity-setup`)

- Installed `sanity`, `next-sanity`, `@sanity/image-url`, `@sanity/vision`.
- `sanity.config.ts`: studio config, project `vwe4wudl`, dataset `production`.
- `schemas/event.ts`: full event document schema (name, slug, date, time, location, organizer, category, year, teaser, description, poster, isArchived, ticketsAvailable, ticketPrice).
- `lib/sanity/client.ts`: read-only CDN client.
- `lib/sanity/image.ts`: `urlFor()` builder — fixed import from `@sanity/image-url` (not sub-path).
- `lib/sanity/queries.ts`: GROQ for upcoming events, archive events, event by slug, all slugs.
- `app/studio/[[...tool]]/page.tsx`: embedded Studio route.
- `next.config.mjs`: added `remotePatterns` for `cdn.sanity.io`.
- `.env.example`: added Sanity section (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`).
- `agent_docs/stack.md`: Sanity packages + Studio route noted.
- `npx tsc --noEmit` passes clean.
- **Components still use `lib/data.ts` mock data** — Sanity data wiring is a separate step.

### Session 4 — April 4, 2026 — Merge + README (`main`)

- Merged `feature/ui-palette-dimmed` into `main` with `--no-ff`.
- Added `README.md` with project description, tech stack, and setup instructions.
- No remote configured yet — `git push origin main` is a pending step when a GitHub remote is added.

### Session 3 — April 4, 2026 — Palette shift + token cleanup (`feature/ui-palette-dimmed`)

- `app/globals.css`: `--background` shifted from `var(--white)` → `var(--light-grey)` (#E8E5E0 is now page bg); `--card/popover/secondary/muted/input` → `#D4D1CC`; added `--color-deep-red-dark: #C42A26` token.
- All 6 components (`navbar`, `hero`, `footer`, `events-carousel`, `archive`, `event-detail-view`) converted from hardcoded hex to semantic Tailwind tokens.
- Intentional `bg-white` carve-outs preserved: navbar pill container, lang toggle, mobile drawer, carousel/archive nav buttons, event cards, archive modal, detail sidebar icon squares.
- `agent_docs/design-system.md` updated: new palette table, token aliases, carve-out list, hardcoded hex tech debt resolved.
- Lesson: gradient `from-white` bleeds must be updated whenever `--background` changes — changed to `from-background`.

### Session 2 — April 3, 2026 — Documentation & cleanup (`chore/docs-cleanup`)

- Rewrote `agent_docs/` (design-system, architecture, stack, deployment) to match the **light** codebase.
- Rewrote `PROJECT_OVERVIEW.md`, `SESSION_CONTEXT.md`, updated `SELF_IMPROVEMENT_LOG.md`, `CLAUDE.md`, `NEW_CHAT_ONBOARDING.md`.
- Deleted dead file: `styles/globals.css` (unreferenced).
- Code hygiene only: `lang="sl"`, `package.json` name `friki-website`, footer `© 2025–2026`, hero subtitle council wording.
- No visual or behavioral changes to components beyond those four strings/config lines.

### Session 1 — April 3, 2026 — Homepage / content (historical)

- Earlier iteration work on hero, navbar labels, footer, 404. Some session notes referred to a dark theme; the live codebase uses the **light** palette — see `app/globals.css`.

### Session 0 — April 3, 2026 — Blueprint setup (historical)

- Initial Claude Code infrastructure and context files.

---

*This file is the source of truth for build state. Update the phase table and add a session log entry when closing a meaningful chunk of work.*

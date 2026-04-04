# FRIKI WEBSITE — Session Context
*Read this before every Claude Code session. Source of truth for current build state.*
*Last updated: Session 4 — April 4, 2026*

---

## CURRENT PHASE STATUS

```
Phase 0  ✅  Initial scaffold — Next.js 16, shadcn/ui, IBM Plex fonts
Phase 1a ✅  Light theme — CSS variables, globals.css, @theme inline, Tailwind v4
Phase 1b ✅  Layout & navigation — Navbar (mobile drawer, lang toggle, section observer), Footer
Phase 1c ✅  Hero — cinematic team photo + identity block + about strip
Phase 1d ✅  Homepage sections — EventsCarousel (carousel + mock data), Archive (grid + modal + search)
Phase 1e ✅  Event detail page — /events/[slug] with sidebar, breadcrumbs, hero image
Phase 1f ⬜  Lib scaffolding — config.ts, supabase-client/server, stripe, resend clients
Phase 1g ⬜  Events page — /events list (server component)
Phase 1h ⬜  Stripe ticket purchase flow — TicketModal + /api/checkout + /api/webhook
Phase 1i ⬜  Success page + Resend email — /tickets/success, QR code, confirmation email
Phase 1j ⬜  Remaining pages — /merch (coming-soon), past-events dedicated page
Phase 1k ⬜  Connect real data — replace lib/data.ts mock data with Supabase queries
Phase 1l ⬜  Polish — loading states, empty states, error boundaries, mobile QA, reduced motion
Phase 2  ⬜  Bilingual (SL/EN) via next-intl — URL-based routing, replace context-based toggle
Phase 3  ⬜  Admin UI — password-protected event/gallery management (future)
```

---

## GIT WORKFLOW

**Active branches:** `main`

**Current branch:** `main`  
**Last commit on main:** `docs: add README for contributor onboarding`  
**Merged:** `feature/ui-palette-dimmed` → `main` (Session 4)

**Branch naming:** `feature/ui-*`, `feature/*`, `feature/api-*`, `fix/*`, `feature/i18n-*`, `chore/*`

**Flow:** feature branches → merge toward `main` when CI/build rules are satisfied (see `CLAUDE.md`).

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
| `components/theme-provider.tsx` | ✅ | Present but **unused** (next-themes) |
| `components/ui/*` | ✅ | shadcn — not imported by custom pages yet |
| `lib/data.ts` | ✅ | Mock events |
| `lib/language-context.tsx` | ✅ | SL/EN + localStorage |
| `lib/translations.ts` | ✅ | Copy strings |
| `lib/utils.ts` | ✅ | `cn()` |
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

Event detail and homepage are mock-driven. **Next:** Phase **1f** — lib scaffolding (`config`, Supabase and Stripe clients with safe placeholders, Resend wrapper) so API routes can be added without surprise build failures.

Then: `/events` index (Phase 1g), Stripe flow (1h–1i), remaining pages (1j), Supabase data (1k), polish (1l).

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

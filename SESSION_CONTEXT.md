# FRIKI WEBSITE — Session Context
*Read this before every Claude Code session. Source of truth for current build state.*
*Last updated: Session 0 — April 3, 2026*

---

## CURRENT PHASE STATUS

```
Phase 0  ✅  Initial scaffold — Next.js 16, shadcn/ui, IBM Plex fonts, basic components
Phase 1a ✅  Dark theme — CSS variables, globals.css, @theme inline, Tailwind v4
Phase 1b ✅  Layout & navigation — Navbar (mobile menu, lang toggle, section observer), Footer
Phase 1c ✅  Hero / team banner — cinematic photo section + FRIKI identity + about strip with stat boxes
Phase 1d ✅  Homepage sections — EventsCarousel (carousel + mock data), Archive (grid + load more)
Phase 1e ⬜  Lib scaffolding — config.ts, supabase-client/server, stripe, resend clients
Phase 1f ⬜  Events page — /events list (server component) + /events/[id] detail page
Phase 1g ⬜  Stripe ticket purchase flow — TicketModal + /api/checkout + /api/webhook
Phase 1h ⬜  Success page + Resend email — /tickets/success, QR code, confirmation email
Phase 1i ⬜  Remaining pages — /past-events, /merch (coming-soon), 404, error
Phase 1j ⬜  Connect real data — replace lib/data.ts mock data with Supabase queries
Phase 1k ⬜  Polish — loading states, empty states, error boundaries, mobile QA
Phase 2  ⬜  Bilingual (SL/EN) via next-intl — do not start before Phase 1 complete
Phase 3  ⬜  Admin UI — password-protected event/gallery management (future)
```

---

## GIT WORKFLOW

**Active branches:**
- `main` — production, deployed to Vercel on every merge
- `dev` — integration branch, merge feature branches here

**Current branch:** main (no dev branch yet — create with `/branch` on first session)
**Last commit:** Initial scaffold

**Branch naming:**
- `feature/ui-*` → theme, animations, visual changes
- `feature/*` → new pages or features
- `feature/api-*` → API routes, Stripe, Supabase
- `fix/*` → bug fixes
- `feature/i18n-*` → translation/locale work
- `chore/*` → config, deps, tooling

**Flow:**
1. `/branch [name]` → creates `feature/[type]-[name]` from dev
2. Work + `/commit` often on feature branch
3. `/merge` → merges feature branch into dev (no-ff)
4. PR dev → main on GitHub when ready to deploy

---

## KEYS STRATEGY

All API keys intentionally empty. Build first, connect services after code is complete.

| Key | Where it goes | When |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` + Vercel env | When Supabase project created |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` + Vercel env | When Supabase project created |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` + Vercel env (server only) | When Supabase project created |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `.env.local` + Vercel env | After Stripe account created |
| `STRIPE_SECRET_KEY` | `.env.local` + Vercel env (server only) | After Stripe account created |
| `STRIPE_WEBHOOK_SECRET` | `.env.local` + Vercel env (server only) | After webhook registered |
| `RESEND_API_KEY` | `.env.local` + Vercel env (server only) | When Resend account created |
| `RESEND_FROM_EMAIL` | `.env.local` + Vercel env | When Resend domain verified |
| `NEXT_PUBLIC_BASE_URL` | `.env.local` + Vercel env | When domain confirmed |

**Never commit any real key to git.**

---

## FILE STATUS

| File/Dir | Status | Notes |
|---|---|---|
| `CLAUDE.md` | ✅ | Slim ~60 lines, progressive disclosure |
| `SESSION_CONTEXT.md` | ✅ | This file |
| `SELF_IMPROVEMENT_LOG.md` | ✅ | Lessons log — read before coding |
| `PROJECT_OVERVIEW.md` | ✅ | Full architecture and decisions |
| `NEW_CHAT_ONBOARDING.md` | ✅ | For claude.ai strategy sessions |
| `agent_docs/stack.md` | ✅ | Stack details, env vars, patterns |
| `agent_docs/architecture.md` | ✅ | Routing, components, data flow |
| `agent_docs/design-system.md` | ✅ | Colors, typography, motion |
| `agent_docs/deployment.md` | ✅ | Vercel, CI/CD, env vars |
| `.claude/settings.json` | ✅ | Permissions + hooks |
| `.claude/commands/` | ✅ | All slash commands |
| `.claude/agents/` | ✅ | Subagent prompts |
| `.env.example` | ✅ | All required keys documented |
| `.env.local` | ⬜ | Not created — fill in when keys ready |
| `app/globals.css` | ✅ | Full dark theme, CSS vars, Tailwind v4 @theme inline, @custom-variant dark |
| `app/layout.tsx` | ✅ | IBM Plex fonts, metadata, Analytics |
| `app/page.tsx` | ✅ | Homepage with Navbar, Hero, EventsCarousel, Archive, Footer |
| `components/navbar.tsx` | ✅ | Dark, fixed, mobile drawer, lang toggle, IntersectionObserver active sections |
| `components/hero.tsx` | ✅ | Full-bleed image, gradient overlay, left-aligned content |
| `components/events-carousel.tsx` | ✅ | Carousel with prev/next, dot indicators — uses mock data from lib/data.ts |
| `components/archive.tsx` | ✅ | Masonry-style grid, load more — uses mock data from lib/data.ts |
| `components/footer.tsx` | ✅ | Social links (Instagram/Facebook/LinkedIn/Email), nav, address |
| `lib/data.ts` | ✅ | Mock Event type + upcomingEvents + archiveEvents + allEvents arrays |
| `lib/utils.ts` | ✅ | shadcn cn() utility |
| `lib/config.ts` | ⬜ | Public env vars only |
| `lib/config.server.ts` | ⬜ | Server secrets — API routes only |
| `lib/supabase-client.ts` | ⬜ | Anon Supabase client |
| `lib/supabase-server.ts` | ⬜ | Service role Supabase client |
| `lib/stripe.ts` | ⬜ | Stripe client |
| `lib/resend.ts` | ⬜ | Resend client |
| `lib/email.ts` | ⬜ | sendTicketConfirmation() |
| `types/database.ts` | ⬜ | Supabase generated types |
| `types/api.ts` | ⬜ | Request/response types |
| `app/events/page.tsx` | ⬜ | Events list page |
| `app/events/[id]/page.tsx` | ⬜ | Event detail page |
| `app/past-events/page.tsx` | ⬜ | Dedicated past events page |
| `app/merch/page.tsx` | ⬜ | Merch coming-soon page |
| `app/tickets/success/page.tsx` | ⬜ | Post-purchase QR success page |
| `app/api/cors.ts` | ⬜ | Shared CORS helper |
| `app/api/events/route.ts` | ⬜ | GET published events |
| `app/api/checkout/route.ts` | ⬜ | POST Stripe checkout |
| `app/api/webhook/route.ts` | ⬜ | POST Stripe webhook |
| `app/api/tickets/[sessionId]/route.ts` | ⬜ | GET ticket by session ID |
| `supabase/schema.sql` | ⬜ | Run in Supabase SQL Editor |
| `components/event-card.tsx` | ⬜ | Standalone reusable event card |
| `components/event-detail-content.tsx` | ⬜ | Client component for event detail + TicketModal |
| `components/ticket-modal.tsx` | ⬜ | Buy ticket form → Stripe redirect |

---

## WHAT TO BUILD NEXT

**Homepage is functional with mock data. Next up is the lib scaffolding + events pages.**

First session should:
1. Create `dev` branch from `main`
2. Create `feature/lib-scaffold` branch from dev
3. Build Phase 1e — all lib files (config, supabase, stripe, resend clients)
4. Then create `feature/events-pages` — Phase 1f (events list + detail pages using mock data first)

**See `PROMPTS_LIBRARY.md` for ready-to-execute Claude Code prompts for each phase.**

**Read before starting:**
- `agent_docs/stack.md` for SDK init patterns and env var structure
- `agent_docs/architecture.md` for routing and component patterns
- `SELF_IMPROVEMENT_LOG.md` for known gotchas

---

## KNOWN CONSTRAINTS

- `next.config.mjs` has `typescript: { ignoreBuildErrors: true }` — **remove this** when Phase 1e+ lib files are typed correctly
- `images: { unoptimized: true }` — fine for now, picsum.photos images work; revisit with Supabase Storage
- `experimental.optimizePackageImports: ['lucide-react']` — keep
- Tailwind v4 is already correctly configured in `globals.css` — `@import 'tailwindcss'`, `@theme inline {}`, `@custom-variant dark` all present
- The `EventsCarousel` and `Archive` components import from `lib/data.ts` (mock data). When Supabase is connected, this import will be replaced with server-side data fetching in the page, passing data as props
- No `output: 'export'` — Vercel full deployment, API routes included

---

## SESSION LOG

### Session 1 — April 3, 2026 — Homepage Fixes (Phase 1c polish)
- **app/page.tsx**: Confirmed `bg-background` (was already correct)
- **components/hero.tsx**: Replaced generic hero with two-part team banner — cinematic photo section (aspect 21/9 desktop / 16/9 mobile, `/team-photo.jpg` with `#111111` fallback, 50% opacity, bottom-fade gradient, FRIKI text logo + eyebrow label) + about strip (two-column with "Who we are" heading/body and 2×2 stat boxes)
- **components/navbar.tsx**: Added browser language auto-detection via `navigator.language` on first visit; persists choice to `localStorage('friki-lang')`; both desktop and mobile toggles now call `localStorage.setItem`. Changed nav label "Upcoming" → "Events"
- **components/footer.tsx**: Changed "Upcoming" → "Events" to match navbar
- **app/not-found.tsx**: Created custom 404 page (dark theme, red 404 label, back to home link)
- **public/team-photo-placeholder.txt**: Created reminder file for team photo placement
- `tsc --noEmit` passes clean; ESLint not installed in node_modules (pre-existing)

### Session 0 — April 3, 2026 — Blueprint Setup + Codebase Audit
- Created full Claude Code infrastructure: CLAUDE.md, SESSION_CONTEXT.md, SELF_IMPROVEMENT_LOG.md, PROJECT_OVERVIEW.md, NEW_CHAT_ONBOARDING.md, PROMPTS_LIBRARY.md
- Created .claude/settings.json with 4 hooks, all slash commands, all 4 subagent prompts
- Created agent_docs/ with stack.md, architecture.md, design-system.md, deployment.md
- Created .env.example with all 9 required env vars documented
- **Codebase audit revealed:** More is built than the scaffold implied:
  - Full dark theme with correct Tailwind v4 syntax already in globals.css ✅
  - Navbar fully built (mobile drawer, language toggle, IntersectionObserver) ✅
  - Hero section built ✅
  - EventsCarousel (carousel + mock data) ✅
  - Archive (masonry grid + load more + mock data) ✅
  - Footer with social links ✅
  - lib/data.ts with Event type + 10 mock events ✅
- Design-system.md updated to match actual palette (C0392B red, 0A0A0A bg, 111111 surface, 262626 border)
- Tailwind v4 PENDING lesson resolved — already implemented correctly
- **No new application code written** — this session is infrastructure only

---

*This file is the source of truth for build state.*
*Update Phase Status table + add Session Log entry at the end of every session.*

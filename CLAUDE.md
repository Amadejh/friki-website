# FRIKI WEBSITE — Claude Code Context

## Session start
Run `/session-start` before writing any code. It reads all context files and verifies build status.

## What this project is
Public-facing website for FRIKi — the student council of UL FRI (Faculty of Computer and Information Science, Ljubljana, Slovenia).
Features at launch: homepage, events list, ticket sales (Stripe), past events gallery, merch store shell.
Bilingual: Slovenian (default) + English via next-intl.

**Stack:** Next.js 16 App Router · TypeScript strict · Tailwind CSS v4 · shadcn/ui (new-york) · Supabase · Stripe · Resend
**Fonts:** IBM Plex Sans (`--font-sans`) · IBM Plex Mono (`--font-mono`)
**Hosting:** Vercel (primary, includes API routes) — GitHub Pages optional for static mirror
**Key constraint:** `STRIPE_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are server-only. Never in client components.

## Commands
```
npm run dev          # dev server (localhost:3000)
npm run build        # production build
npm run lint         # eslint
npx tsc --noEmit     # type check
```

## Slash commands
`/session-start` · `/wrap` · `/commit` · `/branch` · `/merge` · `/phase-complete`
`/plan` · `/status` · `/debug` · `/security-review` · `/quality-check` · `/bug-hunt`

## Git workflow — always follow this
**Never commit directly to main.** Main is production.

Branch naming:
- UI/visual: `feature/ui-[name]`
- New page or feature: `feature/[name]`
- API/backend: `feature/api-[name]`
- Bug fixes: `fix/[name]`
- i18n: `feature/i18n-[name]`
- Config/deps: `chore/[name]`

Flow: `feature/*` → `/commit` → `/merge` → `dev` → PR → `main` (deploy)

## Context files — read when relevant
- `SESSION_CONTEXT.md` — current build state, phases, session log
- `SELF_IMPROVEMENT_LOG.md` — solved bugs, lessons, pending problems
- `PROJECT_OVERVIEW.md` — full architecture, decisions, feature spec
- `agent_docs/stack.md` — stack details, env vars, shadcn patterns
- `agent_docs/architecture.md` — routing, component patterns, data flow
- `agent_docs/design-system.md` — color palette, typography, motion, dark theme
- `agent_docs/deployment.md` — Vercel setup, env vars, CI/CD

## Non-negotiables
- `STRIPE_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` — server-only (`app/api/*` only)
- `.env.local` — never committed, always in `.gitignore`
- Stripe webhook — always verify `stripe-signature` before processing
- `tsc --noEmit` + `npm run lint` must pass before every commit
- All animations must respect `prefers-reduced-motion`
- Never `output: 'export'` unless explicitly switching to static hosting

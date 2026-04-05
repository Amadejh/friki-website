# FRIKI WEBSITE — Self-Improvement Log
*Running record of lessons learned. Read this before writing code to avoid repeating mistakes.*
*Last updated: Session 2 — April 3, 2026*

---

## PURPOSE

This is not documentation. It is a learning record.
Every hard bug, wrong decision, performance problem, or discovery that would have saved
time if known earlier goes here. The goal is that each session is smarter than the last.

---

## FORMAT

```
## LESSON [N]: [Short title]

**Date:** [Session date]
**Problem:** [What went wrong or what was hard?]
**What worked:** [The technique or fix that resolved it]
**Rule for next time:** [One actionable paragraph as a direct instruction]
```

---

## PENDING LESSONS (KNOWN HARD PROBLEMS — SOLVE BEFORE THEY BITE)

### ~~PENDING~~ RESOLVED: Tailwind v4 syntax differs from v3
The codebase uses correct v4 patterns: `@import 'tailwindcss'`, `@theme inline {}` for Tailwind tokens, shadcn variables in `:root {}`. Raw Friki tokens use names like `--white`, `--light-grey`, `--deep-red` (see `app/globals.css`).

### PENDING: shadcn/ui CSS variables conflict with Tailwind v4 theme
shadcn/ui generates variables like `--background`, `--foreground`. Tailwind v4 maps via `@theme inline`. **Fix when encountered:** keep shadcn aliases in `:root`, map into `@theme inline` for `--color-*`; avoid duplicating conflicting names in both places without intent.

### PENDING: `next/image` with unoptimized: true
No automatic optimisation or responsive srcset. When adding images, use explicit dimensions or `fill` + positioned parent. Revisit when Supabase Storage URLs exist (`remotePatterns` or Supabase image transforms).

### PENDING: Supabase SDK throws at module evaluation with empty keys
Use placeholder fallbacks for URL and anon key so `npm run build` does not crash before env is configured.

### PENDING: Server-only files accidentally imported in client components
Future `lib/*.server.ts` must never be imported from `'use client'` components.

### PENDING: Stripe webhook raw body requirement
Use `req.text()` and verify signature before JSON parsing.

### PENDING: TypeScript strict mode + React 19 ref types
Watch ref typing when touching older shadcn components.

### PENDING: next-intl (Phase 2 not started)
When URL-based locales are added, follow next-intl App Router patterns (`setRequestLocale`, etc.). **Phase 2 has not started** — the site still uses React Context + `localStorage` for SL/EN.

---

## LESSONS

## LESSON 1: Documentation drift when using multiple AI tools

**Date:** April 3, 2026

**Problem:** Parallel tools produced markdown that described a different product than the repo (e.g. dark theme vs light, routes and APIs that did not exist).

**What worked:** Auditing source files directly, then rewriting docs from code — not from older markdown.

**Rule for next time:** After sessions that change UI, routes, or stack, reconcile `agent_docs/` and `SESSION_CONTEXT.md` before stopping. **Code is the source of truth; docs describe the code.**

---

## LESSON 2: Hardcoded hex values defeat design tokens

**Date:** April 3, 2026 → **Resolved:** April 4, 2026

**Problem:** `app/globals.css` defines a full token system, but many components use literals such as `text-[#EE352F]` instead of `text-primary` or `text-[var(--deep-red)]`, so palette updates require wide search-and-replace.

**What worked:** A dedicated token-cleanup pass in Session 3 replaced all `[#hex]` values in all 6 components. Confirmed zero remaining `[#` sequences via grep.

**Rule for next time:** In new components, use only semantic Tailwind classes from the token table in `agent_docs/design-system.md`. Never use `[#hex]` literals.

---

## LESSON 3: Gradient `from-*` colors must match the page background token

**Date:** April 4, 2026

**Problem:** When `--background` was shifted from `var(--white)` to `var(--light-grey)`, the hero and event detail gradients (`bg-gradient-to-t from-white`) no longer blended into the page — creating a jarring white-to-warm-grey seam.

**What worked:** Changing `from-white` to `from-background` so the gradient always tracks the current background token.

**Rule for next time:** Any gradient that bleeds an image into the page background must use `from-background` (or whatever the page token is), NOT `from-white`. If you change `--background`, grep for `from-white` in components and update them.

---

## LESSON 4: .next cache must be cleared when CSS variables change

**Date:** April 4, 2026

**Problem:** After shifting `--background` from `var(--white)` to `var(--light-grey)` in `globals.css`, the site still showed white because the Turbopack dev server had the old compiled CSS cached in `.next`.

**What worked:** Deleting `.next` with `Remove-Item -Recurse -Force .next` and restarting `npm run dev`.

**Rule for next time:** Any change inside `@theme inline {}` or `:root {}` that doesn't hot-reload correctly means the `.next` cache is stale. Kill the server, delete `.next`, restart. This is specific to Tailwind v4 + Turbopack.

---

## LESSON 5: Sanity Studio requires `basePath` in `defineConfig`

**Date:** April 5, 2026

**Problem:** Navigating to `/studio` showed "tool not found: studio" — Sanity's internal router couldn't resolve its own route.

**What worked:** Adding `basePath: '/studio'` to `defineConfig()` in `sanity.config.ts`. Without this Sanity doesn't know where it's hosted.

**Rule for next time:** Always set `basePath` to match the route where the Studio is embedded. For this project: `basePath: '/studio'`.

---

## LESSON 6: `metadata` cannot be exported from a `'use client'` file

**Date:** April 5, 2026

**Problem:** Adding `export { metadata, viewport } from 'next-sanity/studio'` to the Studio page file (which had `'use client'`) caused a build error — metadata must be resolved on the server.

**What worked:** Splitting into two files: a server component `page.tsx` that exports `metadata` and `viewport` inline, and a `studio-client.tsx` with `'use client'` that renders `<NextStudio>`.

**Rule for next time:** Any page that needs both `metadata` exports and client-side rendering must be split — server page renders a client component child. Never put `export const metadata` in a `'use client'` file.

---

## LESSON 7: `overflow-hidden` on a section clips negatively-positioned arrow buttons

**Date:** April 5, 2026

**Problem:** Carousel arrow buttons positioned at `absolute -left-14` were invisible — clipped by `overflow-hidden` on the parent section.

**What worked:** Removing `overflow-hidden` from the `<section>` and keeping it only on the inner track `<div>`. The section's padding space then becomes available for the arrows.

**Rule for next time:** Never put `overflow-hidden` on a container that has absolute children that need to escape it. Move it to the smallest possible inner wrapper.

---

### Pattern: Supabase typed client (when added)
```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
const supabase = createClient<Database>(url, key)
```

### Pattern: API route error handling
Return JSON errors; never throw unhandled from route handlers.

### Pattern: Zod for API input validation
Use on all mutating API routes once they exist.

### Pattern: prefers-reduced-motion (not yet in globals)
Add a global reduce rule in `globals.css` when implementing the polish phase.

### Pattern: shadcn/ui component addition
```bash
npx shadcn@latest add [component-name]
```
Do not edit `components/ui/` by hand for project-specific logic — wrap in `components/`.

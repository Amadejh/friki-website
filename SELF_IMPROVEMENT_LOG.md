# FRIKI WEBSITE — Self-Improvement Log
*Running record of lessons learned. Read this before writing code to avoid repeating mistakes.*
*Last updated: Session 0 — April 3, 2026*

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
This was resolved during the Session 0 audit — **the codebase already uses correct v4 syntax.**
`globals.css` has `@import 'tailwindcss'` (correct), `@theme inline {}` for design tokens (correct),
and `@custom-variant dark` (correct). No v3 patterns present.

The pattern to remember:
- Tokens in `@theme inline {}` block (not `@theme {}` — the `inline` keyword matters for Tailwind v4 CSS vars)
- shadcn variables in `:root {}` — these coexist without conflict
- Raw project tokens also in `:root {}` as `--black`, `--surface`, `--red`, etc., then aliased to shadcn names

See `globals.css` as the reference implementation.

### PENDING: shadcn/ui CSS variables conflict with Tailwind v4 theme
shadcn/ui generates CSS variable names like `--background`, `--foreground`, `--primary`, etc.
Tailwind v4 has its own theme namespace. There can be conflicts between shadcn-generated
variables and Tailwind v4 `@theme` declarations. The `components.json` uses CSS variables mode.
**Fix when encountered:** Define shadcn variables inside `:root {}` (not `@theme {}`),
and define project-specific design tokens inside `@theme {}`. Keep them separated.

### PENDING: `next/image` with unoptimized: true
The current config has `images: { unoptimized: true }`. This is fine for dev but means
no automatic WebP conversion or responsive sizing. When adding images, use `width` and `height`
props explicitly. When Supabase Storage URLs are available, consider Supabase Image Transformations
instead of enabling Next.js image optimization (requires setting up `remotePatterns`).

### PENDING: Supabase SDK throws at module evaluation with empty keys
When `@supabase/supabase-js` is initialised with an empty string as the URL or anon key,
it throws at import time, breaking `npm run build`. Use placeholder fallbacks:
`process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'`
Same pattern applies to Stripe and Resend SDK initialisations.
See LESSON 1 in council-website's SELF_IMPROVEMENT_LOG for full context.

### PENDING: Server-only files accidentally imported in client components
`lib/supabase-server.ts` and `lib/config.server.ts` must never be imported in
'use client' components or page files (only in `app/api/*`). Next.js may not always
catch this at build time, but secrets can leak to the browser bundle.
**Pattern:** Files with `.server.ts` suffix = API routes only. If you see a client component
importing from a `.server.ts` file — that is a critical security bug. Fix immediately.

### PENDING: Stripe webhook raw body requirement
`app/api/webhook/route.ts` must export `runtime = 'nodejs'` and read the request with
`req.text()` (NOT `req.json()`) before calling `stripe.webhooks.constructEvent()`.
If you parse with `.json()` first, the signature verification fails. This is a common
first-time Stripe webhook bug.

### PENDING: TypeScript strict mode + React 19 ref types
React 19 changed how refs work. `forwardRef` is no longer needed in most cases.
Ref objects have type `Ref<T>` not `RefObject<T>` when returned from `useRef`.
If TypeScript errors appear on ref usage, check if the component needs `forwardRef`
or if it's a React 19 ref API change. See React 19 migration guide.

### PENDING: next-intl static export compatibility (Phase 2)
When Phase 2 (bilingual) is built, server components using `getTranslations()` must call
`setRequestLocale(locale)` before any translation calls during static pre-rendering.
Without this, `GITHUB_PAGES=true npm run build` fails with "couldn't be rendered statically
because it used headers". Apply this pattern to every `app/[locale]/*/page.tsx`.

---

## LESSONS

*(None yet — this section fills as problems are encountered and solved.)*

---

## REFERENCE: COMMON PATTERNS FOR THIS STACK

### Pattern: Supabase typed client
```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
const supabase = createClient<Database>(url, key)
```
Run `supabase gen types typescript --project-id YOUR_ID > types/database.ts` after schema changes.

### Pattern: API route error handling
```typescript
export async function POST(request: Request) {
  try {
    // ... logic
    return Response.json({ success: true, data: result })
  } catch (error) {
    console.error('[api/route]', error)
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
```
Never let an API route throw unhandled. Always return a typed response.

### Pattern: Zod for API input validation
```typescript
import { z } from 'zod'
const Schema = z.object({
  eventId: z.string().uuid(),
  buyerEmail: z.string().email(),
  buyerName: z.string().min(1).max(100),
})
const body = Schema.parse(await request.json())
```
All request bodies go through Zod before touching any business logic.

### Pattern: prefers-reduced-motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
Add this to globals.css once. Every animation/transition is covered globally.

### Pattern: shadcn/ui component addition
```bash
npx shadcn@latest add [component-name]
```
Components are added to `components/ui/`. Never edit files in `components/ui/` directly —
they are regenerated on updates. Custom logic goes in wrapper components in `components/`.

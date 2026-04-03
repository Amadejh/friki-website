# Stack Details
*Read this when: adding dependencies, setting up services, configuring env vars, or unsure about a library API.*

---

## Core Stack Versions

| Package | Version | Notes |
|---|---|---|
| Next.js | 16.2.0 | App Router, React 19 |
| React | 19.x | New ref API — no `forwardRef` needed in most cases |
| TypeScript | 5.7.3 | Strict mode should be on |
| Tailwind CSS | 4.2.x | **v4 syntax** — see below |
| shadcn/ui | latest (new-york style) | Components in `components/ui/` |
| IBM Plex Sans | Google Fonts | Variables: `--font-sans` |
| IBM Plex Mono | Google Fonts | Variables: `--font-mono` |

---

## Tailwind CSS v4 — Critical Differences from v3

Tailwind v4 is a major rewrite. Do NOT use v3 patterns.

### ✅ v4: Import at top of globals.css
```css
@import "tailwindcss";
```

### ❌ v3: DO NOT USE
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### ✅ v4: Design tokens in @theme
```css
@theme {
  --color-background: #0D0D0D;
  --font-sans: 'IBM Plex Sans', sans-serif;
  --radius-card: 0.75rem;
}
```

### ❌ v3: DO NOT USE tailwind.config.js for tokens
There is no `tailwind.config.js` in v4. All configuration lives in the CSS file.

### ✅ v4: Custom utilities with @utility
```css
@utility content-wrap {
  max-width: 72rem;
  margin-inline: auto;
  padding-inline: 1rem;
}
```

### shadcn/ui CSS variables
shadcn generates variables like `--background`, `--foreground`, `--primary` in `:root {}`.
Keep these in `:root {}`, NOT inside `@theme {}`. The two namespaces can coexist.

---

## shadcn/ui

**Style:** new-york  
**Config:** `components.json`  
**Base colour:** neutral  
**CSS variables:** enabled  
**Icon library:** lucide  

### Adding components
```bash
npx shadcn@latest add [component-name]
```
Components land in `components/ui/`. **Never edit files in `components/ui/` directly** — they will be overwritten on the next `npx shadcn add` command. Custom logic goes in wrapper components in `components/`.

### Key components already installed
(See `components/ui/` for full list — includes accordion, dialog, dropdown-menu, select, tabs, toast/sonner, card, button, input, form, badge, separator, tooltip, and many more from the initial shadcn install.)

---

## Environment Variables

### Public (safe for client bundle, injected at build time)
```
NEXT_PUBLIC_SUPABASE_URL        # your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   # Supabase anon/public key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_BASE_URL            # e.g. https://friki.si
```

### Server-only (NEVER in client components — Vercel env only)
```
SUPABASE_SERVICE_ROLE_KEY       # bypasses RLS — API routes only
STRIPE_SECRET_KEY               # server-side Stripe — API routes only
STRIPE_WEBHOOK_SECRET           # webhook signature verification
RESEND_API_KEY                  # email sending — API routes only
RESEND_FROM_EMAIL               # sender address, must be verified domain
```

### SDK initialisation pattern (placeholder fallbacks required)
```typescript
// lib/supabase-client.ts
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
)
```
Without these fallbacks, `npm run build` fails because Next.js evaluates module code at build time even when the real keys aren't available yet.

---

## Dependencies Reference

### Installed (key ones)
- `@supabase/supabase-js` — database + storage client
- `stripe` — Stripe SDK (use v14+ API)
- `resend` — email SDK
- `zod` — runtime schema validation (use on all API route inputs)
- `lucide-react` — icons (tree-shakeable, `optimizePackageImports` is set)
- `next-themes` — theme provider (installed but dark-only theme — ThemeProvider exists in components)
- `recharts` — charts (available if needed for stats)
- `react-hook-form` + `@hookform/resolvers` — form handling
- `sonner` — toast notifications
- `embla-carousel-react` — carousel (EventsCarousel uses this)
- `date-fns` — date formatting

### Adding new dependencies
```bash
npm install [package]
```
Then check if it needs to be added to `experimental.optimizePackageImports` in `next.config.mjs` (only for large icon/component libraries).

### Installing next-intl (Phase 2)
```bash
npm install next-intl
```
Then follow `agent_docs/architecture.md` for the locale routing setup.

---

## Supabase Setup (when ready)

1. Create project at supabase.com
2. Run `supabase/schema.sql` in the SQL Editor
3. Copy Project URL and anon key to `.env.local`
4. Copy service role key to `.env.local` AND Vercel environment variables (server-only)
5. Generate TypeScript types:
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
   ```

## Stripe Setup (when ready)

1. Create account at stripe.com
2. **Claim GitHub Education fee waiver first** (education.github.com/pack → Stripe)
3. Copy publishable and secret keys to `.env.local`
4. For local webhook testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
   This gives a temporary `STRIPE_WEBHOOK_SECRET` for `.env.local`
5. In production: register webhook endpoint in Stripe dashboard → copy signing secret to Vercel env

## Resend Setup (when ready)

1. Create account at resend.com
2. Add and verify a sending domain
3. Copy API key to `.env.local`
4. Set `RESEND_FROM_EMAIL` to a verified address (e.g. `events@friki.si`)

# Deployment
*Read this when: setting up Vercel, configuring environment variables, handling CI/CD, or deploying.*

---

## Hosting Architecture

```
GitHub repo (main branch)
  └── Vercel (auto-deploy on push to main)
       ├── Static pages (Next.js SSG/ISR)
       ├── API routes (Serverless Functions)
       └── Custom domain → friki.si (or similar)
```

All hosting is on Vercel — there is no split hosting. GitHub Pages is not used for this project (unlike the council-website repo which used a split setup). Vercel handles everything including API routes.

---

## Vercel Setup Steps (first time)

1. Sign up at vercel.com (free Hobby tier)
2. Import GitHub repository (`website` folder is the project root — **important:** set Root Directory to `website` if deploying from the `Claude Madness` monorepo folder, OR move the `website` folder to its own dedicated repo)
3. Framework preset: **Next.js** (auto-detected)
4. Build command: `npm run build` (auto-detected)
5. Output directory: `.next` (auto-detected)
6. Add all environment variables (see below)
7. Deploy

**Recommended:** Create a dedicated `friki-website` GitHub repo for just the website code. Push the `website/` folder contents to it. This avoids the monorepo complexity.

---

## Environment Variables on Vercel

Go to: Project → Settings → Environment Variables

Add each variable for **Production** (and optionally **Preview** with test keys):

| Variable | Environment | Value source |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Production + Preview | Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production + Preview | Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Production only | Supabase project settings |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Production + Preview | Stripe dashboard |
| `STRIPE_SECRET_KEY` | Production only | Stripe dashboard |
| `STRIPE_WEBHOOK_SECRET` | Production only | Stripe webhook settings |
| `RESEND_API_KEY` | Production only | Resend dashboard |
| `RESEND_FROM_EMAIL` | Production only | Verified Resend domain |
| `NEXT_PUBLIC_BASE_URL` | Production + Preview | `https://friki.si` or Vercel preview URL |

**Never put server-only keys in Preview environment** if the Preview URL is publicly accessible and you're concerned about misuse. For a student council site it's fine to use test-mode keys in Preview.

---

## Custom Domain

1. Get a domain via GitHub Education (Namecheap .me free for 1 year)
2. In Vercel: Project → Settings → Domains → Add Domain
3. Follow Vercel's DNS instructions (add CNAME or A record at Namecheap)
4. SSL is automatic via Vercel

---

## Git → Vercel Deploy Flow

```
Local: git push origin feature/xxx
  → PR to dev on GitHub
  → PR to main on GitHub (after dev is stable)
  → Merging to main triggers Vercel auto-deploy
  → Vercel builds and deploys in ~1-2 minutes
  → Check deployment at vercel.com/dashboard
```

Vercel also creates **Preview Deployments** for every PR — useful for reviewing changes before merging to main.

---

## Stripe Webhook Registration (production)

1. After deploying to Vercel, get the production URL (e.g. `https://friki.si`)
2. Go to Stripe Dashboard → Developers → Webhooks → Add endpoint
3. Endpoint URL: `https://friki.si/api/webhook`
4. Events to listen for:
   - `checkout.session.completed`
   - `payment_intent.payment_failed` (optional, for failed payment handling)
5. Copy the Signing Secret → add to Vercel as `STRIPE_WEBHOOK_SECRET`

**For local development:**
```bash
stripe listen --forward-to localhost:3000/api/webhook
```
This gives a temporary webhook secret — add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`.

---

## GitHub Actions (optional — only if adding CI checks)

If you want type checking and lint to run on every PR, add `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run lint
```

Vercel already runs `npm run build` on every deploy — this CI adds earlier feedback on PRs.

---

## next.config.mjs Notes

Current config:
```javascript
{
  typescript: { ignoreBuildErrors: true },  // ← REMOVE when types are clean
  images: { unoptimized: true },            // ← revisit with Supabase Image Transform
  experimental: {
    optimizePackageImports: ['lucide-react']  // ← keep
  }
}
```

**`typescript.ignoreBuildErrors: true`** — This is a development convenience that hides real type errors from the build. Remove it as soon as all TypeScript errors in the codebase are resolved. Running with this on means broken code can be deployed.

---

## Local Development

```bash
# Start dev server
npm run dev
# → http://localhost:3000

# Type check (run before every commit)
npx tsc --noEmit

# Lint
npm run lint

# Production build test
npm run build

# Local Stripe webhook (in a second terminal)
stripe listen --forward-to localhost:3000/api/webhook
```

**`.env.local`** must exist at project root with all required variables. Copy from `.env.example` and fill in values. This file is gitignored and must never be committed.

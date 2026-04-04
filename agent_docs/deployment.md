# Deployment
*Current state: local development only; production not wired up yet.*

---

**Target:** [Vercel](https://vercel.com) for hosting (server routes when added). **GitHub Pages is not planned** — no static `output: 'export'` for this project.

**Today:** run `npm run dev`. Production build: `npm run build` succeeds; `typescript.ignoreBuildErrors: true` in `next.config.mjs` hides type errors from the build (**tech debt** — turn off when types are clean).

**Analytics:** `@vercel/analytics` is used in `app/layout.tsx`; full benefit once the project is linked to a Vercel deployment.

**CI/CD:** none yet. **Custom domain:** not configured.

When going live: create a Vercel project, set env vars from `.env.example`, register Stripe webhooks against the production `/api/webhook` URL (once that route exists).

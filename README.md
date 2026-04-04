# FRIKi Website

Public-facing website for FRIKi (Študentski svet FRI), the student council of UL FRI (Faculty of Computer and Information Science, University of Ljubljana). Handles event promotion, with ticket sales and community features planned.

## Stack

Next.js 16 · TypeScript · Tailwind CSS v4 · shadcn/ui (new-york) · IBM Plex Sans + Mono · Supabase (planned) · Stripe (planned) · Resend (planned)

**Hosting target:** Vercel

## Setup

```bash
git clone <repo-url>
cd friki-website
npm install
cp .env.example .env.local   # fill in values when services are connected
npm run dev                  # → http://localhost:3000
```

> Backend services (Supabase, Stripe, Resend) are not yet wired. The app runs fully on mock data with no env vars required.

## Docs

- [`SESSION_CONTEXT.md`](SESSION_CONTEXT.md) — current build state and phase tracker
- [`PROJECT_OVERVIEW.md`](PROJECT_OVERVIEW.md) — architecture decisions and feature spec

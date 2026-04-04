# FRIKi Website

Public-facing website for FRIKi — the student council (Študentski svet FRI) of the Faculty of Computer and Information Science at the University of Ljubljana (UL FRI), Slovenia. The site handles event promotion, ticket sales (planned), and community connection for the FRI student body.

## Tech stack

- **Next.js 16** (App Router) · **TypeScript** (strict)
- **Tailwind CSS v4** · **shadcn/ui** (new-york)
- **IBM Plex Sans** + **IBM Plex Mono** (via `next/font/google`)
- **Supabase** · **Stripe** · **Resend** — planned; not yet wired

## Setup

1. Clone the repo:
   ```bash
   git clone <repo-url>
   cd website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the env template:
   ```bash
   cp .env.example .env.local
   ```
   Fill in values when backend services are connected.

4. Start the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

> **Note:** Backend services (Supabase, Stripe, Resend) are not yet wired — the app runs fully on mock data without any env vars set.

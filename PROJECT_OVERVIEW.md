# FRIKI WEBSITE — Project Overview
*The "why" behind every decision. Read this when SESSION_CONTEXT doesn't explain something.*
*Last updated: Session 0 — April 3, 2026*

---

## 1. WHO IS THIS FOR

**Primary audience:** Students of UL FRI (Faculty of Computer and Information Science, University of Ljubljana).
**Operator:** Amadej, member of FRIKi (Študentski svet FRI) — the faculty's student council.
**Goal:** Give the council a professional public-facing website that handles event promotion, ticket sales, and community connection. Also serves as a serious technical project to learn full-stack development.

---

## 2. WHAT IS FRIKI

FRIKi is the student council of the Faculty of Computer and Information Science at the University of Ljubljana (UL FRI), Slovenia. It organises events, advocates for students within the faculty, and connects the FRI student community.

Social accounts: `@sofri_friki`, `@fri.ul`, `@studentskisvet_fri` on Instagram.

The website must feel credible to both students and faculty administration. It must handle real money (event tickets). It must be bilingual (Slovenian law requires Slovenian language; English serves international students).

---

## 3. FEATURE SPEC

### Phase 1 — Core Site (current)
**Homepage:** Hero section with FRIKi logo + headline, about the council, stat cards (members, events organised, years active), events preview, links to gallery and merch.
**Events page:** List of upcoming events with cover photos, dates, prices. Each event has a detail page with full description and "Buy Ticket" CTA.
**Ticket purchase:** Stripe Checkout. Student fills in name + email → Stripe payment page → success page with QR code. Confirmation email via Resend.
**Past events / gallery:** Timeline grid of past events with cover photos, dates, and descriptions. Photo lightbox for gallery images.
**Merch shell:** Coming-soon page with FRIKi brand, product category grid (shirts, hoodies, accessories), Instagram CTA.
**Error pages:** Custom 404 and 500.

### Phase 2 — Bilingual (next-intl)
Full Slovenian + English language support via `next-intl`. Slovenian is the default locale. URL structure: `/` for SL, `/en/` for EN. Language switcher in navbar. Required by Slovenian language law for any public-facing website associated with a public institution.

### Phase 3 — Admin UI (future)
Password-protected simple admin to manage events and gallery without touching Supabase dashboard directly. Only after Phase 1 gets real usage.

---

## 4. ARCHITECTURE DECISIONS

### Decision: Vercel for hosting (not GitHub Pages)
GitHub Pages is static-only. Stripe requires server-side code (secret key). Vercel hosts everything — static pages and API routes in the same deployment. Simpler than the split-hosting approach. GitHub Education provides free Vercel Hobby tier.

### Decision: Supabase for database and storage
PostgreSQL with Row Level Security, auto-generated TypeScript types, Supabase Storage for event photos. Free tier is generous enough for a student council site. The JS client works well in Next.js App Router.

### Decision: Stripe Checkout (not custom form)
Never touch raw card numbers. Stripe Checkout handles PCI compliance. Checkout Sessions are the correct API for single-item event ticket purchases. GitHub Education provides a $1,000 Stripe fee waiver — claim this BEFORE processing any real payments.

### Decision: Resend for email
Modern API, 3,000 free emails/month, excellent TypeScript types. Used only for ticket confirmation emails with QR code. Simple use case that doesn't need SendGrid complexity.

### Decision: IBM Plex Sans + IBM Plex Mono
IBM Plex Sans is highly readable at all sizes, has excellent Latin character support (critical for Slovenian diacritics: č, š, ž), and has a distinct, technical character that suits a CS faculty council. Mono variant used for code-like UI elements. Both available on Google Fonts.

### Decision: shadcn/ui (new-york style)
Accessible, well-maintained, composable components. New-york style for a more opinionated default look. Components are copied into the project (not a runtime dependency), enabling full customisation. CSS variables mode for theming.

### Decision: Keys-later strategy
Build all code with placeholder fallbacks. Insert real API keys only when external services are set up. This means every SDK init has `|| 'placeholder'` fallbacks. Builds pass without real keys. Zero secrets committed to git — ever.

---

## 5. DARK THEME COLOUR PALETTE

```
Background:  #0D0D0D   → --background
Surface:     #1A1A1A   → --surface (cards, nav, modals)
Border:      #2A2A2A   → --border
Accent red:  #E63030   → --accent (CTAs, hover states, active indicators)
Text:        #FFFFFF   → --foreground
Muted text:  #888888   → --muted-foreground (secondary labels, captions)
```

These map to shadcn CSS variable names where possible. The `--accent` deviates from shadcn's default (usually blue) — override it in globals.css.

---

## 6. SUPABASE SCHEMA (PLANNED)

```sql
-- Events
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  location TEXT,
  cover_image_url TEXT,
  price_in_cents INTEGER NOT NULL DEFAULT 0,
  capacity INTEGER,
  tickets_sold INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_past BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tickets
CREATE TABLE tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  qr_code TEXT,  -- base64 PNG
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery photos
CREATE TABLE gallery_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

RLS: `events` readable by all (published only). `tickets` not readable via RLS — service role only. `gallery_photos` readable by all.

---

## 7. STRIPE PAYMENT FLOW

```
Student clicks "Buy Ticket" on event detail page
  → POST /api/checkout { eventId, buyerName, buyerEmail }
  → Server validates input (Zod), checks event exists and has capacity
  → Creates Stripe Checkout Session (payment mode, single line item)
  → Returns { url: stripe_checkout_url }
  → Browser redirects to Stripe checkout page
  → Student pays
  → Stripe sends POST to /api/webhook (stripe-signature verified)
  → Webhook writes ticket to Supabase (buyer_name, buyer_email, qr_code, session_id)
  → Webhook increments tickets_sold on event
  → Webhook calls Resend to send confirmation email with QR code
  → Stripe redirects student to /tickets/success?session_id=cs_xxx
  → Success page fetches ticket from /api/tickets/[sessionId]
  → Displays QR code (student screenshots this for entry)
```

---

## 8. SECURITY CONTRACT

1. **`STRIPE_SECRET_KEY`** — only in `app/api/*` files, via `lib/config.server.ts`. Never in client.
2. **`SUPABASE_SERVICE_ROLE_KEY`** — same. Only `lib/supabase-server.ts`, only in API routes.
3. **Webhook verification** — every call to `/api/webhook` must call `stripe.webhooks.constructEvent()` with the raw body and the signature header before doing anything.
4. **RLS on Supabase** — tickets table has no public SELECT policy. Only service role can read.
5. **CORS** — all API routes return `Access-Control-Allow-Origin: ${process.env.NEXT_PUBLIC_BASE_URL}`. Never wildcard `*`.
6. **Input validation** — every API route runs Zod validation on the request body before touching Stripe or Supabase.
7. **`.env.local` never committed** — always in `.gitignore`. Use `.env.example` for documentation.

---

## 9. UX NON-NEGOTIABLES

1. The site must work well on mobile — primary device for students
2. Every loading state handled — Suspense boundaries, skeleton loaders
3. Every empty state handled — "No upcoming events yet" beats a broken grid
4. Payment flow must be one-click from event page to Stripe checkout
5. Success page shows the QR code immediately — students will screenshot it
6. All animations respect `prefers-reduced-motion`
7. The site must feel polished and trustworthy — students are handing over real money
8. Dark theme only — no light mode toggle (brand decision)

---

## 10. WHAT "DONE" LOOKS LIKE FOR PHASE 1

- A student can visit the site, see upcoming events, click "Buy Ticket", pay via Stripe test mode, receive a confirmation email with a QR code, and see the QR code on the success page
- The past events page shows event history with photos in a timeline grid
- The homepage clearly communicates who FRIKi is with stats, events preview, and council info
- The merch page has a coming-soon state with an Instagram CTA
- The site is deployed to Vercel with all env vars configured
- Custom domain points to Vercel deployment

---

## 11. GITHUB EDUCATION PACK BENEFITS

| Benefit | What to use it for |
|---|---|
| Namecheap .me domain (1 year free) | Primary domain for the site |
| Stripe fee waiver ($1,000 revenue) | **Claim BEFORE processing any real payments** |
| GitHub Copilot Student | Activate in GitHub account settings |
| Vercel Hobby (free for all) | Hosting — sign up at vercel.com |
| Supabase free tier | Database + storage — sign up at supabase.com |

**Important:** Go to education.github.com/pack → find Stripe → click the link → connect Stripe account. Do this before the first event goes live.

---

*Last updated: Session 0 — April 3, 2026*

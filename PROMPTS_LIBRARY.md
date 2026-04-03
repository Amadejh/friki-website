# FRIKI WEBSITE — Prompts Library
*DEPRECATED — prompts are now logged in PROMPT_LOG.md as they are written and used.*
*This file is kept only as a reference for planned future phases. Do not add new prompts here.*
*Last updated: Session 0 — April 3, 2026*

> See PROMPT_LOG.md for all active prompts.

---

## HOW TO USE THESE PROMPTS

1. Open Claude Code in `C:\Users\amade\Desktop\Claude Madness\website\`
2. Run `/session-start` to confirm current state
3. Run `/branch [feature-name]` to create the right branch
4. Paste the prompt below for the current phase
5. When Claude Code finishes: run `/phase-complete` to commit, merge to dev, update session files

---

## PROMPT 1 — Phase 1e: Lib Scaffolding
*Branch: `feature/lib-scaffold`*
*What it builds: All service client files, config split, types — the foundation everything else needs*

```
Read CLAUDE.md, SESSION_CONTEXT.md, SELF_IMPROVEMENT_LOG.md, and agent_docs/stack.md.

Context: The homepage is built with mock data. Before building real pages and API routes,
we need all the service client files (Supabase, Stripe, Resend) and type definitions.
Every SDK init needs a placeholder fallback so builds pass without real keys.

STEP 1 — Config split
Create `lib/config.ts` (public vars, safe for any import):
```ts
export const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
} as const
```

Create `lib/config.server.ts` (server secrets — only import from app/api/* files):
```ts
export const serverConfig = {
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder',
  resendApiKey: process.env.RESEND_API_KEY || 're_placeholder',
  resendFromEmail: process.env.RESEND_FROM_EMAIL || 'events@friki.si',
} as const
```

STEP 2 — Supabase clients
Create `lib/supabase-client.ts` (anon client, safe for server components and browser):
Uses `config.supabaseUrl` and `config.supabaseAnonKey` from lib/config.ts.
Import from '@supabase/supabase-js'. Type with `Database` from types/database.ts (create the import but the file doesn't exist yet — use `// TODO: replace any with Database type once supabase types are generated`).

Create `lib/supabase-server.ts` (service role client, API routes ONLY):
Uses `config.supabaseUrl` and `serverConfig.supabaseServiceRoleKey`.
Add a comment: `// SERVER ONLY — never import this in pages, layouts, or client components`.

STEP 3 — Stripe client
Create `lib/stripe.ts`:
- Import Stripe from 'stripe'
- Init: `new Stripe(serverConfig.stripeSecretKey, { apiVersion: '2024-12-18.acacia' })`
- Export as named `stripe`
- Add: `// SERVER ONLY`

STEP 4 — Resend client
Create `lib/resend.ts`:
- Import Resend from 'resend'
- Init with `serverConfig.resendApiKey`
- Export as named `resend`
- Add: `// SERVER ONLY`

STEP 5 — Email helper
Create `lib/email.ts`:
- Import `resend` from ./resend and `serverConfig` from ./config.server
- Export async function `sendTicketConfirmation({ buyerName, buyerEmail, eventName, eventDate, eventLocation, qrCode }: TicketEmailParams)`
- Sends a simple HTML email via resend. HTML-escape all user-provided strings before inserting into HTML.
- Subject: `Your ticket for ${eventName}`
- Body: shows event details + QR code image (base64 PNG as `<img src="data:image/png;base64,${qrCode}" />`)
- Returns `{ success: boolean }`

STEP 6 — Type definitions
Create `types/database.ts`:
- Placeholder with a comment: `// Run: npx supabase gen types typescript --project-id YOUR_ID > types/database.ts`
- Export a minimal placeholder: `export type Database = any // TODO: replace with generated types`
- Export the `Event` interface matching `lib/data.ts` shape exactly (same fields: slug, name, date, time, location, organizer, teaser, description, posterSeed, year, category, wide?)

Create `types/api.ts`:
- Export `CheckoutRequest`: `{ eventId: string; buyerName: string; buyerEmail: string }`
- Export `CheckoutResponse`: `{ url: string }`
- Export `ApiError`: `{ success: false; error: string }`
- Export `ApiSuccess<T>`: `{ success: true; data: T }`

STEP 7 — Install missing deps
Check package.json. Install if not present:
- `@supabase/supabase-js` (for Supabase)
- `stripe` (for Stripe)
- `resend` (for Resend)
- `qrcode` (for QR code generation)
- `@types/qrcode` (dev dependency)

STEP 8 — Verify
Run: npx tsc --noEmit
Run: npm run lint
Fix all errors. The build should pass with placeholder values.
If there are import errors in EventsCarousel or Archive from lib/data.ts, do NOT change those — they use mock data intentionally.

Update SESSION_CONTEXT.md: mark Phase 1e ✅, update file status for all new lib/ and types/ files.
Add any lessons to SELF_IMPROVEMENT_LOG.md.
```

---

## PROMPT 2 — Phase 1f: Events Pages
*Branch: `feature/events-pages`*
*What it builds: /events list + /events/[id] detail page, TicketModal component, reusable EventCard*

```
Read CLAUDE.md, SESSION_CONTEXT.md, SELF_IMPROVEMENT_LOG.md, agent_docs/architecture.md, and agent_docs/design-system.md.

Context: The lib scaffold is done. Now build the events pages. Use mock data from lib/data.ts
for now — Supabase connection comes in Phase 1j. The page structure should be ready for
data to be swapped in later with minimal changes (server component fetching pattern).

STEP 1 — Reusable EventCard component
Create `components/event-card.tsx` (Server Component — no 'use client'):
- Props: `event: Event` (from types/database.ts), `showBuyButton?: boolean`
- Card design matching EventsCarousel cards: bg-card, border-border, rounded-md
- Cover image: aspect-[4/5] with next/image fill, opacity-70 group-hover:opacity-90 group-hover:scale-105
- Category badge: top-left, bg-primary text-white font-mono text-xs
- Content: title (text-foreground font-semibold), date + location with Calendar/MapPin icons (text-muted-foreground font-mono text-xs, icons in text-primary)
- Teaser: text-[var(--body-text)] text-sm line-clamp-2
- If showBuyButton: full-width bg-primary button with "Buy ticket" text
- Card is wrapped in a Next.js Link to /events/[event.slug]
- card-hover class on the Link (defined in globals.css — if not present, add it in this step)

STEP 2 — Events list page
Create `app/events/page.tsx` (Server Component):
- Import upcomingEvents from lib/data.ts (replace with Supabase query in Phase 1j — add TODO comment)
- Page header: eyebrow label (font-mono uppercase tracking-[0.2em] text-primary), h1 "Upcoming Events"
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Render EventCard for each event with showBuyButton={true}
- Empty state: if no events, show a centered message "No upcoming events right now — check back soon."
- Page background: bg-background, py-16 md:py-24, content in max-w-7xl mx-auto px-6 lg:px-8
- Add metadata export: `export const metadata = { title: 'Events – Friki', description: '...' }`

STEP 3 — Event detail page (server wrapper + client component split)
Create `app/events/[id]/page.tsx` (Server Component):
- `params: Promise<{ id: string }>` — await params (Next.js 15+ pattern)
- Find event: `allEvents.find(e => e.slug === params.id)` from lib/data.ts (TODO: replace with Supabase)
- If not found: `notFound()` from next/navigation
- Renders `<EventDetailContent event={event} />`
- Add `generateStaticParams`: return all event slugs from allEvents
- Metadata: `{ title: \`${event.name} – Friki\`, description: event.teaser }`

Create `components/event-detail-content.tsx` ('use client'):
- Props: `{ event: Event }`
- Layout: two-column on desktop (lg:grid-cols-2): left = cover image, right = all details
- Left: large cover image with next/image, aspect-[3/4] or aspect-square
- Right: eyebrow (category badge), h1 (event name, large text-foreground), date/time/location (font-mono), organizer, full description (text-[var(--body-text)] leading-relaxed)
- Buy ticket button: full-width bg-primary rounded-sm, opens TicketModal
- useState for modalOpen: false
- Renders `<TicketModal eventId={event.slug} eventName={event.name} price={0} open={modalOpen} onClose={() => setModalOpen(false)} />`
  (price={0} for now — replace with real price in Phase 1j)

STEP 4 — TicketModal component
Create `components/ticket-modal.tsx` ('use client'):
- Props: `{ eventId: string; eventName: string; price: number; open: boolean; onClose: () => void }`
- If price === 0: show "This event is free" message with a close button (do NOT call Stripe for free events)
- If price > 0: show form with buyerName (text input) and buyerEmail (email input)
- On submit: disable button + show spinner, POST to /api/checkout, redirect to returned url
- On error: show error message with shake animation, re-enable button
- Use shadcn Dialog component from components/ui/dialog
- Validate: name not empty, email valid format — client-side before submit
- Accessibility: focus trap inside Dialog, close on Escape

STEP 5 — CORS helper
Create `app/api/cors.ts`:
```ts
const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
export const corsHeaders = {
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
} as const
```

STEP 6 — Verify
Run: npx tsc --noEmit — all types must pass
Run: npm run lint — must pass
Run: npm run dev — visit /events and /events/fri-noč-2025 and confirm pages render correctly
Update SESSION_CONTEXT.md: mark Phase 1f ✅, update file status.
Add any new lessons to SELF_IMPROVEMENT_LOG.md.
```

---

## PROMPT 3 — Phase 1g: Stripe Checkout Flow
*Branch: `feature/api-checkout`*
*What it builds: /api/checkout, /api/events, TicketModal wired to real API*

```
Read CLAUDE.md, SESSION_CONTEXT.md, SELF_IMPROVEMENT_LOG.md, agent_docs/stack.md.

Context: Events pages are built. Now add the Stripe checkout API route.
The TicketModal already exists — we just need the backend endpoint it calls.
IMPORTANT: Stripe rejects unit_amount: 0. Free events must return early before touching Stripe.

STEP 1 — Events API route
Create `app/api/events/route.ts`:
- GET handler only
- Import supabase-client, corsHeaders
- Query: `supabase.from('events').select('*').eq('is_published', true).eq('is_past', false).order('date', { ascending: true })`
- Return the array wrapped in ApiSuccess<Event[]>
- Handle OPTIONS for CORS preflight
- Full try/catch with ApiError response on failure

STEP 2 — Checkout API route
Create `app/api/checkout/route.ts`:
- POST handler
- Import: stripe from lib/stripe, supabase-client, serverConfig from lib/config.server, corsHeaders, zod z
- Input validation with Zod: `CheckoutSchema = z.object({ eventId: z.string(), buyerName: z.string().min(1).max(100), buyerEmail: z.string().email() })`
- Parse body: `const body = CheckoutSchema.parse(await request.json())`
- Fetch event from Supabase (or for now, from lib/data.ts allEvents — add TODO comment)
- If event not found: return 404
- If event.price_in_cents === 0: return 400 with message "Free events do not require checkout"
  (price_in_cents will be a field on the Supabase event — use event.priceInCents from mock data for now as 500 = €5.00)
- Create Stripe session:
  ```
  stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [{ price_data: { currency: 'eur', unit_amount: event.priceInCents, product_data: { name: event.name } }, quantity: 1 }],
    customer_email: body.buyerEmail,
    metadata: { eventId: body.eventId, buyerName: body.buyerName, buyerEmail: body.buyerEmail },
    success_url: `${serverConfig.baseUrl || process.env.NEXT_PUBLIC_BASE_URL}/tickets/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/events/${body.eventId}`,
  })
  ```
  Wait — serverConfig doesn't have baseUrl. Add: `baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'` to lib/config.server.ts (it's fine in server config, just can't be secret).
- Return `{ url: session.url }`
- Full try/catch

STEP 3 — Handle OPTIONS preflight for both routes
Both API routes need to handle OPTIONS requests:
```ts
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders })
}
```

STEP 4 — Add priceInCents to mock data (temporary)
In `lib/data.ts`, add `priceInCents?: number` to the Event interface.
Add `priceInCents: 500` to FRI Noč and Hackathon events (€5.00 for testing).
Add `priceInCents: 0` to free events (Welcome Week, Career Fair).

STEP 5 — Wire TicketModal to real prices
Update `components/event-detail-content.tsx`:
- Pass `price={event.priceInCents ?? 0}` to TicketModal instead of hardcoded 0
- This makes the free-event guard work correctly

STEP 6 — Spawn security-reviewer subagent
After writing all API route files, spawn the security-reviewer.
Pass: app/api/checkout/route.ts, app/api/events/route.ts, lib/config.server.ts, lib/stripe.ts
Fix all CRITICAL and HIGH findings before committing.

STEP 7 — Verify
npx tsc --noEmit && npm run lint
Update SESSION_CONTEXT.md: mark Phase 1g ✅, update file status.
```

---

## PROMPT 4 — Phase 1h: Webhook + Email + Success Page
*Branch: `feature/api-webhook`*
*What it builds: Stripe webhook handler, Resend confirmation email, /tickets/success QR page*

```
Read CLAUDE.md, SESSION_CONTEXT.md, SELF_IMPROVEMENT_LOG.md, agent_docs/stack.md.

Context: Checkout redirects to Stripe. Now handle the webhook (Stripe calls us after payment)
and the success page (where the student lands after paying).
CRITICAL: Stripe webhooks MUST use req.text() not req.json() before constructEvent().

STEP 1 — Webhook route
Create `app/api/webhook/route.ts`:
- Export `runtime = 'nodejs'` at the top (required for raw body access)
- POST handler only
- Read raw body: `const rawBody = await request.text()` — MUST be text(), NOT json()
- Verify signature: `stripe.webhooks.constructEvent(rawBody, request.headers.get('stripe-signature') ?? '', serverConfig.stripeWebhookSecret)`
- If verification throws: return 400 with "Invalid signature"
- Handle event type `checkout.session.completed` only (ignore other event types)
- Extract session metadata: `session.metadata.eventId`, `session.metadata.buyerName`, `session.metadata.buyerEmail`
- Validate metadata: if any field is missing, log and return 200 (Stripe will retry otherwise)
- Generate QR code: `const qrBuffer = await QRCode.toBuffer(session.id, { width: 300 })`
  Import qrcode: `import QRCode from 'qrcode'`
  Convert to base64: `const qrBase64 = qrBuffer.toString('base64')`
- Insert ticket into Supabase (supabase-server):
  ```
  supabaseAdmin.from('tickets').insert({
    event_id: session.metadata.eventId,
    buyer_name: session.metadata.buyerName,
    buyer_email: session.metadata.buyerEmail,
    stripe_session_id: session.id,
    qr_code: qrBase64,
  })
  ```
  For now (before Supabase is set up): wrap in try/catch and log if it fails — don't crash the webhook
- Increment tickets_sold: call Supabase RPC `increment_tickets_sold` (if Supabase not set up yet, skip)
- Send confirmation email: `sendTicketConfirmation({ buyerName, buyerEmail, eventName, qrCode: qrBase64, ... })`
  Get event name from Supabase or log a TODO
- Always return 200 at the end (Stripe retries on any non-2xx)

STEP 2 — Ticket lookup route
Create `app/api/tickets/[sessionId]/route.ts`:
- GET handler
- Import supabase-server
- Query: `supabaseAdmin.from('tickets').select('*').eq('stripe_session_id', params.sessionId).single()`
- Return ticket or 404

STEP 3 — Success page
Create `app/tickets/success/page.tsx` ('use client'):
- Read `session_id` from URL: `useSearchParams()` — wrap page in Suspense (see SELF_IMPROVEMENT_LOG)
- Fetch ticket: GET /api/tickets/[session_id] using useEffect + useState
- Loading state: show spinner (animate-spin circle)
- Error state: show "Ticket not found — please contact friki@fri.uni-lj.si"
- Success state:
  - Large heading: "You're in! 🎉"
  - Event name and date
  - QR code: `<img src={\`data:image/png;base64,${ticket.qr_code}\`} alt="Your ticket QR code" className="w-48 h-48 mx-auto" />`
  - Caption: "Screenshot this QR code — you'll need it at the door"
  - Download button: `<a href={\`data:image/png;base64,${ticket.qr_code}\`} download="friki-ticket.png">Download QR code</a>`
- Page background: bg-background, centered layout, py-24

STEP 4 — Supabase schema (placeholder for when Supabase is ready)
Create `supabase/schema.sql` with the events, tickets, and gallery_photos table definitions from PROJECT_OVERVIEW.md section 6.
Include the RLS policies and the increment_tickets_sold RPC function.

STEP 5 — Spawn security-reviewer subagent
Pass: app/api/webhook/route.ts, app/api/tickets/[sessionId]/route.ts
Fix all CRITICAL and HIGH findings.

STEP 6 — Verify
npx tsc --noEmit && npm run lint
Update SESSION_CONTEXT.md: mark Phase 1h ✅.
```

---

## PROMPT 5 — Phase 1i: Remaining Pages
*Branch: `feature/remaining-pages`*
*What it builds: /past-events, /merch (coming soon), 404, error.tsx*

```
Read CLAUDE.md, SESSION_CONTEXT.md, SELF_IMPROVEMENT_LOG.md, agent_docs/design-system.md.

Context: Core purchase flow is done. Now build the remaining informational pages.
These are simpler pages — no API calls, no modals.

STEP 1 — Past events page
Create `app/past-events/page.tsx` (Server Component):
- Import archiveEvents from lib/data.ts (TODO: replace with Supabase in Phase 1j)
- Same grid layout as the Archive component on the homepage
- Page header: eyebrow "Look Back", h1 "Archive"
- Grid: same masonry-style 2-col / 3-col grid as components/archive.tsx
- But instead of a "load more" button — show ALL archive events (it's a dedicated archive page)
- Each card links to /events/[event.slug]
- Metadata: `{ title: 'Archive – Friki', description: 'Past events from Friki student council.' }`

STEP 2 — Merch page (coming soon)
Create `app/merch/page.tsx` (Server Component):
- Centered coming-soon layout
- FRIKi eyebrow label, h1 "Merch Store"
- Subtitle: "Coming soon — follow us on Instagram for the first drop."
- Instagram CTA button linking to https://instagram.com/sofri_friki
- Category teasers grid (2x2): T-shirts, Hoodies, Accessories, Limited drops
  Each teaser: icon + label, bg-card border-border rounded-md, muted/locked appearance
- Metadata

STEP 3 — 404 page
Create `app/not-found.tsx`:
- Large "404" in text-primary font-mono
- Heading: "Page not found"
- Brief message
- Link back to / — styled like a CTA button

STEP 4 — Error boundary
Create `app/error.tsx` ('use client'):
- Props: `{ error: Error; reset: () => void }`
- Show error message (sanitised — show message but not stack trace)
- "Try again" button that calls reset()

STEP 5 — Loading state for events pages
Create `app/events/loading.tsx`:
- Skeleton grid of 6 event cards (animate-pulse, bg-secondary rounded-md blocks)

STEP 6 — Update Navbar links
Update `components/navbar.tsx` navLinks array to include all pages:
```ts
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/past-events', label: 'Archive' },
  { href: '/merch', label: 'Merch' },
]
```
The IntersectionObserver section detection only applies to the homepage `/` — it already handles this correctly.

STEP 7 — Verify
npx tsc --noEmit && npm run lint && npm run build
Visit: /, /events, /events/fri-noč-2025, /past-events, /merch, /non-existent-page
All should render correctly.
Update SESSION_CONTEXT.md: mark Phase 1i ✅.
```

---

## PROMPT 6 — Phase 1j: Connect Real Supabase Data
*Branch: `feature/supabase-data`*
*Prerequisites: Supabase project created, schema.sql run, keys in .env.local*
*What it builds: Replace all mock data imports with real Supabase server-component queries*

```
Read CLAUDE.md, SESSION_CONTEXT.md, SELF_IMPROVEMENT_LOG.md, agent_docs/stack.md.

Context: Supabase project is set up. Time to replace all lib/data.ts mock imports with
real server-side database queries. The page structure is already correct — it's just a
data source swap.

STEP 1 — Generate Supabase TypeScript types
Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID_HERE > types/database.ts
Replace the placeholder `export type Database = any` with the generated content.
Update lib/supabase-client.ts and lib/supabase-server.ts to use `createClient<Database>`.

STEP 2 — Update Event type
In types/database.ts (or a separate types/api.ts), export an Event type derived from the
generated Supabase types:
`export type Event = Database['public']['Tables']['events']['Row']`
This replaces the hand-written Event interface in lib/data.ts.

STEP 3 — Update events pages with real data
Update `app/events/page.tsx`:
- Remove: `import { upcomingEvents } from '@/lib/data'`
- Add: `const supabase = createClient(); const { data: events } = await supabase.from('events').select('*').eq('is_published', true).eq('is_past', false).order('date', { ascending: true })`
- Use `events ?? []` in the render

Update `app/past-events/page.tsx`:
- Same pattern but: `.eq('is_past', true).order('date', { ascending: false })`

Update `app/events/[id]/page.tsx`:
- Replace allEvents.find() with: `supabase.from('events').select('*').eq('slug', params.id).single()`
- Update generateStaticParams: `const { data: events } = await supabase.from('events').select('slug'); return events?.map(e => ({ id: e.slug })) ?? []`

STEP 4 — Update homepage sections
The EventsCarousel and Archive components currently import from lib/data.ts directly.
This needs to change: data fetching should happen in the Server Component (page.tsx),
then be passed as props to the components.

Update `app/page.tsx` to fetch data server-side:
```ts
const supabase = createClient()
const { data: upcoming } = await supabase.from('events').select('*').eq('is_published', true).eq('is_past', false).order('date').limit(6)
const { data: archive } = await supabase.from('events').select('*').eq('is_past', true).order('date', { ascending: false }).limit(12)
```
Pass `events={upcoming ?? []}` to EventsCarousel and `events={archive ?? []}` to Archive.

Update `components/events-carousel.tsx` and `components/archive.tsx`:
- Remove: `import { upcomingEvents/archiveEvents } from '@/lib/data'`
- Add: `events: Event[]` to props (Server Component — no 'use client' needed unless it already exists)
- Archive component has useState (for load more) — it stays as 'use client', receives all events via props

STEP 5 — Remove mock data dependency
After confirming all pages work with real data:
- Keep lib/data.ts but rename exports to `mockUpcomingEvents`, `mockArchiveEvents` for any future testing use
- Or delete it entirely if confident

STEP 6 — Verify end-to-end
With Stripe CLI running: `stripe listen --forward-to localhost:3000/api/webhook`
1. Visit /events — should show events from Supabase
2. Click an event → visit /events/[slug] — event detail loads
3. Click "Buy Ticket" → fill form → complete Stripe test payment
4. Land on /tickets/success → QR code displays
5. Check email inbox → confirmation email received
6. Check Supabase dashboard → ticket row created

Update SESSION_CONTEXT.md: mark Phase 1j ✅.
```

---

## PROMPT 7 — Phase 2: Bilingual (next-intl)
*Branch: `feature/i18n-bilingual`*
*Prerequisites: Phase 1 fully complete and deployed*
*What it builds: Full SL/EN support, all pages bilingual, language switcher wired*

```
Read CLAUDE.md, SESSION_CONTEXT.md, SELF_IMPROVEMENT_LOG.md, agent_docs/architecture.md.

Context: Phase 1 is complete and deployed. Time to add bilingual support as required by
Slovenian language law. Default locale: sl. Secondary: en. All pages move to app/[locale]/*.
API routes stay at app/api/* (locale-independent).

STEP 1 — Install next-intl
npm install next-intl

STEP 2 — Create i18n routing config
Create `i18n/routing.ts`:
```ts
import { defineRouting } from 'next-intl/routing'
export const routing = defineRouting({ locales: ['sl', 'en'], defaultLocale: 'sl' })
```

Create `i18n/navigation.ts`:
```ts
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
```

Create `i18n/request.ts`:
```ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? routing.defaultLocale
  return { locale, messages: (await import(`../messages/${locale}.json`)).default }
})
```

STEP 3 — Create translation files
Create `messages/sl.json` with all UI strings in Slovenian:
- Navigation: Domov, Dogodki, Arhiv, Merch
- Hero: eyebrow, headline, subtitle, CTA buttons
- Events section: "Prihajajoci dogodki", card actions, empty state
- Archive: "Arhiv", "Naloži več"
- Footer: contact text, copyright
- Ticket modal: form labels, submit button, error messages
- Success page: heading, QR instructions

Create `messages/en.json` with English equivalents.

STEP 4 — Create middleware
Create/update `middleware.ts`:
```ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
export default createMiddleware(routing)
export const config = { matcher: ['/((?!api|_next|.*\\..*).*)'] }
```

STEP 5 — Migrate pages to [locale] routing
Move all page files from `app/` to `app/[locale]/`:
- app/layout.tsx → app/[locale]/layout.tsx
- app/page.tsx → app/[locale]/page.tsx
- app/events/ → app/[locale]/events/
- app/past-events/ → app/[locale]/past-events/
- app/merch/ → app/[locale]/merch/
- app/tickets/ → app/[locale]/tickets/
- app/not-found.tsx → app/[locale]/not-found.tsx

Every Server Component page must call `setRequestLocale(locale)` BEFORE getTranslations():
```ts
import { setRequestLocale } from 'next-intl/server'
export default async function Page({ params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('namespace')
  // ...
}
```

STEP 6 — Update layout to use NextIntlClientProvider
Update `app/[locale]/layout.tsx`:
- Accept `locale` from params
- Call setRequestLocale(locale)
- Wrap children in `<NextIntlClientProvider messages={messages} locale={locale}>`
- Update <html lang={locale}>

STEP 7 — Wire LanguageSwitcher in Navbar
The Navbar already has a language toggle UI. Replace the local `useState<'SL'|'EN'>` state
with actual next-intl locale switching using the Link from i18n/navigation.ts.
The language switcher should link to the same path in the other locale.

STEP 8 — Verify static builds
Run: npm run build
All routes should render. Check for any "couldn't be rendered statically because it used headers" errors.
Fix with setRequestLocale() if any appear.

Update SESSION_CONTEXT.md: mark Phase 2 ✅.
```

---

## QUICK REFERENCE: PROMPT ORDER

| # | Phase | Branch | Time est. |
|---|---|---|---|
| 1 | Lib scaffold | `feature/lib-scaffold` | 1 session |
| 2 | Events pages | `feature/events-pages` | 1 session |
| 3 | Stripe checkout | `feature/api-checkout` | 1 session |
| 4 | Webhook + email + success | `feature/api-webhook` | 1 session |
| 5 | Remaining pages | `feature/remaining-pages` | 1 session |
| 6 | Connect Supabase | `feature/supabase-data` | 1 session + service setup |
| 7 | Bilingual (next-intl) | `feature/i18n-bilingual` | 1-2 sessions |

Each prompt is designed to be one Claude Code session. Use `/phase-complete` at the end of each.

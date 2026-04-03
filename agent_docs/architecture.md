# Architecture
*Read this when: creating new pages, new components, new API routes, or restructuring the app.*

---

## Directory Structure

```
website/
├── app/
│   ├── layout.tsx                  ← Root layout: fonts, metadata, Analytics
│   ├── page.tsx                    ← Homepage (/)
│   ├── globals.css                 ← Global styles, CSS variables, Tailwind import
│   ├── events/
│   │   ├── page.tsx                ← Events list (/events)
│   │   └── [id]/
│   │       └── page.tsx            ← Event detail (/events/[id])
│   ├── past-events/
│   │   └── page.tsx                ← Past events gallery (/past-events)
│   ├── merch/
│   │   └── page.tsx                ← Merch store shell (/merch)
│   ├── tickets/
│   │   └── success/
│   │       └── page.tsx            ← Post-purchase success (/tickets/success)
│   ├── api/
│   │   ├── cors.ts                 ← Shared CORS headers helper
│   │   ├── events/route.ts         ← GET /api/events
│   │   ├── checkout/route.ts       ← POST /api/checkout
│   │   ├── webhook/route.ts        ← POST /api/webhook (Stripe)
│   │   ├── tickets/
│   │   │   └── [sessionId]/route.ts ← GET /api/tickets/[sessionId]
│   │   └── gallery/route.ts        ← GET /api/gallery
│   └── [locale]/                   ← Phase 2 only: bilingual routing
│       └── layout.tsx
├── components/
│   ├── ui/                         ← shadcn/ui generated components — DO NOT EDIT
│   ├── navbar.tsx                  ← Site navigation
│   ├── footer.tsx                  ← Site footer
│   ├── hero.tsx                    ← Homepage hero section
│   ├── events-carousel.tsx         ← Homepage events preview
│   ├── archive.tsx                 ← Homepage past events teaser
│   ├── event-card.tsx              ← Reusable event card component
│   ├── event-detail-content.tsx    ← Client component for event detail + ticket modal
│   ├── ticket-modal.tsx            ← Buy ticket form (name + email → Stripe checkout)
│   ├── nav-link.tsx                ← Active-state nav link
│   ├── language-switcher.tsx       ← SL/EN toggle (Phase 2)
│   ├── stat-card.tsx               ← Animated counter card
│   ├── section-divider.tsx         ← SVG curve divider between sections
│   ├── hero-spotlight.tsx          ← Cursor-following radial gradient
│   ├── marquee-ticker.tsx          ← Infinite scrolling ticker
│   ├── scroll-progress.tsx         ← Fixed red progress bar on scroll
│   └── theme-provider.tsx          ← next-themes provider (dark-only)
├── lib/
│   ├── config.ts                   ← Public env vars only (NEXT_PUBLIC_*)
│   ├── config.server.ts            ← Server secrets — API routes ONLY
│   ├── supabase-client.ts          ← Anon client — safe for server components + browser
│   ├── supabase-server.ts          ← Service role client — API routes ONLY
│   ├── stripe.ts                   ← Stripe client — API routes ONLY
│   ├── resend.ts                   ← Resend client — API routes ONLY
│   ├── email.ts                    ← sendTicketConfirmation() — API routes ONLY
│   └── utils.ts                    ← shadcn cn() utility (already exists)
├── types/
│   ├── database.ts                 ← Supabase auto-generated types
│   └── api.ts                      ← Request/response types for API routes
├── supabase/
│   └── schema.sql                  ← Run in Supabase SQL Editor on project creation
├── public/
│   └── friki-logo.png              ← FRIKi logo (white on transparent, PNG)
├── hooks/                          ← Custom React hooks (shadcn put some here)
├── agent_docs/                     ← Context files for Claude Code
├── .claude/                        ← Claude Code configuration
└── [config files]
```

---

## Routing Patterns

### Static pages (no data)
Use Server Components. No `'use client'` needed.
```typescript
// app/merch/page.tsx
export default function MerchPage() {
  return <main>...</main>
}
```

### Pages with async data (Supabase)
Use Server Components with `async`. Data fetches happen server-side.
```typescript
// app/events/page.tsx
import { createClient } from '@/lib/supabase-client'

export default async function EventsPage() {
  const supabase = createClient()
  const { data: events } = await supabase.from('events').select('*').eq('is_published', true)
  return <main><EventList events={events ?? []} /></main>
}
```

### Pages with user interaction (forms, modals, state)
Split into Server Component wrapper + Client Component child:
```typescript
// app/events/[id]/page.tsx — Server Component (fetches data)
export default async function EventDetailPage({ params }) {
  const event = await fetchEvent(params.id)
  return <EventDetailContent event={event} />  // passes data to client
}

// components/event-detail-content.tsx — Client Component
'use client'
export function EventDetailContent({ event }) {
  const [modalOpen, setModalOpen] = useState(false)
  // ... interactive UI
}
```

### API routes
All in `app/api/`. Use `runtime = 'nodejs'` for routes that need full Node.js (Stripe webhook). Use the shared CORS helper.
```typescript
// app/api/events/route.ts
import { corsHeaders } from '@/app/api/cors'

export async function GET() {
  // ... fetch and return data
  return Response.json(data, { headers: corsHeaders })
}
```

---

## Component Naming Conventions

- **Files:** kebab-case (`event-card.tsx`, `nav-link.tsx`)
- **Components:** PascalCase matching filename (`EventCard`, `NavLink`)
- **Client components:** add `'use client'` as the first line when using hooks
- **Colocate:** if a component is only used in one page, it can live in that page's directory. Shared components go in `components/`.

---

## Data Flow

```
Supabase database
  → lib/supabase-client.ts (anon, public read)
  → Server Component (async data fetch)
  → Props passed to Client Components
  → User interaction
  → POST to API route
  → lib/supabase-server.ts (service role, writes)
  → Supabase database updated
```

**Rule:** Data reads from Supabase happen in Server Components (free, fast, no waterfall).
**Rule:** Data writes always go through API routes (to use the service role safely).

---

## Key Config Files

### next.config.mjs
- `typescript.ignoreBuildErrors: true` — **Remove this** once all types are correct (it hides real errors)
- `images.unoptimized: true` — keep until Supabase Storage is set up
- `experimental.optimizePackageImports: ['lucide-react']` — keep, reduces bundle size

### components.json (shadcn)
- Do not modify `aliases` — they match `tsconfig.json` path mappings (`@/components`, `@/lib`, etc.)
- `style: 'new-york'` — all new shadcn components should use this style

### tsconfig.json
Path mappings are configured for `@/` → root. When adding new top-level directories, add them here if you want `@/newdir/*` imports.

---

## Phase 2: Bilingual Routing (next-intl)

When Phase 2 starts, the routing changes from `/page` to `/[locale]/page`:
```
/             → /sl/         (Slovenian, redirected from root)
/en/          → /en/         (English)
/events       → /sl/events
/en/events    → /en/events
```

All pages move from `app/` to `app/[locale]/`. Layout changes to accept locale param.
API routes stay at `app/api/` — they are locale-independent.
**Do not start Phase 2 until Phase 1 is complete and tested.**

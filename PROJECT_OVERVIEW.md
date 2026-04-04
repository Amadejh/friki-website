# FRIKI WEBSITE — Project Overview
*The "why" behind every decision. Read this when SESSION_CONTEXT doesn't explain something.*
*Last updated: Session 2 — April 3, 2026*

---

## 1. WHO IS THIS FOR

**Primary audience:** Students of UL FRI (Faculty of Computer and Information Science, University of Ljubljana).
**Operator:** Amadej, member of FRIKi (Študentski svet FRI) — the faculty's student council.
**Goal:** Give the council a professional public-facing website that handles event promotion, ticket sales, and community connection. Also serves as a serious technical project to learn full-stack development.

---

## 2. WHAT IS FRIKI

FRIKi is the student council of the Faculty of Computer and Information Science at the University of Ljubljana (UL FRI), Slovenia. It organises events, advocates for students within the faculty, and connects the FRI student community.

Social accounts include `@sofri_friki` and related faculty channels on Instagram.

The site must feel credible to students and faculty. For payments and public messaging, bilingual support matters: Slovenian is legally and culturally primary; English serves international students. **Today**, copy is SL/EN via React Context and `localStorage`. **Planned:** URL-based locales with `next-intl` (Phase 2).

---

## 3. FEATURE SPEC

### What exists now (Phase 1 — in progress)

- **Homepage (`/`):** Navbar, hero (team photo + identity line + about strip), upcoming events carousel, archive section (grid, search, modal lightbox), footer.
- **Event detail (`/events/[slug]`):** Static pages generated from mock data — hero image, breadcrumbs, sidebar with event meta.
- **404:** `app/not-found.tsx`.
- **Data:** Mock events in `lib/data.ts` — no database or API yet.

### Planned for Phase 1 completion

- **Events list page** (`/events` or equivalent) listing upcoming events.
- **Stripe Checkout** + **webhook** + **Supabase** persistence for tickets; **Resend** for confirmation email; success page with QR-style ticket display.
- **Past events / merch** pages as specified in product discussions (placeholders acceptable early on).
- **Replace mocks** with Supabase-backed queries.

### Phase 2 — Bilingual (next-intl)

Full Slovenian + English with URL segments (e.g. `/en/...`). Will replace the context-only language toggle.

### Phase 3 — Admin UI (future)

Optional password-protected admin for events and gallery content.

---

## 4. ARCHITECTURE DECISIONS

### Decision: Vercel-only hosting

The site needs server-side code for Stripe and webhooks. **Vercel** hosts the Next.js app and API routes in one place. **GitHub Pages is not used** (static-only). An early idea of split hosting was abandoned in favour of a single deployment target.

### Decision: Light theme for the public UI

Early docs assumed a dark theme; during implementation the **light** palette (white background, warm greys, deep red accent) became the actual product direction. **No dark mode toggle** — `next-themes` is installed (shadcn) but the app does not mount a theme provider.

### Decision: Supabase for database and storage (planned)

PostgreSQL with RLS, generated TypeScript types, Storage for images — intended when ticket and event data move off mocks.

### Decision: Stripe Checkout (planned)

Checkout Sessions for ticket purchases; no raw card data handled in-house.

### Decision: Resend for email (planned)

Transactional mail for ticket confirmations.

### Decision: IBM Plex Sans + IBM Plex Mono

Strong Latin coverage (Slovenian diacritics), readable, technical feel. Loaded in `app/layout.tsx` via `next/font/google`.

### Decision: shadcn/ui (new-york style)

Accessible primitives copied into `components/ui/`. Custom marketing components live alongside; shadcn is ready for forms and dialogs when features land.

### Decision: Keys-later strategy (for future SDKs)

When Supabase/Stripe/Resend clients are added, use documented placeholder fallbacks so CI and local builds do not require real secrets.

---

## 5. COLOUR PALETTE (ACTUAL — LIGHT)

Source of truth: `app/globals.css` `:root` and `@theme inline`.

| Token | Hex | Typical use |
|---|---|---|
| `--white` | `#FFFFFF` | Page background, surfaces |
| `--light-grey` | `#E8E5E0` | Section bands, cards |
| `--mid-grey` | `#B8B4AE` | Borders, dividers |
| `--ash-grey` | `#787470` | Muted text |
| `--charcoal` | `#3D3C3A` | Primary text |
| `--deep-red` | `#EE352F` | Accent, CTAs, highlights |

These map to shadcn semantic variables (`--background`, `--primary`, etc.) and Tailwind `bg-background`, `text-primary`, and raw utilities like `bg-deep-red` from `@theme inline`.

**Tech debt:** many components still use literal hex classes (e.g. `text-[#EE352F]`) instead of semantic tokens — a dedicated pass should align them.

---

## 6. SUPABASE SCHEMA (PLANNED)

Same general shape as before: `events`, `tickets`, `gallery_photos` with RLS tuned so public reads are safe and ticket rows are server-only. Run SQL in Supabase when the backend phase starts; generate `types/database.ts` from the project.

---

## 7. STRIPE PAYMENT FLOW (PLANNED)

End-to-end flow remains: event page → `POST /api/checkout` → Stripe Checkout → webhook confirms payment → write ticket + email → redirect to success page showing ticket/QR. **None of the API routes exist in the repo yet** — this section describes the target.

---

## 8. SECURITY CONTRACT (TARGET FOR BACKEND PHASE)

1. **`STRIPE_SECRET_KEY`** — only server code (e.g. API routes + server-only config), never client components.
2. **`SUPABASE_SERVICE_ROLE_KEY`** — same; service client only in trusted server contexts.
3. **Webhooks** — verify Stripe signature on raw body before business logic.
4. **RLS** — tickets not publicly readable; published events readable.
5. **CORS** — when APIs exist, restrict origins (no wildcard in production).
6. **Validation** — Zod (or equivalent) on all API inputs.
7. **`.env.local`** — never committed; use `.env.example` as documentation.

---

## 9. UX NON-NEGOTIABLES

1. Mobile-first layout.
2. Loading and empty states for real data once fetches exist (still open for mock-only pages).
3. Payment path must feel obvious and trustworthy when Stripe ships.
4. **Motion:** minimise harm — `prefers-reduced-motion` is **not** implemented yet (**tech debt**; see `agent_docs/design-system.md`).
5. Light-themed, calm, credible visual language.

---

## 10. WHAT "DONE" LOOKS LIKE FOR PHASE 1

- Tickets can be bought in Stripe test mode with confirmation email and on-screen ticket/QR.
- Events backed by Supabase instead of `lib/data.ts` mocks.
- Past events / merch / auxiliary pages as scoped.
- Deployed on Vercel with environment variables set.

---

## 11. GITHUB EDUCATION PACK BENEFITS

| Benefit | What to use it for |
|---|---|
| Namecheap .me domain (1 year free) | Primary domain when ready |
| Stripe fee waiver | Claim before real revenue |
| Vercel Hobby | Hosting |
| Supabase free tier | Database + storage |

---

*Last updated: Session 2 — April 3, 2026*

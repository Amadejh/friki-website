# FRIKI WEBSITE — Prompt Log
*A running diary of every Claude Code prompt used to build this project.*
*Add a new entry each session. Newest at the top.*

---

## FORMAT

```
### Session [N] — [Date] — [Branch]
**Goal:** [what this prompt was trying to achieve]
**Outcome:** [what actually got built, any deviations]

[the prompt, verbatim]

---
```

---

### Session 1 — April 3, 2026 — feature/ui-team-banner

**Goal:** Fix the white background bug, redesign the hero into a team banner with photo + logo + about section, add browser language auto-detection to the navbar, create a 404 page.

**Outcome:** Complete. Stat boxes removed from hero, light palette applied across all components, language toggle simplified to SL default with manual EN switch.

```
Read CLAUDE.md, SESSION_CONTEXT.md, and SELF_IMPROVEMENT_LOG.md first.

CONTEXT: The homepage exists but needs three specific fixes before it's presentable:
1. The hero section is generic — needs to become a proper team banner (photo + logo + who we are)
2. The navbar language toggle is hardcoded to EN — needs to auto-detect from the browser on first visit
3. app/page.tsx has bg-white on the wrapper div — needs to be bg-background

No Stripe, no ticket purchasing, no payment anything. Skip any reference to those.
The EventsCarousel, Archive, Footer, and event detail page are already good — do NOT touch them.

STEP 1 — Fix app/page.tsx
Open app/page.tsx. Change:
  <div className="min-h-screen bg-white">
to:
  <div className="min-h-screen bg-background">

STEP 2 — Redesign components/hero.tsx into a team banner

Replace the entire file. The team banner has two parts stacked vertically:

PART A — Full-width cinematic photo section
- Full-width section, aspect ratio 21/9 on desktop, 16/9 on mobile
- Background image: src="/team-photo.jpg", Next.js Image with fill and priority.
  Set unoptimized={true}. Opacity 50% (className="object-cover object-top opacity-50").
  Fallback bg: bg-[#111111] on the container.
- Gradient overlay: bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent
- Bottom-left of image (absolute, px-8 lg:px-16 pb-10 md:pb-16):
  - Logo: <Image src="/friki-logo.png" alt="FRIKi" width={100} height={100} className="object-contain" style={{ mixBlendMode: 'screen' }} unoptimized />
    Add comment: {/* Drop friki-logo.png into public/ — use PNG with transparent background */}
  - Eyebrow below logo: text-[#C0392B] text-xs font-semibold uppercase tracking-[0.2em] mt-3 font-mono
    Content: "Študentski svet FRI · Ljubljana, SI"

PART B — About strip below the photo
- bg-[#0A0A0A], py-12 md:py-16, border-b border-[#262626]
- max-w-7xl mx-auto px-6 lg:px-8
- Two columns on desktop (lg:grid lg:grid-cols-2 lg:gap-16), stacked on mobile

LEFT column:
  - Eyebrow: text-[#C0392B] text-xs font-semibold uppercase tracking-[0.2em] mb-4 font-mono → "Who we are"
  - h1: text-white text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4
    → "The student council of FRI."
  - Body paragraph: text-[#A3A3A3] text-base leading-relaxed max-w-prose
    → "FRIKi zastopa interese študentov Fakultete za računalništvo in informatiko Univerze v Ljubljani.
       Organiziramo dogodke, gradimo skupnost in skrbimo za boljše študijsko življenje na FRI.
       We represent students, organise events, and build community within the Faculty of Computer
       and Information Science."

RIGHT column:
  - 2×2 grid (grid grid-cols-2 gap-3)
  - Each box: bg-[#111111] border border-[#262626] rounded-sm p-5
    Number: text-white text-2xl font-bold font-mono
    Label: text-[#525252] text-xs uppercase tracking-widest font-mono mt-1
  - Box 1: "50+" / "Active members"
  - Box 2: "10+" / "Events per year"
  - Box 3: "FRI" / "Univerza v Ljubljani"
  - Box 4: "2010" / "Established"

The component should NOT be 'use client' — it has no interactivity.

STEP 3 — Add browser language auto-detection to components/navbar.tsx

Replace:
  const [lang, setLang] = useState<'EN' | 'SL'>('EN')

With:
  const [lang, setLang] = useState<'EN' | 'SL'>('EN')

  useEffect(() => {
    const stored = localStorage.getItem('friki-lang') as 'EN' | 'SL' | null
    if (stored === 'EN' || stored === 'SL') {
      setLang(stored)
    } else {
      const browserLang = navigator.language || ''
      setLang(browserLang.toLowerCase().startsWith('sl') ? 'SL' : 'EN')
    }
  }, [])

Update both language toggle buttons (desktop and mobile) to also persist to localStorage:
  onClick={() => { setLang(l); localStorage.setItem('friki-lang', l) }}

STEP 4 — Update nav label in components/navbar.tsx
In navLinks, change label 'Upcoming' to 'Events'.
In components/footer.tsx footerLinks, change label 'Upcoming' to 'Events'.

STEP 5 — Create app/not-found.tsx

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[#C0392B] text-xs font-mono uppercase tracking-[0.2em] mb-4">404</p>
      <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4">Page not found.</h1>
      <p className="text-[#525252] text-base mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <a
        href="/"
        className="px-6 py-2.5 bg-[#C0392B] text-white text-xs font-semibold uppercase tracking-widest rounded-sm hover:bg-[#a93226] transition-colors"
      >
        Back to home
      </a>
    </div>
  )
}

STEP 6 — Verify
Run: npx tsc --noEmit
Run: npm run lint
Fix any errors.
Run: npm run dev — visit localhost:3000 and confirm the page is dark, the team banner shows,
the events carousel and archive are unchanged, the navbar language toggle persists on refresh.

Update SESSION_CONTEXT.md — add session log entry, mark Phase 1c ✅.
```

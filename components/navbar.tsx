'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLang } from '@/lib/language-context'
import { t } from '@/lib/translations'

const navLinks = [
  { href: '/', label: t.nav.home, sectionId: null },
  { href: '/#events', label: t.nav.events, sectionId: 'events' },
  { href: '/#archive', label: t.nav.archive, sectionId: 'archive' },
  { href: '/#contact', label: t.nav.contact, sectionId: 'contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const pathname = usePathname()
  const rafRef = useRef<number | null>(null)
  const ioActiveRef = useRef<string | null>(null)
  const { lang, setLang } = useLang()

  // Track which section should be highlighted.
  // IntersectionObserver can be sensitive to thresholds and small section sizes.
  // Instead, we derive the active section from scroll position relative to the fixed header.
  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection(null)
      return
    }

    const sectionIds = navLinks.map((l) => l.sectionId).filter(Boolean) as string[]

    const updateActiveSection = () => {
      const headerEl = document.querySelector('header') as HTMLElement | null
      const headerHeight = headerEl?.getBoundingClientRect().height ?? 64
      const doc = document.documentElement

      // Near the bottom of the page the footer may be visible, but never reach the
      // top probe line because there is no remaining scroll room. Force-contact then.
      const isNearPageBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 8
      if (isNearPageBottom) {
        setActiveSection('contact')
        return
      }

      // Use a "probe line" inside the viewport; the active section is the one whose
      // vertical range contains that line.
      const probeY = window.scrollY + headerHeight + 8

      let bestId: string | null = null
      let bestTop = -Infinity

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue

        const rect = el.getBoundingClientRect()
        const top = rect.top + window.scrollY
        const bottom = top + rect.height

        if (probeY >= top && probeY <= bottom) {
          // If multiple sections match, pick the one that starts lowest (closest to probe).
          if (top > bestTop) {
            bestTop = top
            bestId = id
          }
        }
      }

      setActiveSection(bestId)
    }

    const scheduleUpdate = () => {
      if (rafRef.current) return
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null
        updateActiveSection()
      })
    }

    updateActiveSection()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [pathname])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Suggested improvement (reliable last-section detection):
  // IntersectionObserver can be more resilient than scroll-position math near the bottom.
  // We only use it to ensure the last section ("contact") becomes active when it enters view.
  useEffect(() => {
    if (pathname !== '/') return

    const sectionIds = navLinks.map((l) => l.sectionId).filter(Boolean) as string[]
    const headerEl = document.querySelector('header') as HTMLElement | null
    const headerHeight = headerEl?.getBoundingClientRect().height ?? 64

    const obs = new IntersectionObserver(
      (entries) => {
        let bestId: string | null = null
        let bestRatio = 0

        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id
          if (!id) continue
          if (!entry.isIntersecting) continue
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio
            bestId = id
          }
        }

        ioActiveRef.current = bestId

        if (bestId === 'contact') {
          setActiveSection('contact')
        }
      },
      {
        threshold: [0.01, 0.05, 0.1],
        // Push the "top" of the root down by the fixed header so contact becomes active
        // as soon as it reaches the visible navbar area.
        rootMargin: `-${headerHeight + 8}px 0px 0px 0px`,
      }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      obs.observe(el)
    })

    return () => obs.disconnect()
  }, [pathname])

  const isActive = (link: (typeof navLinks)[0]) => {
    if (pathname !== '/') return false
    if (link.sectionId) return activeSection === link.sectionId
    return activeSection === null
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: (typeof navLinks)[0]) => {
    if (pathname === '/') {
      e.preventDefault()
      if (link.sectionId === null) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        document.getElementById(link.sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }
      setMobileOpen(false)
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-center h-14 lg:h-16 relative">

          {/* Center nav pills — desktop */}
          <div className="hidden md:flex pointer-events-auto items-center gap-0.5 bg-white border border-border rounded-sm px-1.5 py-1.5 shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.sectionId ? `/#${link.sectionId}` : '/'}
                onClick={(e) => handleNavClick(e, link)}
                className={cn(
                  'px-4 py-1 rounded-sm text-xs font-semibold uppercase tracking-widest transition-all duration-150',
                  isActive(link)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card'
                )}
              >
                {link.label[lang]}
              </Link>
            ))}
          </div>

          {/* Right: lang toggle + hamburger */}
          <div className="absolute right-6 lg:right-8 flex items-center gap-2 pointer-events-auto">
            {/* Language toggle — desktop */}
            <div className="hidden md:flex items-center gap-0.5 bg-white border border-border rounded-sm p-1 shadow-sm">
              {(['SL', 'EN'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLang(l)
                  }}
                  className={cn(
                    'px-3 py-1 rounded-sm text-xs font-mono font-semibold transition-all duration-150',
                    lang === l
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  aria-pressed={lang === l}
                  aria-label={`Switch to ${l === 'SL' ? 'Slovenian' : 'English'}`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Hamburger */}
            <button
              className="md:hidden p-2 rounded-sm bg-white border border-border text-muted-foreground shadow-sm hover:border-primary hover:text-primary transition-all duration-150"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed top-0 right-0 bottom-0 z-50 w-64 bg-white border-l border-border flex flex-col transition-transform duration-200 ease-in-out md:hidden',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-end px-5 h-14 border-b border-border">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5 p-3 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.sectionId ? `/#${link.sectionId}` : '/'}
              onClick={(e) => handleNavClick(e, link)}
              className={cn(
                'px-4 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-widest transition-colors duration-150',
                isActive(link)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              )}
            >
              {link.label[lang]}
            </Link>
          ))}
        </nav>

        {/* Language toggle — mobile */}
        <div className="p-4 border-t border-border">
          <p className="text-border text-xs font-mono uppercase tracking-widest mb-2">{t.nav.language[lang]}</p>
          <div className="flex items-center gap-1">
            {(['SL', 'EN'] as const).map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLang(l)
                }}
                className={cn(
                  'flex-1 py-2 rounded-sm text-xs font-mono font-semibold transition-all',
                  lang === l
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:text-foreground'
                )}
                aria-pressed={lang === l}
              >
                {l === 'SL' ? 'Slovenščina' : 'English'}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}

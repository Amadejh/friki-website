'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Instagram, Mail } from 'lucide-react'
import { SiDiscord } from 'react-icons/si'
import { useLang } from '@/lib/language-context'
import { t } from '@/lib/translations'

const socialLinks = [
  { href: 'https://instagram.com/sofri_friki', label: 'Instagram', Icon: Instagram },
  { href: 'mailto:friki@fri.uni-lj.si', label: 'Email', Icon: Mail },
  { href: 'https://discord.gg/friki', label: 'Discord', Icon: SiDiscord },
]

export default function Footer() {
  const pathname = usePathname()
  const { lang } = useLang()

  const footerLinks = [
    { href: '/',         label: t.footer.home[lang] },
    { href: '/#events',  label: t.footer.events[lang] },
    { href: '/#archive', label: t.footer.archive[lang] },
    { href: '/#contact', label: t.footer.contact[lang] },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const sectionId = href.startsWith('/#') ? href.slice(2) : null
    if (pathname === '/') {
      e.preventDefault()
      if (sectionId === null) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer
      id="contact"
      className="w-full bg-card border-t border-border pb-28 md:pb-36"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={(e) => handleNavClick(e, '/')}
              className="text-foreground text-xl font-bold tracking-tight hover:text-primary transition-colors w-fit font-mono"
            >
              Friki
            </Link>
            <p className="text-muted-foreground text-base leading-relaxed max-w-xs">
              {t.footer.desc[lang]}
            </p>
            <p className="text-border text-sm font-mono">
              Večna pot 113, 1000 Ljubljana, SI
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <p className="text-border font-mono text-sm uppercase tracking-[0.2em] mb-5">
              {t.footer.navigate[lang]}
            </p>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-muted-foreground text-base hover:text-foreground transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div>
            <p className="text-border font-mono text-sm uppercase tracking-[0.2em] mb-5">
              {t.footer.connect[lang]}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-md flex items-center justify-center text-muted-foreground border border-border bg-white hover:text-primary hover:border-primary transition-all duration-150"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <p className="mt-6 text-muted-foreground text-base leading-relaxed">
              {t.footer.questions[lang]}{' '}
              <a
                href="mailto:friki@fri.uni-lj.si"
                className="text-foreground hover:text-primary underline underline-offset-2 transition-colors"
              >
                {t.footer.getInTouch[lang]}
              </a>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-border text-sm font-mono">
            &copy; 2025–2026 Friki &ndash; Študentsko društvo FRI
          </p>
          <p className="text-border text-sm font-mono">
            FRI &middot; Univerza v Ljubljani
          </p>
        </div>
      </div>
    </footer>
  )
}

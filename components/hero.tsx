'use client'

import Image from 'next/image'
import { useLang } from '@/lib/language-context'
import { t } from '@/lib/translations'

export default function Hero() {
  const { lang } = useLang()

  return (
    <section aria-label="Team banner">
      {/* PART A — Full-width cinematic photo */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-background">
        <Image
          src="/team-photo.jpg"
          alt="FRIKi team photo"
          fill
          priority
          unoptimized
          className="object-cover object-top opacity-60"
        />
        {/* Gradient bleeds into the page background below */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />

        {/* Bottom-left identity block */}
        <div className="absolute bottom-0 left-0 px-8 lg:px-16 pb-10 md:pb-16">
          {/* Drop friki-logo.png into public/ to replace this text logo */}
          <span className="text-foreground text-4xl md:text-5xl font-bold tracking-tight font-mono">FRIKI</span>
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mt-3 font-mono">
            Študentski svet FRI · Ljubljana, Slovenija
          </p>
        </div>
      </div>

      {/* PART B — About strip */}
      <div className="bg-background py-12 md:py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4 font-mono">
            {t.hero.eyebrow[lang]}
          </p>
          <h1 className="text-foreground text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4 max-w-2xl">
            {t.hero.heading[lang]}
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
            {t.hero.body[lang]}
          </p>
        </div>
      </div>
    </section>
  )
}

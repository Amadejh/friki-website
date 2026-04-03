'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, MapPin, User } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import type { Event } from '@/lib/data'
import { useLang } from '@/lib/language-context'
import { t } from '@/lib/translations'

interface EventDetailProps {
  event: Event
}

export function View({ event }: EventDetailProps) {
  const { lang } = useLang()
  const infoItems = [
    { label: t.detail.date[lang], value: event.date, Icon: Calendar },
    { label: t.detail.time[lang], value: event.time, Icon: Clock },
    { label: t.detail.location[lang], value: event.location, Icon: MapPin },
    { label: t.detail.organizer[lang], value: event.organizer, Icon: User },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero image */}
      <div style={{ position: 'relative', width: '100%', height: '60vh' }}>
        <Image
          src={`https://picsum.photos/seed/${event.posterSeed}/1400/840`}
          alt={`${event.name} event poster`}
          fill
          priority
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />

        <div className="absolute top-24 left-0 right-0 px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#787470] hover:text-[#3D3C3A] text-xs font-mono font-medium transition-colors group bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-sm border border-[#B8B4AE]"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            {t.detail.backToHome[lang]}
          </Link>
        </div>

        <div className="absolute bottom-6 left-6 lg:left-8">
          <span className="px-2 py-0.5 bg-[#EE352F] text-white text-xs font-mono font-medium rounded-sm">
            {event.category}
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#B8B4AE] font-mono mb-8">
          <Link href="/" className="hover:text-[#787470] transition-colors">{t.detail.home[lang]}</Link>
          <span>/</span>
          <Link href="/#events" className="hover:text-[#787470] transition-colors">{t.detail.events[lang]}</Link>
          <span>/</span>
          <span className="text-[#787470]">{event.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h1 className="text-[#3D3C3A] text-3xl md:text-5xl font-bold tracking-tight leading-tight text-balance mb-6">
              {event.name}
            </h1>
            <p className="text-[#3D3C3A] text-base md:text-lg leading-relaxed mb-6">
              {event.teaser}
            </p>
            <div className="w-8 h-px bg-[#EE352F] mb-6" />
            <p className="text-[#787470] text-base leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Sidebar — event details */}
          <aside className="lg:col-span-1">
            <div className="bg-[#E8E5E0] border border-[#B8B4AE] rounded-sm p-6 sticky top-24">
              <h2 className="text-[#B8B4AE] font-mono text-xs uppercase tracking-[0.2em] mb-6">
                {t.detail.eventDetails[lang]}
              </h2>
              <ul className="flex flex-col gap-5">
                {infoItems.map(({ label, value, Icon }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className="w-7 h-7 flex-shrink-0 border border-[#B8B4AE] bg-white flex items-center justify-center rounded-sm">
                      <Icon size={13} className="text-[#EE352F]" />
                    </span>
                    <div>
                      <p className="text-[#B8B4AE] text-xs font-mono uppercase tracking-widest leading-none mb-1">
                        {label}
                      </p>
                      <p className="text-[#3D3C3A] text-sm font-medium">{value}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-[#B8B4AE]">
                <Link
                  href="/#contact"
                  className="w-full flex items-center justify-center px-5 py-2.5 rounded-sm bg-[#EE352F] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#C42A26] transition-colors duration-150"
                >
                  {t.detail.getInTouch[lang]}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}

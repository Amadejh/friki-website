'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react'
import { useLang } from '@/lib/language-context'
import { t } from '@/lib/translations'
import { urlFor } from '@/lib/sanity/image'
import type { SanityEvent } from '@/lib/sanity/types'

export default function EventsCarousel({ events }: { events: SanityEvent[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const { lang } = useLang()

  const totalVisible = 3
  const maxIndex = Math.max(0, events.length - totalVisible)

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1))
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1))

  return (
    <section
      id="events"
      className="w-full bg-card border-t border-border py-16 md:py-24 overflow-hidden"
      aria-label={t.carousel.heading[lang]}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading row */}
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-3 font-mono">
              {t.carousel.eyebrow[lang]}
            </p>
            <h2 className="text-foreground text-3xl md:text-4xl font-bold tracking-tight leading-none">
              {t.carousel.heading[lang]}
            </h2>
          </div>
        </div>

        {/* Carousel track */}
        <div className="relative">
          <button
            type="button"
            onClick={prev}
            disabled={currentIndex === 0}
            aria-label={t.carousel.prevEvents[lang]}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-20 md:w-12 md:h-24 rounded-full border border-border bg-white/95 text-muted-foreground shadow-sm hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={currentIndex >= maxIndex}
            aria-label={t.carousel.nextEvents[lang]}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-20 md:w-12 md:h-24 rounded-full border border-border bg-white/95 text-muted-foreground shadow-sm hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <ChevronRight size={18} />
          </button>

          <div className="overflow-hidden" ref={trackRef}>
          <div
            className="flex gap-4 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(calc(-${currentIndex} * (100% / 3 + 5.5px)))` }}
          >
            {events.map((event) => (
              <Link
                key={event.slug}
                href={`/events/${event.slug}`}
                className="group flex-shrink-0 w-full md:w-[calc(33.333%-11px)] bg-white border border-border rounded-xl overflow-hidden hover:border-border hover:shadow-md transition-all duration-200 flex flex-col"
                aria-label={`${t.carousel.viewDetails[lang]} ${event.name}`}
              >
                {/* Poster */}
                <div className="aspect-[4/5] overflow-hidden bg-background">
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image
                      src={event.poster ? urlFor(event.poster).width(400).height(500).url() : '/placeholder.jpg'}
                      alt={`${event.name} poster`}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-mono font-medium rounded-md">
                      {event.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <h3 className="text-foreground font-semibold text-base leading-snug tracking-tight">
                    {event.name}
                  </h3>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono">
                      <Calendar size={11} className="flex-shrink-0 text-primary" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono">
                      <MapPin size={11} className="flex-shrink-0 text-primary" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 flex-1">
                    {event.teaser}
                  </p>

                  <span className="inline-flex items-center justify-center w-full mt-auto px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-widest hover:bg-deep-red-dark transition-colors duration-150">
                    {t.carousel.viewEvent[lang]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-px rounded-none transition-all duration-300 ${
                i === currentIndex ? 'w-8 bg-primary' : 'w-4 bg-border'
              }`}
              aria-label={`${t.carousel.goToSlide[lang]} ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

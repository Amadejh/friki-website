'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import type { Event } from '@/lib/data'
import { archiveEvents } from '@/lib/data'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useLang } from '@/lib/language-context'
import { t, lineupByCategory } from '@/lib/translations'

const eventsPerPage = 9
const animationDurationMs = 250

type Rect = { left: number; top: number; width: number; height: number }

function hashString(input: string) {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function getCardAspectClass(event: Event) {
  const variants = ['aspect-square', 'aspect-[4/5]', 'aspect-[3/4]', 'aspect-[16/7]'] as const
  const idx = hashString(event.slug) % variants.length
  return variants[idx]
}

function getGallerySeeds(event: Event) {
  return [0, 1, 2, 3].map((i) => event.posterSeed + i * 13)
}

export default function Archive() {
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const { lang } = useLang()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return archiveEvents
    return archiveEvents.filter((e) => {
      return (
        e.name.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.date.toLowerCase().includes(q)
      )
    })
  }, [query])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / eventsPerPage)), [filtered.length])

  useEffect(() => {
    setCurrentPage(0)
  }, [query])

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages - 1))
  }, [totalPages])

  const slides = useMemo(() => {
    const result: Event[][] = []
    for (let page = 0; page < totalPages; page += 1) {
      const start = page * eventsPerPage
      const end = start + eventsPerPage
      result.push(filtered.slice(start, end))
    }
    return result
  }, [filtered, totalPages])

  // Modal state
  const [modalEvent, setModalEvent] = useState<Event | null>(null)
  const [modalOrigin, setModalOrigin] = useState<Rect | null>(null)
  const [modalEnd, setModalEnd] = useState<Rect | null>(null)
  const [modalExpanded, setModalExpanded] = useState(false)
  const closeTimerRef = useRef<number | null>(null)

  const closeModal = () => {
    if (!modalEvent) return
    setModalExpanded(false)
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = window.setTimeout(() => {
      setModalEvent(null)
      setModalOrigin(null)
      setModalEnd(null)
      closeTimerRef.current = null
    }, animationDurationMs)
  }

  useEffect(() => {
    if (!modalEvent) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [modalEvent])

  const openModal = (event: Event, originEl: HTMLElement) => {
    const origin = originEl.getBoundingClientRect()
    const padding = 16
    const width = Math.min(960, window.innerWidth - padding * 2)
    const height = Math.min(720, window.innerHeight - padding * 2)
    const end: Rect = {
      left: (window.innerWidth - width) / 2,
      top: (window.innerHeight - height) / 2,
      width,
      height,
    }
    setModalEvent(event)
    setModalOrigin({ left: origin.left, top: origin.top, width: origin.width, height: origin.height })
    setModalEnd(end)
    setModalExpanded(false)
    requestAnimationFrame(() => setModalExpanded(true))
  }

  return (
    <section
      id="archive"
      className="w-full bg-white border-t border-[#B8B4AE] py-16 md:py-24"
      aria-label={t.archive.heading[lang]}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-6 md:mb-10">
          <p className="text-[#EE352F] text-xs font-semibold uppercase tracking-[0.2em] mb-3 font-mono">
            {t.archive.eyebrow[lang]}
          </p>
          <h2 className="text-[#3D3C3A] text-3xl md:text-4xl font-bold tracking-tight leading-none">
            {t.archive.heading[lang]}
          </h2>
        </div>

        {/* Search */}
        <div className="mb-6 md:mb-10">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.archive.searchPlaceholder[lang]}
            aria-label={t.archive.searchLabel[lang]}
            className="w-full px-4 py-3 rounded-sm bg-[#E8E5E0] border border-[#B8B4AE] text-[#3D3C3A] placeholder:text-[#B8B4AE] outline-none focus:border-[#EE352F] transition-colors"
          />
        </div>

        {/* Carousel */}
        <div className="relative">
          {slides.length > 1 && (
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              aria-label={t.archive.prevPage[lang]}
              className="flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 w-9 h-20 md:w-12 md:h-24 rounded-full bg-white/95 border border-[#B8B4AE] text-[#787470] shadow-sm hover:border-[#EE352F] hover:text-[#EE352F] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {slides.length > 1 && (
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(slides.length - 1, p + 1))}
              disabled={currentPage >= slides.length - 1}
              aria-label={t.archive.nextPage[lang]}
              className="flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 w-9 h-20 md:w-12 md:h-24 rounded-full bg-white/95 border border-[#B8B4AE] text-[#787470] shadow-sm hover:border-[#EE352F] hover:text-[#EE352F] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          )}

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {slides.map((pageEvents, pageIdx) => (
                <div key={`${pageIdx}`} className="min-w-full">
                  <div
                    className={`grid grid-cols-3 gap-3 ${
                      modalEvent ? 'filter blur-[2px] brightness-90 transition-[filter] duration-200' : ''
                    }`}
                    aria-label={`${t.archive.pageLabel[lang]} ${pageIdx + 1}`}
                  >
                    {pageEvents.map((event) => {
                      const aspect = getCardAspectClass(event)
                      return (
                        <button
                          key={event.slug}
                          type="button"
                          onClick={(e) => openModal(event, e.currentTarget)}
                          className="group text-left rounded-sm bg-[#E8E5E0] border border-[#B8B4AE] hover:border-[#787470] transition-all duration-300 overflow-hidden transform-gpu hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-md"
                          aria-label={`${t.archive.openDetails[lang]} ${event.name}`}
                        >
                          <div className={`relative w-full ${aspect}`}>
                            <Image
                              src={`https://picsum.photos/seed/${event.posterSeed}/900/700`}
                              alt={event.name}
                              fill
                              unoptimized
                              className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#3D3C3A]/80 via-[#3D3C3A]/10 to-transparent" />
                            <div className="absolute inset-0 flex flex-col justify-end p-4">
                              <span className="inline-flex w-fit px-1.5 py-0.5 bg-[#EE352F] text-white text-[11px] font-mono font-medium rounded-sm mb-2">
                                {event.category}
                              </span>
                              <h3 className="text-white font-semibold text-sm leading-snug tracking-tight">
                                {event.name}
                              </h3>
                              <p className="text-[#E8E5E0] text-xs mt-1 font-mono">
                                {event.date}
                              </p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {pageEvents.length === 0 && (
                    <div className="py-16 text-center">
                      <p className="text-[#787470] font-mono">{t.archive.noResults[lang]}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {slides.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              {Array.from({ length: slides.length }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i)}
                  aria-label={`${t.archive.goToPage[lang]} ${i + 1}`}
                  className={`h-px transition-all duration-200 ${i === currentPage ? 'w-10 bg-[#EE352F]' : 'w-4 bg-[#B8B4AE]'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {modalEvent && modalOrigin && modalEnd && (
          <>
            <div
              className="fixed inset-0 z-50 bg-[#3D3C3A]/40"
              onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal() }}
              aria-hidden="true"
            />

            <div
              className="fixed z-[60] bg-white border border-[#B8B4AE] shadow-xl overflow-hidden rounded-[16px] transition-[left,top,width,height,border-radius] duration-[250ms] ease-out"
              style={{
                left: modalExpanded ? modalEnd.left : modalOrigin.left,
                top: modalExpanded ? modalEnd.top : modalOrigin.top,
                width: modalExpanded ? modalEnd.width : modalOrigin.width,
                height: modalExpanded ? modalEnd.height : modalOrigin.height,
                borderRadius: modalExpanded ? 16 : 10,
              }}
              role="dialog"
              aria-modal="true"
              aria-label={`${t.archive.eventDetailsFor[lang]} ${modalEvent.name}`}
            >
              <div className="h-full flex flex-col min-h-0">
                <div className="relative p-6 border-b border-[#B8B4AE] flex-shrink-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex w-fit px-2 py-1 bg-[#EE352F] text-white text-[11px] font-mono font-medium rounded-sm mb-3">
                        {modalEvent.category}
                      </div>
                      <h3 className="text-[#3D3C3A] text-xl font-bold tracking-tight leading-tight">
                        {modalEvent.name}
                      </h3>
                      <p className="text-[#787470] text-sm font-mono mt-2">
                        {modalEvent.date} · {modalEvent.location}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={closeModal}
                      aria-label={t.archive.closeModal[lang]}
                      className="p-2 rounded-sm border border-[#B8B4AE] text-[#787470] bg-white hover:border-[#EE352F] hover:text-[#EE352F] transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 min-h-0">
                  <h4 className="text-[#B8B4AE] font-mono text-xs uppercase tracking-[0.2em] mb-3">
                    {t.archive.lineupHeading[lang]}
                  </h4>
                  <ul className="flex flex-wrap gap-2 mb-6">
                    {lineupByCategory(modalEvent.category, lang).map((item) => (
                      <li
                        key={item}
                        className="px-3 py-1 rounded-sm bg-[#E8E5E0] border border-[#B8B4AE] text-[#3D3C3A] text-sm font-mono"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <h4 className="text-[#B8B4AE] font-mono text-xs uppercase tracking-[0.2em] mb-3">
                    {t.archive.descHeading[lang]}
                  </h4>
                  <p className="text-[#3D3C3A] leading-relaxed">{modalEvent.description}</p>

                  <div className="mt-8">
                    <h4 className="text-[#B8B4AE] font-mono text-xs uppercase tracking-[0.2em] mb-3">
                      {t.archive.galleryHeading[lang]}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {getGallerySeeds(modalEvent).map((seed) => (
                        <div
                          key={seed}
                          className="relative aspect-[4/3] rounded-sm overflow-hidden border border-[#B8B4AE]"
                        >
                          <Image
                            src={`https://picsum.photos/seed/${seed}/800/600`}
                            alt={`${modalEvent.name} photo`}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-[#B8B4AE] font-mono text-xs uppercase tracking-[0.2em] mb-3">
                      {t.archive.venueHeading[lang]}
                    </h4>
                    <p className="text-[#3D3C3A] font-medium">{modalEvent.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

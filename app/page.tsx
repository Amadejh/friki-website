import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import EventsCarousel from '@/components/events-carousel'
import Archive from '@/components/archive'
import Footer from '@/components/footer'
import { sanityClient } from '@/lib/sanity/client'
import { upcomingEventsQuery, archiveEventsQuery } from '@/lib/sanity/queries'
import type { SanityEvent } from '@/lib/sanity/types'

export const revalidate = 60

export default async function HomePage() {
  const [upcomingEvents, archiveEvents] = await Promise.all([
    sanityClient.fetch<SanityEvent[]>(upcomingEventsQuery),
    sanityClient.fetch<SanityEvent[]>(archiveEventsQuery),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <EventsCarousel events={upcomingEvents} />
        <Archive events={archiveEvents} />
      </main>
      <Footer />
    </div>
  )
}

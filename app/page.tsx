import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import EventsCarousel from '@/components/events-carousel'
import Archive from '@/components/archive'
import Footer from '@/components/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <EventsCarousel />
        <Archive />
      </main>
      <Footer />
    </div>
  )
}

export interface SanityEvent {
  slug: string
  name: string
  date: string
  time?: string
  location: string
  organizer?: string
  category: string
  year: number
  teaser: string
  description?: string
  poster?: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
    hotspot?: { x: number; y: number; height: number; width: number }
  }
  ticketsAvailable?: boolean
  ticketPrice?: number
}

import { groq } from 'next-sanity'

export const upcomingEventsQuery = groq`
  *[_type == "event" && isArchived == false] | order(year desc, date asc) {
    "slug": slug.current,
    name,
    date,
    time,
    location,
    organizer,
    category,
    year,
    teaser,
    description,
    poster,
    ticketsAvailable,
    ticketPrice,
  }
`

export const archiveEventsQuery = groq`
  *[_type == "event" && isArchived == true] | order(year desc) {
    "slug": slug.current,
    name,
    date,
    time,
    location,
    organizer,
    category,
    year,
    teaser,
    description,
    poster,
  }
`

export const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug][0] {
    "slug": slug.current,
    name,
    date,
    time,
    location,
    organizer,
    category,
    year,
    teaser,
    description,
    poster,
    ticketsAvailable,
    ticketPrice,
  }
`

export const allEventSlugsQuery = groq`
  *[_type == "event"] { "slug": slug.current }
`

export interface Event {
  slug: string
  name: string
  date: string
  time: string
  location: string
  organizer: string
  teaser: string
  description: string
  posterSeed: number
  year: number
  category: string
  wide?: boolean
}

export const upcomingEvents: Event[] = [
  {
    slug: 'fri-noč-2025',
    name: 'FRI Noč',
    date: 'April 18, 2025',
    time: '20:00',
    location: 'FRI Ljubljana',
    organizer: 'Friki',
    teaser: 'The biggest annual night at FRI — music, food, and unforgettable memories with your fellow students.',
    description:
      'FRI Noč is Friki\'s flagship annual event — a night of music, food, and community that brings together hundreds of students from across the faculty. This year\'s edition features live performances, DJ sets, and a student showcase area. Whether you\'re a first-year finding your footing or a seasoned student, FRI Noč is the place to be.',
    posterSeed: 10,
    year: 2025,
    category: 'Social',
  },
  {
    slug: 'hackathon-spring-2025',
    name: 'Hackathon Spring 2025',
    date: 'May 3–4, 2025',
    time: '09:00',
    location: 'FRI – Room P22',
    organizer: 'Friki & FRI',
    teaser: '48 hours, great ideas, and the best minds in the faculty. Form your team and start building.',
    description:
      'The Spring Hackathon is a 48-hour coding sprint open to all FRI students. Teams of 2–4 tackle real-world challenges across categories including sustainability, education, and open innovation. Prizes, mentors, and endless coffee await. Past editions have spawned actual startups — who knows what this year will bring?',
    posterSeed: 20,
    year: 2025,
    category: 'Tech',
  },
  {
    slug: 'welcome-week-2025',
    name: 'Welcome Week',
    date: 'October 6–10, 2025',
    time: '10:00',
    location: 'FRI Campus',
    organizer: 'Friki',
    teaser: 'A full week of orientation events, socials, and workshops designed to welcome new students to FRI.',
    description:
      'Welcome Week is Friki\'s annual orientation programme for new FRI students. Over five days, freshers get to know the faculty, meet fellow students, attend workshops, and discover all the ways Friki can support their time at uni. Events range from campus tours and panel talks to evening socials and a faculty-wide quiz night.',
    posterSeed: 30,
    year: 2025,
    category: 'Community',
  },
  {
    slug: 'career-fair-2025',
    name: 'FRI Career Fair',
    date: 'March 12, 2025',
    time: '11:00',
    location: 'FRI Atrium',
    organizer: 'Friki & Career Centre',
    teaser: 'Meet top tech companies and explore internship and job opportunities at the biggest CS career fair in Slovenia.',
    description:
      'The FRI Career Fair brings together the country\'s leading tech employers and eager CS talent under one roof. Browse stands, attend lightning talks, and schedule one-on-one chats with recruiters. Whether you\'re seeking an internship, part-time gig, or your first full-time role, this is the event to attend.',
    posterSeed: 40,
    year: 2025,
    category: 'Career',
  },
]

export const archiveEvents: Event[] = [
  {
    slug: 'fri-noč-2024',
    name: 'FRI Noč 2024',
    date: 'April 20, 2024',
    time: '20:00',
    location: 'FRI Ljubljana',
    organizer: 'Friki',
    teaser: 'Another legendary night at FRI.',
    description: 'FRI Noč 2024 brought together over 500 students for a night of music and community.',
    posterSeed: 50,
    year: 2024,
    category: 'Social',
    wide: true,
  },
  {
    slug: 'hackathon-2024',
    name: 'Hackathon 2024',
    date: 'April 5–6, 2024',
    time: '09:00',
    location: 'FRI – Room P22',
    organizer: 'Friki & FRI',
    teaser: '48 hours of innovation and code.',
    description: 'Our 2024 hackathon saw 20 teams compete across three challenge tracks.',
    posterSeed: 60,
    year: 2024,
    category: 'Tech',
  },
  {
    slug: 'sportni-dan-2024',
    name: 'Športni Dan 2024',
    date: 'May 15, 2024',
    time: '10:00',
    location: 'Tivoli Park, Ljubljana',
    organizer: 'Friki',
    teaser: 'Sun, sport, and solidarity.',
    description: 'Students competed in football, volleyball, and ultimate frisbee at Tivoli.',
    posterSeed: 70,
    year: 2024,
    category: 'Sport',
  },
  {
    slug: 'fri-noč-2023',
    name: 'FRI Noč 2023',
    date: 'April 22, 2023',
    time: '20:00',
    location: 'FRI Ljubljana',
    organizer: 'Friki',
    teaser: 'The night that started it all (again).',
    description: 'FRI Noč 2023 launched the revamped Friki events calendar with a sold-out party.',
    posterSeed: 80,
    year: 2023,
    category: 'Social',
    wide: true,
  },
  {
    slug: 'welcome-week-2023',
    name: 'Welcome Week 2023',
    date: 'October 2–6, 2023',
    time: '10:00',
    location: 'FRI Campus',
    organizer: 'Friki',
    teaser: 'Welcoming 300 new students to the FRI family.',
    description: 'Five days of orientation events, workshops, and social mixers for the class of 2023.',
    posterSeed: 90,
    year: 2023,
    category: 'Community',
  },
  {
    slug: 'lan-party-2023',
    name: 'LAN Party 2023',
    date: 'December 1, 2023',
    time: '18:00',
    location: 'FRI – Lab 2',
    organizer: 'Friki',
    teaser: 'All-night gaming session in the FRI labs.',
    description: 'Students brought their own rigs for a marathon gaming and socialising session.',
    posterSeed: 11,
    year: 2023,
    category: 'Gaming',
  },
]

export const allEvents = [...upcomingEvents, ...archiveEvents]

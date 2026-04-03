export type Lang = 'SL' | 'EN'

export const t = {
  // Navbar
  nav: {
    home: { SL: 'Domov', EN: 'Home' },
    events: { SL: 'Prihodnje', EN: 'Events' },
    archive: { SL: 'Arhiv', EN: 'Archive' },
    contact: { SL: 'Kontakt', EN: 'Contact' },
    language: { SL: 'Jezik', EN: 'Language' },
  },
  // Hero
  hero: {
    eyebrow: { SL: 'Kdo smo', EN: 'Who we are' },
    heading: { SL: 'Študentski svet FRI.', EN: 'The student council of FRI.' },
    body: {
      SL: 'FRIKi je študentski svet Fakultete za računalništvo in informatiko Univerze v Ljubljani. Zastopamo interese študentov, organiziramo dogodke in gradimo skupnost znotraj FRI.',
      EN: 'FRIKi is the student council of the Faculty of Computer and Information Science at the University of Ljubljana. We represent student interests, organise events, and build community within FRI.',
    },
  },
  // Events carousel
  carousel: {
    eyebrow: { SL: 'Kaj se dogaja', EN: "What's On" },
    heading: { SL: 'Prihodnji dogodki', EN: 'Upcoming Events' },
    viewEvent: { SL: 'Poglej dogodek', EN: 'View event' },
    prevEvents: { SL: 'Prejšnji dogodki', EN: 'Previous events' },
    nextEvents: { SL: 'Naslednji dogodki', EN: 'Next events' },
    viewDetails: { SL: 'Poglej podrobnosti za', EN: 'View details for' },
    goToSlide: { SL: 'Pojdi na diapozitiv', EN: 'Go to slide' },
  },
  // Archive
  archive: {
    eyebrow: { SL: 'Nazaj v čas', EN: 'Look Back' },
    heading: { SL: 'Arhiv', EN: 'Archive' },
    searchPlaceholder: { SL: 'Išči arhivirane dogodke...', EN: 'Search archived events...' },
    searchLabel: { SL: 'Išči arhivirane dogodke', EN: 'Search archived events' },
    noResults: { SL: 'Ni dogodkov, ki ustrezajo iskanju.', EN: 'No archived events match your search.' },
    prevPage: { SL: 'Prejšnja stran', EN: 'Previous archived events' },
    nextPage: { SL: 'Naslednja stran', EN: 'Next archived events' },
    openDetails: { SL: 'Odpri podrobnosti za', EN: 'Open details for' },
    pageLabel: { SL: 'Stran arhiva', EN: 'Archived events page' },
    goToPage: { SL: 'Pojdi na stran', EN: 'Go to archive page' },
    // Modal
    lineupHeading: { SL: 'Program', EN: 'Lineup' },
    descHeading: { SL: 'Opis', EN: 'Description' },
    galleryHeading: { SL: 'Galerija', EN: 'Media gallery' },
    venueHeading: { SL: 'Prizorišče', EN: 'Venue / location' },
    closeModal: { SL: 'Zapri', EN: 'Close modal' },
    eventDetailsFor: { SL: 'Podrobnosti dogodka:', EN: 'Event details for' },
  },
  // Footer
  footer: {
    navigate: { SL: 'Navigacija', EN: 'Navigate' },
    connect: { SL: 'Povežite se', EN: 'Connect' },
    desc: {
      SL: 'Študentski svet Fakultete za računalništvo in informatiko Univerze v Ljubljani.',
      EN: 'The student council of the Faculty of Computer and Information Science, University of Ljubljana.',
    },
    questions: { SL: 'Vprašanja?', EN: 'Questions?' },
    getInTouch: { SL: 'Stopite v stik.', EN: 'Get in touch.' },
    home: { SL: 'Domov', EN: 'Home' },
    events: { SL: 'Prihodnje', EN: 'Events' },
    archive: { SL: 'Arhiv', EN: 'Archive' },
    contact: { SL: 'Kontakt', EN: 'Contact' },
  },
  // Event detail page
  detail: {
    backToHome: { SL: 'Nazaj domov', EN: 'Back to home' },
    home: { SL: 'Domov', EN: 'Home' },
    events: { SL: 'Dogodki', EN: 'Events' },
    eventDetails: { SL: 'Podrobnosti dogodka', EN: 'Event Details' },
    date: { SL: 'Datum', EN: 'Date' },
    time: { SL: 'Čas', EN: 'Time' },
    location: { SL: 'Lokacija', EN: 'Location' },
    organizer: { SL: 'Organizator', EN: 'Organizer' },
    getInTouch: { SL: 'Stopite v stik', EN: 'Get in touch' },
  },
} satisfies Record<string, Record<string, { SL: string; EN: string }>>

// Lineup labels by category
export const lineupByCategory = (category: string, lang: Lang): string[] => {
  const g = category.toLowerCase()
  if (g.includes('tech'))
    return lang === 'SL'
      ? ['Delavnice', 'Mentorji & ekipe', 'Demo & nagrade']
      : ['Workshops', 'Mentors & teams', 'Demo & prizes']
  if (g.includes('social') || g.includes('community'))
    return lang === 'SL'
      ? ['Nastopi v živo', 'Predstavitev študentov', 'Skupnostni trenutki']
      : ['Live performances', 'Student showcase', 'Community moments']
  if (g.includes('career'))
    return lang === 'SL'
      ? ['Stojnice podjetij', 'Kratka predavanja', 'Mreženje']
      : ['Company stands', 'Lightning talks', 'Networking sessions']
  if (g.includes('sport'))
    return lang === 'SL'
      ? ['Tekme', 'Spretnostni izzivi', 'Skupnostne igre']
      : ['Matches', 'Skills challenges', 'Community games']
  if (g.includes('gaming'))
    return lang === 'SL'
      ? ['LAN tekme', 'Skupinski boji', 'Nočno druženje']
      : ['LAN matches', 'Team brackets', 'All-night social time']
  return lang === 'SL'
    ? ['Predavatelji & aktivnosti', 'Doživetja', 'Skupnost & zabava']
    : ['Speakers & activities', 'Experiences', 'Community & fun']
}

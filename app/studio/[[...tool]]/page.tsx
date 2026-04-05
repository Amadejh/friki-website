import StudioClient from './studio-client'

export const metadata = {
  referrer: 'same-origin',
  robots: 'noindex',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function StudioPage() {
  return <StudioClient />
}

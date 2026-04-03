import { notFound } from 'next/navigation'
import { allEvents } from '@/lib/data'
import { View } from '@/components/event-detail-view'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return allEvents.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = allEvents.find((e) => e.slug === slug)
  if (!event) return {}
  return { title: `${event.name} – Friki`, description: event.teaser }
}

export default async function ({ params }: Props) {
  const { slug } = await params
  const event = allEvents.find((e) => e.slug === slug)
  if (!event) notFound()
  return <View event={event} />
}

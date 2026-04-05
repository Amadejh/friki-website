import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity/client'
import { eventBySlugQuery, allEventSlugsQuery } from '@/lib/sanity/queries'
import { View } from '@/components/event-detail-view'
import type { SanityEvent } from '@/lib/sanity/types'
import type { Metadata } from 'next'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const events = await sanityClient.fetch<{ slug: string }[]>(allEventSlugsQuery)
  return events.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await sanityClient.fetch<SanityEvent>(eventBySlugQuery, { slug })
  if (!event) return {}
  return { title: `${event.name} – Friki`, description: event.teaser }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const event = await sanityClient.fetch<SanityEvent>(eventBySlugQuery, { slug })
  if (!event) notFound()
  return <View event={event} />
}

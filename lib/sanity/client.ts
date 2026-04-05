import { createClient } from 'next-sanity'

export const sanityClient = createClient({
  projectId: 'vwe4wudl',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

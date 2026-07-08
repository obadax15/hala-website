import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // useCdn: false ensures newly published content appears immediately (no cache delay)
  useCdn: false,
  perspective: 'published',
})

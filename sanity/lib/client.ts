import { createClient, QueryParams } from 'next-sanity'

import { apiVersion, dataset, projectId, token } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
})

// Client with write token for server-side operations
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || token, // Use write token if available
})

export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  revalidate = 300, 
  tags = [],
}: {
  query: QueryString
  params?: QueryParams
  revalidate?: number | false
  tags?: string[]
}) {
  return client.fetch(query, params, {
    cache: 'force-cache', 
    next: {
      revalidate: tags.length ? false : revalidate, 
      tags, 
    },
  })
}
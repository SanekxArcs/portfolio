import { createClient, QueryParams } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Public CV content is regenerated at most hourly, so the Sanity CDN avoids
  // an origin request when a Vercel revalidation happens.
  useCdn: true,
})

export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  revalidate = 3600,
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
      revalidate,
      tags, 
    },
  })
}

import { createClient, QueryParams } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
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
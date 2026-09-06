import { MetadataRoute } from 'next'
import {siteUrl} from '@/lib/site'
import {getProfile} from '@/sanity/lib/profile'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const profile = await getProfile()

  return [
    {
      url: siteUrl,
      lastModified: profile?._updatedAt,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}

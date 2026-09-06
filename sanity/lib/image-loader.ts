'use client'
import type {ImageLoaderProps} from 'next/image'

// Sanity handles transforms and CDN caching; no Vercel image function is needed.
export default function sanityImageLoader({src, width, quality}: ImageLoaderProps) {
  if (!src.startsWith('https://cdn.sanity.io/images/')) return src
  const url = new URL(src)
  if (url.pathname.endsWith('.svg')) return src
  url.searchParams.set('w', String(width))
  url.searchParams.set('q', String(quality || 75))
  url.searchParams.set('fit', 'max')
  url.searchParams.set('auto', 'format')
  return url.toString()
}

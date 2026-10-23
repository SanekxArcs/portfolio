import {notFound} from 'next/navigation'
import {getProjects} from '@/lib/studio-content'
import {getDictionary} from '@/lib/i18n/dictionaries'
import {isLocale} from '@/lib/i18n/locales'
import {studioMetadata} from '@/lib/studio-metadata'
import {ProjectPage} from '@/components/studio/pages'
import {JsonLd, projectGraph} from '@/lib/structured-data'
import {siteUrl} from '@/lib/site'
type Props = {params: Promise<{locale: string; slug: string}>}

/** Whole sentences up to a search-snippet length; a short lead continues into the next one. */
function snippet(text: string | null | undefined, limit = 155) {
  if (!text) return undefined
  const clean = text.replace(/\s+/gu, ' ').trim()
  if (clean.length <= limit) return clean
  let out = ''
  for (const sentence of clean.split(/(?<=[.!?])\s+/u)) {
    const next = (out + ' ' + sentence).trim()
    if (next.length <= limit) {
      out = next
      continue
    }
    if (out.length >= 110) break
    return next.slice(0, limit - 1).replace(/[\s,;:]+\S*$/u, '') + '…'
  }
  return out
}
export const dynamicParams = false

export function generateStaticParams() {
  return getProjects('en').map((project) => ({slug: project.slug}))
}
export async function generateMetadata({params}: Props) {
  const {locale, slug} = await params
  if (!isLocale(locale)) return {}
  const project = getProjects(locale).find((item) => item.slug === slug)
  if (!project) return {}
  const metadata = studioMetadata(
    locale,
    '/work/' + slug,
    'work',
    project.nda
      ? getDictionary(locale).work.ndaTitle
      : (project.title ?? undefined),
    project.nda
      ? getDictionary(locale).work.nda
      : snippet(project.description),
  )
  if (project.nda) return {...metadata, robots: {index: false, follow: true}}
  // Public projects share their own card: name, kind and stack beside the screenshot (PNG).
  const image = {
    url: `${siteUrl}/${locale}/work/${slug}/share-image`,
    width: 1200,
    height: 630,
    type: 'image/png',
    alt: `${getDictionary(locale).work.imageAlt} — ${project.title}`,
  }
  return {
    ...metadata,
    openGraph: {...metadata.openGraph, images: [image]},
    twitter: {...metadata.twitter, images: [image]},
  }
}
export default async function Page({params}: Props) {
  const {locale, slug} = await params
  if (!isLocale(locale)) notFound()
  const project = getProjects(locale).find((item) => item.slug === slug)
  if (!project) notFound()
  return (
    <>
      {!project.nda && <JsonLd data={projectGraph(locale, project)} />}
      <ProjectPage locale={locale} project={project} />
    </>
  )
}

import {notFound} from 'next/navigation'
import {getProjects} from '@/lib/studio-content'
import {getDictionary} from '@/lib/i18n/dictionaries'
import {isLocale} from '@/lib/i18n/locales'
import {studioMetadata} from '@/lib/studio-metadata'
import {ProjectPage} from '@/components/studio/pages'
type Props = {params: Promise<{locale: string; slug: string}>}
export const dynamicParams = false

export function generateStaticParams() {
  return getProjects('en').map((project) => ({slug: project.slug}))
}
export async function generateMetadata({params}: Props) {
  const {locale, slug} = await params
  if (!isLocale(locale)) return {}
  const project = getProjects(locale).find((item) => item.slug === slug)
  if (!project) return {}
  return studioMetadata(
    locale,
    '/work/' + slug,
    'work',
    project.nda
      ? getDictionary(locale).work.ndaTitle
      : (project.title ?? undefined),
  )
}
export default async function Page({params}: Props) {
  const {locale, slug} = await params
  if (!isLocale(locale)) notFound()
  const project = getProjects(locale).find((item) => item.slug === slug)
  if (!project) notFound()
  return <ProjectPage locale={locale} project={project} />
}

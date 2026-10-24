import {notFound} from 'next/navigation'
import {getProjects} from '@/lib/studio-content'
import {getDictionary} from '@/lib/i18n/dictionaries'
import {isLocale} from '@/lib/i18n/locales'
import {studioMetadata} from '@/lib/studio-metadata'
import {PageIntro, StudioCta} from '@/components/studio/pages'
import {WorkGrid} from '@/components/studio/work-grid'
import {JsonLd, pageGraph} from '@/lib/structured-data'
type Props = {params: Promise<{locale: string}>}
export async function generateMetadata({params}: Props) {
  const {locale} = await params
  return isLocale(locale) ? studioMetadata(locale, '/work', 'work') : {}
}
export default async function Page({params}: Props) {
  const {locale} = await params
  if (!isLocale(locale)) notFound()
  const d = getDictionary(locale),
    projects = await getProjects(locale)
  return (
    <>
      <JsonLd data={await pageGraph(locale, 'work', projects)} />
      <PageIntro
        title={d.work.title}
        intro={d.work.intro}
      />
      <WorkGrid projects={projects} locale={locale} d={d} />
      <StudioCta locale={locale} d={d} />
    </>
  )
}

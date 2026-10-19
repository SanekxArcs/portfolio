import {notFound} from 'next/navigation'
import {getProjects} from '@/lib/studio-content'
import {getDictionary} from '@/lib/i18n/dictionaries'
import {isLocale} from '@/lib/i18n/locales'
import {studioMetadata} from '@/lib/studio-metadata'
import {PageIntro, StudioCta} from '@/components/studio/pages'
import {WorkGrid} from '@/components/studio/work-grid'
type Props = {params: Promise<{locale: string}>}
export async function generateMetadata({params}: Props) {
  const {locale} = await params
  return isLocale(locale) ? studioMetadata(locale, '/work', 'work') : {}
}
export default async function Page({params}: Props) {
  const {locale} = await params
  if (!isLocale(locale)) notFound()
  const d = getDictionary(locale)
  return (
    <>
      <PageIntro
        label={d.work.label}
        title={d.work.title}
        intro={d.work.intro}
      />
      <WorkGrid projects={getProjects(locale)} locale={locale} d={d} />
      <StudioCta locale={locale} d={d} />
    </>
  )
}

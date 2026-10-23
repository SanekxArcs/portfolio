import {notFound} from 'next/navigation'
import {ServicesPage} from '@/components/studio/pages'
import {isLocale} from '@/lib/i18n/locales'
import {studioMetadata} from '@/lib/studio-metadata'
import {JsonLd, pageGraph} from '@/lib/structured-data'
type Props = {params: Promise<{locale: string}>}
export async function generateMetadata({params}: Props) {
  const {locale} = await params
  return isLocale(locale) ? studioMetadata(locale, '/services', 'services') : {}
}
export default async function Page({params}: Props) {
  const {locale} = await params
  if (!isLocale(locale)) notFound()
  return (
    <>
      <JsonLd data={pageGraph(locale, 'services')} />
      <ServicesPage locale={locale} />
    </>
  )
}

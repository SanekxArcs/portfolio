import {notFound} from 'next/navigation'
import {ServicesPage} from '@/components/studio/pages'
import {isLocale} from '@/lib/i18n/locales'
import {studioMetadata} from '@/lib/studio-metadata'
type Props = {params: Promise<{locale: string}>}
export async function generateMetadata({params}: Props) {
  const {locale} = await params
  return isLocale(locale) ? studioMetadata(locale, '/services', 'services') : {}
}
export default async function Page({params}: Props) {
  const {locale} = await params
  if (!isLocale(locale)) notFound()
  return <ServicesPage locale={locale} />
}

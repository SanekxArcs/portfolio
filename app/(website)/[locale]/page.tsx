import {notFound} from 'next/navigation'
import {HomePage} from '@/components/studio/pages'
import {isLocale} from '@/lib/i18n/locales'
export default async function Page({
  params,
}: {
  params: Promise<{locale: string}>
}) {
  const {locale} = await params
  if (!isLocale(locale)) notFound()
  return <HomePage locale={locale} />
}

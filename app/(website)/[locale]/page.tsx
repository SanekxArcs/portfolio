import {notFound} from 'next/navigation'
import {HomePage} from '@/components/studio/pages'
import {isLocale} from '@/lib/i18n/locales'
import {JsonLd, pageGraph} from '@/lib/structured-data'
export default async function Page({
  params,
}: {
  params: Promise<{locale: string}>
}) {
  const {locale} = await params
  if (!isLocale(locale)) notFound()
  return (
    <>
      <JsonLd data={pageGraph(locale, 'home')} />
      <HomePage locale={locale} />
    </>
  )
}

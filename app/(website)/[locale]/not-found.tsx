'use client'
import {StudioLink as Link} from '@/components/studio/transitions'
import {useParams} from 'next/navigation'
import {getDictionary} from '@/lib/i18n/dictionaries'
import {isLocale} from '@/lib/i18n/locales'
export default function NotFound() {
  const params = useParams()
  const locale =
    typeof params.locale === 'string' && isLocale(params.locale)
      ? params.locale
      : 'en'
  const d = getDictionary(locale)
  return (
    <div className="studio-wrap studio-error">
      <p className="studio-eyebrow">404 / O.D. EMPOWER</p>
      <h1>{d.notFound.title}</h1>
      <p>{d.notFound.text}</p>
      <Link href={'/' + locale} className="studio-button primary">
        {d.notFound.back}
      </Link>
    </div>
  )
}

'use client'
import {useParams} from 'next/navigation'
import {getDictionary} from '@/lib/i18n/dictionaries'
import {isLocale} from '@/lib/i18n/locales'
export default function ErrorPage({reset}: {error: Error; reset: () => void}) {
  const params = useParams()
  const locale =
    typeof params.locale === 'string' && isLocale(params.locale)
      ? params.locale
      : 'en'
  const d = getDictionary(locale)
  return (
    <div className="studio-wrap studio-error">
      <h1>{d.error.title}</h1>
      <p>{d.error.text}</p>
      <button className="studio-button primary" onClick={reset}>
        {d.error.retry}
      </button>
    </div>
  )
}

import type {Metadata} from 'next'
import {siteUrl} from '@/lib/site'
import {locales, type Locale} from '@/lib/i18n/locales'
import {getDictionary} from '@/lib/i18n/dictionaries'
export function studioMetadata(
  locale: Locale,
  path = '',
  key: 'home' | 'services' | 'work' | 'experience' | 'contact' = 'home',
  name?: string,
): Metadata {
  const d = getDictionary(locale)
  const title =
    (name ??
      (key === 'experience'
        ? 'Oleksandr Dzisiak — ' + d.meta[key]
        : d.meta[key])) + ' — O.D. EMPOWER'
  return {
    title,
    description: d.meta.description,
    alternates: {
      canonical: siteUrl + '/' + locale + path,
      languages: {
        ...Object.fromEntries(
          locales.map((language) => [
            language,
            siteUrl + '/' + language + path,
          ]),
        ),
        'x-default': siteUrl + '/en' + path,
      },
    },
    openGraph: {
      title,
      description: d.meta.description,
      url: siteUrl + '/' + locale + path,
      siteName: 'O.D. EMPOWER',
      type: 'website',
      locale: ({en: 'en_US', pl: 'pl_PL', uk: 'uk_UA'} as const)[locale],
      alternateLocale: locales
        .filter((language) => language !== locale)
        .map((language) => ({en: 'en_US', pl: 'pl_PL', uk: 'uk_UA'})[language]),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: d.meta.description,
    },
  }
}

import type {Metadata} from 'next'
import {siteUrl} from '@/lib/site'
import {locales, type Locale} from '@/lib/i18n/locales'
import {getDictionary} from '@/lib/i18n/dictionaries'
export function studioMetadata(
  locale: Locale,
  path = '',
  key: 'home' | 'services' | 'work' | 'experience' | 'contact' = 'home',
  name?: string,
  descriptionOverride?: string,
): Metadata {
  const d = getDictionary(locale)
  const description =
    descriptionOverride ??
    (key === 'home' ? d.meta.description : d.meta.descriptions[key])
  const title =
    (name ??
      (key === 'experience'
        ? 'Oleksandr Dzisiak — ' + d.meta[key]
        : d.meta[key])) + ' — O.D. EMPOWER'
  const image = {
    url: `${siteUrl}/${locale}/share-image`,
    width: 1200,
    height: 630,
    type: 'image/png',
    alt: `O.D. EMPOWER — ${d.hero.line1} ${d.hero.line2}`,
  }
  return {
    title,
    description,
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
      description,
      url: siteUrl + '/' + locale + path,
      images: [image],
      siteName: 'O.D. EMPOWER',
      type: 'website',
      locale: ({en: 'en_US', pl: 'pl_PL', uk: 'uk_UA'} as const)[locale],
      alternateLocale: locales
        .filter((language) => language !== locale)
        .map((language) => ({en: 'en_US', pl: 'pl_PL', uk: 'uk_UA'})[language]),
    },
    twitter: {
      card: 'summary_large_image',
      images: [image],
      title,
      description,
    },
  }
}


import type {MetadataRoute} from 'next'
import {siteUrl} from '@/lib/site'
import {locales} from '@/lib/i18n/locales'
import {getProjects} from '@/lib/studio-content'
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '',
    '/services',
    '/work',
    '/experience',
    '/contact',
    ...getProjects('en')
      .filter((project) => !project.nda)
      .map((project) => '/work/' + project.slug),
  ]
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: siteUrl + '/' + locale + path,
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : path.startsWith('/work/') ? 0.6 : 0.8,
      alternates: {
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
    })),
  )
}

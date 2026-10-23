import {siteUrl} from '@/lib/site'
import {locales, type Locale} from '@/lib/i18n/locales'
import {getDictionary} from '@/lib/i18n/dictionaries'
import {getLocalizedProfile, type StudioProject} from '@/lib/studio-content'

/**
 * schema.org JSON-LD built only from facts already on the site. Every node has a stable @id,
 * so pages reference the same Person, business and website instead of repeating them.
 */
const ids = {
  person: `${siteUrl}/#person`,
  business: `${siteUrl}/#business`,
  website: `${siteUrl}/#website`,
}
const absolute = (path: string) => (path.startsWith('http') ? path : siteUrl + path)
const languageCodes = {en: 'en', pl: 'pl', uk: 'uk'} as const

function personNode(locale: Locale) {
  const profile = getLocalizedProfile(locale)
  return {
    '@type': 'Person',
    '@id': ids.person,
    name: profile.name,
    jobTitle: profile.role,
    url: `${siteUrl}/${locale}/experience`,
    image: profile.profilePhotoUrl ? absolute(profile.profilePhotoUrl) : undefined,
    sameAs: profile.links?.map((link) => link.link).filter(Boolean),
    address: {'@type': 'PostalAddress', addressCountry: 'PL'},
    knowsLanguage: ['uk', 'pl', 'en'],
    knowsAbout: [...(profile.skillsFrontend ?? []), ...(profile.skillsBackend ?? [])].slice(0, 16),
    worksFor: {'@id': ids.business},
  }
}

function businessNode(locale: Locale) {
  const d = getDictionary(locale)
  return {
    '@type': 'ProfessionalService',
    '@id': ids.business,
    name: 'O.D. EMPOWER',
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/web-app-manifest-512x512.png`,
    image: `${siteUrl}/${locale}/share-image`,
    description: d.meta.description,
    founder: {'@id': ids.person},
    address: {'@type': 'PostalAddress', addressCountry: 'PL'},
    availableLanguage: locales.map((language) => languageCodes[language]),
    makesOffer: d.services.items.map((item) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: item.title,
        description: item.text,
        url: `${siteUrl}/${locale}/services`,
        provider: {'@id': ids.business},
      },
    })),
  }
}

function websiteNode(locale: Locale) {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    name: 'O.D. EMPOWER',
    alternateName: 'o-d.dev',
    url: siteUrl,
    inLanguage: languageCodes[locale],
    publisher: {'@id': ids.business},
    author: {'@id': ids.person},
  }
}

function breadcrumbs(locale: Locale, trail: [string, string][]) {
  const d = getDictionary(locale)
  const items: [string, string][] = [[d.nav.home, `/${locale}`], ...trail]
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: siteUrl + path,
    })),
  }
}

function page(type: string, locale: Locale, path: string, extra: Record<string, unknown> = {}) {
  return {
    '@type': type,
    '@id': `${siteUrl}/${locale}${path}#page`,
    url: `${siteUrl}/${locale}${path}`,
    inLanguage: languageCodes[locale],
    isPartOf: {'@id': ids.website},
    about: {'@id': ids.business},
    ...extra,
  }
}

type PageKind = 'home' | 'services' | 'work' | 'experience' | 'contact'

export function pageGraph(locale: Locale, kind: PageKind, projects: StudioProject[] = []) {
  const d = getDictionary(locale)
  const graph: Record<string, unknown>[] = [personNode(locale), businessNode(locale), websiteNode(locale)]
  if (kind === 'home') graph.push(page('WebPage', locale, '', {name: d.meta.home}))
  if (kind === 'services')
    graph.push(
      page('WebPage', locale, '/services', {name: d.meta.services}),
      breadcrumbs(locale, [[d.nav.services, `/${locale}/services`]]),
    )
  if (kind === 'experience')
    graph.push(
      page('ProfilePage', locale, '/experience', {name: d.meta.experience, mainEntity: {'@id': ids.person}}),
      breadcrumbs(locale, [[d.nav.experience, `/${locale}/experience`]]),
    )
  if (kind === 'contact')
    graph.push(
      page('ContactPage', locale, '/contact', {name: d.meta.contact}),
      breadcrumbs(locale, [[d.nav.contact, `/${locale}/contact`]]),
    )
  if (kind === 'work')
    graph.push(
      page('CollectionPage', locale, '/work', {
        name: d.meta.work,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: projects
            .filter((project) => !project.nda)
            .map((project, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `${siteUrl}/${locale}/work/${project.slug}`,
              name: project.title,
            })),
        },
      }),
      breadcrumbs(locale, [[d.nav.work, `/${locale}/work`]]),
    )
  return {'@context': 'https://schema.org', '@graph': graph}
}

export function projectGraph(locale: Locale, project: StudioProject) {
  const d = getDictionary(locale)
  const path = `/work/${project.slug}`
  const image = project.media?.desktop ?? project.imageUrls?.[0]
  return {
    '@context': 'https://schema.org',
    '@graph': [
      personNode(locale),
      businessNode(locale),
      websiteNode(locale),
      {
        '@type': 'CreativeWork',
        '@id': `${siteUrl}/${locale}${path}#work`,
        name: project.title,
        description: project.description,
        url: `${siteUrl}/${locale}${path}`,
        image: image ? absolute(image) : undefined,
        inLanguage: languageCodes[locale],
        creator: {'@id': ids.person},
        keywords: project.technologies?.join(', '),
        sameAs: project.url ?? undefined,
        isPartOf: {'@id': ids.website},
      },
      breadcrumbs(locale, [
        [d.nav.work, `/${locale}/work`],
        [project.title ?? d.work.ndaTitle, `/${locale}${path}`],
      ]),
    ],
  }
}

/** Serialises safely inside a script tag: no "</script>" can break out of the JSON. */
export function JsonLd({data}: {data: unknown}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(data).replace(/</g, '\\u003c')}}
    />
  )
}

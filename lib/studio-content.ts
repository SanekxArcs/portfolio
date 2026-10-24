import {ConvexHttpClient} from 'convex/browser'
import {unstable_cache} from 'next/cache'
import {api} from '@/convex/_generated/api'
import type {CvProfile, CvProject} from '@/components/cv/types'
import type {Locale} from '@/lib/i18n/locales'

export type ProjectMedia = {
  desktop: string
  kind?: 'website' | 'desktop' | 'extension'
  video?: string
  mobile?: string
  detail?: string
  detailWidth?: number
  detailHeight?: number
  capturedOn: string
  sourceUrl: string
  resolvedUrl?: string
  view?: string
}

export type StudioProject = CvProject & {
  media?: ProjectMedia
  id: string
  slug: string
  featured: boolean
}

/** Every page reads this tag; the admin expires it after each save. */
export const contentTag = 'cms-content'

// Pages stay static: content is fetched once, then served from the Next cache
// until the admin saves and expires the tag.
const loadContent = unstable_cache(
  async () => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL
    if (!url) throw new Error('NEXT_PUBLIC_CONVEX_URL is not set.')
    return new ConvexHttpClient(url).query(api.content.snapshot, {})
  },
  // A new deployment starts from fresh content. The hourly refresh catches edits made
  // outside the admin (Convex dashboard, CLI), which do not expire the tag.
  ['cms-content', process.env.VERCEL_DEPLOYMENT_ID ?? 'local'],
  {tags: [contentTag], revalidate: 3600},
)

type Localized<T> = {en: T; pl?: T; uk?: T}
// An empty translation falls back to English rather than leaving a gap.
const pick = <T,>(value: Localized<T>, locale: Locale): T => {
  const translated = locale === 'en' ? undefined : value[locale]
  return translated && (!Array.isArray(translated) || translated.length) ? translated : value.en
}

export async function getProjects(locale: Locale): Promise<StudioProject[]> {
  const {projects} = await loadContent()
  return projects.map((project) => {
    const media = project.nda ? undefined : project.media
    return {
      title: project.title,
      description: pick(project.description, locale),
      features: pick(project.features, locale),
      technologies: project.technologies,
      url: project.url,
      urlToCode: project.urlToCode,
      petProject: project.petProject,
      isPinned: project.isPinned,
      nda: project.nda,
      imageUrls: media
        ? [media.desktop, ...(media.detail ? [media.detail] : [])]
        : project.gallery,
      ...(media ? {media} : {}),
      id: project.slug,
      slug: project.slug,
      featured: project.featured,
    }
  })
}

export async function getFeaturedProjects(locale: Locale) {
  return (await getProjects(locale)).filter((project) => project.featured)
}

export async function getClients() {
  return (await loadContent()).clients
}

/** The live CV file: where it is stored and the name it downloads as. */
export async function getCvFile() {
  const {profile} = await loadContent()
  return profile?.cvFileUrl
    ? {url: profile.cvFileUrl, name: profile.cvFileName ?? 'Oleksandr-Dzisiak-CV.pdf'}
    : null
}

export async function getLocalizedProfile(locale: Locale): Promise<CvProfile> {
  const {profile, experience} = await loadContent()
  if (!profile) throw new Error('No profile in Convex yet. Run: npx convex run seed:importContent')
  return {
    _id: profile._id,
    name: profile.name,
    role: pick(profile.role, locale),
    description: pick(profile.description, locale),
    about: pick(profile.about, locale),
    logoUrl: profile.logoUrl,
    profilePhotoUrl: profile.profilePhotoUrl,
    cvUrl: profile.cvUrl,
    // Served through /cv so the link stays same-origin and downloads with a proper filename.
    cvFileUrl: profile.cvFileUrl ? '/cv' : undefined,
    contacts: profile.contacts,
    links: profile.links,
    languages: profile.languages,
    skillsFrontend: profile.skillsFrontend,
    skillsBackend: profile.skillsBackend,
    skillsDevOps: profile.skillsDevOps,
    skillsOther: pick(profile.skillsOther, locale),
    softSkills: pick(profile.softSkills, locale),
    interests: pick(profile.interests, locale),
    education: profile.education.map((item) => ({
      institution: item.institution,
      specialization: pick(item.specialization, locale),
    })),
    courses: profile.courses,
    workExperience: experience.map((job) => ({
      companyName: job.companyName,
      website: job.website,
      websiteName: job.websiteName,
      isRelated: job.isRelated,
      hideFromCV: job.hideFromCV,
      jobTitle: pick(job.jobTitle, locale),
      jobTitle2: job.jobTitle2 && pick(job.jobTitle2, locale),
      duration: pick(job.duration, locale),
      location: pick(job.location, locale),
      type: pick(job.type, locale),
      description: pick(job.description, locale),
    })),
    projects: await getProjects(locale),
  }
}

import profile from '@/content/profile.json'
import projectIndex from '@/content/project-index.json'
import projectMedia from '@/content/project-media.json'
import pl from '@/content/site/profile-pl.json'
import uk from '@/content/site/profile-uk.json'
import projectPl from '@/content/site/projects-pl.json'
import projectUk from '@/content/site/projects-uk.json'
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
const mediaById = projectMedia as Record<string, ProjectMedia>

export type StudioProject = CvProject & {
  media?: ProjectMedia
  id: string
  slug: string
  featured: boolean
}
export function getLocalizedProfile(locale: Locale): CvProfile {
  if (locale === 'en') return profile
  const translation = locale === 'pl' ? pl : uk
  return {
    ...profile,
    role: translation.role,
    description: translation.description,
    about: translation.about,
    softSkills: translation.softSkills,
    skillsOther: translation.skillsOther,
    interests: translation.interests,
    education: profile.education.map((item, index) => ({
      ...item,
      specialization: translation.education[index],
    })),
    workExperience: profile.workExperience.map((item, index) => ({
      ...item,
      ...translation.work[index],
    })),
    projects: getProjects(locale),
  }
}
export function getProjects(locale: Locale): StudioProject[] {
  return projectIndex.map((entry) => {
    const project = profile.projects[entry.sourceIndex]
    const translation =
      locale === 'en'
        ? null
        : (locale === 'pl' ? projectPl : projectUk)[entry.sourceIndex]
    const media = project.nda ? undefined : mediaById[entry.id]
    return {
      ...project,
      ...translation,
      ...(media
        ? {
            media,
            imageUrls: [media.desktop, ...(media.detail ? [media.detail] : [])],
          }
        : {}),
      id: entry.id,
      slug: entry.slug,
      featured: entry.featured,
    }
  })
}
export function getFeaturedProjects(locale: Locale) {
  return getProjects(locale).filter((project) => project.featured)
}

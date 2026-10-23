import {isLocale, locales} from '@/lib/i18n/locales'
import {getProjects} from '@/lib/studio-content'
import {projectSocialImage} from '@/lib/project-social-image'

// One prerendered PNG per public project and language, shared as the page's social image.
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getProjects(locale)
      .filter((project) => !project.nda)
      .map((project) => ({locale, slug: project.slug})),
  )
}

export async function GET(
  _request: Request,
  context: {params: Promise<{locale: string; slug: string}>},
) {
  const {locale, slug} = await context.params
  if (!isLocale(locale)) return new Response(null, {status: 404})
  const project = getProjects(locale).find((item) => item.slug === slug)
  if (!project || project.nda) return new Response(null, {status: 404})
  return projectSocialImage(locale, project)
}

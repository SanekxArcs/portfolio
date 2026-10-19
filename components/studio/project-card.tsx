import {MotionText} from '@/components/studio/motion-text'
import {StudioLink as Link} from '@/components/studio/transitions'
import {ProjectPreview} from './project-preview'
import {ArrowUpRight, LockKeyhole} from 'lucide-react'
import type {StudioProject} from '@/lib/studio-content'
import type {Locale} from '@/lib/i18n/locales'
import type {Dictionary} from '@/lib/i18n/dictionaries'

export function ProjectCard({
  project,
  locale,
  d,
  large = false,
}: {
  project: StudioProject
  locale: Locale
  d: Dictionary
  large?: boolean
}) {
  const title = project.nda ? d.work.ndaTitle : project.title
  return (
    <article
      className={`studio-project-card ${large ? 'project-wide' : ''}`}
      data-reveal
    >
      <Link
        href={`/${locale}/work/${project.slug}`}
        className={`studio-project-image project-tone-${project.id}`}
        aria-label={`${d.work.view}: ${title}`}
      >
        <div className="project-image-topline">
          <span>
            O—D /{' '}
            {project.featured
              ? d.home.workLabel.split('/')[1]?.trim()
              : d.nav.work}
          </span>
          <span>
            {project.nda
              ? d.work.confidential
              : project.petProject
                ? d.work.independent
                : d.work.commercial}
          </span>
        </div>
        {project.imageUrls?.[0] && !project.nda ? (
          <ProjectPreview project={project} d={d} />
        ) : (
          <div className="project-private-art">
            <LockKeyhole size={48} strokeWidth={1} />
            <span>
              <MotionText text={d.work.confidential} />
            </span>
          </div>
        )}
        <span className="project-open">
          <ArrowUpRight size={22} />
        </span>
      </Link>
      <div className="project-card-meta">
        <div>
          <p className="studio-eyebrow">
            {project.petProject ? d.work.independent : d.work.commercial}
          </p>
          <h3>
            <Link href={`/${locale}/work/${project.slug}`}>
              <MotionText text={title} />
            </Link>
          </h3>
        </div>
        <span className="project-tech">
          <MotionText text={project.technologies?.slice(0, 3).join(' / ')} />
        </span>
      </div>
    </article>
  )
}

import Image from 'next/image'
import {Play} from 'lucide-react'
import type {Dictionary} from '@/lib/i18n/dictionaries'
import type {StudioProject} from '@/lib/studio-content'

/** Desktop and phone captures stay responsive and keep the website pixels intact. */
export function ProjectPreview({
  project,
  d,
  priority = false,
}: {
  project: StudioProject
  d: Dictionary
  priority?: boolean
}) {
  const src = project.imageUrls?.[0]
  if (!src) return null
  const product = project.media?.kind === 'desktop' || project.media?.kind === 'extension'
  return (
    <div
      className={`project-preview ${product ? 'project-preview--product' : ''} ${project.media?.mobile ? 'project-preview--responsive' : ''}`}
    >
      <div className="project-browser">
        <div className="project-screen-viewport">
          <Image
            src={src}
            fill
            priority={priority}
            unoptimized={!!project.media}
            sizes="(max-width: 760px) 90vw, 1000px"
            alt={`${d.work.imageAlt} — ${project.title}`}
            className="project-screen"
          />
        </div>
      </div>
      {project.media?.mobile && (
        <div className="project-phone">
          <div className="project-phone-screen">
            <Image
              src={project.media.mobile}
              unoptimized
              fill
              sizes="(max-width: 760px) 22vw, 180px"
              alt={`${d.work.mobilePreview} — ${project.title}`}
            />
          </div>
        </div>
      )}
      {project.media?.video && (
        <span className="project-video-label"><Play size={13} aria-hidden="true" />{d.work.watchDemo}</span>
      )}
    </div>
  )
}

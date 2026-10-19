import Image from 'next/image'
import {Play} from 'lucide-react'
import type {Dictionary} from '@/lib/i18n/dictionaries'
import type {StudioProject} from '@/lib/studio-content'

/** Device frames stay responsive and keep the captured website pixels intact. */
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
  const url = project.media?.resolvedUrl ?? project.url
  const product = project.media?.kind === 'desktop' || project.media?.kind === 'extension'
  const address = product ? project.title : url
    ? new URL(url).hostname.replace(/^www\./, '')
    : project.title
  return (
    <div
      className={`project-preview ${product ? 'project-preview--product' : ''} ${project.media?.mobile ? 'project-preview--responsive' : ''}`}
    >
      <div className="project-browser">
        <div className="project-browser-bar" aria-hidden="true">
          <div className="project-window-controls">
            <i />
            <i />
            <i />
          </div>
          <span>{address}</span>
        </div>
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
          <span className="project-phone-speaker" aria-hidden="true" />
          <div className="project-phone-screen">
            <Image
              src={project.media.mobile}
              unoptimized
              fill
              sizes="(max-width: 760px) 22vw, 180px"
              alt={`${d.work.mobilePreview} — ${project.title}`}
            />
          </div>
          <span className="project-phone-home" aria-hidden="true" />
        </div>
      )}
      {project.media?.video && (
        <span className="project-video-label"><Play size={13} aria-hidden="true" />{d.work.watchDemo}</span>
      )}
    </div>
  )
}

'use client'
import {useState} from 'react'
import {AnimatePresence, motion} from 'motion/react'
import type {Dictionary} from '@/lib/i18n/dictionaries'
import type {Locale} from '@/lib/i18n/locales'
import type {StudioProject} from '@/lib/studio-content'
import {ProjectCard} from './project-card'
import {
  MotionNumber,
  MotionText,
  smoothEase,
  useStudioReducedMotion,
} from './motion-text'
import {MotionSize} from './motion-size'

export function WorkGrid({
  projects,
  locale,
  d,
}: {
  projects: StudioProject[]
  locale: Locale
  d: Dictionary
}) {
  const [filter, setFilter] = useState('all')
  const reduced = useStudioReducedMotion()
  const matches = (project: StudioProject, category: string) =>
    category === 'all' ||
    (category === 'commercial' && !project.petProject && !project.nda) ||
    (category === 'independent' && project.petProject) ||
    (category === 'confidential' && project.nda)
  const filtered = projects.filter((project) => matches(project, filter))
  return (
    <div className="studio-wrap">
      <div className="work-filters" role="group" aria-label={d.work.label}>
        {(['all', 'commercial', 'independent', 'confidential'] as const).map(
          (value) => (
            <motion.button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              whileTap={reduced ? undefined : {scale: 0.97}}
            >
              {filter === value && (
                <motion.span
                  className="motion-tab-indicator"
                  layoutId="work-filter-indicator"
                  transition={{duration: reduced ? 0 : 0.35, ease: smoothEase}}
                />
              )}
              <span className="motion-tab-label">
                <MotionText text={d.work[value]} />
              </span>
              <MotionNumber
                value={
                  projects.filter((project) => matches(project, value)).length
                }
              />
            </motion.button>
          ),
        )}
      </div>
      <p className="sr-only" role="status">
        {filtered.length} {d.nav.work}
      </p>
      <div className="work-results">
        <MotionNumber value={filtered.length} />
        <MotionText text={d.nav.work} />
      </div>
      <MotionSize>
        <div className="studio-work-grid">
          <AnimatePresence initial={false} mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                className="studio-project-tile"
                layout={reduced ? false : 'position'}
                initial={{opacity: 0, y: 18}}
                animate={{opacity: 1, y: 0}}
                exit={{
                  opacity: 0,
                  y: reduced ? 0 : -8,
                  scale: reduced ? 1 : 0.98,
                }}
                transition={{
                  duration: reduced ? 0 : 0.3,
                  layout: {duration: reduced ? 0 : 0.45, ease: smoothEase},
                }}
              >
                <ProjectCard project={project} locale={locale} d={d} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </MotionSize>
    </div>
  )
}

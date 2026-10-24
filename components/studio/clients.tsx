'use client'

import {useState} from 'react'
import {AnimatePresence, motion} from 'motion/react'
import {ChevronDown} from 'lucide-react'
import type {Dictionary} from '@/lib/i18n/dictionaries'

type Client = {name: string; url: string; featured: boolean; linked: boolean}
import {
  MotionNumber,
  MotionText,
  smoothEase,
  useStudioReducedMotion,
} from './motion-text'

export function StudioClients({d, clients}: {d: Dictionary; clients: Client[]}) {
  const [expanded, setExpanded] = useState(false)
  const reduced = useStudioReducedMotion()
  const featured = clients.filter((client) => client.featured)
  const remaining = clients.filter((client) => !client.featured)
  const renderClient = (client: Client) => (
    <li key={client.url}>
      {client.linked ? (
        <a
          className="studio-client-name"
          href={client.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${client.name} — ${d.clients.visit}`}
        >
          <span>{client.name}</span>
        </a>
      ) : (
        <div className="studio-client-name">
          <span>{client.name}</span>
        </div>
      )}
    </li>
  )

  return (
    <section
      className="studio-clients studio-wrap"
      aria-labelledby="studio-clients-title"
    >
      <div className="studio-clients-heading" data-reveal>
        <div>
          <h2 id="studio-clients-title">
            <MotionText text={d.clients.title} />
          </h2>
        </div>
        <p className="studio-clients-intro">
          <MotionText text={d.clients.intro} />
        </p>
      </div>
      <ul className="studio-client-grid">{featured.map(renderClient)}</ul>
      <div id="studio-more-clients">
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="more-clients"
              initial={{height: 0, opacity: 0}}
              animate={{height: 'auto', opacity: 1}}
              exit={{height: 0, opacity: 0}}
              transition={{duration: reduced ? 0 : 0.4, ease: smoothEase}}
              className="studio-clients-more"
            >
              <ul className="studio-client-grid">
                {remaining.map(renderClient)}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button
        type="button"
        className="studio-clients-toggle"
        aria-expanded={expanded}
        aria-controls="studio-more-clients"
        onClick={() => setExpanded(!expanded)}
      >
        <MotionText text={expanded ? d.clients.showLess : d.clients.showAll} />
        <span className="studio-clients-count">
          <MotionNumber value={clients.length} />
        </span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>
    </section>
  )
}

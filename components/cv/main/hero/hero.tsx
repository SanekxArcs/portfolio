'use client'

import {useMemo} from 'react'
import {motion, type Variants, useReducedMotion} from 'motion/react'
import {ArrowDown, ArrowUpRight, Mail, Phone} from 'lucide-react'
import {useUIStore} from '@/hooks/use-ui-store'
import {ActionButton} from '@/components/cv/atoms/action-button'
import type {CvProfile} from '../../types'
import {HeroInfo} from './hero-info'
import {HeroActions} from './hero-actions'
import {HeroSocials} from './hero-socials'
import {HeroLanguages} from './hero-languages'
import {HeroDetails} from './hero-details'
import {HeroImage} from './hero-image'
import './hero.css'

export function Hero({profile}: {profile: CvProfile}) {
  const {isReducedMotion, hasUserPreference} = useUIStore()
  const systemReducedMotion = useReducedMotion()
  const reducedMotion = hasUserPreference ? isReducedMotion : isReducedMotion || !!systemReducedMotion
  const itemVariants: Variants = useMemo(() => ({
    hidden: {opacity: 1, y: reducedMotion ? 0 : 16},
    visible: {opacity: 1, y: 0, transition: {duration: reducedMotion ? 0 : 0.7, ease: 'easeOut'}},
  }), [reducedMotion])
  const hasProjects = !!(profile.projects?.length || profile.petProjects?.length || profile.commercialProjects?.length)

  return (
    <motion.section id="profile" className="portfolio-hero" aria-labelledby="hero-name" initial="hidden" animate="visible">
      <div className="hero-main">
        <div className="hero-copy">
          <HeroInfo profile={profile} variants={itemVariants} />
          <motion.div className="hero-primary-actions" variants={itemVariants}>
            <ActionButton href={hasProjects ? '#projects' : '#experience'} label={hasProjects ? 'Explore my work' : 'View my experience'} icon={<ArrowUpRight />} className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400" />
            {profile.contacts?.email && <ActionButton href={`mailto:${profile.contacts.email}`} icon={<Mail />} variant="outline" size="icon" className="hero-contact-button" props={{'aria-label': 'Send email', title: 'Send email'}} />}
            {profile.contacts?.phoneNumber && <ActionButton href={`tel:${profile.contacts.phoneNumber}`} icon={<Phone />} variant="outline" size="icon" className="hero-contact-button" props={{'aria-label': 'Call me', title: 'Call me'}} />}
          </motion.div>
        </div>
        <div className="hero-visual-column">
          <HeroImage profile={profile} variants={itemVariants} shouldReduceMotion={reducedMotion} />
        </div>
      </div>
      <motion.div className="hero-resume" variants={itemVariants}>
        <div className="hero-resume-connect">
          <h2 className="hero-detail-label">CV & Connect</h2>
          <HeroActions profile={profile} variants={itemVariants} />
          <HeroSocials profile={profile} variants={itemVariants} />
        </div>
        <div className="hero-resume-details">
          <h2 className="hero-detail-label">At a glance</h2>
          <HeroLanguages profile={profile} variants={itemVariants} />
          <HeroDetails profile={profile} variants={itemVariants} />
        </div>
      </motion.div>
      <a className="hero-next text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400" href="#about"><ArrowDown size={14} /> Get to know me</a>
    </motion.section>
  )
}

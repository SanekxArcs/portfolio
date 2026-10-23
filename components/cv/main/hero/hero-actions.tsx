'use client'
import {motion, type Variants} from 'motion/react'
import {ActionButton} from '@/components/cv/atoms/action-button'
import type {CvProfile} from '@/components/cv/types'
import {mainHeadConfig} from './hero.config'

type Props = {profile: CvProfile; variants: Variants}

export function HeroActions({profile, variants}: Props) {
  const {icons, actions} = mainHeadConfig
  return (
    <motion.div className="hero-cv-actions" variants={variants}>
      <div className="hero-cv-links">
        {profile.cvFileUrl && <ActionButton href={profile.cvFileUrl} icon={<icons.Download />} label={actions.saveCv} download />}
        {profile.cvUrl && <ActionButton href={profile.cvUrl} icon={<icons.ExternalLink />} label={actions.viewCv} variant={profile.cvFileUrl ? 'link' : 'default'} className={profile.cvFileUrl ? 'hero-cv-view text-muted-foreground' : undefined} external />}
      </div>

    </motion.div>
  )
}

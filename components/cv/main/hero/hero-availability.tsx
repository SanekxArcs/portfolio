'use client'
import {motion, Variants} from 'motion/react'

import {Badge} from '@/components/ui/badge'

import type {CvProfile} from '@/components/cv/types'

import {mainHeadConfig} from './hero.config'

type Props = {
  profile: CvProfile
  variants: Variants
}

export function HeroAvailability({profile, variants}: Props) {
  const {icons, availability} = mainHeadConfig

  return (
    <motion.div className="mb-4 inline-block" variants={variants}>
      <Badge
        variant="secondary"
        className="text-emerald-800 dark:text-emerald-200 bg-emerald-200/80 p-2.5 text-sm font-medium dark:bg-emerald-950/80"
      >
        <icons.BadgeCheck className="mr-1 text-emerald-600" />
        {profile.contacts?.workAvailability &&
        Array.isArray(profile.contacts.workAvailability) &&
        profile.contacts.workAvailability.length > 0
          ? profile.contacts.workAvailability[0] === availability.immediately
            ? availability.available
            : profile.contacts.workAvailability[0]
          : availability.available}
      </Badge>
    </motion.div>
  )
}

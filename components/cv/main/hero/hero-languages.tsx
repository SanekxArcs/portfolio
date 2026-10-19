'use client'
import {motion, Variants} from 'motion/react'

import {Badge} from '@/components/ui/badge'
import FlagIcon from '@/components/FlagIcon'

import type {CvProfile} from '@/components/cv/types'

type Props = {
  profile: CvProfile
  variants: Variants
}

export function HeroLanguages({profile, variants}: Props) {
  if (!profile.languages || profile.languages.length === 0) return null

  return (
    <motion.div className="hero-languages flex flex-wrap gap-2" aria-label="Languages" variants={variants}>
      {profile.languages.map((lang, i) => (
        <Badge key={i} variant="outline" className="bg-background/50 gap-1.5 pl-1.5 text-xs">
          <FlagIcon languageCode={lang.language?.trim() || ''} />
          <span>
            {lang.language?.trim().toLowerCase() === 'poland' ? 'Polish' : lang.language}
            {lang.level && <span className="text-muted-foreground ml-1">· {lang.level}</span>}
          </span>
        </Badge>
      ))}
    </motion.div>
  )
}

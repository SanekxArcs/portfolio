'use client'
import {useMemo} from 'react'
import {motion, Variants} from 'motion/react'

import type {CvProfile} from '@/components/cv/types'
import {HighlightedText} from '@/components/cv/atoms/highlighted-text'
import {getAllSkills} from '@/lib/cv-utils'

type Props = {
  profile: CvProfile
  variants: Variants
}

export function HeroInfo({profile, variants}: Props) {
  const allSkills = useMemo(() => getAllSkills(profile), [profile])

  return (
    <>
      <motion.h1 id="hero-name"
        className="from-foreground dark:from-foreground mb-4 scroll-m-20 bg-linear-to-b to-emerald-700 bg-clip-text text-start text-5xl leading-tight font-extrabold tracking-tight text-balance text-transparent sm:text-6xl lg:text-7xl dark:bg-linear-to-r dark:to-emerald-400"
        variants={variants}
      >
        {profile.name}
      </motion.h1>
      <motion.p
        className="hero-role text-muted-foreground mb-6 text-2xl font-light sm:text-3xl"
        variants={variants}
      >
        {profile.role?.trim().replace(/^full[\s-]*stack developer$/i, 'Full-stack Developer')}
      </motion.p>
      {profile.description && (
        <motion.p
          className="hero-description text-muted-foreground group mb-8 max-w-2xl text-lg leading-relaxed"
          variants={variants}
        >
          <HighlightedText text={profile.description} skills={allSkills} />
        </motion.p>
      )}
    </>
  )
}

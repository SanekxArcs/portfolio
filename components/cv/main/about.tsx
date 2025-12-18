'use client'

import {User, Speech} from 'lucide-react'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import type {CvProfile} from '@/components/cv/types'
import {motion, Variants} from 'motion/react'
import {useUIStore} from '@/hooks/use-ui-store'
import {HighlightedText} from '../atoms/highlighted-text'
import {useMemo, useState} from 'react'
import {getAllSkills} from '@/lib/cv-utils'
import {cn} from '@/lib/utils'

type Props = {
  profile: CvProfile
}

const containerVariants: Variants = {
  hidden: {opacity: 0, y: 20},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.8,
      ease: 'easeOut',
    },
  },
}

export function About({profile}: Props) {
  const {isReducedMotion} = useUIStore()
  const allSkills = useMemo(() => getAllSkills(profile), [profile])

  return (
    <motion.section
      id="about"
      className="mb-20 scroll-mt-24"
      initial={isReducedMotion ? 'visible' : 'hidden'}
      animate="visible"
      variants={containerVariants}
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
          <User className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold">About Me</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="">
          <Card className="group relative h-full overflow-hidden border-2">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y--8 text-emerald-500 opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.05]">
              <User className="h-full w-full" />
            </div>
            <CardContent className="p-6 pt-0 lg:p-8 lg:pt-0">
              <p className="text-muted-foreground text-lg leading-relaxed">
                <HighlightedText
                  text={profile.about || ''}
                  skills={allSkills}
                  highlightClassName="group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                />
              </p>
              {profile.softSkills && profile.softSkills.length > 0 && (
                <>
                  <div className=" mt-2 flex items-center justify-between gap-2 pt-2 pb-6 text-xl">
                    <div className="flex items-center gap-2 text-xl">
                      <Speech className="h-5 w-5 text-emerald-500" />
                      Soft Skills
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {profile.softSkills.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={isReducedMotion ? {opacity: 1} : {opacity: 0, x: 10}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: i * 0.1}}
                        className="group/skill relative border-l-2 border-emerald-500/20 pl-4 transition-colors hover:border-emerald-500"
                      >
                        <div className="text-foreground font-bold transition-colors group-hover/skill:text-emerald-600 dark:group-hover/skill:text-emerald-400">
                          {item.skill}
                        </div>
                        {item.description && (
                          <p className="text-muted-foreground mt-1 text-sm leading-snug">
                            {item.description}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.section>
  )
}

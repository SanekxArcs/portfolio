'use client'
import {HeroImage} from '@/components/cv/main/hero/hero-image'
import {useUIStore} from '@/hooks/use-ui-store'
import {useReducedMotion} from 'motion/react'
import type {CvProfile} from '@/components/cv/types'
import type {Dictionary} from '@/lib/i18n/dictionaries'
import '@/components/cv/main/hero/hero.css'
export function StudioIdentity({
  profile,
  d,
}: {
  profile: CvProfile
  d: Dictionary
}) {
  const {isReducedMotion, hasUserPreference} = useUIStore()
  const system = useReducedMotion()
  return (
    <div className="studio-identity">
      <HeroImage
        profile={profile}
        variants={{}}
        shouldReduceMotion={
          hasUserPreference ? isReducedMotion : isReducedMotion || !!system
        }
        labels={d.identity}
      />
    </div>
  )
}

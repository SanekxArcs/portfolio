'use client'

import {usePathname} from 'next/navigation'
import {HeroLogoScene} from '@/components/cv/main/hero/hero-logo-scene'
import {useStudioReducedMotion} from './motion-text'
import '@/components/cv/main/hero/hero.css'

export function StudioBackgroundScene() {
  const pathname = usePathname()
  const reduced = useStudioReducedMotion()
  if (/^\/(en|pl|uk)\/?$/.test(pathname)) return null
  return (
    <HeroLogoScene
      reducedMotion={reduced}
      photoVisible={false}
      backgroundOnly
    />
  )
}

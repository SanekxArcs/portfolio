'use client'

import {useState} from 'react'
import Image from 'next/image'
import {motion, type Variants} from 'motion/react'
import {MousePointer2} from 'lucide-react'
import type {CvProfile} from '@/components/cv/types'
import {HeroLogoScene} from './hero-logo-scene'

type IdentityLabels = {
  photo: string
  logo: string
  meet: string
  return: string
  tap: string
  tapReturn: string
}
const defaultLabels: IdentityLabels = {
  photo: 'View profile photo',
  logo: 'View logo',
  meet: 'Click to meet me',
  return: 'Click to return to logo',
  tap: 'Tap to meet me',
  tapReturn: 'Tap to return',
}
type Props = {
  profile: CvProfile
  variants: Variants
  shouldReduceMotion: boolean
  labels?: IdentityLabels
}

export function HeroImage({
  profile,
  variants,
  shouldReduceMotion,
  labels = defaultLabels,
}: Props) {
  const [showPhoto, setShowPhoto] = useState(false)
  const [photoLoaded, setPhotoLoaded] = useState(false)
  const photoVisible = showPhoto && photoLoaded

  return (
    <motion.div className="hero-identity" variants={variants}>
      <HeroLogoScene
        reducedMotion={shouldReduceMotion}
        photoVisible={photoVisible}
      />
      {profile.profilePhotoUrl && (
        <button
          className="hero-identity-trigger"
          type="button"
          onClick={() => setShowPhoto((value) => !value)}
          aria-label={showPhoto ? labels.logo : labels.photo}
          aria-controls="hero-profile-portrait"
          aria-pressed={showPhoto}
        >
          <span className="hero-portrait-anchor" aria-hidden={!photoVisible}>
            <motion.span
              id="hero-profile-portrait"
              className="hero-portrait"
              initial={false}
              animate={
                photoVisible
                  ? {
                      opacity: 1,
                      scale: 1,
                      rotateY: 360,
                      y: 0,
                      filter: 'blur(0px)',
                    }
                  : {
                      opacity: 0,
                      scale: 0.8,
                      rotateY: 0,
                      y: 12,
                      filter: 'blur(6px)',
                    }
              }
              transition={{
                duration: shouldReduceMotion ? 0 : 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Image
                src={profile.profilePhotoUrl}
                alt=""
                fill
                priority
                sizes="(max-width: 760px) 120px, 240px"
                className="object-cover"
                onLoad={() => setPhotoLoaded(true)}
              />
            </motion.span>
          </span>
          <span className="hero-identity-hint" aria-hidden="true">
            <MousePointer2 size={12} />
            <span className="hero-identity-hint-desktop">
              {showPhoto ? labels.return : labels.meet}
            </span>
            <span className="hero-identity-hint-touch">
              {showPhoto ? labels.tapReturn : labels.tap}
            </span>
          </span>
        </button>
      )}
    </motion.div>
  )
}

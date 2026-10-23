'use client'

import {useRef, useState, type KeyboardEvent, type PointerEvent} from 'react'
import Image from 'next/image'
import {motion, type Variants} from 'motion/react'
import {MousePointer2} from 'lucide-react'
import type {CvProfile} from '@/components/cv/types'
import {HeroLogoScene, LOGO_SPIN_EVENT, createLogoSpin} from './hero-logo-scene'

const repaintSpin = () => window.dispatchEvent(new Event(LOGO_SPIN_EVENT))

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
// Pixels of travel before a press becomes a drag instead of a click.
const DRAG_THRESHOLD = 6

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
  const spinRef = useRef(createLogoSpin())
  const press = useRef({
    id: -1,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    moved: false,
  })
  const suppressClick = useRef(false)

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return
    suppressClick.current = false
    press.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: event.timeStamp,
      moved: false,
    }
  }
  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const p = press.current,
      spin = spinRef.current
    if (p.id !== event.pointerId) return
    if (!p.moved) {
      if (
        Math.hypot(event.clientX - p.startX, event.clientY - p.startY) <
        DRAG_THRESHOLD
      )
        return
      p.moved = true
      spin.dragging = true
      spin.velocity = 0
      try {
        event.currentTarget.setPointerCapture(event.pointerId)
      } catch {
        /* The pointer already ended; the drag still applies to this move. */
      }
    }
    const dx = event.clientX - p.lastX,
      dy = event.clientY - p.lastY,
      dt = Math.max((event.timeStamp - p.lastTime) / 1000, 1 / 240)
    spin.angleY += dx * 0.012
    spin.angleX = Math.max(-0.6, Math.min(0.6, spin.angleX + dy * 0.006))
    // Smoothed release speed, so a flick keeps spinning after the pointer lets go.
    spin.velocity = spin.velocity * 0.6 + ((dx * 0.012) / dt) * 0.4
    p.lastX = event.clientX
    p.lastY = event.clientY
    p.lastTime = event.timeStamp
    repaintSpin()
  }
  const endPress = (event: PointerEvent<HTMLButtonElement>) => {
    const p = press.current,
      spin = spinRef.current
    if (p.id !== event.pointerId) return
    if (p.moved) {
      suppressClick.current = true
      // A pointer resting before release should not fling the mark.
      if (event.timeStamp - p.lastTime > 80) spin.velocity = 0
      spin.velocity = Math.max(-18, Math.min(18, spin.velocity))
      if (shouldReduceMotion) spin.velocity = 0
    }
    spin.dragging = false
    p.id = -1
    repaintSpin()
  }
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const spin = spinRef.current,
      direction = event.key === 'ArrowRight' ? 1 : -1
    if (shouldReduceMotion) spin.angleY += (direction * Math.PI) / 4
    else spin.velocity += direction * 8
    repaintSpin()
  }

  return (
    <motion.div className="hero-identity" variants={variants}>
      <HeroLogoScene
        reducedMotion={shouldReduceMotion}
        photoVisible={photoVisible}
        spinRef={spinRef}
      />
      {profile.profilePhotoUrl && (
        <button
          className="hero-identity-trigger"
          type="button"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPress}
          onPointerCancel={endPress}
          onKeyDown={onKeyDown}
          onClick={() => {
            if (suppressClick.current) {
              suppressClick.current = false
              return
            }
            setShowPhoto((value) => !value)
          }}
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

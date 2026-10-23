'use client'

import {useEffect, useRef, useState, useSyncExternalStore, type ReactNode} from 'react'
import {motion, useScroll, useTransform} from 'motion/react'
import {Check, Copy} from 'lucide-react'
import {useStudioReducedMotion} from './motion-text'

/** The footer panel grows from an inset card to the full viewport as it scrolls into view. */
export function FooterStage({children}: {children: ReactNode}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useStudioReducedMotion()
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start end', 'start start'],
  })
  const clipPath = useTransform(scrollYProgress, (p) => {
    const rest = 1 - Math.min(1, p)
    return `inset(${(rest * 28).toFixed(1)}px round ${(rest * 36).toFixed(1)}px)`
  })
  const lift = useTransform(scrollYProgress, [0, 1], [48, 0])
  return (
    <motion.div
      ref={ref}
      className="footer-stage"
      style={reduced ? undefined : {clipPath}}
    >
      <motion.div
        className="footer-stage-inner studio-wrap"
        style={reduced ? undefined : {y: lift}}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

const subscribeToMinutes = (notify: () => void) => {
  const timer = window.setInterval(notify, 15_000)
  return () => window.clearInterval(timer)
}

/** The current time where Oleksandr works; empty until hydrated so server and client agree. */
export function FooterClock({
  locale,
  label,
  note,
}: {
  locale: string
  label: string
  note: string
}) {
  const time = useSyncExternalStore(
    subscribeToMinutes,
    () =>
      new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : locale, {
        timeZone: 'Europe/Warsaw',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date()),
    () => '',
  )
  return (
    <p className="footer-clock">
      <span>{label}</span>
      <time>{time || '--:--'}</time>
      <span>{note}</span>
    </p>
  )
}

/** The email set large: one click copies it, with the result announced in place. */
export function CopyEmail({
  email,
  copyLabel,
  copiedLabel,
}: {
  email: string
  copyLabel: string
  copiedLabel: string
}) {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2200)
    return () => window.clearTimeout(timer)
  }, [copied])
  return (
    <button
      type="button"
      className="footer-email"
      data-copied={copied}
      aria-label={`${copyLabel}: ${email}`}
      onClick={() => {
        void navigator.clipboard
          ?.writeText(email)
          .then(() => setCopied(true))
          .catch(() => {})
      }}
    >
      <span className="footer-email-address">{email}</span>
      <span className="footer-email-status" aria-live="polite">
        {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
        {copied ? copiedLabel : copyLabel}
      </span>
    </button>
  )
}

/** A giant wordmark whose letters lift toward the pointer. Decorative; the name is in the copyright. */
export function FooterWordmark({text}: {text: string}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduced = useStudioReducedMotion()
  useEffect(() => {
    const root = ref.current
    if (!root || reduced || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const letters = [...root.querySelectorAll<HTMLElement>('span')]
    let frame = 0,
      pointerX = 0,
      inside = false
    const paint = () => {
      frame = 0
      for (const letter of letters) {
        const box = letter.getBoundingClientRect()
        const distance = Math.abs(pointerX - (box.left + box.width / 2))
        const lift = inside ? Math.max(0, 1 - distance / 220) : 0
        letter.style.setProperty('--lift', lift.toFixed(3))
      }
    }
    const move = (event: PointerEvent) => {
      pointerX = event.clientX
      inside = true
      if (!frame) frame = requestAnimationFrame(paint)
    }
    const leave = () => {
      inside = false
      if (!frame) frame = requestAnimationFrame(paint)
    }
    const area = root.parentElement ?? root
    area.addEventListener('pointermove', move)
    area.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      area.removeEventListener('pointermove', move)
      area.removeEventListener('pointerleave', leave)
    }
  }, [reduced])
  return (
    <p ref={ref} className="footer-wordmark" aria-hidden="true">
      {[...text].map((char, index) => (
        <span key={index}>{char === ' ' ? ' ' : char}</span>
      ))}
    </p>
  )
}

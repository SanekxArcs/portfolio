'use client'

import {useEffect, useRef} from 'react'
import {toast} from 'sonner'


import {useUIStore} from '@/hooks/use-ui-store'

export function WelcomeToast() {
  const {isReducedMotion} = useUIStore()
  const hasShownToast = useRef(false)
  const prevReducedMotion = useRef<boolean | null>(null)

  useEffect(() => {
    if (hasShownToast.current) return
    hasShownToast.current = true

    setTimeout(() => {
      const shouldShowReducedMessage = isReducedMotion

      const hasVisited = localStorage.getItem('has-visited-portfolio')

      let title = 'Welcome!'
      let message =
        'Hello! Greetings on my portfolio. Feel free to explore and welcome to contact me.'

      if (hasVisited) {
        title = 'Welcome back!'
        message = "Hello, you visited us again! I'm happy to see you."
      } else {
        localStorage.setItem('has-visited-portfolio', 'true')
      }

      const now = new Date()
      const isBirthdaySeason = now.getMonth() === 0 && [9, 10, 11].includes(now.getDate())
      if (isBirthdaySeason) {
        const birthdayMessages: Record<number, string> = {
          9: ' 🎂 Tomorrow is my birthday!',
          10: ' 🎂 Today is my birthday!',
          11: ' 🎂 Yesterday was my birthday!',
        }
        message += birthdayMessages[now.getDate()]

        if (!shouldShowReducedMessage && now.getDate() === 10) {
          void import('canvas-confetti').then(({default: confetti}) => confetti({
            particleCount: 150,
            spread: 70,
            origin: {y: 0.6},
          }))
        }
      }

      if (shouldShowReducedMessage) {
        toast.info(title, {
          description: `${message} I noticed you prefer reduced motion. You can enable animations by clicking the lightning icon in the navbar.`,
          duration: 8000,
        })
      } else {
        toast.success(title, {
          description: message,
          duration: 5000,
        })
      }
    }, 100)
  }, [isReducedMotion])

  useEffect(() => {
    if (prevReducedMotion.current === null) {
      prevReducedMotion.current = isReducedMotion
      return
    }
    if (prevReducedMotion.current === true && isReducedMotion === false) {
      toast.success('Animations enabled')
    }
    prevReducedMotion.current = isReducedMotion
  }, [isReducedMotion])

  return null
}

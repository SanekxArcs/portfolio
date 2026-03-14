'use client'

import * as React from 'react'
import {Moon, Sun} from 'lucide-react'
import {useTheme} from 'next-themes'

import {Button} from '@/components/ui/button'
import {useVibrationOnClick} from '@/hooks/use-vibration'

export function ModeToggle() {
  const {resolvedTheme, setTheme} = useTheme()
  const vibrate = useVibrationOnClick(40)
  const isDark = resolvedTheme !== 'light'

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = isDark ? 'light' : 'dark'
    const x = e.clientX
    const y = e.clientY

    if (!('startViewTransition' in document)) {
      setTheme(newTheme)
      return
    }

    const transition = document.startViewTransition(() => {
      setTheme(newTheme)
    })

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 400,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={(e) => {
        toggleTheme(e)
        vibrate()
      }}
      title='Toggle theme'
      aria-label='Toggle theme'
    >
      {isDark ? (
        <Moon className="size-4" />
      ) : (
        <Sun className="size-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

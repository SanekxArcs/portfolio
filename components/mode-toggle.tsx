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

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        toggleTheme()
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

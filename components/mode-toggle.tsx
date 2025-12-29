'use client'

import * as React from 'react'
import {MonitorCog, Moon, Sun} from 'lucide-react'
import {useTheme} from 'next-themes'

import {Button} from '@/components/ui/button'
import {useVibrationOnClick} from '@/hooks/use-vibration'

export function ModeToggle() {
  const {theme, setTheme} = useTheme()
  const vibrate = useVibrationOnClick(40)

  const toggleTheme = () => {
    const themes = ['system', 'dark', 'light']
    const currentIndex = themes.indexOf(theme || 'system')
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
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
      {theme === 'system' && <MonitorCog className="size-4" />}
      {theme === 'dark' && <Moon className="size-4" />}
      {theme === 'light' && <Sun className="size-4" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

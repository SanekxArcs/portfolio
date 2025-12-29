'use client'

import * as React from 'react'
import Link from 'next/link'
import {motion, AnimatePresence} from 'motion/react'
import {Menu, X, User, Briefcase, Cpu, FolderGit2, Zap, ZapOff, SnowflakeIcon} from 'lucide-react'

import {Button} from '@/components/ui/button'
import {ModeToggle} from '@/components/mode-toggle'
import GradualBlur from '@/components/GradualBlur'
import {ButtonGroup} from '@/components/ui/button-group'
import {useUIStore} from '@/hooks/use-ui-store'
import {useVibrationOnClick} from '@/hooks/use-vibration'
import {useSnowfallStore} from '@/lib/snowfallStore'
import {cn} from '@/lib/utils'
import {toast} from 'sonner'

const navLinks = [
  {href: '#about', label: 'About', icon: User},
  {href: '#experience', label: 'Experience', icon: Briefcase},
  {href: '#skills', label: 'Skills', icon: Cpu},
  {href: '#projects', label: 'Projects', icon: FolderGit2},
]

export function NavbarClient({logoUrl, name}: {logoUrl?: string | null; name?: string | null}) {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState<string>('')
  const {isReducedMotion, toggleReducedMotion} = useUIStore()
  const {isEnabled, toggleSnowfall} = useSnowfallStore()
  const vibrate = useVibrationOnClick(40)

  const initials = React.useMemo(() => {
    if (!name) return 'OD'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [name])

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      if (window.scrollY < 100) {
        setActiveSection('')
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    const sections = ['about', 'experience', 'skills', 'projects']
    sections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 bg-transparent transition-all duration-300',
        isScrolled ? 'py-3' : 'py-6',
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center text-xl font-bold tracking-tighter"
          aria-label="Home"
          onClick={() => {
            vibrate()
            toast.success('You already on a home page!', {duration: 1000})
          }}
        >
          <div
            className={cn(
              'relative flex size-8 items-center justify-center overflow-hidden',
              logoUrl ? 'bg-transparent' : 'rounded-lg bg-emerald-600 text-white',
            )}
          >
            {logoUrl ? (
              <div
                role="img"
                className="h-full w-full bg-linear-to-t from-emerald-950 to-emerald-900 transition-colors duration-300 dark:from-white dark:to-emerald-100"
                style={{
                  maskImage: `url(${logoUrl})`,
                  WebkitMaskImage: `url(${logoUrl})`,
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                }}
              />
            ) : (
              initials
            )}
          </div>
          <span
            className={cn(
              'inline-block transition-opacity',
              isScrolled ? 'opacity-100' : 'opacity-50',
            )}
          >
            .dev
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '')
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={vibrate}
                className={cn(
                  'group/nav relative flex items-center gap-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-muted-foreground hover:text-emerald-600',
                )}
              >
                <link.icon
                  className={cn(
                    'size-4 transition-transform duration-300',
                    isActive ? 'scale-110' : 'group-hover/nav:scale-110',
                  )}
                />
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -top-4.25 right-0 left-0 h-0.5 rounded-full bg-emerald-600 dark:bg-emerald-400"
                    transition={{type: 'spring', stiffness: 380, damping: 30}}
                  />
                )}
              </Link>
            )
          })}
          <div className="bg-border h-4 w-px" />
          <ButtonGroup>
            <Button
              variant="outline"
              className="relative"
              size="icon"
              onClick={() => {
                toggleSnowfall()
                vibrate()
              }}
               title={isReducedMotion ? 'Enable Snowfall' : 'Turn off Snowfall'}
              aria-label={isReducedMotion ? 'Enable Snowfall' : 'Turn off Snowfall'}
            >
              <SnowflakeIcon />
              {!isEnabled && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-px h-4 w-0.5 -rotate-45 border-r border-white bg-current dark:border-black" />
                </div>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => {
                toggleReducedMotion()
                vibrate()
              }}
              title={isReducedMotion ? 'Enable animations' : 'Reduce motion'}
              aria-label={isReducedMotion ? 'Enable animations' : 'Reduce motion'}
            >
              <Zap />
              {isReducedMotion && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-px h-4 w-0.5 -rotate-45 border-r border-white bg-current dark:border-black" />
                </div>
              )}
            </Button>
            <ModeToggle />
          </ButtonGroup>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ButtonGroup>
            <Button
              variant="outline"
              className="relative"
              size="icon"
              onClick={() => {
                toggleSnowfall()
                vibrate()
              }}
            >
              <SnowflakeIcon />
              {!isEnabled && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-px h-4 w-0.5 -rotate-45 border-r border-white bg-current dark:border-black" />
                </div>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => {
                toggleReducedMotion()
                vibrate()
              }}
              title={isReducedMotion ? 'Enable animations' : 'Reduce motion'}
              aria-label={isReducedMotion ? 'Enable animations' : 'Reduce motion'}
            >
              <Zap />
              {isReducedMotion && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-px h-4 w-0.5 -rotate-45 border-r border-white bg-current dark:border-black" />
                </div>
              )}
            </Button>
            <ModeToggle />
          </ButtonGroup>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen)
              vibrate()
            }}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{opacity: 1, y: '-200%'}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 1, y: '-200%'}}
            transition={{duration: 0.3}}
            className="absolute top-full right-0 left-0 flex flex-col items-end justify-end gap-4 border-b bg-transparent p-4 shadow-lg md:hidden"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex w-full items-center justify-end gap-2 rounded-md p-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'hover:bg-muted',
                  )}
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    vibrate()
                    toast.success(`Go to ${link.label} section`, {duration: 1000})
                  }}
                >
                  <link.icon className="size-4" />
                  {link.label}
                </Link>
              )
            })}
            <GradualBlur
              target="parent"
              position="bottom"
              height="100%"
              strength={2}
              divCount={10}
              curve="bezier"
              exponential={true}
              opacity={1}
              zIndex={-1}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <GradualBlur
        target="parent"
        position="top"
        height="6rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential={true}
        opacity={1}
        zIndex={-1}
      />
    </header>
  )
}

'use client'

import {MotionText} from '@/components/studio/motion-text'

import {AnimatePresence, motion} from 'motion/react'
import {smoothEase, useStudioReducedMotion} from './motion-text'

import {useEffect, useState} from 'react'
import {
  StudioLink as Link,
  useStudioTransition,
} from '@/components/studio/transitions'
import {usePathname} from 'next/navigation'
import {ArrowUpRight, Menu, X, Moon, Sun, Zap} from 'lucide-react'
import {useTheme} from 'next-themes'
import {BrandMark} from '@/components/brand-mark'
import {useUIStore} from '@/hooks/use-ui-store'
import {locales, languageLabels, type Locale} from '@/lib/i18n/locales'
import type {Dictionary} from '@/lib/i18n/dictionaries'

export function StudioHeader({
  locale,
  d,
  logo,
}: {
  locale: Locale
  d: Dictionary
  logo?: string | null
}) {
  const {run} = useStudioTransition()
  const pathname = usePathname()
  const reduced = useStudioReducedMotion()
  const [open, setOpen] = useState(false)
  const {resolvedTheme, setTheme} = useTheme()
  const {isReducedMotion, toggleReducedMotion} = useUIStore()
  const links = [
    ['/work', d.nav.work],
    ['/services', d.nav.services],
    ['/experience', d.nav.experience],
  ]
  useEffect(() => {
    if (!open) return
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        document.getElementById('studio-menu-button')?.focus()
      }
    }
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [open])
  return (
    <header className="studio-header">
      <div className="studio-header-inner">
        <Link
          href={`/${locale}`}
          className="studio-wordmark"
          aria-label={`O.D. EMPOWER — ${d.nav.home}`}
          onClick={() => setOpen(false)}
        >
          <BrandMark logoUrl={logo} threeD />
          <span className="-ml-2">.dev</span>
        </Link>
        <nav className="studio-desktop-nav" aria-label={d.nav.menu}>
          {links.map(([path, label]) => (
            <Link
              key={path}
              href={`/${locale}${path}`}
              aria-current={
                pathname.startsWith(`/${locale}${path}`) ? 'page' : undefined
              }
            >
              <MotionText name={`text-nav-${path.slice(1)}`} text={label} />
            </Link>
          ))}
        </nav>
        <div className="studio-header-tools">
          <div
            className="studio-languages"
            role="group"
            aria-label={d.nav.language}
          >
            {locales.map((language) => {
              const href = `/${language}${pathname.replace(/^\/(en|pl|uk)(?=\/|$)/, '')}`
              return (
                <Link
                  data-locale-link
                  key={language}
                  href={href}
                  hrefLang={language}
                  lang={language}
                  aria-current={language === locale ? 'true' : undefined}
                  onClick={(event) => {
                    document.cookie =
                      'portfolio-locale=' +
                      language +
                      ';path=/;max-age=31536000;samesite=lax'
                    event.currentTarget.href =
                      href + window.location.search + window.location.hash
                  }}
                >
                  {languageLabels[language]}
                </Link>
              )
            })}
          </div>
          <button
            className="studio-icon-button studio-motion-toggle"
            type="button"
            aria-label={d.nav.motion}
            title={d.nav.motion}
            aria-pressed={isReducedMotion}
            onClick={toggleReducedMotion}
          >
            <Zap size={15} />
          </button>
          <button
            className="studio-icon-button"
            type="button"
            aria-label={d.nav.theme}
            title={d.nav.theme}
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect()
              run(
                'theme',
                () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
                {
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
                },
              )
            }}
          >
            <Sun size={16} className="studio-sun" />
            <Moon size={16} className="studio-moon" />
          </button>
          <button
            id="studio-menu-button"
            className="studio-icon-button studio-menu-button"
            aria-label={open ? d.nav.close : d.nav.menu}
            aria-expanded={open}
            aria-controls="studio-mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="studio-mobile-nav-shell"
            initial={{height: 0, opacity: 0}}
            animate={{height: 'auto', opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: reduced ? 0 : 0.3, ease: smoothEase}}
          >
            <nav
              id="studio-mobile-nav"
              className="studio-mobile-nav"
              aria-label={d.nav.menu}
            >
              {[...links, ['/contact', d.nav.contact]].map(([path, label]) => (
                <Link
                  key={path}
                  href={`/${locale}${path}`}
                  aria-current={
                    pathname === `/${locale}${path}` ? 'page' : undefined
                  }
                  onClick={() => setOpen(false)}
                >
                  <MotionText name={`text-nav-${path.slice(1)}`} text={label} />
                  <ArrowUpRight size={20} />
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

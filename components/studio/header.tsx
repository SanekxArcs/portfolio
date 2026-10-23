'use client'

import {MotionText} from '@/components/studio/motion-text'

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'motion/react'
import {smoothEase, useStudioReducedMotion} from './motion-text'

import {useEffect, useLayoutEffect, useRef, useState} from 'react'
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
  contactLabels = [],
}: {
  locale: Locale
  d: Dictionary
  logo?: string | null
  /** The contact label in every language, so the action keeps one width across locales. */
  contactLabels?: string[]
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
  // The capsule plate appears once the page moves; the line inside it tracks reading progress.
  const {scrollY, scrollYProgress} = useScroll()
  const [scrolled, setScrolled] = useState(false)
  // The full-screen footer has its own links, so the header steps aside once it reaches the top.
  const [tucked, setTucked] = useState(false)
  useMotionValueEvent(scrollY, 'change', (value) => {
    setScrolled(value > 24)
    const stage = document.querySelector('.footer-stage')
    setTucked(!!stage && stage.getBoundingClientRect().top < 96)
  })
  // One spotlight glides between links: the hovered or focused one, else the current page.
  const [hovered, setHovered] = useState<string | null>(null)
  const current = links.find(([path]) =>
    pathname.startsWith(`/${locale}${path}`),
  )?.[0]
  const spotlight = hovered ?? current
  // The spotlight is one layer over the whole nav with a pill cut out by clip-path, measured
  // against the nav itself. It never depends on page scroll, so a route change cannot fling it.
  const navRef = useRef<HTMLElement>(null)
  const spotRef = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    const nav = navRef.current,
      spot = spotRef.current
    if (!nav || !spot) return
    const place = () => {
      const link = spotlight
        ? nav.querySelector<HTMLElement>(`[data-path="${spotlight}"]`)
        : null
      spot.style.opacity = link ? '1' : '0'
      if (!link) return
      const left = link.offsetLeft,
        right = nav.clientWidth - left - link.offsetWidth
      spot.style.clipPath = `inset(0 ${right}px 0 ${left}px round 12px)`
    }
    place()
    const resize = new ResizeObserver(place)
    resize.observe(nav)
    return () => resize.disconnect()
  }, [spotlight, locale])
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
    <header
      className="studio-header"
      data-scrolled={scrolled || open}
      data-tucked={tucked && !open}
    >
      <div className="studio-header-inner">
        <span className="studio-header-plate" aria-hidden="true">
          <motion.span
            className="studio-header-progress"
            style={{scaleX: scrollYProgress}}
          />
        </span>
        <Link
          href={`/${locale}`}
          className="studio-wordmark"
          aria-label={`O.D. EMPOWER — ${d.nav.home}`}
          onClick={() => setOpen(false)}
        >
          <BrandMark logoUrl={logo} threeD />
          <span className="-ml-2">.dev</span>
        </Link>
        <nav
          ref={navRef}
          className="studio-desktop-nav"
          aria-label={d.nav.menu}
          onPointerLeave={() => setHovered(null)}
        >
          <span
            ref={spotRef}
            className="studio-nav-spotlight"
            data-reduced={reduced}
            aria-hidden="true"
          />
          {links.map(([path, label]) => (
            <Link
              key={path}
              href={`/${locale}${path}`}
              data-path={path}
              aria-current={current === path ? 'page' : undefined}
              onPointerEnter={() => setHovered(path)}
              onFocus={() => setHovered(path)}
              onBlur={() => setHovered(null)}
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
                  {language === locale && (
                    <span
                      className="studio-language-thumb"
                      aria-hidden="true"
                    />
                  )}
                  <span>{languageLabels[language]}</span>
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
          <Link
            href={`/${locale}/contact`}
            className="studio-header-cta"
            aria-current={
              pathname.startsWith(`/${locale}/contact`) ? 'page' : undefined
            }
          >
            <span className="studio-header-cta-label">
              <MotionText name="text-header-contact" text={d.nav.contact} />
              {contactLabels
                .filter((label) => label !== d.nav.contact)
                .map((label) => (
                  <span key={label} aria-hidden="true">
                    {label}
                  </span>
                ))}
            </span>
          </Link>
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
                  <MotionText
                    name={`text-mobile-nav-${path.slice(1)}`}
                    text={label}
                  />
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

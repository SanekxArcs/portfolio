'use client'

import {
  createContext,
  useContext,
  useRef,
  useLayoutEffect,
  useTransition,
  useSyncExternalStore,
  ViewTransition,
  addTransitionType,
  type ComponentProps,
  type ReactNode,
} from 'react'
import {flushSync} from 'react-dom'
import NextLink from 'next/link'
import {usePathname, useRouter} from 'next/navigation'
import {LayoutGroup, motion} from 'motion/react'
import {useTheme} from 'next-themes'
import {useStudioReducedMotion} from './motion-text'

type ChangeKind = 'page' | 'language' | 'theme'
type WaveOrigin = {x: number; y: number}
type PendingWave = {
  origin: WaveOrigin
  rect: DOMRect
  tiltX: string
  tiltY: string
  radius: string
  scroll?: {x: number; y: number}
}
declare global {
  interface Window {
    __portfolioWave?: PendingWave
  }
}

function applyPageGeometry() {
  const wave = window.__portfolioWave
  const page = document.getElementById('studio-shell')
  if (!wave || !page) return
  const rect = page.getBoundingClientRect()
  const root = document.documentElement
  const values: Record<string, string> = {
    x: wave.origin.x - rect.left + 'px',
    y: wave.origin.y - rect.top + 'px',
    'old-x': wave.rect.left - rect.left + 'px',
    'old-y': wave.rect.top - rect.top + 'px',
    'old-height': wave.rect.height + 'px',
    'old-width': wave.rect.width + 'px',
    'old-origin-x': wave.origin.x - wave.rect.left + 'px',
    'old-origin-y': wave.origin.y - wave.rect.top + 'px',
    'tilt-x': wave.tiltX,
    'tilt-y': wave.tiltY,
    radius: wave.radius,
  }
  for (const [key, value] of Object.entries(values))
    root.style.setProperty('--page-wave-' + key, value)
}
function animatePageGeometry() {
  applyPageGeometry()
  const wave = window.__portfolioWave
  if (!wave) return
  const clear = () => {
    if (window.__portfolioWave === wave) delete window.__portfolioWave
  }
  const active = document.activeViewTransition
  if (active) void active.finished.then(clear, clear)
  else window.setTimeout(clear, 900)
}

type Coordinator = {
  run: (kind: ChangeKind, update: () => void, origin?: WaveOrigin) => void
  pending: boolean
}
const TransitionContext = createContext<Coordinator>({
  run: (_kind, update) => update(),
  pending: false,
})
export const useStudioTransition = () => useContext(TransitionContext)

/** React waits for the actual RSC commit, fonts and layout before taking the new snapshot. */
export function StudioTransitions({
  children,
  chrome,
  locale,
}: {
  children: ReactNode
  chrome?: ReactNode
  locale: string
}) {
  const [pending, begin] = useTransition()
  const pathname = usePathname()
  useLayoutEffect(() => {
    const scroll = window.__portfolioWave?.scroll
    if (scroll)
      window.scrollTo({left: scroll.x, top: scroll.y, behavior: 'instant'})
    applyPageGeometry()
  }, [pathname])
  const themeWave = useRef<ReturnType<Document['startViewTransition']> | null>(
    null,
  )
  const reduced = useStudioReducedMotion()
  const {resolvedTheme} = useTheme()
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  useLayoutEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  useLayoutEffect(() => {
    if (!resolvedTheme) return
    // Apply inside the commit, before React captures the new view. next-themes persists the setting.
    const root = document.documentElement
    root.classList.toggle('dark', resolvedTheme === 'dark')
    root.classList.toggle('light', resolvedTheme === 'light')
    root.style.colorScheme = resolvedTheme
  }, [resolvedTheme])
  const run = (kind: ChangeKind, update: () => void, origin?: WaveOrigin) => {
    // A scroll already in flight must not move sticky elements between snapshots.
    window.scrollTo({
      left: window.scrollX,
      top: window.scrollY,
      behavior: 'instant',
    })
    themeWave.current?.skipTransition()
    themeWave.current = null
    delete document.documentElement.dataset.themeWave
    if (kind === 'theme') {
      // Synchronous theme updates use one viewport snapshot, including the 3D canvas.
      // They stay outside React's concurrent route/text transitions.
      if (
        reduced ||
        !document.startViewTransition ||
        !CSS.supports('clip-path', 'circle(0px at 0px 0px)')
      ) {
        flushSync(update)
        return
      }
      document.activeViewTransition?.skipTransition()
      const root = document.documentElement
      const x = origin?.x ?? innerWidth / 2
      const y = origin?.y ?? innerHeight / 2
      root.style.setProperty('--theme-wave-x', x + 'px')
      root.style.setProperty('--theme-wave-y', y + 'px')
      root.style.setProperty(
        '--theme-wave-radius',
        Math.ceil(
          Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)),
        ) + 'px',
      )
      root.dataset.themeWave = 'true'
      const transition = document.startViewTransition(() => flushSync(update))
      themeWave.current = transition
      void transition.ready.catch(() => {})
      void transition.finished
        .finally(() => {
          if (themeWave.current !== transition) return
          themeWave.current = null
          delete root.dataset.themeWave
        })
        .catch(() => {})
      return
    }
    delete window.__portfolioWave
    if (
      (kind === 'page' || kind === 'language') &&
      !reduced &&
      typeof document.startViewTransition === 'function'
    ) {
      const rect = document
        .getElementById('studio-shell')
        ?.getBoundingClientRect()
      const point = origin ?? {x: innerWidth / 2, y: innerHeight / 2}
      const depth = innerWidth < 760 ? 1.6 : 2.8
      if (rect)
        window.__portfolioWave = {
          origin: point,
          rect,
          tiltX: ((point.y / innerHeight - 0.5) * -depth).toFixed(2) + 'deg',
          tiltY: ((point.x / innerWidth - 0.5) * depth).toFixed(2) + 'deg',
          radius:
            Math.ceil(
              Math.hypot(
                Math.max(point.x, innerWidth - point.x),
                Math.max(point.y, innerHeight - point.y),
              ),
            ) + 'px',
          scroll: kind === 'language' ? {x: scrollX, y: scrollY} : undefined,
        }
    }
    begin(() => {
      if (!reduced) addTransitionType(kind === 'language' ? 'page' : kind)
      update()
    })
  }
  return (
    <TransitionContext.Provider value={{run, pending}}>
      {chrome}
      <ViewTransition
        name="studio-shell"
        onUpdate={animatePageGeometry}
        onShare={animatePageGeometry}
        default="none"
        share={reduced ? 'none' : {page: 'vt-page', default: 'none'}}
        update={
          reduced
            ? 'none'
            : {theme: 'vt-theme', page: 'vt-page', default: 'none'}
        }
      >
        <div
          id="studio-shell"
          className="studio-shell"
          data-theme={hydrated ? resolvedTheme : undefined}
        >
          <LayoutGroup id="studio">{children}</LayoutGroup>
        </div>
      </ViewTransition>
      <motion.div
        className="studio-navigation-progress"
        aria-hidden="true"
        initial={false}
        animate={{opacity: pending ? 1 : 0, scaleX: pending ? 0.8 : 1}}
        transition={{duration: pending ? 0.8 : 0.18}}
      />
    </TransitionContext.Provider>
  )
}

export function ViewRegion({
  children,
  name,
  kind = 'page',
}: {
  children: ReactNode
  name: string
  kind?: 'page' | 'chrome'
}) {
  const reduced = useStudioReducedMotion()
  return (
    <ViewTransition
      name={name}
      default="none"
      update={
        reduced
          ? 'none'
          : {
              theme: 'none',
              page: name === 'studio-header' ? 'vt-stable-chrome' : 'none',
              language: kind === 'page' ? 'vt-language' : 'vt-chrome',
              default: kind === 'page' ? 'vt-page' : 'none',
            }
      }
      enter={
        reduced
          ? 'none'
          : {page: 'none', language: 'vt-language', default: 'vt-page'}
      }
      exit={
        reduced
          ? 'none'
          : {page: 'none', language: 'vt-language', default: 'vt-page'}
      }
      share={
        reduced
          ? 'none'
          : {
              theme: 'none',
              language: kind === 'page' ? 'vt-language' : 'vt-chrome',
              page: kind === 'chrome' ? 'vt-stable-chrome' : 'none',
              default: 'vt-page',
            }
      }
    >
      {children}
    </ViewTransition>
  )
}

/** Preserve Next's normal link semantics; animation never delays or hides the outgoing page. */
export function StudioLink({
  onNavigate,
  onClick,
  onPointerEnter,
  onFocus,
  onTouchStart,
  prefetch,
  ...props
}: ComponentProps<typeof NextLink>) {
  const reduced = useStudioReducedMotion()
  const clickOrigin = useRef<WaveOrigin | undefined>(undefined)
  const prefetched = useRef(false)
  const router = useRouter(),
    {run} = useStudioTransition()
  // Pages prefetch on intent (hover, focus, touch) instead of for every link in view, so a
  // slow phone is not downloading every language and project nobody has opened.
  const intent = () => {
    if (prefetched.current || prefetch === false || typeof props.href !== 'string') return
    const url = new URL(props.href, location.href)
    if (url.origin !== location.origin) return
    prefetched.current = true
    router.prefetch(url.pathname + url.search)
  }
  return (
    <NextLink
      {...props}
      prefetch={prefetch === true}
      onPointerEnter={(event) => {
        onPointerEnter?.(event)
        intent()
      }}
      onFocus={(event) => {
        onFocus?.(event)
        intent()
      }}
      onTouchStart={(event) => {
        onTouchStart?.(event)
        intent()
      }}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        const rect = event.currentTarget.getBoundingClientRect()
        clickOrigin.current =
          event.detail === 0
            ? {x: rect.left + rect.width / 2, y: rect.top + rect.height / 2}
            : {x: event.clientX, y: event.clientY}
      }}
      onNavigate={(event) => {
        let cancelled = false
        onNavigate?.({
          preventDefault: () => {
            cancelled = true
            event.preventDefault()
          },
        })
        if (cancelled) return
        if (typeof props.href !== 'string') return
        const url = new URL(props.href, location.href)
        if (url.origin !== location.origin) return
        const language = !!(props as Record<string, unknown>)[
          'data-locale-link'
        ]
        if (language) {
          url.search = location.search
          url.hash = location.hash
          document.cookie = `portfolio-locale=${url.pathname.split('/')[1]};path=/;max-age=31536000;samesite=lax`
        }
        if (
          url.pathname === location.pathname &&
          url.search === location.search
        ) {
          if (!url.hash) {
            event.preventDefault()
            if (location.hash)
              window.history.replaceState(
                window.history.state,
                '',
                url.pathname + url.search,
              )
            window.scrollTo({
              left: 0,
              top: 0,
              behavior: reduced ? 'instant' : 'smooth',
            })
          }
          return
        }
        event.preventDefault()
        run(
          language ? 'language' : 'page',
          () =>
            router.push(url.pathname + url.search + url.hash, {
              scroll: language ? false : (props.scroll ?? true),
            }),
          clickOrigin.current,
        )
      }}
    />
  )
}

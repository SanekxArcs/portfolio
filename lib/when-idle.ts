/**
 * Runs decorative work once the page has loaded and the main thread is idle, so 3D scenes and
 * canvases never compete with the first paint or the first interaction. Returns a cancel.
 */
export function whenIdle(run: () => void, timeout = 2500) {
  let cancelled = false,
    idle = 0,
    timer = 0
  const go = () => {
    if (!cancelled) run()
  }
  const schedule = () => {
    if (cancelled) return
    // Safari has no requestIdleCallback; a short timeout after load stands in for it.
    if (typeof window.requestIdleCallback === 'function')
      idle = window.requestIdleCallback(go, {timeout})
    else timer = window.setTimeout(go, 200)
  }
  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule, {once: true})
  return () => {
    cancelled = true
    window.removeEventListener('load', schedule)
    if (idle && typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idle)
    window.clearTimeout(timer)
  }
}

const engagement = ['pointerdown', 'touchstart', 'keydown', 'scroll', 'wheel'] as const

/**
 * Like whenIdle, but waits for the visitor's first touch, scroll or key press. Used on touch
 * devices for the 3D scenes: the flat mark stands in until someone engages, so a glance at the
 * page never downloads or builds the WebGL library.
 */
export function whenEngaged(run: () => void, timeout = 2500) {
  let cancelIdle: (() => void) | undefined
  const engage = () => {
    for (const type of engagement) window.removeEventListener(type, engage)
    cancelIdle = whenIdle(run, timeout)
  }
  for (const type of engagement) window.addEventListener(type, engage, {passive: true, once: true})
  return () => {
    for (const type of engagement) window.removeEventListener(type, engage)
    cancelIdle?.()
  }
}

/** Phones and tablets: no hover, so pointer-following effects have nothing to follow. */
export const isCoarsePointer = () =>
  typeof window !== 'undefined' &&
  matchMedia('(hover: none), (pointer: coarse)').matches

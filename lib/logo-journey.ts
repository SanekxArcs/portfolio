export type LogoPose = {x: number; y: number; size: number; progress: number}
export type JourneyBounds = {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}
export type LogoJourney = LogoPose & {
  journey: number
  front: boolean
  phase: 'hero' | 'background' | 'departure' | 'gutter' | 'arrival' | 'docked'
  safe?: {edge: number; left: number; top: number; bottom: number}
}
const clamp = (n: number) => Math.max(0, Math.min(1, n))
const ease = (n: number) => {
  const t = clamp(n)
  return t * t * (3 - 2 * t)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const cubic = (a: number, b: number, c: number, d: number, t: number) =>
  (1 - t) ** 3 * a +
  3 * (1 - t) ** 2 * t * b +
  3 * (1 - t) * t * t * c +
  t ** 3 * d

/** Leave in the background; enter the foreground only in the outer gutter and reserved dock. */
export function logoJourney(
  base: LogoPose,
  surface: JourneyBounds,
  dock: JourneyBounds,
  viewport: {width: number; height: number; scroll: number; maxScroll: number},
  reduced = false,
): LogoJourney {
  const {width, height, scroll, maxScroll} = viewport
  const documentTop = surface.top + scroll
  // The final surface must enter the viewport before the sculpture leaves its
  // background pose. Keep the entire detour within this section's arrival.
  const start = Math.max(0, documentTop - height * 0.98)
  const end = Math.max(start + 1, Math.min(maxScroll, documentTop - height * 0.3))
  const p = clamp((scroll - start) / Math.max(1, end - start))
  const dockSize = Math.min(dock.width, dock.height)
  const destination = {
    x: dock.left + dock.width / 2,
    y: dock.top + dock.height / 2,
    size: dockSize,
    progress: 0,
  }
  const safe = {
    edge: surface.right + 2,
    left: dock.left - 12,
    top: Math.min(surface.top - 120, dock.top - 12),
    // The large dock intentionally overhangs the card. Its full bounds stay
    // foreground-safe after the smoothed size reaches its final value.
    bottom: width < 760
      ? dock.bottom + 12
      : Math.max(surface.bottom + 16, dock.bottom + 12),
  }
  if (reduced)
    return p < 1
      ? {...base, journey: p, front: false, phase: 'background'}
      : {...destination, journey: p, front: true, phase: 'docked', safe}
  if (p <= 0)
    return {
      ...base,
      journey: 0,
      front: false,
      phase: base.progress < 0.99 ? 'hero' : 'background',
    }
  const gutter = Math.max(12, width - surface.right)
  const transitSize = Math.min(90, gutter * 0.8)
  const gutterX = surface.right + gutter / 2
  const startY = surface.top - transitSize / 2 - 24
  if (p < 0.42) {
    const t = ease(p / 0.42)
    return {
      x: lerp(base.x, gutterX, t),
      y: lerp(base.y, height * 0.5, t),
      size: lerp(base.size, transitSize, t),
      progress: base.progress,
      journey: p,
      front: false,
      phase: 'departure',
      safe,
    }
  }
  if (p < 0.72) {
    const t = ease((p - 0.42) / 0.3)
    return {
      x: gutterX,
      y: lerp(height * 0.5, startY, t),
      size: transitSize,
      progress: 1 - ease((p - 0.42) / 0.2),
      journey: p,
      front: true,
      phase: 'gutter',
      safe,
    }
  }
  const t = ease((p - 0.72) / 0.28)
  return {
    x: cubic(
      gutterX,
      gutterX,
      destination.x + dockSize * 0.4,
      destination.x,
      t,
    ),
    y: cubic(
      startY,
      surface.top,
      destination.y - dockSize * 0.15,
      destination.y,
      t,
    ),
    size: lerp(transitSize, dockSize, t),
    progress: 0,
    journey: p,
    front: true,
    phase: p >= 1 ? 'docked' : 'arrival',
    safe,
  }
}

/** Account for the visible orbit envelope, not just the center of the sculpture. */
export function canLiftLogo(pose: LogoPose, safe: LogoJourney['safe']) {
  if (!safe) return false
  const radius = pose.size * 0.47
  return (
    pose.x - radius >= safe.edge ||
    (pose.x - radius >= safe.left &&
      pose.y - radius >= safe.top &&
      pose.y + radius <= safe.bottom)
  )
}

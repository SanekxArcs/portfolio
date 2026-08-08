'use client'

import * as React from 'react'

export interface ParticleScrollOptions {
  point?: number
  band?: number
  density?: number
  size?: number
  spread?: number
  gravity?: number
  drift?: number
  swirl?: number
  stagger?: number
  fade?: number
  settle?: number
  smoothing?: number
}

export interface ParticleScrollProps extends ParticleScrollOptions {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const defaults: Required<ParticleScrollOptions> = {
  point: 0.68, band: 420, density: 2, size: 1.25, spread: 220,
  gravity: 0.35, drift: 0.7, swirl: 60, stagger: 0.7, fade: 0.85,
  settle: 1.2, smoothing: 0.6,
}

function noise(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/** A cross-browser particle reveal. Content remains semantic HTML; the canvas is decorative. */
export function ParticleScroll({ children, className, style, ...input }: ParticleScrollProps) {
  const options = { ...defaults, ...input }
  const root = React.useRef<HTMLDivElement>(null)
  const canvas = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const host = root.current
    const surface = canvas.current
    if (!host || !surface) return
    const ctx = surface.getContext('2d')
    if (!ctx) return
    let frame = 0
    let time = 0
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const draw = (now: number) => {
      time = now / 1000
      const rect = host.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.round(rect.width * dpr))
      const height = Math.max(1, Math.round(rect.height * dpr))
      if (surface.width !== width || surface.height !== height) {
        surface.width = width; surface.height = height
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, rect.width, rect.height)
      const line = rect.height * options.point
      const band = Math.max(80, options.band)
      const step = Math.max(3, options.density * 3)
      for (let y = 0, row = 0; y < rect.height; y += step, row++) {
        const progress = Math.max(0, Math.min(1, (line + band - y) / band))
        if (progress >= 1) continue
        for (let x = 0, col = 0; x < rect.width; x += step, col++) {
          const seed = row * 1009 + col * 67
          const delay = noise(seed) * options.stagger
          const p = Math.max(0, Math.min(1, (progress - delay) / Math.max(.01, 1 - delay)))
          if (p >= 1 || noise(seed + 3) > .72) continue
          const drift = reduced.matches ? 0 : Math.sin(time * (1 + options.drift) + seed) * options.drift * 2
          const scatter = (1 - p) * options.spread * (0.35 + noise(seed + 5) * .65)
          const px = x + (noise(seed + 7) - .5) * scatter + drift
          const py = y + (noise(seed + 11) - .5) * scatter + scatter * options.gravity
          const alpha = options.fade * (1 - p) * .75
          ctx.fillStyle = `rgba(125, 211, 252, ${alpha})`
          ctx.fillRect(px, py, Math.max(.7, options.size), Math.max(.7, options.size))
        }
      }
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    const resize = new ResizeObserver(() => {})
    resize.observe(host)
    return () => { cancelAnimationFrame(frame); resize.disconnect() }
  }, [options.band, options.density, options.drift, options.fade, options.gravity, options.point, options.size, options.spread, options.stagger])

  return <div ref={root} className={className} style={{ position: 'relative', ...style }}>
    <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    <canvas ref={canvas} aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }} />
  </div>
}

export default ParticleScroll

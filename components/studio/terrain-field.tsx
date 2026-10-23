'use client'

import {useEffect, useRef, useSyncExternalStore} from 'react'
import {createPortal} from 'react-dom'
import {useStudioReducedMotion} from './motion-text'

/** Classic 3D gradient noise; a fixed permutation keeps the map identical between visits. */
const perm = (() => {
  const p = Array.from({length: 256}, (_, i) => i)
  let seed = 7
  for (let i = 255; i > 0; i--) {
    seed = (seed * 16807) % 2147483647
    const j = seed % (i + 1)
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  return Uint8Array.from([...p, ...p])
})()
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
const lerp = (a: number, b: number, t: number) => a + t * (b - a)
const grad = (hash: number, x: number, y: number, z: number) => {
  const h = hash & 15,
    u = h < 8 ? x : y,
    v = h < 4 ? y : h === 12 || h === 14 ? x : z
  return (h & 1 ? -u : u) + (h & 2 ? -v : v)
}
function noise(x: number, y: number, z: number) {
  const X = Math.floor(x) & 255,
    Y = Math.floor(y) & 255,
    Z = Math.floor(z) & 255
  x -= Math.floor(x)
  y -= Math.floor(y)
  z -= Math.floor(z)
  const u = fade(x),
    v = fade(y),
    w = fade(z)
  const A = perm[X] + Y,
    AA = perm[A] + Z,
    AB = perm[A + 1] + Z,
    B = perm[X + 1] + Y,
    BA = perm[B] + Z,
    BB = perm[B + 1] + Z
  return lerp(
    lerp(
      lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u),
      lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u),
      v,
    ),
    lerp(
      lerp(grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1), u),
      lerp(grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1), u),
      v,
    ),
    w,
  )
}

const noSubscribe = () => () => {}

const CELL = 18
const LEVELS = 14
const LEVEL_STEP = 0.09
const HILL_RADIUS = 170

/**
 * A living contour map behind the site: the terrain drifts, scrolling reshapes it and
 * the pointer raises a hill that follows with a lag. Decorative; static in reduced motion.
 */
export function TerrainField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useStudioReducedMotion()
  // Inside the shell, above its opaque surface and below the logo backdrop.
  const shell = useSyncExternalStore(
    noSubscribe,
    () => document.getElementById('studio-shell'),
    () => null,
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let width = 0,
      height = 0,
      cols = 0,
      rows = 0,
      values = new Float32Array(0),
      frame = 0,
      last = 0,
      time = 0,
      color = '#087c57',
      strength = 1
    const pointer = {x: -9999, y: -9999, tx: -9999, ty: -9999, lift: 0, targetLift: 0}
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches

    const sample = () => {
      const z = time * 0.035 + scrollY * 0.00022
      const r2 = HILL_RADIUS * HILL_RADIUS
      for (let j = 0; j <= rows; j++) {
        const y = j * CELL
        for (let i = 0; i <= cols; i++) {
          const x = i * CELL
          let v =
            noise(x / 520, y / 520, z) * 0.95 +
            noise(x / 190 + 40, y / 190, z * 1.6) * 0.3
          if (pointer.lift > 0.001) {
            const dx = x - pointer.x,
              dy = y - pointer.y
            v += pointer.lift * 0.5 * Math.exp(-(dx * dx + dy * dy) / r2)
          }
          values[j * (cols + 1) + i] = v
        }
      }
    }

    // Marching squares: one path for ordinary contours, one for every fourth (index) line.
    const paint = () => {
      sample()
      ctx.clearRect(0, 0, width, height)
      const thin = new Path2D(),
        index = new Path2D()
      const stride = cols + 1
      for (let level = 0; level < LEVELS; level++) {
        const threshold = (level - LEVELS / 2) * LEVEL_STEP
        const path = level % 4 === 0 ? index : thin
        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const a = values[j * stride + i],
              b = values[j * stride + i + 1],
              c = values[(j + 1) * stride + i + 1],
              d = values[(j + 1) * stride + i]
            const code =
              (a > threshold ? 8 : 0) |
              (b > threshold ? 4 : 0) |
              (c > threshold ? 2 : 0) |
              (d > threshold ? 1 : 0)
            if (code === 0 || code === 15) continue
            const x = i * CELL,
              y = j * CELL
            const top = () => [x + ((threshold - a) / (b - a)) * CELL, y] as const
            const right = () => [x + CELL, y + ((threshold - b) / (c - b)) * CELL] as const
            const bottom = () => [x + ((threshold - d) / (c - d)) * CELL, y + CELL] as const
            const left = () => [x, y + ((threshold - a) / (d - a)) * CELL] as const
            const line = (p: readonly [number, number], q: readonly [number, number]) => {
              path.moveTo(p[0], p[1])
              path.lineTo(q[0], q[1])
            }
            switch (code) {
              case 1: case 14: line(left(), bottom()); break
              case 2: case 13: line(bottom(), right()); break
              case 3: case 12: line(left(), right()); break
              case 4: case 11: line(top(), right()); break
              case 6: case 9: line(top(), bottom()); break
              case 7: case 8: line(left(), top()); break
              case 5: line(left(), top()); line(bottom(), right()); break
              case 10: line(top(), right()); line(left(), bottom()); break
            }
          }
        }
      }
      ctx.strokeStyle = color
      ctx.lineWidth = 0.8
      ctx.globalAlpha = 0.07 * strength
      ctx.stroke(thin)
      ctx.lineWidth = 1.1
      ctx.globalAlpha = 0.15 * strength
      ctx.stroke(index)
      ctx.globalAlpha = 1
    }

    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
      last = 0
    }
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate)
      if (last && now - last < 33) return
      const dt = last ? Math.min((now - last) / 1000, 0.06) : 0
      last = now
      time += dt
      pointer.x = pointer.x < -999 ? pointer.tx : lerp(pointer.x, pointer.tx, 0.07)
      pointer.y = pointer.y < -999 ? pointer.ty : lerp(pointer.y, pointer.ty, 0.07)
      pointer.lift = lerp(pointer.lift, pointer.targetLift, 0.05)
      paint()
    }
    const start = () => {
      stop()
      if (reduced) paint()
      else if (!document.hidden) frame = requestAnimationFrame(animate)
    }
    const resize = () => {
      width = innerWidth
      height = innerHeight
      cols = Math.ceil(width / CELL)
      rows = Math.ceil(height / CELL)
      values = new Float32Array((cols + 1) * (rows + 1))
      const dpr = Math.min(devicePixelRatio, 1.5)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      paint()
    }
    const theme = () => {
      const style = getComputedStyle(canvas)
      color = style.getPropertyValue('--studio-green').trim() || color
      strength = Number.parseFloat(style.getPropertyValue('--terrain-strength')) || 1
      paint()
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      pointer.tx = event.clientX
      pointer.ty = event.clientY
      pointer.targetLift = 1
    }
    const leave = () => {
      pointer.targetLift = 0
    }
    const scrolled = () => {
      if (reduced) paint()
    }

    const themeObserver = new MutationObserver(theme)
    themeObserver.observe(document.documentElement, {attributes: true, attributeFilter: ['class']})
    addEventListener('resize', resize)
    addEventListener('scroll', scrolled, {passive: true})
    document.addEventListener('visibilitychange', start)
    if (finePointer && !reduced) {
      addEventListener('pointermove', move, {passive: true})
      document.documentElement.addEventListener('pointerleave', leave)
    }
    resize()
    theme()
    start()
    return () => {
      stop()
      themeObserver.disconnect()
      removeEventListener('resize', resize)
      removeEventListener('scroll', scrolled)
      document.removeEventListener('visibilitychange', start)
      removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [reduced, shell])

  if (!shell) return null
  return createPortal(
    <canvas ref={canvasRef} className="studio-terrain" aria-hidden="true" />,
    shell,
  )
}

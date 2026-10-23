'use client'

import {useEffect, useRef, useSyncExternalStore} from 'react'
import {createPortal} from 'react-dom'
import {useStudioReducedMotion} from './motion-text'
import {isCoarsePointer, whenIdle} from '@/lib/when-idle'

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
      strength = 1,
      scrollFrame = 0,
      lastScrollPaint = 0
    const pointer = {x: -9999, y: -9999, tx: -9999, ty: -9999, lift: 0, targetLift: 0}
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches
    // Touch screens have no pointer hill to follow: draw a still map that reshapes on scroll,
    // on a coarser grid, instead of drifting every frame.
    const still = reduced || isCoarsePointer()
    const cell = still && !reduced ? CELL * 1.4 : CELL

    const sample = () => {
      const z = time * 0.035 + scrollY * 0.00022
      const r2 = HILL_RADIUS * HILL_RADIUS
      for (let j = 0; j <= rows; j++) {
        const y = j * cell
        for (let i = 0; i <= cols; i++) {
          const x = i * cell
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
            // Edge crossings as plain numbers: no per-cell allocations on the hot path.
            const x = i * cell,
              y = j * cell,
              topX = x + ((threshold - a) / (b - a)) * cell,
              rightY = y + ((threshold - b) / (c - b)) * cell,
              bottomX = x + ((threshold - d) / (c - d)) * cell,
              leftY = y + ((threshold - a) / (d - a)) * cell,
              right = x + cell,
              bottom = y + cell
            switch (code) {
              case 1: case 14: path.moveTo(x, leftY); path.lineTo(bottomX, bottom); break
              case 2: case 13: path.moveTo(bottomX, bottom); path.lineTo(right, rightY); break
              case 3: case 12: path.moveTo(x, leftY); path.lineTo(right, rightY); break
              case 4: case 11: path.moveTo(topX, y); path.lineTo(right, rightY); break
              case 6: case 9: path.moveTo(topX, y); path.lineTo(bottomX, bottom); break
              case 7: case 8: path.moveTo(x, leftY); path.lineTo(topX, y); break
              case 5:
                path.moveTo(x, leftY); path.lineTo(topX, y)
                path.moveTo(bottomX, bottom); path.lineTo(right, rightY)
                break
              case 10:
                path.moveTo(topX, y); path.lineTo(right, rightY)
                path.moveTo(x, leftY); path.lineTo(bottomX, bottom)
                break
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
      if (still) paint()
      else if (!document.hidden) frame = requestAnimationFrame(animate)
    }
    const resize = () => {
      width = innerWidth
      height = innerHeight
      cols = Math.ceil(width / cell)
      rows = Math.ceil(height / cell)
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
    // A still map repaints while scrolling at most ~12 times a second.
    const scrolled = () => {
      if (!still || scrollFrame) return
      scrollFrame = requestAnimationFrame((now) => {
        scrollFrame = 0
        if (now - lastScrollPaint < 80) return scrolled()
        lastScrollPaint = now
        paint()
      })
    }

    const themeObserver = new MutationObserver(theme)
    // Nothing is drawn until the page has loaded and gone idle.
    const cancelIdle = whenIdle(() => {
      themeObserver.observe(document.documentElement, {attributes: true, attributeFilter: ['class']})
      addEventListener('resize', resize)
      addEventListener('scroll', scrolled, {passive: true})
      document.addEventListener('visibilitychange', start)
      if (finePointer && !still) {
        addEventListener('pointermove', move, {passive: true})
        document.documentElement.addEventListener('pointerleave', leave)
      }
      const style = getComputedStyle(canvas)
      color = style.getPropertyValue('--studio-green').trim() || color
      strength = Number.parseFloat(style.getPropertyValue('--terrain-strength')) || 1
      resize()
      start()
    })
    return () => {
      cancelIdle()
      cancelAnimationFrame(scrollFrame)
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

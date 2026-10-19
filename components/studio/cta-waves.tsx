'use client'

import {useEffect, useRef} from 'react'
import {useStudioReducedMotion} from './motion-text'

/** A projected ripple surface: decorative, paused offscreen, static in reduced motion. */
export function CtaWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useStudioReducedMotion()
  const elapsed = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let width = 0,
      height = 0,
      frame = 0,
      last = 0,
      visible = false
    let color = '#087c57'
    const paint = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = color
      ctx.lineWidth = 0.8
      const scale = Math.min(width / 2.5, height / 1.45)
      const project = (u: number, v: number) => {
        const radius = Math.hypot(u, v)
        const wave =
          Math.sin(radius * 7 - elapsed.current * 1.4) *
            0.13 *
            Math.exp(-radius * 0.35) +
          Math.sin(u * 3 + elapsed.current * 0.55) * 0.035
        const perspective = 1 / (1 + v * 0.16)
        return [
          width * 0.54 + (u * 0.84 + v * 0.42) * scale * perspective,
          height * 0.54 + (v * 0.5 - u * 0.16 - wave) * scale * perspective,
        ]
      }
      for (let direction = 0; direction < 2; direction++) {
        for (let line = 0; line <= 24; line++) {
          const fixed = (line / 24 - 0.5) * 3.3
          ctx.globalAlpha = 0.16 + Math.sin((line / 24) * Math.PI) * 0.29
          ctx.beginPath()
          for (let point = 0; point <= 64; point++) {
            const variable = (point / 64 - 0.5) * 3.3
            const [x, y] = direction
              ? project(fixed, variable)
              : project(variable, fixed)
            if (point === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
      last = 0
    }
    const animate = (now: number) => {
      frame = 0
      if (!visible || reduced || document.hidden) return
      if (last && now - last < 32) {
        frame = requestAnimationFrame(animate)
        return
      }
      if (last) elapsed.current += Math.min((now - last) / 1000, 0.06)
      last = now
      paint()
      frame = requestAnimationFrame(animate)
    }
    const resume = () => {
      stop()
      if (visible && !document.hidden) {
        paint()
        if (!reduced) frame = requestAnimationFrame(animate)
      }
    }
    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      const dpr = Math.min(devicePixelRatio, 1.5)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      paint()
    }
    const theme = () => {
      color =
        getComputedStyle(canvas).getPropertyValue('--studio-green').trim() ||
        '#087c57'
      paint()
    }
    const resizeObserver = new ResizeObserver(resize)
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        resume()
      },
      {rootMargin: '120px'},
    )
    const themeObserver = new MutationObserver(theme)
    resizeObserver.observe(canvas)
    visibilityObserver.observe(canvas)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    document.addEventListener('visibilitychange', resume)
    theme()
    resize()
    return () => {
      stop()
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      themeObserver.disconnect()
      document.removeEventListener('visibilitychange', resume)
    }
  }, [reduced])

  return <canvas ref={canvasRef} className="cta-waves" aria-hidden="true" />
}

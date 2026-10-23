'use client'

import {useEffect, useRef} from 'react'
import type {ShapeJSON} from 'three'
import {useStudioReducedMotion} from './motion-text'
import contour from '@/content/brand-arrow.json'
import {stepCursorSpring, idleRollProgress} from '@/lib/cursor-physics'

type Ember = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  age: number
  size: number
}

/** The pointer stays immediate; only its decorative tilt and exhaust are animated. */
export function BrandCursor() {
  const arrowRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLCanvasElement>(null)
  const reduced = useStudioReducedMotion()

  useEffect(() => {
    const fine = matchMedia('(hover: hover) and (pointer: fine)')
    const contrast = matchMedia('(forced-colors: active)')
    if (reduced || !fine.matches || contrast.matches) return
    let disposed = false
    let teardown = () => {}
    void import('three')
      .then((THREE) => {
        if (disposed) return
        const arrow = arrowRef.current
        const trail = trailRef.current
        const ctx = trail?.getContext('2d')
        if (!arrow || !trail || !ctx) return
        let renderer: InstanceType<typeof THREE.WebGLRenderer>
        try {
          renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
        } catch {
          return // Keep the native brand cursor if WebGL is unavailable.
        }
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
        renderer.setSize(64, 64)
        arrow.appendChild(renderer.domElement)
        const scene = new THREE.Scene()
        const camera = new THREE.OrthographicCamera(0, 64, 64, 0, 0.1, 200)
        camera.position.z = 100
        const shape = new THREE.Shape().fromJSON(
          contour.shape as unknown as ShapeJSON,
        )
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 5,
          bevelEnabled: true,
          bevelSize: 0.15,
          bevelThickness: 0.55,
          bevelSegments: 4,
          curveSegments: 24,
          steps: 1,
        })
        // Preserve the original Bézier contour; mirror it, without stretching either axis.
        geometry.translate(-contour.tip[0], -contour.tip[1], -2.5)
        geometry.scale(-contour.scale, -contour.scale, 1)
        const nozzle = new THREE.Vector3(
          (contour.tip[0] - contour.notch[0]) * contour.scale,
          (contour.tip[1] - contour.notch[1]) * contour.scale,
          0,
        )
        const rollAxis = nozzle.clone().normalize()
        const yawAxis = new THREE.Vector3(0, 0, 1)
        const rollRotation = new THREE.Quaternion()
        const projectedNozzle = new THREE.Vector3()
        const projectedTip = new THREE.Vector3()
        camera.updateMatrixWorld()
        const face = new THREE.MeshStandardMaterial({
          color: '#a7ecc5',
          metalness: 0.35,
          roughness: 0.28,
        })
        const edge = new THREE.MeshStandardMaterial({
          color: '#087c57',
          metalness: 0.5,
          roughness: 0.3,
        })
        const mesh = new THREE.Mesh(geometry, [face, edge])
        mesh.position.set(16, 48, 0)
        scene.add(mesh, new THREE.AmbientLight(0xffffff, 2))
        const light = new THREE.DirectionalLight(0xffffff, 3)
        light.position.set(-25, 70, 80)
        scene.add(light)
        const embers: Ember[] = []
        let x = -100,
          y = -100,
          lastMove = performance.now(),
          lastFrame = 0
        let visible = false,
          pressed = false,
          interactive = false,
          frame = 0
        let spinAt = 0,
          spinDuration = 0,
          nextSpin = lastMove + 2200,
          spinSign = 1,
          spinTurns = 2
        const yaw = {angle: 0, velocity: 0}
        const roll = {angle: 0.1, velocity: 0}
        let yawTarget = 0,
          rollTarget = 0.1,
          travel = 0
        let pointerVX = 0,
          pointerVY = 0
        let previousEmitter: {x: number; y: number} | null = null
        const blocked =
          'input, textarea, select, [contenteditable]:not([contenteditable="false"]), iframe, :disabled, [aria-disabled="true"]'
        const hide = () => {
          visible = false
          document.body.classList.remove('studio-cursor-active')
          arrow.style.opacity = '0'
          embers.length = 0
          previousEmitter = null
          travel = 0
          ctx.clearRect(0, 0, innerWidth, innerHeight)
          cancelAnimationFrame(frame)
          frame = 0
        }
        const resize = () => {
          const dpr = Math.min(devicePixelRatio, 2)
          trail.width = innerWidth * dpr
          trail.height = innerHeight * dpr
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }
        const draw = (now: number) => {
          frame = 0
          if (!visible) return
          const dt = Math.min((now - lastFrame) / 1000 || 0.016, 0.04)
          lastFrame = now
          stepCursorSpring(yaw, yawTarget, dt)
          yawTarget *= Math.exp(-9 * dt)
          rollTarget = 0.1 + (rollTarget - 0.1) * Math.exp(-9 * dt)
          if (now - lastMove > 1400 && now >= nextSpin && !spinDuration) {
            spinAt = now
            spinDuration = 1800 + Math.random() * 600
            spinSign = Math.random() > 0.5 ? 1 : -1
            spinTurns = Math.random() > 0.5 ? 2 : 3
          }
          if (spinDuration) {
            const t = Math.min(1, (now - spinAt) / spinDuration)
            roll.angle =
              0.1 + idleRollProgress(t) * Math.PI * 2 * spinTurns * spinSign
            roll.velocity = 0
            if (t === 1) {
              spinDuration = 0
              roll.angle = 0.1
              nextSpin = now + 2500 + Math.random() * 3500
            }
          } else stepCursorSpring(roll, rollTarget, dt)
          // Both rotations pivot at the actual tip. The barrel-roll axis passes through the notch.
          mesh.quaternion.setFromAxisAngle(yawAxis, yaw.angle)
          mesh.quaternion.multiply(
            rollRotation.setFromAxisAngle(rollAxis, roll.angle),
          )
          mesh.scale.setScalar(pressed ? 0.94 : interactive ? 1.05 : 1)
          mesh.updateMatrixWorld(true)
          projectedNozzle
            .copy(nozzle)
            .applyMatrix4(mesh.matrixWorld)
            .project(camera)
          projectedTip
            .set(0, 0, 0)
            .applyMatrix4(mesh.matrixWorld)
            .project(camera)
          const emitter = {
            x: x - 16 + (projectedNozzle.x + 1) * 32,
            y: y - 16 + (1 - projectedNozzle.y) * 32,
          }
          const directionX = projectedNozzle.x - projectedTip.x
          const directionY = projectedTip.y - projectedNozzle.y
          const length = Math.hypot(directionX, directionY) || 1
          if (travel > 0.5) {
            const count = Math.min(10, Math.ceil(travel / 3))
            const previous = previousEmitter ?? emitter
            for (let i = 0; i < count; i++) {
              const t = i / count
              embers.push({
                x: emitter.x + (previous.x - emitter.x) * t,
                y: emitter.y + (previous.y - emitter.y) * t,
                vx:
                  (directionX / length) * 45 -
                  pointerVX * 0.035 +
                  (Math.random() - 0.5) * 15,
                vy:
                  (directionY / length) * 45 -
                  pointerVY * 0.035 +
                  (Math.random() - 0.5) * 15,
                life: 0.18 + Math.random() * 0.22,
                age: 0,
                size: 1.2 + Math.random() * 1.7,
              })
            }
            if (embers.length > 80) embers.splice(0, embers.length - 80)
          }
          previousEmitter = emitter
          travel = 0
          ctx.clearRect(0, 0, innerWidth, innerHeight)
          ctx.globalCompositeOperation = 'lighter'
          for (let i = embers.length - 1; i >= 0; i--) {
            const p = embers[i]
            p.age += dt
            if (p.age >= p.life) {
              embers.splice(i, 1)
              continue
            }
            const fade = 1 - p.age / p.life
            const radius = Math.max(0.1, p.size * fade)
            const glow = ctx.createRadialGradient(
              p.x,
              p.y,
              0,
              p.x,
              p.y,
              radius * 2.5,
            )
            glow.addColorStop(0, `rgba(255,240,177,${fade * 0.85})`)
            glow.addColorStop(0.3, `rgba(255,158,55,${fade * 0.65})`)
            glow.addColorStop(1, 'rgba(255,70,15,0)')
            ctx.fillStyle = glow
            ctx.beginPath()
            ctx.arc(p.x, p.y, radius * 2.5, 0, Math.PI * 2)
            ctx.fill()
            p.x += p.vx * dt
            p.y += p.vy * dt
            p.vy -= 15 * dt
          }
          face.color.set(interactive ? '#35e6a3' : '#a7ecc5')
          renderer.render(scene, camera)
          frame = requestAnimationFrame(draw)
        }
        const syncTarget = (target: Element | null) => {
          if (
            !target ||
            target.closest(blocked) ||
            !fine.matches ||
            contrast.matches
          ) {
            hide()
            return false
          }
          interactive = !!target.closest(
            'a, button, summary, [role="button"], label[for]',
          )
          return true
        }
        const move = (event: PointerEvent) => {
          if (event.pointerType !== 'mouse') {
            hide()
            return
          }
          if (
            !syncTarget(event.target instanceof Element ? event.target : null)
          )
            return
          const now = performance.now()
          const dx = event.clientX - x,
            dy = event.clientY - y
          const distance = visible ? Math.hypot(dx, dy) : 0
          const elapsed = Math.max(0.008, (now - lastMove) / 1000)
          pointerVX = distance
            ? Math.max(-2000, Math.min(2000, dx / elapsed))
            : 0
          pointerVY = distance
            ? Math.max(-2000, Math.min(2000, dy / elapsed))
            : 0
          travel += distance
          yawTarget = Math.max(
            -0.65,
            Math.min(
              0.65,
              (rollAxis.x * pointerVY + rollAxis.y * pointerVX) * 0.0005,
            ),
          )
          rollTarget =
            0.1 +
            Math.max(-0.2, Math.min(0.2, (pointerVX + pointerVY) * 0.0001))
          if (spinDuration) {
            // Keep the current orientation when movement interrupts an idle roll, then spring home.
            roll.angle =
              ((((roll.angle + Math.PI) % (Math.PI * 2)) + Math.PI * 2) %
                (Math.PI * 2)) -
              Math.PI
            roll.velocity = 0
          }
          x = event.clientX
          y = event.clientY
          lastMove = now
          nextSpin = now + 2200
          spinDuration = 0
          arrow.style.transform = `translate3d(${x - 16}px, ${y - 16}px, 0)`
          arrow.style.opacity = '1'
          visible = true
          document.body.classList.add('studio-cursor-active')
          if (!frame) {
            lastFrame = lastMove
            frame = requestAnimationFrame(draw)
          }
        }
        const down = () => {
          pressed = true
        }
        const up = () => {
          pressed = false
        }
        const leave = (event: PointerEvent) => {
          if (!event.relatedTarget) hide()
        }
        const scroll = () => {
          if (visible) syncTarget(document.elementFromPoint(x, y))
        }
        const visibility = () => {
          if (document.hidden) hide()
        }
        resize()
        window.addEventListener('pointermove', move, {passive: true})
        window.addEventListener('pointerdown', down)
        window.addEventListener('pointerup', up)
        document.addEventListener('pointerout', leave)
        document.addEventListener('visibilitychange', visibility)
        window.addEventListener('blur', hide)
        window.addEventListener('resize', resize)
        window.addEventListener('scroll', scroll, {
          passive: true,
          capture: true,
        })
        fine.addEventListener('change', hide)
        contrast.addEventListener('change', hide)
        teardown = () => {
          hide()
          window.removeEventListener('pointermove', move)
          window.removeEventListener('pointerdown', down)
          window.removeEventListener('pointerup', up)
          document.removeEventListener('pointerout', leave)
          document.removeEventListener('visibilitychange', visibility)
          window.removeEventListener('blur', hide)
          window.removeEventListener('resize', resize)
          window.removeEventListener('scroll', scroll, true)
          fine.removeEventListener('change', hide)
          contrast.removeEventListener('change', hide)
          geometry.dispose()
          face.dispose()
          edge.dispose()
          renderer.dispose()
          renderer.domElement.remove()
        }
      })
      .catch(() => {})
    return () => {
      disposed = true
      teardown()
    }
  }, [reduced])

  return (
    <>
      <canvas
        className="studio-cursor-trail"
        ref={trailRef}
        aria-hidden="true"
      />
      <div className="studio-cursor-arrow" ref={arrowRef} aria-hidden="true" />
    </>
  )
}

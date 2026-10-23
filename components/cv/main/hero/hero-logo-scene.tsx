'use client'

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
  useSyncExternalStore,
} from 'react'
import {createPortal} from 'react-dom'
import {logoJourney, canLiftLogo, type LogoJourney} from '@/lib/logo-journey'
import {isCoarsePointer, whenEngaged, whenIdle} from '@/lib/when-idle'
import {LOGO_PATH, LOGO_TRANSFORM, LOGO_VIEWBOX} from './logo-path'

/**
 * The flat mark shown until WebGL is ready. Inline SVG drawing needs no request and, unlike a
 * CSS mask image, is not a Largest Contentful Paint candidate: the page's own content is.
 */
function FlatMark() {
  const id = useId()
  return (
    <svg className="hero-brand-fallback" viewBox={LOGO_VIEWBOX} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a7f3d0" />
          <stop offset="0.5" stopColor="#10b981" />
          <stop offset="1" stopColor="#065f46" />
        </linearGradient>
      </defs>
      <path transform={LOGO_TRANSFORM} fill={`url(#${id})`} d={LOGO_PATH} />
    </svg>
  )
}

type SceneLayout = LogoJourney
/** Drag state shared with the hero trigger: angles in radians, velocity in radians per second. */
export type LogoSpin = {
  angleX: number
  angleY: number
  velocity: number
  dragging: boolean
}
/** Fired by the trigger after it changes a spin, so a paused (reduced-motion) scene repaints. */
export const LOGO_SPIN_EVENT = 'studio:logo-spin'
export const createLogoSpin = (): LogoSpin => ({
  angleX: 0,
  angleY: 0,
  velocity: 0,
  dragging: false,
})
const TURN = Math.PI * 2
const subscribeToHydration = () => () => {}
const clamp = (value: number) => Math.max(0, Math.min(1, value))

function readSceneLayout(
  anchor: HTMLElement,
  backgroundOnly = false,
  reduced = false,
): SceneLayout {
  const rect = anchor.getBoundingClientRect()
  const main = anchor.closest('section')?.querySelector('.hero-main')
  const distance = Math.max(
    320,
    (main?.getBoundingClientRect().height ?? 400) * 0.9,
  )
  const raw = clamp(window.scrollY / distance)
  const progress = raw * raw * (3 - 2 * raw)
  const base = {
    x:
      (rect.left + rect.width / 2) * (1 - progress) +
      innerWidth * 0.64 * progress,
    y:
      (rect.top + rect.height / 2) * (1 - progress) +
      innerHeight * 0.5 * progress,
    size:
      Math.min(rect.width, rect.height) * (1 - progress) +
      Math.min(1200, Math.max(760, innerWidth * 0.9)) * progress,
    progress,
  }
  const initial = backgroundOnly
    ? {
        x: innerWidth * 0.64,
        y: innerHeight * 0.5,
        size: Math.min(1200, Math.max(760, innerWidth * 0.9)),
        progress: 1,
      }
    : base
  const dock =
    document.querySelector<HTMLElement>('.studio-cta [data-logo-dock]') ??
    document.querySelector<HTMLElement>('.footer-logo-arrival [data-logo-dock]')
  const surface = dock?.closest<HTMLElement>(
    '.studio-cta-inner, .footer-logo-arrival',
  )
  if (!dock || !surface)
    return {
      ...initial,
      journey: 0,
      front: false,
      phase: backgroundOnly ? 'background' : 'hero',
    }
  return logoJourney(
    initial,
    surface.getBoundingClientRect(),
    dock.getBoundingClientRect(),
    {
      width: innerWidth,
      height: innerHeight,
      scroll: scrollY,
      maxScroll: Math.max(
        0,
        document.documentElement.scrollHeight - innerHeight,
      ),
    },
    reduced,
  )
}

function applySceneLayout(host: HTMLElement, layout: SceneLayout) {
  host.style.setProperty('--scene-x', layout.x.toFixed(2) + 'px')
  host.style.setProperty('--scene-y', layout.y.toFixed(2) + 'px')
  host.style.setProperty('--scene-size', layout.size.toFixed(2) + 'px')
  host.style.setProperty('--scene-progress', layout.progress.toFixed(4))
  const backdrop = host.parentElement
  if (backdrop) {
    backdrop.style.zIndex = layout.front ? '20' : '0'
    backdrop.dataset.journey = layout.phase
  }
}

/** One canvas follows the hero, background, gutter and dock; scrolling never remounts it. */
export function HeroLogoScene({
  reducedMotion,
  photoVisible,
  backgroundOnly = false,
  spinRef,
}: {
  reducedMotion: boolean
  photoVisible: boolean
  backgroundOnly?: boolean
  spinRef?: RefObject<LogoSpin>
}) {
  const anchorRef = useRef<HTMLDivElement>(null)
  // A locale commit can replace the portal host while retaining this component.
  // Bind the renderer to the actual host node, rather than only its first mount.
  const [host, setHost] = useState<HTMLDivElement | null>(null)
  const photoRef = useRef(photoVisible)
  const elapsedRef = useRef(0)
  const redrawRef = useRef<() => void>(() => {})
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  )

  useLayoutEffect(() => {
    const anchor = anchorRef.current
    if (host && anchor)
      applySceneLayout(
        host,
        readSceneLayout(anchor, backgroundOnly, reducedMotion),
      )
  }, [host, backgroundOnly, reducedMotion])

  useEffect(() => {
    photoRef.current = photoVisible
    redrawRef.current()
  }, [photoVisible])

  useEffect(() => {
    const anchor = anchorRef.current
    if (!mounted || !anchor || !host) return
    const abort = new AbortController()
    const spin = spinRef?.current
    let cancelled = false
    let disposeScene: (() => void) | undefined
    let paintScene:
      | ((layout: SceneLayout, elapsed: number, delta: number) => void)
      | undefined
    let frame = 0
    let previous = 0
    let previousScroll = scrollY
    let elapsed = elapsedRef.current
    const readLayout = () =>
      readSceneLayout(anchor, backgroundOnly, reducedMotion)
    const current = readLayout()
    let appearance = current.progress
    // Layout is measured only when something moved (scroll, resize, content size), plus a
    // slow safety refresh, so idle frames never force a reflow.
    let target = {...current}
    let layoutDirty = true,
      layoutReadAt = 0
    // Touch devices render at 30fps; the scene is ambient there, not pointer-driven.
    const frameMs = isCoarsePointer() ? 1000 / 30 : 1000 / 60
    const tick = (time: number) => {
      frame = 0
      if (cancelled || document.hidden) return
      if (!reducedMotion && previous && time - previous < frameMs - 1) {
        requestDraw()
        return
      }
      const delta = previous ? Math.min((time - previous) / 1000, 0.08) : 1 / 30
      previous = time
      if (!reducedMotion) elapsed += delta
      elapsedRef.current = elapsed
      if (layoutDirty || time - layoutReadAt > 250) {
        target = readLayout()
        layoutDirty = false
        layoutReadAt = time
      }
      const scrollDelta = scrollY - previousScroll
      previousScroll = scrollY
      current.y -= scrollDelta * clamp((target.journey - 0.65) / 0.35)
      const smoothing = reducedMotion ? 1 : 1 - Math.exp(-delta * 11)
      for (const key of ['x', 'y', 'size', 'progress'] as const)
        current[key] += (target[key] - current[key]) * smoothing
      current.journey = target.journey
      current.phase = target.phase
      current.safe = target.safe
      current.front = target.front && canLiftLogo(current, target.safe)
      const desiredAppearance =
        target.front && !current.front ? 1 : current.progress
      appearance += (desiredAppearance - appearance) * smoothing
      const painted = {...current, progress: appearance}
      applySceneLayout(host, painted)
      paintScene?.(painted, elapsed, delta)
      if (!reducedMotion) requestDraw()
    }
    function requestDraw() {
      if (!frame && !cancelled && !document.hidden)
        frame = requestAnimationFrame(tick)
    }
    const onVisibility = () => {
      previous = 0
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
      } else requestDraw()
    }
    const markDirty = () => {
      layoutDirty = true
      requestDraw()
    }
    redrawRef.current = requestDraw
    const resizeObserver = new ResizeObserver(markDirty)
    resizeObserver.observe(anchor)
    const hero = anchor.closest('section')?.querySelector('.hero-main')
    if (hero) resizeObserver.observe(hero)
    const mainContent = document.getElementById('main-content')
    if (mainContent) resizeObserver.observe(mainContent)
    const dock = document.querySelector('[data-logo-dock]')
    if (dock) resizeObserver.observe(dock)
    window.addEventListener('scroll', markDirty, {passive: true})
    window.addEventListener(LOGO_SPIN_EVENT, requestDraw)
    window.addEventListener('resize', markDirty, {passive: true})
    document.addEventListener('visibilitychange', onVisibility)
    requestDraw()

    // The SVG fallback carries the first paint; three.js loads once the page is idle, or on
    // touch devices once the visitor first engages.
    const defer = isCoarsePointer() ? whenEngaged : whenIdle
    const cancelIdle = defer(() => void Promise.all([
      import('three'),
      import('three/addons/loaders/SVGLoader.js'),
      fetch('/logo.svg', {signal: abort.signal}).then((response) => {
        if (!response.ok) throw new Error('Logo unavailable')
        return response.text()
      }),
    ])
      .then(([THREE, {SVGLoader}, svg]) => {
        if (cancelled) return
        const paths = new SVGLoader().parse(svg).paths
        let renderer: InstanceType<typeof THREE.WebGLRenderer>
        try {
          renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'low-power',
          })
        } catch {
          return
        }
        renderer.setClearColor(0x000000, 0)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.1
        renderer.domElement.setAttribute('aria-hidden', 'true')
        host.appendChild(renderer.domElement)
        const scene = new THREE.Scene()
        const camera = new THREE.OrthographicCamera(
          -innerWidth / 2,
          innerWidth / 2,
          innerHeight / 2,
          -innerHeight / 2,
          0.1,
          5000,
        )
        camera.position.z = 1500
        const presentation = new THREE.Group()
        scene.add(presentation)
        const material = new THREE.MeshPhysicalMaterial({
          color: 0x10b981,
          metalness: 0.4,
          roughness: 0.3,
          clearcoat: 0.8,
          clearcoatRoughness: 0.2,
          side: THREE.DoubleSide,
          transparent: true,
        })
        const geometries: InstanceType<typeof THREE.ExtrudeGeometry>[] = []
        const mark = new THREE.Group()
        for (const path of paths)
          for (const shape of path.toShapes()) {
            const geometry = new THREE.ExtrudeGeometry(shape, {
              depth: 5,
              bevelEnabled: true,
              bevelSize: 0.35,
              bevelThickness: 0.5,
              bevelSegments: 3,
              curveSegments: 16,
            })
            geometries.push(geometry)
            mark.add(new THREE.Mesh(geometry, material))
          }
        const bounds = new THREE.Box3().setFromObject(mark)
        const size = bounds.getSize(new THREE.Vector3())
        mark.position.sub(bounds.getCenter(new THREE.Vector3()))
        const normalizedMark = new THREE.Group()
        const scale = 2.9 / Math.max(size.x, size.y, 1)
        normalizedMark.scale.set(scale, -scale, scale)
        normalizedMark.add(mark)
        const sculpture = new THREE.Group()
        sculpture.rotation.set(0.08, -0.18, -0.04)
        sculpture.add(normalizedMark)
        presentation.add(sculpture)

        const orbitGeometry = new THREE.TorusGeometry(2, 0.007, 6, 160)
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0x34d399,
          transparent: true,
          opacity: 0.4,
        })
        const dotGeometry = new THREE.SphereGeometry(0.028, 12, 8)
        const haloGeometry = new THREE.SphereGeometry(0.075, 12, 8)
        const dotMaterial = new THREE.MeshBasicMaterial({color: 0xc2ffe6})
        const haloMaterial = new THREE.MeshBasicMaterial({
          color: 0x6ee7b7,
          transparent: true,
          opacity: 0.12,
          depthWrite: false,
        })
        const travelers: {
          node: InstanceType<typeof THREE.Group>
          phase: number
          speed: number
        }[] = []
        const makeOrbit = (direction: number) => {
          const ring = new THREE.Mesh(orbitGeometry, orbitMaterial)
          for (let index = 0; index < 3; index++) {
            const node = new THREE.Group()
            node.add(
              new THREE.Mesh(dotGeometry, dotMaterial),
              new THREE.Mesh(haloGeometry, haloMaterial),
            )
            node.scale.setScalar(index === 0 ? 1 : 0.7)
            ring.add(node)
            travelers.push({
              node,
              phase: (index * Math.PI * 2) / 3 + direction,
              speed: direction * (0.22 + index * 0.04),
            })
          }
          presentation.add(ring)
          return ring
        }
        const orbit = makeOrbit(1)
        orbit.position.z = -0.35
        const outerOrbit = makeOrbit(-1)
        outerOrbit.scale.setScalar(1.15)
        outerOrbit.position.z = -0.5
        presentation.add(new THREE.HemisphereLight(0xe0fff2, 0x063c34, 2.4))
        const key = new THREE.DirectionalLight(0xe4fff5, 4)
        key.position.set(-3, 4, 5)
        presentation.add(key, key.target)
        const rim = new THREE.DirectionalLight(0x5eead4, 3)
        rim.position.set(4, -1, -2)
        presentation.add(rim, rim.target)
        const foregroundColor = new THREE.Color(0x10b981)
        const backgroundColor = new THREE.Color(0x064e3b)
        let viewportWidth = 0
        let viewportHeight = 0
        let pointerX = 0
        let pointerY = 0
        let photoMix = photoRef.current ? 1 : 0
        let baseRotationY = -0.18
        let lost = false
        paintScene = (layout, time, delta) => {
          if (lost) return
          if (viewportWidth !== innerWidth || viewportHeight !== innerHeight) {
            viewportWidth = innerWidth
            viewportHeight = innerHeight
            renderer.setPixelRatio(
              Math.min(
                window.devicePixelRatio,
                1.5,
                Math.sqrt(3_000_000 / (viewportWidth * viewportHeight)),
              ),
            )
            renderer.setSize(viewportWidth, viewportHeight)
            camera.left = -viewportWidth / 2
            camera.right = viewportWidth / 2
            camera.top = viewportHeight / 2
            camera.bottom = -viewportHeight / 2
            camera.updateProjectionMatrix()
          }
          const ease = reducedMotion ? 1 : 1 - Math.exp(-delta * 8)
          photoMix +=
            ((photoRef.current && layout.journey === 0
              ? 1 - layout.progress
              : 0) -
              photoMix) *
            ease
          presentation.position.set(
            layout.x - viewportWidth / 2,
            viewportHeight / 2 - layout.y,
            0,
          )
          presentation.scale.setScalar(layout.size / 5.2)
          baseRotationY +=
            (-0.18 +
              Math.sin(time * 0.45) * 0.16 +
              pointerX *
                0.4 *
                (layout.journey === 0 ? 1 - layout.progress : 0) -
              baseRotationY) *
            ease
          // A released spin coasts, then settles on the nearest whole turn so the mark faces front.
          if (spin && !spin.dragging && !reducedMotion) {
            spin.angleY += spin.velocity * delta
            spin.velocity *= Math.exp(-delta * 1.8)
            if (Math.abs(spin.velocity) < 1.2) {
              const rest = Math.round(spin.angleY / TURN) * TURN
              spin.angleY += (rest - spin.angleY) * (1 - Math.exp(-delta * 2.6))
              spin.velocity *= Math.exp(-delta * 4)
            }
            spin.angleX *= Math.exp(-delta * 4)
          }
          sculpture.rotation.y =
            baseRotationY + photoMix * Math.PI * 2 + (spin?.angleY ?? 0)
          sculpture.rotation.x +=
            ((spin?.angleX ?? 0) + 0.08 +
              pointerY *
                0.2 *
                (layout.journey === 0 ? 1 - layout.progress : 0) -
              sculpture.rotation.x) *
            ease
          sculpture.position.y = Math.sin(time * 0.7) * 0.06
          sculpture.scale.setScalar(1 - photoMix * 0.15)
          material.opacity = 1 - photoMix * 0.99
          material.color.lerpColors(
            foregroundColor,
            backgroundColor,
            layout.progress * 0.85,
          )
          orbit.rotation.set(
            0.9 + Math.sin(time * 0.2) * 0.06,
            0.2,
            -0.4 + time * 0.035,
          )
          outerOrbit.rotation.set(
            0.5,
            -0.6 + Math.sin(time * 0.17) * 0.06,
            0.8 - time * 0.025,
          )
          for (const traveler of travelers) {
            const angle = time * traveler.speed + traveler.phase
            traveler.node.position.set(
              Math.cos(angle) * 2,
              Math.sin(angle) * 2,
              0,
            )
          }
          renderer.render(scene, camera)
          host.dataset.ready = 'true'
        }
        const onPointer = (event: PointerEvent) => {
          if (reducedMotion || backgroundOnly || event.pointerType !== 'mouse')
            return
          const rect = anchor.getBoundingClientRect()
          pointerX = Math.max(
            -0.5,
            Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5),
          )
          pointerY = Math.max(
            -0.5,
            Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5),
          )
        }
        const onLost = (event: Event) => {
          event.preventDefault()
          lost = true
          delete host.dataset.ready
        }
        const onRestored = () => {
          lost = false
          requestDraw()
        }
        renderer.domElement.addEventListener('webglcontextlost', onLost)
        renderer.domElement.addEventListener('webglcontextrestored', onRestored)
        window.addEventListener('pointermove', onPointer, {passive: true})
        requestDraw()
        disposeScene = () => {
          paintScene = undefined
          window.removeEventListener('pointermove', onPointer)
          renderer.domElement.removeEventListener('webglcontextlost', onLost)
          renderer.domElement.removeEventListener(
            'webglcontextrestored',
            onRestored,
          )
          geometries.forEach((geometry) => geometry.dispose())
          orbitGeometry.dispose()
          dotGeometry.dispose()
          haloGeometry.dispose()
          material.dispose()
          orbitMaterial.dispose()
          dotMaterial.dispose()
          haloMaterial.dispose()
          renderer.dispose()
          renderer.domElement.remove()
          delete host.dataset.ready
        }
      })
      .catch(() => {
        /* The SVG mark still follows the scroll when WebGL is unavailable. */
      }))
    return () => {
      cancelled = true
      cancelIdle()
      abort.abort()
      resizeObserver.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', markDirty)
      window.removeEventListener(LOGO_SPIN_EVENT, requestDraw)
      window.removeEventListener('resize', markDirty)
      document.removeEventListener('visibilitychange', onVisibility)
      redrawRef.current = () => {}
      disposeScene?.()
    }
  }, [mounted, reducedMotion, host, backgroundOnly, spinRef])

  return (
    <>
      <div
        ref={anchorRef}
        className={
          backgroundOnly ? 'journey-background-anchor' : 'hero-scene-anchor'
        }
        aria-hidden="true"
      />
      {mounted &&
        createPortal(
          <div className="portfolio-scene-backdrop" aria-hidden="true">
            <div ref={setHost} className="intro-sculpture hero-scene-layer">
              <div className="hero-scene-fallback">
                <FlatMark />
                <i />
                <i />
              </div>
            </div>
          </div>,
          document.getElementById('studio-shell') ?? document.body,
        )}
    </>
  )
}

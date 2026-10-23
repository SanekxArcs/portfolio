'use client'

import {useEffect, useRef} from 'react'
import {isCoarsePointer, whenEngaged, whenIdle} from '@/lib/when-idle'
import {useStudioReducedMotion} from './motion-text'

let logoSource: Promise<string> | undefined
function readLogo() {
  return (logoSource ??= fetch('/logo.svg')
    .then((response) => {
      if (!response.ok) throw new Error('Logo unavailable')
      return response.text()
    })
    .catch((error) => {
      logoSource = undefined
      throw error
    }))
}

/** Small, on-demand sculpture. Navigation stays on the parent link. */
export function MiniLogo() {
  const hostRef = useRef<HTMLSpanElement>(null)
  const reduced = useStudioReducedMotion()

  useEffect(() => {
    const host = hostRef.current
    const link = host?.closest('a')
    if (!host || !link) return
    let disposed = false,
      started = false,
      visible = false
    let cleanup = () => {}
    let repaint = () => {}
    let cancelInit: (() => void) | undefined
    const initialize = async () => {
      if (started) return
      started = true
      try {
        const [THREE, {SVGLoader}, svg] = await Promise.all([
          import('three'),
          import('three/addons/loaders/SVGLoader.js'),
          readLogo(),
        ])
        if (disposed) return
        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: 'low-power',
        })
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.2
        const scene = new THREE.Scene()
        const camera = new THREE.OrthographicCamera(
          -1.6,
          1.6,
          1.6,
          -1.6,
          0.1,
          100,
        )
        camera.position.z = 10
        const material = new THREE.MeshPhysicalMaterial({
          color: 0x10b981,
          metalness: 0.4,
          roughness: 0.3,
          clearcoat: 0.8,
          clearcoatRoughness: 0.2,
        })
        const geometries: InstanceType<typeof THREE.ExtrudeGeometry>[] = []
        const mark = new THREE.Group()
        for (const path of new SVGLoader().parse(svg).paths)
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
        const normalized = new THREE.Group()
        const scale = 2.85 / Math.max(size.x, size.y, 1)
        normalized.scale.set(scale, -scale, scale)
        normalized.add(mark)
        const sculpture = new THREE.Group()
        sculpture.add(normalized)
        scene.add(sculpture, new THREE.AmbientLight(0xffffff, 2))
        const key = new THREE.DirectionalLight(0xffffff, 3)
        key.position.set(-3, 4, 6)
        const rim = new THREE.DirectionalLight(0x8ce7b3, 2)
        rim.position.set(3, -2, 2)
        scene.add(key, rim)
        let frame = 0,
          from = -0.2,
          yaw = -0.2,
          target = -0.2,
          spinAt = 0,
          duration = 850,
          pulseAt = -Infinity
        let running = false
        const render = (now: number) => {
          const t = running ? Math.min(1, (now - spinAt) / duration) : 1
          if (running) yaw = from + (target - from) * t * t * (3 - 2 * t)
          if (t === 1) running = false
          const pulse = Math.max(0, 1 - (now - pulseAt) / 420)
          sculpture.rotation.set(
            0.08 + (reduced ? 0 : Math.sin(pulse * Math.PI) * 0.15),
            yaw,
            -0.04,
          )
          sculpture.scale.setScalar(
            reduced ? 1 : 1 - Math.sin(pulse * Math.PI) * 0.08,
          )
          material.emissive.set('#10b981')
          material.emissiveIntensity = pulse * 0.25
          renderer.render(scene, camera)
          host.dataset.ready = 'true'
        }
        const tick = (now: number) => {
          frame = 0
          if (disposed || !visible || document.hidden) return
          render(now)
          if (running || now - pulseAt < 420)
            frame = requestAnimationFrame(tick)
        }
        repaint = () => {
          if (!frame && visible && !document.hidden)
            frame = requestAnimationFrame(tick)
        }
        const spin = () => {
          if (reduced) return
          from = yaw
          target =
            -0.2 + (Math.floor((yaw + 0.2) / (Math.PI * 2)) + 1) * Math.PI * 2
          if (target - yaw < 0.5) target += Math.PI * 2
          spinAt = performance.now()
          duration = 850
          running = true
          repaint()
        }
        const press = () => {
          pulseAt = performance.now()
          repaint()
        }
        const click = () => {
          spin()
          duration = 600
          press()
        }
        const hover = (event: PointerEvent) => {
          if (event.pointerType === 'mouse') spin()
        }
        const resize = () => {
          const width = Math.max(1, host.clientWidth),
            height = Math.max(1, host.clientHeight)
          renderer.setSize(width, height, false)
          const aspect = width / height
          camera.left = -1.6 * aspect
          camera.right = 1.6 * aspect
          camera.updateProjectionMatrix()
          repaint()
        }
        const theme = () => {
          material.color.set(
            document.documentElement.classList.contains('dark')
              ? '#10b981'
              : '#087c57',
          )
          repaint()
        }
        host.appendChild(renderer.domElement)
        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(host)
        const themeObserver = new MutationObserver(theme)
        themeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class'],
        })
        link.addEventListener('pointerenter', hover)
        link.addEventListener('focus', spin)
        link.addEventListener('pointerdown', press)
        link.addEventListener('click', click)
        document.addEventListener('visibilitychange', repaint)
        theme()
        resize()
        // A pointer can already be over the link when the lazy model finishes loading.
        if (link.matches(':hover, :focus-visible')) spin()
        cleanup = () => {
          cancelAnimationFrame(frame)
          resizeObserver.disconnect()
          themeObserver.disconnect()
          link.removeEventListener('pointerenter', hover)
          link.removeEventListener('focus', spin)
          link.removeEventListener('pointerdown', press)
          link.removeEventListener('click', click)
          document.removeEventListener('visibilitychange', repaint)
          geometries.forEach((geometry) => geometry.dispose())
          material.dispose()
          renderer.dispose()
          renderer.domElement.remove()
          delete host.dataset.ready
        }
      } catch {
        // The original local image remains visible if WebGL or the model cannot load.
      }
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) {
          // The flat mark shows first; the 3D model builds once the page is idle.
          if (!started)
            cancelInit ??= (isCoarsePointer() ? whenEngaged : whenIdle)(
              () => void initialize(),
            )
          repaint()
        }
      },
      {rootMargin: '120px'},
    )
    observer.observe(host)
    return () => {
      disposed = true
      cancelInit?.()
      observer.disconnect()
      cleanup()
    }
  }, [reduced])

  return <span ref={hostRef} className="mini-logo-scene" aria-hidden="true" />
}

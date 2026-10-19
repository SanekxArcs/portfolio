'use client'
import {useLayoutEffect, useRef, useState, type ReactNode} from 'react'
import {motion} from 'motion/react'
import {smoothEase, useStudioReducedMotion} from './motion-text'

/** Animate the containing height while its naturally sized contents reflow. */
export function MotionSize({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | undefined>(undefined)
  const reduced = useStudioReducedMotion()
  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const measure = () => setHeight(element.getBoundingClientRect().height)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return (
    <motion.div
      className={className}
      initial={false}
      animate={{height: height ?? 'auto'}}
      transition={{duration: reduced ? 0 : 0.42, ease: smoothEase}}
      style={{
        overflow: 'clip',
        overflowClipMargin: '8px',
        position: 'relative',
      }}
    >
      <div ref={ref} className="motion-size-content">
        {children}
      </div>
    </motion.div>
  )
}

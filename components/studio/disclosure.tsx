'use client'
import {useId, useState, type ReactNode} from 'react'
import {AnimatePresence, motion} from 'motion/react'
import {ChevronDown} from 'lucide-react'
import {MotionText, smoothEase, useStudioReducedMotion} from './motion-text'

export function MotionDisclosure({
  label,
  children,
  className = '',
}: {
  label: ReactNode
  children: ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const id = useId(),
    reduced = useStudioReducedMotion()
  return (
    <div className={`motion-disclosure ${className}`} data-reveal>
      <h3 className="disclosure-heading">
        <button
          type="button"
          className="disclosure-trigger"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}
        >
          <span>
            {typeof label === 'string' ? <MotionText text={label} /> : label}
          </span>
          <motion.span
            className="disclosure-chevron"
            animate={{rotate: open ? 180 : 0}}
            transition={{duration: reduced ? 0 : 0.3, ease: smoothEase}}
          >
            <ChevronDown size={18} />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            className="disclosure-body"
            key="content"
            initial={{height: 0, opacity: 0}}
            animate={{height: 'auto', opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{
              height: {duration: reduced ? 0 : 0.45, ease: smoothEase},
              opacity: {duration: reduced ? 0 : 0.22},
            }}
          >
            <div>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

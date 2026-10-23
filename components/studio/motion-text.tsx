'use client'

import {ViewTransition} from 'react'
import {useReducedMotion} from 'motion/react'
import NumberFlow from '@number-flow/react'
import {useUIStore} from '@/hooks/use-ui-store'

export const smoothEase = [0.22, 1, 0.36, 1] as const
export function useStudioReducedMotion() {
  const system = useReducedMotion()
  const {isReducedMotion, hasUserPreference} = useUIStore()
  return hasUserPreference ? isReducedMotion : isReducedMotion || !!system
}

/** Animate only changed text; initial render and ordinary scrolling stay completely still. */
export function MotionText({
		text,
		name,
		className,
	}: {
		text: string | number | null | undefined;
		name?: string;
		className?: string;
	}) {
		const reduced = useStudioReducedMotion();
		return (
			<ViewTransition
				name={name}
				default="none"
				share={
					reduced
						? "none"
						: {
								theme: "none",
								page: "none",
								language: "vt-text",
								default: "vt-text",
							}
				}
				update={
					reduced
						? "none"
						: {
								theme: "none",
								page: "none",
								language: "vt-text",
								default: "vt-text",
							}
				}
			>
				<span className={`motion-text ${className ?? ""}`}>{text ?? ""}</span>
			</ViewTransition>
		);
	}

export function MotionNumber({value, pad = 0}: {value: number; pad?: number}) {
  const reduced = useStudioReducedMotion()
  return (
    <NumberFlow
      className="motion-number"
      value={value}
      animated={!reduced}
      format={{minimumIntegerDigits: Math.max(1, pad), useGrouping: false}}
      transformTiming={{duration: 380, easing: 'cubic-bezier(.22,1,.36,1)'}}
      spinTiming={{duration: 380, easing: 'cubic-bezier(.22,1,.36,1)'}}
      opacityTiming={{duration: 180, easing: 'ease-out'}}
      style={{minWidth: `${Math.max(2, pad)}ch`}}
    />
  )
}

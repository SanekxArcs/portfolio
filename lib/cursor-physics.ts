export type CursorSpring = {angle: number; velocity: number}

/** A damped angular spring; substeps keep quick gestures stable after a slow frame. */
export function stepCursorSpring(
  state: CursorSpring,
  target: number,
  seconds: number,
) {
  const duration = Math.max(0, Math.min(seconds, 0.05))
  const steps = Math.max(1, Math.ceil(duration / (1 / 120)))
  const dt = duration / steps
  for (let i = 0; i < steps; i++) {
    state.velocity += ((target - state.angle) * 150 - state.velocity * 15) * dt
    state.angle += state.velocity * dt
  }
}

/** Several barrel rolls followed by a small spring overshoot, with an exact resting pose. */
export function idleRollProgress(progress: number) {
  const t = Math.max(0, Math.min(1, progress))
  return t === 1
    ? 1
    : 1 - Math.exp(-7 * t * t) * Math.cos(2.5 * Math.PI * t * t)
}

import {test} from 'node:test'
import assert from 'node:assert/strict'
import {stepCursorSpring, idleRollProgress} from '../lib/cursor-physics.ts'

test('cursor tail rebounds and settles after a drag is released', () => {
  const state = {angle: 0, velocity: 0}
  for (let i = 0; i < 30; i++) stepCursorSpring(state, 0.6, 1 / 60)
  assert(state.angle > 0.5)
  let rebounded = false
  for (let i = 0; i < 240; i++) {
    stepCursorSpring(state, 0, 1 / 60)
    if (state.angle < 0) rebounded = true
  }
  assert(rebounded, 'Release should have a small spring rebound')
  assert(Math.abs(state.angle) < 0.001)
  assert(Math.abs(state.velocity) < 0.001)
})

test('cursor physics stays stable across normal frame rates and a stalled frame', () => {
  const simulate = (fps) => {
    const state = {angle: 0, velocity: 0}
    for (let i = 0; i < fps / 2; i++) stepCursorSpring(state, -0.6, 1 / fps)
    return state.angle
  }
  assert(Math.abs(simulate(30) - simulate(144)) < 0.02)
  const state = {angle: 0.5, velocity: 4}
  stepCursorSpring(state, 0, 10)
  assert(Number.isFinite(state.angle) && Math.abs(state.angle) < 1)
})

test('idle barrel rolls overshoot gently and finish at the resting orientation', () => {
  assert.equal(idleRollProgress(0), 0)
  assert.equal(idleRollProgress(1), 1)
  assert(Array.from({length: 100}, (_, i) => idleRollProgress(i / 100)).some((n) => n > 1))
})

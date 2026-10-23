import {test} from 'node:test'
import assert from 'node:assert/strict'
import {logoJourney, canLiftLogo} from '../lib/logo-journey.ts'

function frame(scroll, mobile = false) {
  const width = mobile ? 390 : 1440, height = 1000
  const right = width - (mobile ? 20 : 80)
  const surface = {left: mobile ? 20 : 80, right, top: 6000 - scroll, bottom: 6480 - scroll, width: right - (mobile ? 20 : 80), height: 480}
  const size = mobile ? 160 : 480
  const dockTop = mobile ? 5960 - scroll : surface.top + (surface.height - size) / 2
  const dock = {left: right - size + (mobile ? -12 : 36), right: right + (mobile ? -12 : 36), top: dockTop, bottom: dockTop + size, width: size, height: size}
  const base = {x: width * 0.64, y: height * 0.5, size: 1000, progress: 1}
  return {pose: logoJourney(base, surface, dock, {width, height, scroll, maxScroll: 7000}), dock}
}

test('logo journey starts behind content and reaches the actual dock', () => {
  for (const mobile of [false, true]) {
    const {pose, dock} = frame(5700, mobile)
    assert.equal(pose.phase, 'docked')
    assert.equal(pose.x, dock.left + dock.width / 2)
    assert.equal(pose.y, dock.top + dock.height / 2)
    assert(canLiftLogo(pose, pose.safe))
    assert.equal(frame(0, mobile).pose.front, false)
  }
})

test('departure, gutter and arrival join continuously as the page scrolls', () => {
  for (const mobile of [false, true]) for (const p of [0.42, 0.72, 1]) {
    const before = frame(5020 + 680 * (p - 0.000001), mobile).pose
    const after = frame(5020 + 680 * (p + 0.000001), mobile).pose
    assert(Math.hypot(after.x - before.x, after.y - before.y) < 0.1)
    assert(Math.abs(after.size - before.size) < 0.1)
  }
})

test('the entire orbit envelope fits the outer gutter before it becomes foreground', () => {
  for (const mobile of [false, true]) for (const p of [0.43, 0.5, 0.6, 0.7]) {
    const {pose} = frame(5020 + 680 * p, mobile)
    assert.equal(pose.phase, 'gutter')
    assert(canLiftLogo(pose, pose.safe))
    assert(pose.x - pose.size * 0.47 >= pose.safe.edge)
    assert(!canLiftLogo({...pose, x: pose.x - 200, size: 700}, pose.safe), 'An obstructed sculpture must remain behind the content')
  }
})

test('the logo stays in the background until the final section enters the viewport', () => {
  for (const mobile of [false, true]) {
    for (const scroll of [3900, 4500, 5000, 5020]) {
      const {pose} = frame(scroll, mobile)
      assert.equal(pose.phase, 'background')
      assert.equal(pose.journey, 0)
      assert.equal(pose.size, 1000)
      assert.equal(pose.front, false)
    }
    assert.equal(frame(5200, mobile).pose.phase, 'departure')
  }
})

test('a large dock that overhangs a short card remains visible when fully settled', () => {
  const surface = {left: 320, right: 1600, top: 270, bottom: 686, width: 1280, height: 416}
  const dock = {left: 1155, right: 1635, top: 238, bottom: 718, width: 480, height: 480}
  const pose = logoJourney({x: 1228, y: 540, size: 1200, progress: 1}, surface, dock,
    {width: 1920, height: 1080, scroll: 6000, maxScroll: 7000})
  assert.equal(pose.phase, 'docked')
  assert(pose.y + pose.size * 0.47 > surface.bottom + 16, 'Reproduce the old card-only boundary failure')
  assert(canLiftLogo(pose, pose.safe), 'Settling must not demote the overhanging logo behind the card')
  assert(!canLiftLogo({...pose, y: pose.y + 200}, pose.safe), 'The reserved dock must still enforce vertical clearance')
})

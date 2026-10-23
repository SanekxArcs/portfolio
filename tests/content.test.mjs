import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync, existsSync} from 'node:fs'

const profile = JSON.parse(
  readFileSync(new URL('../content/profile.json', import.meta.url), 'utf8'),
)
function values(value) {
  if (Array.isArray(value)) return value.flatMap(values)
  if (value && typeof value === 'object')
    return Object.values(value).flatMap(values)
  return typeof value === 'string' ? [value] : []
}

test('all bundled public assets exist and public content has no CMS URLs', () => {
  for (const value of values(profile)) {
    assert.ok(
      !value.startsWith('https://cdn.sanity.io/'),
      'Public content still depends on the CMS asset CDN',
    )
    if (value.startsWith('/content/')) {
      assert.match(value, /^\/content\/[a-zA-Z0-9_.-]+$/)
      assert.ok(
        existsSync(new URL(`../public${value}`, import.meta.url)),
        `Missing local asset: ${value}`,
      )
    }
  }
})

test('public project data retains confidential-project redaction', () => {
  for (const project of profile.projects ?? []) {
    if (!project.nda) continue
    assert.equal(project.title, 'Confidential project')
    assert.ok(!project.url)
    assert.ok(!project.urlToCode)
    assert.deepEqual(project.imageUrls, [])
  }
})

test('public snapshot excludes hidden work, private documents and conversation fields', () => {
  assert.ok(profile.name && profile._id)
  assert.ok(
    (profile.workExperience ?? []).every((item) => item.hideFromCV !== true),
  )
  for (const field of [
    'messages',
    'sessionId',
    'systemPrompt',
    'additionalInfo',
    'userEmail',
    'userPhone',
    'leaseToken',
    'snapshot',
  ]) {
    assert.ok(
      !Object.hasOwn(profile, field),
      `Private field appeared in public content: ${field}`,
    )
  }
})

test('refreshed project media references existing public assets and excludes confidential projects', () => {
  const media = JSON.parse(
    readFileSync(
      new URL('../content/project-media.json', import.meta.url),
      'utf8',
    ),
  )
  const index = JSON.parse(
    readFileSync(
      new URL('../content/project-index.json', import.meta.url),
      'utf8',
    ),
  )
  for (const [id, item] of Object.entries(media)) {
    if (item.kind) assert.ok(['website', 'desktop', 'extension'].includes(item.kind), `Unsupported preview kind: ${id}`)
    const entry = index.find((project) => project.id === id)
    assert.ok(entry, `Unknown project media: ${id}`)
    const project = profile.projects[entry.sourceIndex]
    assert.equal(
      project.nda,
      false,
      `Confidential project has public captures: ${id}`,
    )
    assert.match(item.capturedOn, /^\d{4}-\d{2}-\d{2}$/)
    assert.equal(
      new URL(item.sourceUrl).hostname.replace(/^www\./, ''),
      new URL(project.url ?? project.urlToCode).hostname.replace(/^www\./, ''),
    )
    if (item.video) {
      assert.match(item.video, /^\/content\/[a-z0-9-]+\.mp4$/)
      assert.ok(existsSync(new URL(`../public${item.video}`, import.meta.url)), `Missing project video: ${item.video}`)
    }
    for (const field of ['desktop', 'mobile', 'detail']) {
      if (!item[field]) continue
      assert.match(item[field], /^\/content\/project-[a-z0-9-]+\.webp$/)
      assert.ok(
        existsSync(new URL(`../public${item[field]}`, import.meta.url)),
        `Missing project capture: ${item[field]}`,
      )
    }
    assert.ok(item.desktop)
  }
})

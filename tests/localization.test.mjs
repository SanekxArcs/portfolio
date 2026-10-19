import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const json = (file) =>
  JSON.parse(readFileSync(new URL('../' + file, import.meta.url), 'utf8'))
const profile = json('content/profile.json'),
  index = json('content/project-index.json')
function leaves(value, prefix = '') {
  if (Array.isArray(value))
    return value.flatMap((item, i) => leaves(item, `${prefix}.${i}`))
  if (value && typeof value === 'object')
    return Object.entries(value).flatMap(([key, item]) =>
      leaves(item, `${prefix}.${key}`),
    )
  return [[prefix, typeof value]]
}
test('locale dictionaries cover the same complete UI without empty copy', () => {
  const english = json('content/site/en.json')
  for (const locale of ['pl', 'uk'])
    assert.deepEqual(
      leaves(json(`content/site/${locale}.json`)),
      leaves(english),
    )
  for (const locale of ['en', 'pl', 'uk']) {
    const content = json(`content/site/${locale}.json`)
    const strings = (value) =>
      typeof value === 'string'
        ? [value]
        : Array.isArray(value)
          ? value.flatMap(strings)
          : Object.values(value).flatMap(strings)
    assert.ok(strings(content).every((value) => value.trim().length > 0))
  }
})
test('translated projects and career histories retain complete item and feature coverage', () => {
  for (const locale of ['pl', 'uk']) {
    const projects = json(`content/site/projects-${locale}.json`),
      career = json(`content/site/profile-${locale}.json`)
    assert.equal(projects.length, profile.projects.length)
    projects.forEach((item, i) => {
      assert.ok(item.description.trim())
      assert.equal(item.features.length, profile.projects[i].features.length)
    })
    assert.equal(career.work.length, profile.workExperience.length)
    career.work.forEach((item, i) =>
      assert.equal(
        item.description.length,
        profile.workExperience[i].description.length,
      ),
    )
    assert.equal(career.softSkills.length, profile.softSkills.length)
    assert.equal(career.education.length, profile.education.length)
    assert.equal(career.interests.length, profile.interests.length)
  }
})
test('all project routes have unique stable slugs and map to an existing source', () => {
  assert.equal(index.length, profile.projects.length)
  assert.equal(new Set(index.map((item) => item.slug)).size, index.length)
  assert.equal(
    new Set(index.map((item) => item.sourceIndex)).size,
    index.length,
  )
  for (const item of index) {
    assert.match(item.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    assert.ok(profile.projects[item.sourceIndex])
  }
  assert.equal(index.filter((item) => item.featured).length, 3)
  assert.ok(
    index
      .filter((item) => item.featured)
      .every((item) => !profile.projects[item.sourceIndex].nda),
  )
})

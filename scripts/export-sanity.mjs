import {createHash} from 'node:crypto'
import {mkdir, readFile, writeFile, access} from 'node:fs/promises'
import path from 'node:path'
import nextEnv from '@next/env'

nextEnv.loadEnvConfig(process.cwd())
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const version = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-15'
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN
if (!projectId || !dataset || !token) throw new Error('Sanity project, dataset and a server-side read-capable token are required for the complete backup.')
const base = `https://${projectId}.api.sanity.io/v${version}`
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const directory = path.resolve('.local-backups', `sanity-${stamp}`)
await mkdir(directory, {recursive: true})
async function readApi(url) {
  const response = await fetch(url, {headers: {Authorization: `Bearer ${token}`}, signal: AbortSignal.timeout(120000)})
  if (!response.ok) throw new Error(`Sanity export failed (${response.status}); live content has not been changed.`)
  return response
}
const raw = await (await readApi(`${base}/data/export/${dataset}`)).text()
const documents = raw.trim().split('\n').filter(Boolean).map(line => JSON.parse(line))
if (!documents.some(doc => doc._type === 'cvProfile' && !doc._id.startsWith('drafts.'))) throw new Error('Backup has no published profile; stopping.')
await writeFile(path.join(directory, 'dataset.ndjson'), raw)
const query = await readFile(new URL('./legacy/cv-profile.groq', import.meta.url), 'utf8')
const queryUrl = new URL(`${base}/data/query/${dataset}`)
queryUrl.searchParams.set('query', query)
queryUrl.searchParams.set('perspective', 'published')
const profile = (await (await readApi(queryUrl)).json()).result
if (!profile?._id || !profile.name) throw new Error('Published profile is missing; stopping.')
await writeFile(path.join(directory, 'profile-original.json'), JSON.stringify(profile, null, 2) + '\n')

const assets = documents.filter(doc => ['sanity.imageAsset', 'sanity.fileAsset'].includes(doc._type))
const assetDirectory = path.join(directory, 'assets')
await mkdir(assetDirectory)
const manifest = []
for (let offset = 0; offset < assets.length; offset += 4) {
  await Promise.all(assets.slice(offset, offset + 4).map(async asset => {
    const url = new URL(asset.url)
    if (url.protocol !== 'https:' || url.hostname !== 'cdn.sanity.io') throw new Error('Unexpected asset origin; stopping.')
    const filename = path.basename(url.pathname)
    if (!/^[a-zA-Z0-9_.-]+$/.test(filename)) throw new Error('Unexpected asset filename; stopping.')
    url.searchParams.set('dlRaw', filename)
    const response = await fetch(url, {headers: {Authorization: `Bearer ${token}`}, signal: AbortSignal.timeout(120000)})
    if (!response.ok) throw new Error(`Asset backup failed (${response.status}).`)
    const bytes = Buffer.from(await response.arrayBuffer())
    if (!bytes.length || (asset.size && bytes.length !== asset.size)) throw new Error('Asset size does not match source: ' + filename + ' expected=' + asset.size + ' received=' + bytes.length + ' type=' + response.headers.get('content-type'))
    const sha1 = createHash('sha1').update(bytes).digest('hex')
    if (asset.sha1hash && sha1 !== asset.sha1hash) throw new Error('Asset checksum does not match source.')
    await writeFile(path.join(assetDirectory, filename), bytes)
    manifest.push({id: asset._id, url: asset.url, filename, size: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex')})
  }))
}
await writeFile(path.join(directory, 'manifest.json'), JSON.stringify({exportedAt: new Date().toISOString(), projectId, dataset, documents: documents.length, assets: manifest, profileId: profile._id}, null, 2) + '\n')

// Public output uses the existing projection: hidden work and NDA links/images stay private.
// Never copy the raw dataset, AI configuration, drafts or private conversations into public/.
const publicDirectory = path.resolve('public/content')
const contentFile = path.resolve('content/profile.json')
try { await access(contentFile); throw new Error('Local profile already exists; backup completed, but refusing to overwrite edited content.') } catch (error) { if (error.code !== 'ENOENT') throw error }
await mkdir(publicDirectory, {recursive: true})
async function localize(value) {
  if (Array.isArray(value)) return Promise.all(value.map(localize))
  if (value && typeof value === 'object') return Object.fromEntries(await Promise.all(Object.entries(value).map(async ([key, item]) => [key, await localize(item)])))
  if (typeof value !== 'string' || !value.startsWith('https://cdn.sanity.io/')) return value
  const url = new URL(value)
  const asset = manifest.find(item => item.url.split('?')[0] === `${url.origin}${url.pathname}`)
  if (!asset) throw new Error('A published asset is absent from the backup; refusing partial migration.')
  const publicResponse = await fetch(asset.url, {signal: AbortSignal.timeout(120000)})
  if (!publicResponse.ok) throw new Error('Public asset download failed.')
  const publicBytes = Buffer.from(await publicResponse.arrayBuffer())
  if (!publicBytes.length) throw new Error('Public asset was empty.')
  await writeFile(path.join(publicDirectory, asset.filename), publicBytes)
  return `/content/${asset.filename}`
}
const localProfile = await localize(profile)
await mkdir(path.dirname(contentFile), {recursive: true})
await writeFile(contentFile, JSON.stringify(localProfile, null, 2) + '\n')
console.log(JSON.stringify({backup: path.relative(process.cwd(), directory), documents: documents.length, assets: manifest.length, publicProjects: profile.projects?.length || 0, workEntries: profile.workExperience?.length || 0, profile: 'content/profile.json'}))

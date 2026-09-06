import {createHash} from 'node:crypto'
import nextEnv from '@next/env'
import {createClient} from 'next-sanity'

nextEnv.loadEnvConfig(process.cwd())
const apply = process.argv.includes('--apply')
if (!process.env.SANITY_API_WRITE_TOKEN) throw new Error('SANITY_API_WRITE_TOKEN is required')
const client = createClient({projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-12-15', token: process.env.SANITY_API_WRITE_TOKEN, useCdn: false, perspective: 'raw'})
const anonymous = client.withConfig({token: undefined, perspective: 'published'})
const hash = value => createHash('sha256').update(value).digest('hex')
const publicIds = await anonymous.fetch('*[_type in ["cvProfile", "chatHistory"]]._id')
const docs = await client.fetch('*[_id in $ids]', {ids: publicIds})
const chats = docs.filter(doc => doc._type === 'chatHistory' && (doc.messages?.length || doc.userEmail || doc.userPhone || doc.userName))
const profiles = docs.filter(doc => doc._type === 'cvProfile' && doc.projects?.some(project => project.nda && (project.title !== 'Confidential project' || project.image?.length || project.url || project.urlToCode)))
console.log(JSON.stringify({mode: apply ? 'apply' : 'preview', chatsToProtect: chats.length, profilesToSanitize: profiles.length,
  ndaProjects: profiles.reduce((count, doc) => count + doc.projects.filter(project => project.nda).length, 0)}))

if (apply) {
  for (const doc of [...chats, ...profiles]) {
    const backupId = `private.archive.${hash(`${doc._id}:${doc._rev}`)}`
    // Preserve the original in private storage before sanitizing any public field.
    // Use a string snapshot so references in an archive cannot expose assets or block later cleanup.
    await client.createIfNotExists({_id: backupId, _type: 'privateArchive', sourceType: doc._type, snapshot: JSON.stringify(doc), archivedAt: new Date().toISOString()})
    const backup = await client.getDocument(backupId)
    if (!backup || backup.snapshot !== JSON.stringify(doc)) throw new Error('Backup verification failed; public document was not modified')
    if (await anonymous.fetch('count(*[_id == $id])', {id: backupId})) throw new Error('Private backup is anonymously readable; stopping')
    const patch = client.patch(doc._id).ifRevisionId(doc._rev)
    if (doc._type === 'chatHistory') {
      // Leave a harmless stub rather than deleting the source document and its history.
      await patch.set({messages: [], archived: true}).unset(['sessionId', 'userEmail', 'userPhone', 'userName', 'companyName']).commit({visibility: 'sync'})
    } else {
      const projects = doc.projects.map(project => {
        if (!project.nda) return project
        const safe = {...project, title: 'Confidential project'}
        delete safe.image; delete safe.url; delete safe.urlToCode
        return safe
      })
      await patch.set({projects}).commit({visibility: 'sync'})
    }
  }
  const remaining = await anonymous.fetch('{"chatsWithPrivateData": count(*[_type == "chatHistory" && (count(messages)>0 || length(userEmail)>0 || length(userPhone)>0 || length(userName)>0)]), "ndaProjectsWithPrivateFields": count(*[_type == "cvProfile"].projects[][nda == true && (title != "Confidential project" || count(image)>0 || defined(url) || defined(urlToCode))])}')
  console.log(JSON.stringify({verification: remaining}))
}

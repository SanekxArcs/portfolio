import {getAuthUserId} from '@convex-dev/auth/server'
import {ConvexError, v, type Infer} from 'convex/values'
import {mutation, query, type MutationCtx} from './_generated/server'
import type {Doc, Id} from './_generated/dataModel'
import {requireAdmin} from './auth'
import {
  clientFields,
  experienceFields,
  fileSlots,
  profileFields,
  projectFields,
  storedFile,
} from './schema'

/** Who is signed in, without throwing, so the admin UI can show the right screen. */
export const me = query({
  args: {},
  handler: async (ctx) => {
    if (!(await getAuthUserId(ctx))) return null
    try {
      const user = await requireAdmin(ctx)
      return {email: user.email ?? '', admin: true}
    } catch {
      return {email: '', admin: false}
    }
  },
})

export const projects = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return ctx.db.query('projects').withIndex('by_order').collect()
  },
})
export const experience = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return ctx.db.query('experience').withIndex('by_order').collect()
  },
})
export const profile = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return ctx.db.query('profile').first()
  },
})
export const clients = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return ctx.db.query('clients').withIndex('by_order').collect()
  },
})
export const fileUrl = query({
  args: {storageId: v.id('_storage')},
  handler: async (ctx, {storageId}) => {
    await requireAdmin(ctx)
    return ctx.storage.getUrl(storageId)
  },
})

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return ctx.storage.generateUploadUrl()
  },
})

const storageIds = (project: Doc<'projects'>) =>
  [
    ...project.gallery,
    project.media?.desktop,
    project.media?.mobile,
    project.media?.detail,
  ].flatMap((item) => (item?.storageId ? [item.storageId] : []))

async function nextOrder(ctx: MutationCtx, table: 'projects' | 'experience') {
  const last = await ctx.db.query(table).withIndex('by_order').order('desc').first()
  return (last?.order ?? -1) + 1
}

export const saveProject = mutation({
  args: {id: v.optional(v.id('projects')), project: v.object(projectFields)},
  handler: async (ctx, {id, project}) => {
    await requireAdmin(ctx)
    const slug = project.slug.trim()
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
      throw new ConvexError('The slug may only use lowercase letters, numbers and single dashes.')
    const clash = await ctx.db
      .query('projects')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .first()
    if (clash && clash._id !== id) throw new ConvexError(`Another project already uses “${slug}”.`)
    if (!id) return ctx.db.insert('projects', {...project, slug, order: await nextOrder(ctx, 'projects')})
    const previous = await ctx.db.get(id)
    if (!previous) throw new ConvexError('This project no longer exists.')
    await ctx.db.replace(id, {...project, slug})
    // Drop files that were replaced or removed in this save.
    const kept = new Set(storageIds({...previous, ...project}))
    for (const storageId of storageIds(previous))
      if (!kept.has(storageId)) await ctx.storage.delete(storageId)
    return id
  },
})

export const deleteProject = mutation({
  args: {id: v.id('projects')},
  handler: async (ctx, {id}) => {
    await requireAdmin(ctx)
    const project = await ctx.db.get(id)
    if (!project) return
    for (const storageId of storageIds(project)) await ctx.storage.delete(storageId)
    await ctx.db.delete(id)
  },
})

export const saveExperience = mutation({
  args: {id: v.optional(v.id('experience')), job: v.object(experienceFields)},
  handler: async (ctx, {id, job}) => {
    await requireAdmin(ctx)
    if (!id) return ctx.db.insert('experience', {...job, order: await nextOrder(ctx, 'experience')})
    await ctx.db.replace(id, job)
    return id
  },
})

export const deleteExperience = mutation({
  args: {id: v.id('experience')},
  handler: async (ctx, {id}) => {
    await requireAdmin(ctx)
    await ctx.db.delete(id)
  },
})

/** Saves a new order: the list position becomes each document's `order`. */
export const reorder = mutation({
  args: {
    ids: v.union(
      v.object({table: v.literal('projects'), ids: v.array(v.id('projects'))}),
      v.object({table: v.literal('experience'), ids: v.array(v.id('experience'))}),
    ),
  },
  handler: async (ctx, {ids}) => {
    await requireAdmin(ctx)
    await Promise.all(
      ids.ids.map((id: Id<'projects'> | Id<'experience'>, order) => ctx.db.patch(id, {order})),
    )
  },
})

export const saveProfile = mutation({
  args: {profile: v.object(profileFields)},
  handler: async (ctx, {profile}) => {
    await requireAdmin(ctx)
    const existing = await ctx.db.query('profile').first()
    if (!existing) return void (await ctx.db.insert('profile', profile))
    const {cv, photo, cvFileUrl, profilePhotoUrl} = existing
    await ctx.db.replace(existing._id, {...profile, cv, photo, cvFileUrl, profilePhotoUrl})
  },
})

/** How many replaced versions of each file are kept for a quick restore. */
const KEEP_PREVIOUS = 2
const slot = v.union(v.literal('cv'), v.literal('photo'))

async function profileDoc(ctx: MutationCtx) {
  const profile = await ctx.db.query('profile').first()
  if (!profile) throw new ConvexError('Import the profile first.')
  return profile
}

/** The CV and photo with a download URL for every kept version. */
export const files = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    const profile = await ctx.db.query('profile').first()
    const withUrl = async (file: Infer<typeof storedFile>) => ({
      ...file,
      url: file.storageId ? await ctx.storage.getUrl(file.storageId) : (file.path ?? null),
    })
    const resolve = async (name: (typeof fileSlots)[number]) => {
      const value = profile?.[name]
      return value
        ? {current: await withUrl(value.current), previous: await Promise.all(value.previous.map(withUrl))}
        : null
    }
    return {cv: await resolve('cv'), photo: await resolve('photo')}
  },
})

/** Makes an uploaded file live; the old one moves into the kept versions. */
export const replaceFile = mutation({
  args: {
    slot,
    storageId: v.id('_storage'),
    name: v.string(),
    contentType: v.optional(v.string()),
    size: v.optional(v.number()),
  },
  handler: async (ctx, {slot, ...file}) => {
    await requireAdmin(ctx)
    const profile = await profileDoc(ctx)
    const old = profile[slot]
    const history = old ? [old.current, ...old.previous] : []
    for (const dropped of history.slice(KEEP_PREVIOUS))
      if (dropped.storageId) await ctx.storage.delete(dropped.storageId)
    await ctx.db.patch(profile._id, {
      [slot]: {current: {...file, uploadedAt: Date.now()}, previous: history.slice(0, KEEP_PREVIOUS)},
    })
  },
})

/** Swaps a kept version back in. The file it replaces is kept, so nothing is lost. */
export const restoreFile = mutation({
  args: {slot, index: v.number()},
  handler: async (ctx, {slot, index}) => {
    await requireAdmin(ctx)
    const profile = await profileDoc(ctx)
    const value = profile[slot]
    const restored = value?.previous[index]
    if (!value || !restored) throw new ConvexError('That version is no longer kept.')
    const others = value.previous.filter((_, i) => i !== index)
    await ctx.db.patch(profile._id, {[slot]: {current: restored, previous: [value.current, ...others]}})
  },
})

/** The client list is small, so it is saved as a whole. */
export const saveClients = mutation({
  args: {
    clients: v.array(
      v.object({name: clientFields.name, url: clientFields.url, featured: clientFields.featured, linked: clientFields.linked}),
    ),
  },
  handler: async (ctx, {clients}) => {
    await requireAdmin(ctx)
    for (const client of await ctx.db.query('clients').collect()) await ctx.db.delete(client._id)
    for (const [order, client] of clients.entries()) await ctx.db.insert('clients', {...client, order})
  },
})

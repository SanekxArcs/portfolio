/**
 * One-time import of the JSON content that the site used before the CMS.
 *   npx convex run seed:importContent
 *   npx convex run seed:migrateImages
 *   npx convex run seed:migrateProfileFiles
 */
import {v} from 'convex/values'
import profileJson from '../content/profile.json'
import projectIndex from '../content/project-index.json'
import projectMediaJson from '../content/project-media.json'
import clientsJson from '../content/site/clients.json'
import profilePl from '../content/site/profile-pl.json'
import profileUk from '../content/site/profile-uk.json'
import projectsPl from '../content/site/projects-pl.json'
import projectsUk from '../content/site/projects-uk.json'
import {internal} from './_generated/api'
import type {Id} from './_generated/dataModel'
import {internalAction, internalMutation, internalQuery} from './_generated/server'

const CV_NAME = 'Oleksandr-Dzisiak-CV.pdf'
const PHOTO_NAME = 'Oleksandr-Dzisiak.jpg'

/** Convex has no null for optional fields: drop nulls before inserting. */
function clean<T>(value: T): T {
  if (Array.isArray(value)) return value.map(clean) as T
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== null && item !== undefined)
        .map(([key, item]) => [key, clean(item)]),
    ) as T
  return value
}
const s = (value: string | null | undefined) => value ?? ''
const list = (value: (string | null)[] | null | undefined) =>
  (value ?? []).filter((item): item is string => !!item)
type Media = {
  desktop: string
  mobile?: string
  detail?: string
  detailWidth?: number
  detailHeight?: number
  video?: string
  kind?: 'website' | 'desktop' | 'extension'
  capturedOn: string
  sourceUrl: string
  resolvedUrl?: string
  view?: string
}

export const importContent = internalMutation({
  args: {force: v.optional(v.boolean())},
  handler: async (ctx, {force}) => {
    const existing = await ctx.db.query('projects').first()
    if (existing && !force) throw new Error('Content already exists. Pass {"force": true} to replace it.')
    for (const table of ['projects', 'experience', 'profile', 'clients'] as const)
      for (const doc of await ctx.db.query(table).collect()) await ctx.db.delete(doc._id)

    const p = profileJson
    await ctx.db.insert(
      'profile',
      clean({
        name: s(p.name),
        role: {en: s(p.role), pl: profilePl.role, uk: profileUk.role},
        description: {en: s(p.description), pl: profilePl.description, uk: profileUk.description},
        about: {en: s(p.about), pl: profilePl.about, uk: profileUk.about},
        contacts: {
          email: p.contacts.email,
          phoneNumber: p.contacts.phoneNumber,
          location: p.contacts.location,
          relocationReady: p.contacts.relocationReady,
          typeOfContract: p.contacts.typeOfContract ?? undefined,
        },
        links: p.links.map((link) => ({
          name: s(link.name),
          link: s(link.link),
          title: link.title ?? undefined,
          iconName: link.iconName ?? undefined,
        })),
        languages: p.languages.map((item) => ({language: s(item.language), level: item.level ?? undefined})),
        skillsFrontend: list(p.skillsFrontend),
        skillsBackend: list(p.skillsBackend),
        skillsDevOps: list(p.skillsDevOps),
        skillsOther: {en: list(p.skillsOther), pl: profilePl.skillsOther, uk: profileUk.skillsOther},
        softSkills: {
          en: p.softSkills.map((item) => ({skill: s(item.skill), description: item.description ?? undefined})),
          pl: profilePl.softSkills,
          uk: profileUk.softSkills,
        },
        interests: {en: list(p.interests), pl: profilePl.interests, uk: profileUk.interests},
        education: p.education.map((item, index) => ({
          institution: item.institution ?? undefined,
          specialization: {
            en: s(item.specialization),
            pl: profilePl.education[index],
            uk: profileUk.education[index],
          },
        })),
        courses: p.courses.map((course) => ({
          title: s(course.title),
          platform: course.platform ?? undefined,
          date: course.date ?? undefined,
          badges: course.badges ?? undefined,
          visibleOnCV: course.visibleOnCV ?? undefined,
        })),
        cvUrl: p.cvUrl,
        logoUrl: p.logoUrl,
        cv: {current: {path: p.cvFileUrl, name: CV_NAME, uploadedAt: Date.now()}, previous: []},
        photo: {current: {path: p.profilePhotoUrl, name: PHOTO_NAME, uploadedAt: Date.now()}, previous: []},
      }),
    )

    for (const [order, job] of p.workExperience.entries()) {
      const pl = profilePl.work[order]
      const uk = profileUk.work[order]
      await ctx.db.insert(
        'experience',
        clean({
          order,
          companyName: job.companyName ?? undefined,
          website: job.website ?? undefined,
          websiteName: job.websiteName ?? undefined,
          isRelated: !!job.isRelated,
          hideFromCV: !!job.hideFromCV,
          jobTitle: {en: s(job.jobTitle), pl: pl?.jobTitle, uk: uk?.jobTitle},
          jobTitle2: job.jobTitle2 ? {en: job.jobTitle2, pl: pl?.jobTitle2, uk: uk?.jobTitle2} : undefined,
          duration: {en: s(job.duration), pl: pl?.duration, uk: uk?.duration},
          location: {en: s(job.location), pl: pl?.location, uk: uk?.location},
          type: {en: s(job.type), pl: pl?.type, uk: uk?.type},
          description: {en: list(job.description), pl: pl?.description, uk: uk?.description},
        }),
      )
    }

    const mediaById = projectMediaJson as Record<string, Media>
    for (const [order, entry] of projectIndex.entries()) {
      const project = p.projects[entry.sourceIndex]
      const pl = projectsPl[entry.sourceIndex]
      const uk = projectsUk[entry.sourceIndex]
      const media = mediaById[entry.id]
      await ctx.db.insert(
        'projects',
        clean({
          slug: entry.slug,
          order,
          featured: entry.featured,
          title: s(project.title),
          description: {en: s(project.description), pl: pl?.description, uk: uk?.description},
          features: {en: list(project.features), pl: pl?.features, uk: uk?.features},
          technologies: list(project.technologies),
          url: project.url ?? undefined,
          urlToCode: project.urlToCode ?? undefined,
          petProject: !!project.petProject,
          isPinned: !!project.isPinned,
          nda: !!project.nda,
          gallery: list(project.imageUrls).map((path) => ({path})),
          media: media && {
            ...media,
            desktop: {path: media.desktop},
            mobile: media.mobile ? {path: media.mobile} : undefined,
            detail: media.detail ? {path: media.detail} : undefined,
          },
        }),
      )
    }

    for (const [order, client] of clientsJson.entries()) await ctx.db.insert('clients', {...client, order})
    return {projects: projectIndex.length, experience: p.workExperience.length, clients: clientsJson.length}
  },
})

export const pendingImages = internalQuery({
  args: {},
  handler: async (ctx) =>
    (await ctx.db.query('projects').collect()).map((project) => ({
      id: project._id,
      paths: [
        ...project.gallery,
        project.media?.desktop,
        project.media?.mobile,
        project.media?.detail,
      ].flatMap((item) => (item?.path && !item.storageId ? [item.path] : [])),
    })),
})

export const attachImage = internalMutation({
  args: {id: v.id('projects'), path: v.string(), storageId: v.id('_storage')},
  handler: async (ctx, {id, path, storageId}) => {
    const project = await ctx.db.get(id)
    if (!project) return
    const swap = <T extends {path?: string; storageId?: Id<'_storage'>}>(item: T) =>
      item.path === path && !item.storageId ? {...item, storageId} : item
    await ctx.db.patch(id, {
      gallery: project.gallery.map(swap),
      media: project.media && {
        ...project.media,
        desktop: swap(project.media.desktop),
        mobile: project.media.mobile && swap(project.media.mobile),
        detail: project.media.detail && swap(project.media.detail),
      },
    })
  },
})

/**
 * Copies each /public screenshot into Convex storage, fetching it from the live
 * site. The original path stays on the document as a fallback.
 */
export const migrateImages = internalAction({
  args: {siteUrl: v.optional(v.string())},
  handler: async (ctx, {siteUrl}) => {
    const origin = siteUrl ?? process.env.PUBLIC_SITE_URL ?? 'https://www.o-d.dev'
    const failed: string[] = []
    let stored = 0
    for (const {id, paths} of await ctx.runQuery(internal.seed.pendingImages, {})) {
      for (const path of new Set(paths)) {
        const response = await fetch(new URL(path, origin))
        if (!response.ok) {
          failed.push(`${path} (${response.status})`)
          continue
        }
        const storageId = await ctx.storage.store(await response.blob())
        await ctx.runMutation(internal.seed.attachImage, {id, path, storageId})
        stored++
      }
    }
    return {stored, failed}
  },
})

/** Moves the CV and photo from the old path fields into versioned file slots. */
export const profileFilesToSlots = internalMutation({
  args: {},
  handler: async (ctx) => {
    const profile = await ctx.db.query('profile').first()
    if (!profile) return
    const now = Date.now()
    await ctx.db.patch(profile._id, {
      cv: profile.cv ?? (profile.cvFileUrl ? {current: {path: profile.cvFileUrl, name: CV_NAME, uploadedAt: now}, previous: []} : undefined),
      photo:
        profile.photo ??
        (profile.profilePhotoUrl
          ? {current: {path: profile.profilePhotoUrl, name: PHOTO_NAME, uploadedAt: now}, previous: []}
          : undefined),
      cvFileUrl: undefined,
      profilePhotoUrl: undefined,
    })
  },
})

export const pendingProfileFiles = internalQuery({
  args: {},
  handler: async (ctx) => {
    const profile = await ctx.db.query('profile').first()
    return (['cv', 'photo'] as const).flatMap((slot) => {
      const current = profile?.[slot]?.current
      return current?.path && !current.storageId ? [{slot, path: current.path}] : []
    })
  },
})

export const attachProfileFile = internalMutation({
  args: {
    slot: v.union(v.literal('cv'), v.literal('photo')),
    storageId: v.id('_storage'),
    contentType: v.optional(v.string()),
    size: v.number(),
  },
  handler: async (ctx, {slot, ...file}) => {
    const profile = await ctx.db.query('profile').first()
    const value = profile?.[slot]
    if (!profile || !value) return
    await ctx.db.patch(profile._id, {[slot]: {...value, current: {...value.current, ...file}}})
  },
})

/** Copies the CV and photo from the live site into Convex storage. */
export const migrateProfileFiles = internalAction({
  args: {siteUrl: v.optional(v.string())},
  handler: async (ctx, {siteUrl}) => {
    await ctx.runMutation(internal.seed.profileFilesToSlots, {})
    const origin = siteUrl ?? process.env.PUBLIC_SITE_URL ?? 'https://www.o-d.dev'
    const done: string[] = []
    for (const {slot, path} of await ctx.runQuery(internal.seed.pendingProfileFiles, {})) {
      const response = await fetch(new URL(path, origin))
      if (!response.ok) throw new Error(`${path}: ${response.status}`)
      const blob = await response.blob()
      const storageId = await ctx.storage.store(blob)
      await ctx.runMutation(internal.seed.attachProfileFile, {
        slot,
        storageId,
        contentType: blob.type || undefined,
        size: blob.size,
      })
      done.push(slot)
    }
    return {stored: done}
  },
})

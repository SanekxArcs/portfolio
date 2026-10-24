import {authTables} from '@convex-dev/auth/server'
import {defineSchema, defineTable} from 'convex/server'
import {v} from 'convex/values'

/** English is required; Polish and Ukrainian fall back to it when empty. */
export const text = v.object({
  en: v.string(),
  pl: v.optional(v.string()),
  uk: v.optional(v.string()),
})
export const lines = v.object({
  en: v.array(v.string()),
  pl: v.optional(v.array(v.string())),
  uk: v.optional(v.array(v.string())),
})
/** A file in Convex storage, or a path under /public until it is migrated. */
export const image = v.object({
  storageId: v.optional(v.id('_storage')),
  path: v.optional(v.string()),
})
const softSkill = v.object({skill: v.string(), description: v.optional(v.string())})
export const storedFile = v.object({
  storageId: v.optional(v.id('_storage')),
  path: v.optional(v.string()),
  name: v.string(),
  contentType: v.optional(v.string()),
  size: v.optional(v.number()),
  uploadedAt: v.number(),
})
/** The live file plus the last versions it replaced, newest first. */
export const fileSlot = v.object({current: storedFile, previous: v.array(storedFile)})
export const fileSlots = ['cv', 'photo'] as const

export const projectFields = {
  slug: v.string(),
  order: v.number(),
  featured: v.boolean(),
  title: v.string(),
  description: text,
  features: lines,
  technologies: v.array(v.string()),
  url: v.optional(v.string()),
  urlToCode: v.optional(v.string()),
  petProject: v.boolean(),
  isPinned: v.boolean(),
  nda: v.boolean(),
  /** Screenshots shown when the project has no captured media. */
  gallery: v.array(image),
  media: v.optional(
    v.object({
      desktop: image,
      mobile: v.optional(image),
      detail: v.optional(image),
      detailWidth: v.optional(v.number()),
      detailHeight: v.optional(v.number()),
      video: v.optional(v.string()),
      kind: v.optional(v.union(v.literal('website'), v.literal('desktop'), v.literal('extension'))),
      capturedOn: v.string(),
      sourceUrl: v.string(),
      resolvedUrl: v.optional(v.string()),
      view: v.optional(v.string()),
    }),
  ),
}

export const experienceFields = {
  order: v.number(),
  companyName: v.optional(v.string()),
  website: v.optional(v.string()),
  websiteName: v.optional(v.string()),
  isRelated: v.boolean(),
  hideFromCV: v.boolean(),
  jobTitle: text,
  jobTitle2: v.optional(text),
  duration: text,
  location: text,
  type: text,
  description: lines,
}

export const profileFields = {
  name: v.string(),
  role: text,
  description: text,
  about: text,
  contacts: v.object({
    email: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    location: v.optional(v.string()),
    relocationReady: v.optional(v.boolean()),
    typeOfContract: v.optional(v.array(v.string())),
    workAvailability: v.optional(v.array(v.string())),
  }),
  links: v.array(
    v.object({
      name: v.string(),
      link: v.string(),
      title: v.optional(v.string()),
      iconName: v.optional(v.string()),
    }),
  ),
  languages: v.array(v.object({language: v.string(), level: v.optional(v.string())})),
  skillsFrontend: v.array(v.string()),
  skillsBackend: v.array(v.string()),
  skillsDevOps: v.array(v.string()),
  skillsOther: lines,
  softSkills: v.object({
    en: v.array(softSkill),
    pl: v.optional(v.array(softSkill)),
    uk: v.optional(v.array(softSkill)),
  }),
  interests: lines,
  education: v.array(v.object({institution: v.optional(v.string()), specialization: text})),
  courses: v.array(
    v.object({
      title: v.string(),
      platform: v.optional(v.string()),
      date: v.optional(v.string()),
      badges: v.optional(v.array(v.string())),
      visibleOnCV: v.optional(v.boolean()),
    }),
  ),
  cvUrl: v.optional(v.string()),
  logoUrl: v.optional(v.string()),
}

export const clientFields = {
  order: v.number(),
  name: v.string(),
  url: v.string(),
  featured: v.boolean(),
  linked: v.boolean(),
}

export default defineSchema({
  ...authTables,
  projects: defineTable(projectFields).index('by_order', ['order']).index('by_slug', ['slug']),
  experience: defineTable(experienceFields).index('by_order', ['order']),
  // Files are changed only through their own upload/restore mutations, never by a profile save.
  profile: defineTable({
    ...profileFields,
    cv: v.optional(fileSlot),
    photo: v.optional(fileSlot),
    // Paths from before the file slots; cleared by seed:migrateProfileFiles.
    cvFileUrl: v.optional(v.string()),
    profilePhotoUrl: v.optional(v.string()),
  }),
  clients: defineTable(clientFields).index('by_order', ['order']),
})

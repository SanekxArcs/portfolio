import type {Infer} from 'convex/values'
import {query, type QueryCtx} from './_generated/server'
import type {image} from './schema'

type Image = Infer<typeof image>

export async function imageUrl(ctx: QueryCtx, img: Image | undefined) {
  if (!img) return undefined
  if (img.storageId) return (await ctx.storage.getUrl(img.storageId)) ?? img.path
  return img.path
}

/**
 * Everything the public site renders, in one read. The site caches this and
 * the admin expires that cache after each save.
 */
export const snapshot = query({
  args: {},
  handler: async (ctx) => {
    const [profile, experience, projects, clients] = await Promise.all([
      ctx.db.query('profile').first(),
      ctx.db.query('experience').withIndex('by_order').collect(),
      ctx.db.query('projects').withIndex('by_order').collect(),
      ctx.db.query('clients').withIndex('by_order').collect(),
    ])
    const live = async (slot: {current: Image} | undefined) => imageUrl(ctx, slot?.current)
    return {
      profile: profile && {
        ...profile,
        // Storage details stay private; the site only needs the live URLs.
        cv: undefined,
        photo: undefined,
        cvFileName: profile.cv?.current.name,
        cvFileUrl: (await live(profile.cv)) ?? profile.cvFileUrl,
        profilePhotoUrl: (await live(profile.photo)) ?? profile.profilePhotoUrl,
      },
      experience,
      clients,
      projects: await Promise.all(
        projects.map(async ({gallery, media, ...project}) => ({
          ...project,
          gallery: (await Promise.all(gallery.map((item) => imageUrl(ctx, item)))).filter(
            (url): url is string => !!url,
          ),
          media: media && {
            ...media,
            desktop: (await imageUrl(ctx, media.desktop)) ?? '',
            mobile: await imageUrl(ctx, media.mobile),
            detail: await imageUrl(ctx, media.detail),
          },
        })),
      ),
    }
  },
})

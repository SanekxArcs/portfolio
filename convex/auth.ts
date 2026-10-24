import {Password} from '@convex-dev/auth/providers/Password'
import {convexAuth, getAuthUserId} from '@convex-dev/auth/server'
import {ConvexError} from 'convex/values'
import type {QueryCtx} from './_generated/server'

const isAdminEmail = (email: unknown) =>
  typeof email === 'string' &&
  !!process.env.ADMIN_EMAIL &&
  email.trim().toLowerCase() === process.env.ADMIN_EMAIL.trim().toLowerCase()

export const {auth, signIn, signOut, store, isAuthenticated} = convexAuth({
  providers: [
    Password({
      // Only the address in ADMIN_EMAIL may create an account or sign in.
      profile(params) {
        if (!isAdminEmail(params.email)) throw new ConvexError('This account cannot sign in.')
        return {email: String(params.email).trim().toLowerCase()}
      },
    }),
  ],
})

export async function requireAdmin(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx)
  const user = userId && (await ctx.db.get(userId))
  if (!user || !isAdminEmail(user.email)) throw new ConvexError('Not signed in as the admin.')
  return user
}

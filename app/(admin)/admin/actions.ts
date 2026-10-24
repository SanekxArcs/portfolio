'use server'

import {convexAuthNextjsToken} from '@convex-dev/auth/nextjs/server'
import {fetchQuery} from 'convex/nextjs'
import {updateTag} from 'next/cache'
import {api} from '@/convex/_generated/api'
import {contentTag} from '@/lib/studio-content'

/** Expires the site's cached content so the next visit renders the new version. */
export async function publishContent() {
  const me = await fetchQuery(api.admin.me, {}, {token: await convexAuthNextjsToken()})
  if (!me?.admin) throw new Error('Not signed in as the admin.')
  updateTag(contentTag)
}

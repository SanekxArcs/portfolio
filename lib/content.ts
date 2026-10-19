import 'server-only'
import type {CvProfile} from '@/components/cv/types'
import profile from '@/content/profile.json'

/** Public content boundary. Replace this local adapter with Convex after the design phase. */
export async function getProfile(): Promise<CvProfile> {
  return profile
}

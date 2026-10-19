import type {CvLink} from '@/components/cv/types'
/** Keep source notes (which can contain contact details) out of visible social labels. */
export function socialLabel(link: CvLink): string {
  const url = link.link?.toLowerCase() ?? ''
  if (url.includes('github.com')) return 'GitHub'
  if (url.includes('linkedin.com')) return 'LinkedIn'
  if (url.includes('t.me/') || url.includes('telegram')) return 'Telegram'
  return link.title?.split(':')[0] || link.iconName || 'Link'
}

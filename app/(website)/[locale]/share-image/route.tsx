import {isLocale} from '@/lib/i18n/locales'
import SocialImage from '@/lib/social-image'

// A stable URL lets every localized page explicitly share the same brand card.
export async function GET(
  _request: Request,
  context: {params: Promise<{locale: string}>},
) {
  const {locale} = await context.params
  if (!isLocale(locale)) return new Response(null, {status: 404})
  return SocialImage({params: Promise.resolve({locale})})
}

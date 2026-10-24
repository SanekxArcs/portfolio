import {MotionText} from '@/components/studio/motion-text'
import {socialLabel} from '@/lib/social-links'
import {notFound} from 'next/navigation'
import {getDictionary} from '@/lib/i18n/dictionaries'
import {getLocalizedProfile} from '@/lib/studio-content'
import {isLocale} from '@/lib/i18n/locales'
import {studioMetadata} from '@/lib/studio-metadata'
import {PageIntro} from '@/components/studio/pages'
import {JsonLd, pageGraph} from '@/lib/structured-data'
import {ContactIcons} from '@/components/studio/footer'
import {EnquiryForm} from '@/components/studio/enquiry-form'
type Props = {
  params: Promise<{locale: string}>
  searchParams: Promise<{intent?: string; service?: string}>
}
export async function generateMetadata({params}: Props) {
  const {locale} = await params
  return isLocale(locale) ? studioMetadata(locale, '/contact', 'contact') : {}
}
export default async function Page({params, searchParams}: Props) {
  const {locale} = await params
  if (!isLocale(locale)) notFound()
  const query = await searchParams,
    d = getDictionary(locale),
    profile = await getLocalizedProfile(locale)
  return (
    <>
      <JsonLd data={await pageGraph(locale, 'contact')} />
      <PageIntro
        title={d.contact.title}
        intro={d.contact.intro}
      />
      <section className="studio-wrap studio-contact-layout">
        <EnquiryForm
          key={String(query.intent) + String(query.service)}
          d={d}
          email={profile.contacts?.email ?? ''}
          initialMode={query.intent === 'hiring' ? 'hiring' : 'project'}
          initialService={query.service ?? ''}
        />
        <aside className="contact-aside">
          <h2>
            <MotionText text={d.contact.direct} />
          </h2>
          <p>
            <MotionText text={d.contact.available} />
          </p>
          <ContactIcons profile={profile} d={d} />
          <p className="studio-eyebrow">
            <MotionText text={d.contact.social} />
          </p>
          <div className="studio-social-links">
            {profile.links
              ?.filter((link) => link.link)
              .map((link, index) => (
                <a
                  href={link.link!}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={index}
                >
                  <MotionText text={socialLabel(link)} />
                </a>
              ))}
          </div>
        </aside>
      </section>
    </>
  )
}

import {MotionText} from '@/components/studio/motion-text'
import {socialLabel} from '@/lib/social-links'
import {StudioLink as Link} from '@/components/studio/transitions'
import {ArrowUp, Mail, Phone} from 'lucide-react'
import {Github, Linkedin, Telegram} from '@/components/icons/brand-icons'
import type {CvProfile} from '@/components/cv/types'
import type {Dictionary} from '@/lib/i18n/dictionaries'
import type {Locale} from '@/lib/i18n/locales'
import {CopyEmail, FooterClock, FooterStage, FooterWordmark} from './footer-stage'

export function ContactIcons({
  profile,
  d,
}: {
  profile: CvProfile
  d: Dictionary
}) {
  return (
    <div className="studio-contact-icons">
      {profile.contacts?.email && (
        <a
          className="studio-icon-button"
          href={`mailto:${profile.contacts.email}`}
          aria-label={d.footer.email}
          title={d.footer.email}
        >
          <Mail size={18} />
        </a>
      )}
      {profile.contacts?.phoneNumber && (
        <a
          className="studio-icon-button"
          href={`tel:${profile.contacts.phoneNumber}`}
          aria-label={d.footer.phone}
          title={d.footer.phone}
        >
          <Phone size={18} />
        </a>
      )}
    </div>
  )
}

/** A full-screen closing stage: copy the email, see the local time, then the giant wordmark. */
export function StudioFooter({
  locale,
  d,
  profile,
}: {
  locale: Locale
  d: Dictionary
  profile: CvProfile
}) {
  const email = profile.contacts?.email
  return (
    <footer className="studio-footer">
      <div className="footer-logo-arrival studio-wrap" aria-hidden="true">
        <div className="footer-logo-dock" data-logo-dock />
      </div>
      <FooterStage>
        <div className="footer-top">
          <FooterClock
            locale={locale}
            label={d.footer.localTime}
            note={d.footer.anyTime}
          />
          <a href="#top" className="footer-top-link" aria-label={d.footer.top}>
            <ArrowUp size={20} />
          </a>
        </div>
        <div className="footer-lead">
          <h2>
            <MotionText text={d.footer.heading} />
          </h2>
          {email && (
            <>
              <CopyEmail
                email={email}
                copyLabel={d.footer.copy}
                copiedLabel={d.footer.copied}
              />
              <div className="footer-lead-actions">
                <a href={`mailto:${email}`} className="footer-pill">
                  <Mail size={16} aria-hidden="true" />
                  <MotionText text={d.footer.write} />
                </a>
                {profile.contacts?.phoneNumber && (
                  <a
                    href={`tel:${profile.contacts.phoneNumber}`}
                    className="footer-pill"
                  >
                    <Phone size={16} aria-hidden="true" />
                    <MotionText text={d.footer.phone} />
                  </a>
                )}
              </div>
            </>
          )}
        </div>
        <div className="footer-links">
          <nav aria-label={d.nav.menu}>
            {[
              ['/work', d.nav.work],
              ['/services', d.nav.services],
              ['/experience', d.nav.experience],
              ['/contact', d.nav.contact],
            ].map(([url, title]) => (
              <Link key={url} href={`/${locale}${url}`} className="footer-roll">
                <span className="footer-roll-track">
                  <span>{title}</span>
                  <span aria-hidden="true">{title}</span>
                </span>
              </Link>
            ))}
          </nav>
          <div className="footer-socials">
            {profile.links
              ?.filter((link) => link.link)
              .map((link) => {
                const label = socialLabel(link)
                const Icon =
                  label === 'GitHub'
                    ? Github
                    : label === 'LinkedIn'
                      ? Linkedin
                      : label === 'Telegram'
                        ? Telegram
                        : null
                return (
                  <a
                    key={link.link}
                    href={link.link!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                  >
                    {Icon ? <Icon width={20} height={20} aria-hidden="true" /> : label}
                  </a>
                )
              })}
          </div>
        </div>
        <FooterWordmark text="O.D. EMPOWER" />
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} O.D. EMPOWER.{' '}
            <MotionText text={d.footer.rights} />
          </span>
          <span>
            <MotionText text={d.footer.built} />
          </span>
        </div>
      </FooterStage>
    </footer>
  )
}

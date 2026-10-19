import {MotionText} from '@/components/studio/motion-text'
import {socialLabel} from '@/lib/social-links'
import {StudioLink as Link} from '@/components/studio/transitions'
import {ArrowUp, ArrowUpRight, Mail, Phone} from 'lucide-react'
import {BrandMark} from '@/components/brand-mark'
import type {CvProfile} from '@/components/cv/types'
import type {Dictionary} from '@/lib/i18n/dictionaries'
import type {Locale} from '@/lib/i18n/locales'

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
export function StudioFooter({
  locale,
  d,
  profile,
}: {
  locale: Locale
  d: Dictionary
  profile: CvProfile
}) {
  return (
			<footer className="studio-footer studio-wrap">
        <div className="footer-logo-arrival" aria-hidden="true"><div className="footer-logo-dock" data-logo-dock /></div>
				<div className="studio-footer-main">
					<div>
						<Link href={`/${locale}`} className="studio-wordmark">
							<BrandMark logoUrl={profile.logoUrl} threeD />
								<span className="-ml-2">.dev</span>
						</Link>
						<p>
							<MotionText text={d.footer.text} />
						</p>
					</div>
					<nav aria-label={d.nav.menu}>
						{[
							["/work", d.nav.work],
							["/services", d.nav.services],
							["/experience", d.nav.experience],
							["/contact", d.nav.contact],
						].map(([url, title]) => (
							<Link key={url} href={`/${locale}${url}`}>
								<MotionText text={title} />
								<ArrowUpRight size={13} />
							</Link>
						))}
					</nav>
					<div>
						<ContactIcons profile={profile} d={d} />
						<div className="studio-social-links">
							{profile.links
								?.filter((link) => link.link)
								.map((link, i) => (
									<a
										key={i}
										href={link.link!}
										target="_blank"
										rel="noopener noreferrer"
									>
										<MotionText text={socialLabel(link)} />
										<ArrowUpRight size={12} />
									</a>
								))}
						</div>
					</div>
				</div>
				<div className="studio-footer-bottom">
					<span>
						© {new Date().getFullYear()} O.D. EMPOWER.{" "}
						<MotionText text={d.footer.rights} />
					</span>
					<span>
						<MotionText text={d.footer.built} />
					</span>
					<a href="#top" aria-label={d.footer.top}>
						<ArrowUp size={16} />
					</a>
				</div>
			</footer>
		);
}

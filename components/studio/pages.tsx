import {MotionText} from '@/components/studio/motion-text'
import {MotionNumber} from './motion-text'
import {MotionDisclosure} from './disclosure'
import {ProjectCard} from './project-card'
import { ProjectPreview } from "./project-preview";
import {VideoPlayer} from './video-player'
import {StudioLink as Link} from '@/components/studio/transitions'
import Image from 'next/image'
import {
  ArrowUpRight,
  ArrowRight,
  CircleCheck,
  Globe,
  Layers,
  Workflow,
  Sparkles,
  LockKeyhole,
  Download,
  ExternalLink,
  MapPin,
} from 'lucide-react'
import {getDictionary, type Dictionary} from '@/lib/i18n/dictionaries'
import type {Locale} from '@/lib/i18n/locales'
import {
  getClients,
  getFeaturedProjects,
  getLocalizedProfile,
  getProjects,
  type StudioProject,
} from '@/lib/studio-content'
import {StudioIdentity} from './identity'
import {StudioClients} from './clients'
import {CtaWaves} from './cta-waves'
import {ContactIcons} from './footer'

export function SectionTitle({
  title,
  text,
  action,
}: {
  title: string
  text?: string
  action?: React.ReactNode
}) {
  return (
    <div className="studio-section-heading" data-reveal>
      <div>
        <h2>
          <MotionText text={title} />
        </h2>
        {text && <p className="studio-section-intro">{text}</p>}
      </div>
      {action}
    </div>
  )
}
export function StudioCta({locale, d}: {locale: Locale; d: Dictionary}) {
  return (
    <section className="studio-cta studio-wrap" data-reveal>
      <div className="studio-cta-inner">
        <h2>
          <MotionText name="text-d-cta-title-1" text={d.cta.title} />
        </h2>
        <div className="studio-actions">
          <Link href={`/${locale}/contact`} className="studio-button primary">
            <MotionText name="text-d-cta-button-1" text={d.cta.button} />
          </Link>
          <Link href={`/${locale}/experience`} className="studio-text-link">
            <MotionText name="text-d-cta-secondary-1" text={d.cta.secondary} />
          </Link>
        </div>
        <div className="cta-art-clip"><CtaWaves /></div>
        <div className="cta-logo-dock" data-logo-dock aria-hidden="true" />
      </div>
    </section>
  )
}
const serviceIcons = [Globe, Layers, Workflow, Sparkles]
export function ServiceList({
  locale,
  d,
  detailed = false,
  heading: Heading = 'h3',
}: {
  locale: Locale
  d: Dictionary
  detailed?: boolean
  /** h2 where the list sits straight under the page h1, h3 under a section heading. */
  heading?: 'h2' | 'h3'
}) {
  return (
    <div
      className={`studio-service-list ${detailed ? 'service-detailed' : ''}`}
    >
      {d.services.items.map((item, index) => {
        const Icon = serviceIcons[index]
        return (
          <Link
            className="studio-service"
            key={item.id}
            href={`/${locale}/contact?service=${item.id}`}
            aria-label={`${d.services.discuss}: ${item.title}`}
            data-reveal
          >
            <span className="service-number">
              <MotionNumber value={index + 1} pad={2} />
            </span>
            <div className="service-heading">
              <Icon size={26} strokeWidth={1.2} />
              <Heading>
                <MotionText text={item.title} />
              </Heading>
            </div>
            <div className="service-description">
              <p>
                <MotionText text={item.text} />
              </p>
              {detailed && (
                <>
                  <p className="studio-eyebrow service-includes">
                    <MotionText text={d.services.include} />
                  </p>
                  <ul>
                    {item.deliverables.map((line) => (
                      <li key={line}>
                        <MotionText text={line} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <span className="service-arrow" aria-hidden="true">
              <ArrowUpRight size={24} />
            </span>
          </Link>
        )
      })}
    </div>
  )
}
export function Process({d}: {d: Dictionary}) {
  return (
    <section className="studio-section studio-wrap">
      <SectionTitle title={d.process.title} />
      <div className="studio-process">
        {d.process.items.map((item, index) => (
          <article key={item.title} data-reveal>
            <div>
              <span>
                <MotionNumber value={index + 1} pad={2} />
              </span>
              {index === d.process.items.length - 1 ? (
                <CircleCheck size={18} className="process-complete" aria-hidden="true" />
              ) : (
                <ArrowRight size={18} aria-hidden="true" />
              )}
            </div>
            <h3>
              <MotionText text={item.title} />
            </h3>
            <p>
              <MotionText text={item.text} />
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
export async function HomePage({locale}: {locale: Locale}) {
  const d = getDictionary(locale),
    profile = await getLocalizedProfile(locale),
    featured = await getFeaturedProjects(locale),
    clients = await getClients()
  return (
			<>
				<section
					className="studio-home-hero studio-wrap"
					aria-labelledby="studio-hero-heading"
				>
					<div className="hero-main">
						<div className="studio-hero-copy">
							<h1 id="studio-hero-heading">
								<MotionText text={d.hero.line1} />
								<br />
								{' '}
								<MotionText text={d.hero.line2} />
							</h1>
							<p className="studio-hero-intro">
								<MotionText
									className="text-balance"
									name="text-d-hero-intro-1"
									text={d.hero.intro}
								/>
							</p>
							<div className="studio-actions">
								<Link
									className="studio-button primary"
									href={`/${locale}/contact`}
								>
									<MotionText
										name="text-d-hero-primary-1"
										text={d.hero.primary}
									/>
								</Link>
								<Link
									className="studio-text-link"
									href={`/${locale}/experience`}
								>
									<MotionText
										name="text-d-hero-secondary-1"
										text={d.hero.secondary}
									/>
								</Link>
							</div>
						</div>
						<div className="studio-hero-art">
							<StudioIdentity profile={profile} d={d} />
							<p className="hero-art-caption">
								<MotionText
									name="text-d-hero-caption-1"
									text={d.hero.caption}
								/>
							</p>
						</div>
					</div>
				</section>
				<section id="selected-work" className="studio-section studio-wrap">
					<SectionTitle
						title={d.home.workTitle}
						text={d.home.workIntro}
						action={
							<Link className="studio-text-link" href={`/${locale}/work`}>
								<MotionText
									name="text-d-home-allWork-1"
									text={d.home.allWork}
								/>
							</Link>
						}
					/>
					<div className="studio-featured-grid">
						{featured.map((project, index) => (
							<ProjectCard
								key={project.id}
								project={project}
								locale={locale}
								d={d}
								large={index === 0}
							/>
						))}
					</div>
				</section>
				<StudioClients d={d} clients={clients} />
				<section className="studio-section studio-wrap">
					<SectionTitle
						title={d.home.servicesTitle}
						action={
							<Link href={`/${locale}/services`} className="studio-text-link">
								<MotionText
									name="text-d-home-allServices-1"
									text={d.home.allServices}
								/>
							</Link>
						}
					/>
					<ServiceList locale={locale} d={d} />
				</section>
				<Process d={d} />
				<section
					className="studio-section studio-wrap studio-about-teaser"
					data-reveal
				>
					<div className="studio-about-image">
						{profile.profilePhotoUrl && (
							<Image
								src={profile.profilePhotoUrl}
								width={600}
								height={700}
								alt={profile.name ?? "Oleksandr Dzisiak"}
								sizes="(max-width:760px) 90vw, 450px"
							/>
						)}
					</div>
					<div>
						<h2>
							<MotionText
								name="text-d-home-aboutTitle-1"
								text={d.home.aboutTitle}
							/>
						</h2>
						<p>
							<MotionText
								name="text-d-home-aboutText-1"
								text={d.home.aboutText}
							/>
						</p>
						<Link className="studio-hiring-note" href={`/${locale}/experience`}>
							<div>
								<h3>
									<MotionText name="text-d-home-hiring-1" text={d.home.hiring} />
								</h3>
								<p>
									<MotionText
										name="text-d-home-hiringText-1"
										text={d.home.hiringText}
									/>
								</p>
							</div>
							<ArrowUpRight size={22} aria-hidden="true" />
						</Link>
					</div>
				</section>
				<StudioCta locale={locale} d={d} />
			</>
		);
}
export function PageIntro({
  title,
  intro,
}: {
  title: string
  intro: string
}) {
  return (
    <div className="studio-page-intro studio-wrap">
      <h1>
        <MotionText name="text-page-title" text={title} />
      </h1>
      <p>
        <MotionText name="text-page-intro" text={intro} />
      </p>
    </div>
  )
}
export function ServicesPage({locale}: {locale: Locale}) {
  const d = getDictionary(locale)
  return (
    <>
      <PageIntro
        title={d.services.title}
        intro={d.services.intro}
      />
      <section className="studio-wrap">
        <ServiceList locale={locale} d={d} detailed heading="h2" />
      </section>
      <Process d={d} />
      <section className="studio-section studio-wrap studio-faq">
        <h2>
          <MotionText text={d.services.faqTitle} />
        </h2>
        <div>
          {d.services.faq.map((item) => (
            <MotionDisclosure key={item.q} label={item.q}>
              <p>
                <MotionText text={item.a} />
              </p>
            </MotionDisclosure>
          ))}
        </div>
      </section>
      <StudioCta locale={locale} d={d} />
    </>
  )
}
export async function ProjectPage({
  locale,
  project,
}: {
  locale: Locale
  project: StudioProject
}) {
  const d = getDictionary(locale)
  const title = project.nda ? d.work.ndaTitle : project.title
  const all = await getProjects(locale),
    next =
      all[(all.findIndex((item) => item.id === project.id) + 1) % all.length]
  return (
			<>
				<section className="studio-case-intro studio-wrap">
					<Link href={`/${locale}/work`} className="studio-text-link">
						<MotionText text={d.work.back} />
					</Link>
					<h1>
						<MotionText text={title} />
					</h1>
					<p className="case-kind">
						{project.nda
							? d.work.confidential
							: project.petProject
								? d.work.independent
								: d.work.commercial}
					</p>
					<div className="studio-actions">
						{project.url && !project.nda && (
							<a
								href={project.url}
								target="_blank"
								rel="noopener noreferrer"
								className="studio-button primary"
							>
								<MotionText text={project.media?.kind === 'extension' ? d.work.extension : d.work.visit} />
								<ExternalLink size={16} aria-hidden="true" />
							</a>
						)}
						{project.urlToCode && !project.nda && (
							<a
								href={project.urlToCode}
								target="_blank"
								rel="noopener noreferrer"
								className="studio-button secondary"
							>
								<MotionText text={d.work.code} />
								<ExternalLink size={16} />
							</a>
						)}
					</div>
				</section>
				<div className="studio-wrap">
					<div
						className={`case-hero-image ${project.media?.video ? 'case-hero-image--video' : project.media ? "case-hero-image--mockup" : ""}`}
					>
						{project.media?.video && !project.nda ? (
                <VideoPlayer
                  src={project.media.video}
                  poster={project.media.desktop}
                  title={title}
                  d={d}
                />
              ) : project.imageUrls?.[0] && !project.nda ? (
							project.media ? (
								<ProjectPreview project={project} d={d} priority />
							) : (
								<Image
									src={project.imageUrls[0]}
									width={1600}
									height={1000}
									priority
									sizes="100vw"
									alt={`${d.work.imageAlt} — ${title}`}
								/>
							)
						) : (
							<div className="case-nda">
								<LockKeyhole size={42} strokeWidth={1} />
								<p>
									<MotionText text={d.work.nda} />
								</p>
							</div>
						)}
					</div>
				</div>
				<section className="studio-section studio-wrap case-overview">
					<div>
						<h2>
							<MotionText text={d.work.overview} />
						</h2>
						<p>
							<MotionText text={project.description} />
						</p>
						<p className="case-attribution">
							<MotionText text={d.work.attribution} />
						</p>
					</div>
					<aside>
						<h3>
							<MotionText text={d.work.features} />
						</h3>
						<ul>
							{project.features?.map((feature, index) => (
								<li key={index}>
									<MotionText text={feature} />
								</li>
							))}
						</ul>
						<h3>
							<MotionText text={d.work.stack} />
						</h3>
						<div className="studio-tags">
							{project.technologies?.map((tech, index) => (
								<span key={index}>{tech}</span>
							))}
						</div>
					</aside>
				</section>
				{!project.nda && !!project.imageUrls?.slice(1).length && (
					<section className="studio-section studio-wrap case-gallery">
						<h2>
							<MotionText text={d.work.gallery} />
						</h2>
						{project.imageUrls
							.slice(1)
							.filter(Boolean)
							.map((url, index) => (
								<Image
									key={url}
									src={url!}
									unoptimized={project.media?.detail === url}
									width={
										project.media?.detail === url
											? (project.media.detailWidth ?? 1400)
											: 1400
									}
									height={
										project.media?.detail === url
											? (project.media.detailHeight ?? 950)
											: 950
									}
									sizes="100vw"
									alt={`${d.work.imageAlt} — ${title} / ${index + 2}`}
									data-reveal
								/>
							))}
					</section>
				)}
				<div className="studio-wrap case-next">
          <Link href={`/${locale}/work/${next.slug}`}>
            <div>
              <span className="studio-eyebrow"><MotionText text={d.work.related} /></span>
              <span className="case-next-title">{next.nda ? d.work.ndaTitle : next.title}</span>
            </div>
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
        <StudioCta locale={locale} d={d} />
			</>
		);
}
export async function ExperiencePage({locale}: {locale: Locale}) {
  const d = getDictionary(locale),
    p = await getLocalizedProfile(locale),
    e = d.experience
  const jobs = p.workExperience ?? [],
    relevant = jobs.filter((item) => item.isRelated),
    earlier = jobs.filter((item) => !item.isRelated)
  const jobList = (items: typeof jobs) => (
    <div className="career-timeline">
      {items.map((job, index) => (
        <article key={`${job.companyName}-${job.duration}`} data-reveal>
          <div className="career-dates">
            <span>
              <MotionText text={job.duration} />
            </span>
            <span>
              <MotionText text={job.location} />{' '}
              {job.type ? ` / ${job.type}` : ''}
            </span>
          </div>
          <div className="career-detail">
            <p className="career-company">
              <MotionText text={job.companyName} />
              {job.website && (
                <a
                  href={job.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${e.website}: ${job.companyName}`}
                >
                  <ArrowUpRight size={14} />
                </a>
              )}
            </p>
            <h3>
              <MotionText text={job.jobTitle} />
              {job.jobTitle2 && (
                <>
                  {' '}
                  <ArrowRight size={16} /> <MotionText text={job.jobTitle2} />
                </>
              )}
            </h3>
            <ul>
              {job.description?.map((line, i) => (
                <li key={i}>
                  <MotionText text={line} />
                </li>
              ))}
            </ul>
          </div>
          <span className="career-index">
            <MotionNumber value={index + 1} pad={2} />
          </span>
        </article>
      ))}
    </div>
  )
  return (
    <>
      <section id="profile" className="studio-career-hero studio-wrap">
        <div>
          <h1>
            <MotionText text={p.name} />
          </h1>
          <p className="career-role">
            <MotionText name="text-e-role-1" text={e.role} />
          </p>
          <p>
            <MotionText name="text-e-intro-1" text={e.intro} />
          </p>
          {/* Everything about the CV sits together: the file, the online copy and its language. */}
          <div className="studio-actions">
            {p.cvFileUrl && (
              <a href={p.cvFileUrl} download className="studio-button primary">
                <Download size={16} aria-hidden="true" />
                <MotionText name="text-e-download-1" text={e.download} />
              </a>
            )}
            {p.cvUrl && (
              <a
                href={p.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="studio-button secondary"
              >
                <MotionText name="text-e-view-1" text={e.view} />
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            )}
          </div>
          <p className="career-cv-note">
            <MotionText name="text-e-cvLanguage-1" text={e.cvLanguage} />
          </p>
        </div>
        <aside className="career-profile-card">
          {p.profilePhotoUrl && (
            <Image
              src={p.profilePhotoUrl}
              width={350}
              height={400}
              alt={p.name ?? ''}
              priority
            />
          )}
          <dl>
            <div>
              <dt>
                <MotionText name="text-e-location-1" text={e.location} />
              </dt>
              <dd>
                <MapPin size={14} />
                {p.contacts?.location === 'Poland'
                  ? e.poland
                  : p.contacts?.location}
              </dd>
            </div>
            <div>
              <dt>
                <MotionText name="text-e-relocation-1" text={e.relocation} />
              </dt>
              <dd>
                <MotionText
                  text={
                    p.contacts?.relocationReady
                      ? e.relocationYes
                      : e.relocationNo
                  }
                />
              </dd>
            </div>
            <div>
              <dt>
                <MotionText
                  name="text-e-availability-1"
                  text={e.availability}
                />
              </dt>
              <dd>
                <MotionText
                  text={(
                    p.contacts?.workAvailability ??
                    p.contacts?.typeOfContract?.filter((value) =>
                      ['Full-time', 'Part-time'].includes(value),
                    )
                  )
                    ?.map((value) =>
                      value === 'Full-time'
                        ? e.fulltime
                        : value === 'Part-time'
                          ? e.parttime
                          : value,
                    )
                    .join(' / ')}
                />
              </dd>
            </div>
            <div>
              <dt>
                <MotionText name="text-e-contract-1" text={e.contract} />
              </dt>
              <dd>
                <MotionText
                  text={p.contacts?.typeOfContract
                    ?.filter(
                      (value) => !['Full-time', 'Part-time'].includes(value),
                    )
                    .map((value) =>
                      value === 'Contract' ? e.contractType : value,
                    )
                    .join(' / ')}
                />
              </dd>
            </div>
          </dl>
          <div className="career-languages">
            <p className="studio-eyebrow">
              <MotionText name="text-e-languages-1" text={e.languages} />
            </p>
            {p.languages?.map((language) => (
              <span key={language.language}>
                <MotionText
                  text={
                    language.language === 'Ukrainian'
                      ? e.ukrainian
                      : language.language === 'Polish' ||
                          language.language === 'Poland'
                        ? e.polish
                        : e.english
                  }
                />
                <b>
                  <MotionText
                    text={
                      language.level === 'Native' ? e.native : language.level
                    }
                  />
                </b>
              </span>
            ))}
          </div>
          <div className="career-contact">
            <Link
              href={`/${locale}/contact?intent=hiring`}
              className="studio-text-link"
            >
              <MotionText name="text-e-contact-1" text={e.contact} />
            </Link>
            <ContactIcons profile={p} d={d} />
          </div>
        </aside>
      </section>
      <section id="about" className="studio-wrap studio-section career-about">
        <div>
          <h2>
            <MotionText name="text-e-about-1" text={e.about} />
          </h2>
        </div>
        <p>
          <MotionText name="text-p-about-1" text={p.about} />
        </p>
      </section>
      <section id="experience" className="studio-wrap studio-section">
        <SectionTitle title={e.history} />
        {jobList(relevant)}
        {!!earlier.length && (
          <MotionDisclosure
            className="career-earlier"
            label={
              <>
                <MotionText name="text-e-earlier-1" text={e.earlier} />
                <span className="disclosure-count">
                  <MotionNumber value={earlier.length} />
                </span>
              </>
            }
          >
            {jobList(earlier)}
          </MotionDisclosure>
        )}
      </section>
      <section id="skills" className="studio-section studio-wrap">
        <SectionTitle title={e.skills} />
        <div className="career-skills">
          {[
            [e.frontend, p.skillsFrontend],
            [e.backend, p.skillsBackend],
            [e.devops, p.skillsDevOps],
            [e.other, p.skillsOther],
          ].map(([title, skills]) => (
            <div key={title as string} data-reveal>
              <h3>{title as string}</h3>
              <div className="studio-tags">
                {(skills as string[] | null)?.map((skill, index) => (
                  <span key={index}>
                    <MotionText text={skill} />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="studio-section studio-wrap">
        <SectionTitle title={e.strengths} />
        <div className="career-strengths">
          {p.softSkills?.map((item, index) => (
            <article key={index} data-reveal>
              <span>
                <MotionNumber value={index + 1} pad={2} />
              </span>
              <h3>
                <MotionText text={item.skill} />
              </h3>
              <p>
                <MotionText text={item.description} />
              </p>
            </article>
          ))}
        </div>
      </section>
      <section
        id="education"
        className="studio-section studio-wrap career-learning"
      >
        <div>
          <h2>
            <MotionText name="text-e-education-1" text={e.education} />
          </h2>
          {p.education?.map((item, index) => (
            <article key={index}>
              <h3>
                <MotionText text={item.institution} />
              </h3>
              <p>
                <MotionText text={item.specialization} />
              </p>
            </article>
          ))}
        </div>
        <div>
          <h2>
            <MotionText name="text-e-courses-1" text={e.courses} />
          </h2>
          <p className="career-course-note">
            <MotionText name="text-e-courseTitles-1" text={e.courseTitles} />
          </p>
          {p.courses?.map((course, index) => (
            <article key={index}>
              <span>
                <MotionText text={course.date} />
              </span>
              <h3>
                <MotionText text={course.title} />
              </h3>
              <p>
                <MotionText text={course.platform} />
              </p>
              <div className="studio-tags">
                {course.badges?.map((badge, i) => (
                  <span key={i}>
                    <MotionText text={badge} />
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="studio-section studio-wrap career-interests">
        <h2>
          <MotionText name="text-e-interests-1" text={e.interests} />
        </h2>
        <div className="studio-tags">
          {p.interests?.map((interest) => (
            <span key={interest}>
              <MotionText text={interest} />
            </span>
          ))}
        </div>
      </section>
      <div id="projects" className="studio-wrap career-project-link">
        <h2>
          <MotionText name="text-e-projects-1" text={e.projects} />
        </h2>
        <Link className="studio-button secondary" href={`/${locale}/work`}>
          <MotionText name="text-d-home-allWork-2" text={d.home.allWork} />
        </Link>
      </div>
      <StudioCta locale={locale} d={d} />
    </>
  )
}

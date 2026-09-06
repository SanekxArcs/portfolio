import Link from 'next/link'

import {getProfile} from '@/sanity/lib/profile'
import {siteUrl} from '@/lib/site'

import {Hero} from '@/components/cv/main/hero/hero'
import {About} from '@/components/cv/main/about'
import {WorkExperience} from '@/components/cv/main/work-experience'
import {Skills} from '@/components/cv/main/skills'
import {Education} from '@/components/cv/main/education'
import {Projects} from '@/components/cv/main/projects'
import {Cta} from '@/components/cv/main/cta'

export async function CvPage() {
  // Let ISR retain the last successful render on CMS errors instead of caching an empty CV.
  const profile = await getProfile()

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <h1 className="text-2xl font-semibold">CV not configured yet</h1>
        <p className="text-muted-foreground mt-2">
          Set Sanity env vars and create a document: <span className="font-medium">CV Profile</span>{' '}
          in the Studio at{' '}
          <Link href="/studio" className="font-medium text-emerald-600 hover:underline">
            /studio
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'ProfilePage', url: siteUrl,
        mainEntity: {'@type': 'Person', name: profile.name, jobTitle: profile.role,
          url: siteUrl, image: profile.profilePhotoUrl,
          sameAs: profile.links?.map(link => link.link).filter(link => link?.startsWith('https://')),
        },
      }).replace(/</g, '\\u003c')}} />
      <div className="container mx-auto max-w-5xl cursor-default px-4 py-8">
        <Hero profile={profile} />
        <About profile={profile} />
        <WorkExperience profile={profile} />
        <Skills profile={profile} />
        <Education profile={profile} />
        <Projects profile={profile} />
      </div>
      <Cta />
    </>
  )
}

import {getProfile} from '@/lib/content'
import {siteUrl} from '@/lib/site'

import {Hero} from '@/components/cv/main/hero/hero'
import {About} from '@/components/cv/main/about'
import {WorkExperience} from '@/components/cv/main/work-experience'
import {Skills} from '@/components/cv/main/skills'
import {Education} from '@/components/cv/main/education'
import {Projects} from '@/components/cv/main/projects'
import {Cta} from '@/components/cv/main/cta'

export async function CvPage() {
  const profile = await getProfile()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'ProfilePage', url: siteUrl,
        mainEntity: {'@type': 'Person', name: profile.name, jobTitle: profile.role,
          url: siteUrl, image: profile.profilePhotoUrl ? new URL(profile.profilePhotoUrl, siteUrl).href : undefined,
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

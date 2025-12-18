import {sanityFetch} from '@/sanity/lib/live'
import {CV_PROFILE_DATA} from '@/sanity/queries/queries'
import {CV_PROFILE_DATAResult} from '@/sanity.types'

import {Hero} from '@/components/cv/main/hero/hero'
import {About} from '@/components/cv/main/about'
import {WorkExperience} from '@/components/cv/main/work-experience'
import {Skills} from '@/components/cv/main/skills'
import {Education} from '@/components/cv/main/education'
import {Projects} from '@/components/cv/main/projects'
import {Cta} from '@/components/cv/main/cta'
import Link from 'next/link'
import {toast} from 'sonner'

export async function CvPage() {
  let profile: CV_PROFILE_DATAResult | null = null

  try {
    const {data} = await sanityFetch({query: CV_PROFILE_DATA})
    profile = data
  } catch (error) {
    toast.error('Failed to load CV profile data.')
    console.error('Failed to load CV profile data', error)
  }

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

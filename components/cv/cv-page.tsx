import {client} from '@/sanity/lib/client'
import { CV_PROFILE_DATA } from "@/sanity/queries/queries";
import {CV_PROFILE_DATAResult} from '@/sanity.types'

import { MainHead } from "@/components/cv/main/main-head";
import { About } from "@/components/cv/main/about";
import { WorkExperience } from "@/components/cv/main/work-experience";
import { Skills } from "@/components/cv/main/skills";
import { Education } from "@/components/cv/main/education";
import { Projects } from "@/components/cv/main/projects";
import { Cta } from "@/components/cv/main/cta";
import Link from "next/link";
import { Rodo } from "./main/rodo";
import { toast } from "sonner";

export async function CvPage() {
  let profile: CV_PROFILE_DATAResult | null = null

  try {
    profile = await client.fetch<CV_PROFILE_DATAResult>(CV_PROFILE_DATA)
  } catch (error) {
    toast.error("Failed to load CV profile data.");
    console.error("Failed to load CV profile data", error);
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <h1 className="text-2xl font-semibold">CV not configured yet</h1>
        <p className="text-muted-foreground mt-2">
          Set Sanity env vars and create a document of type{" "}
          <span className="font-medium">CV Profile</span> in the Studio at{" "}
          <Link
            href="/studio"
            className="font-medium text-emerald-600 hover:underline"
          >
            /studio
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto max-w-5xl cursor-default px-4 py-8">
        <MainHead profile={profile} />
        <About profile={profile} />
        <WorkExperience profile={profile} />
        <Skills profile={profile} />
        <Education profile={profile} />
        <Projects profile={profile} />
        <Rodo />
      </div>
      <Cta profile={profile} />
    </>
  )
}

"use client"

import * as React from "react"
import { motion } from "motion/react"

import { Separator } from "@/components/ui/separator"
import type { CvProfile } from "@/components/cv/types"
import { Contacts } from "@/components/cv/aside/contacts"
import { Interests } from "@/components/cv/aside/interests"
import { Languages } from "@/components/cv/aside/languages"
import { Links } from "@/components/cv/aside/links"
import { ProfilePhoto } from "@/components/cv/aside/profile-photo"
import { SoftSkills } from "@/components/cv/aside/soft-skills"
import { TechSkills } from "@/components/cv/aside/tech-skills"
import { Vcard } from "@/components/cv/aside/vcard"

type Props = {
  profile: Pick<
    CvProfile,
    | "name"
    | "profilePhotoUrl"
    | "vcardQrUrl"
    | "contacts"
    | "links"
    | "vcardUrl"
    | "languages"
    | "techs"
    | "softSkills"
    | "interests"
    | "cvUrl"
    | "cvFileUrl"
  > & {
    profilePhotoUrl?: string
    vcardQrUrl?: string
  }
}

export function CvAside({ profile }: Props) {
  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="order-1 col-span-12 px-4 lg:order-0 lg:col-span-4 lg:px-0 lg:pr-10"
    >
      <div className="sticky top-20 mb-10 flex flex-col gap-5 lg:mb-0 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto hover:overflow-y-auto">
        <Languages languages={profile.languages} />
        <Separator />
        <TechSkills techs={profile.techs} />
        <Separator />
        <SoftSkills softSkills={profile.softSkills} />
        <Separator />
        <Interests interests={profile.interests} />
        <Separator className="hidden lg:block print:hidden" />
        <Vcard vcardUrl={profile.vcardUrl} qrCodeUrl={profile.vcardQrUrl} />
      </div>
    </motion.aside>
  )
}

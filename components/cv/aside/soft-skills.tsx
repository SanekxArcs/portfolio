"use client"

import * as React from "react"
import { MessageCircle } from "lucide-react"

import { SectionWrapper } from "@/components/cv/section-wrapper"

type Props = {
  softSkills?: string[]
}

export function SoftSkills({ softSkills }: Props) {
  if (!softSkills?.length) return null

  return (
    <div className="cursor-default select-none">
      <SectionWrapper icon={<MessageCircle className="mr-2" />} title="Soft Skills" separator={false}>
        <ul className="flex flex-col gap-1 px-3 pl-5 text-sm list-disc list-inside">
          {softSkills.map((skill, index) => (
            <li key={`${skill}-${index}`}>{skill}</li>
          ))}
        </ul>
      </SectionWrapper>
    </div>
  )
}

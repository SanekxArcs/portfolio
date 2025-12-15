"use client"

import * as React from "react"
import { Info } from "lucide-react"

import { SectionWrapper } from "@/components/cv/section-wrapper"

type Props = {
  interests?: string[]
}

export function Interests({ interests }: Props) {
  if (!interests?.length) return null

  return (
    <div className="cursor-default select-none break-before-auto print:hidden">
      <SectionWrapper icon={<Info className="mr-2" />} title="Interests" separator={false}>
        <ul className="flex flex-col gap-1 px-3 pl-5 text-sm list-disc list-inside">
          {interests.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </SectionWrapper>
    </div>
  )
}

"use client"

import * as React from "react"
import { Languages as LanguagesIcon } from "lucide-react"

import { SectionWrapper } from "@/components/cv/section-wrapper"
import type { CvLanguage } from "@/components/cv/types"

type Props = {
  languages?: CvLanguage[]
}

export function Languages({ languages }: Props) {
  if (!languages?.length) return null

  return (
    <div className="select-none break-before-auto">
      <SectionWrapper icon={<LanguagesIcon className="mr-2" />} title="Languages" separator={false}>
        <div className="flex flex-col gap-2 px-3">
          {languages.map((l, i) => (
            <div key={`${l.language}-${i}`} className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{l.language}:</span>
              <span className="text-muted-foreground">{l.level ?? "—"}</span>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </div>
  )
}

"use client"

import * as React from "react"
import { Computer } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { SectionWrapper } from "@/components/cv/section-wrapper"

type Props = {
  techs?: string[]
}

export function TechSkills({ techs }: Props) {
  if (!techs?.length) return null

  return (
    <div>
      <SectionWrapper icon={<Computer className="mr-2" />} title="Tech Skills" separator={false}>
        <ul className="flex flex-wrap gap-2 px-3">
          {techs.map((tech, index) => (
            <Badge key={`${tech}-${index}`} className="cursor-default select-none" variant="default">
              {tech}
            </Badge>
          ))}
        </ul>
      </SectionWrapper>
    </div>
  )
}

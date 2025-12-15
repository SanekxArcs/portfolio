"use client"

import * as React from "react"
import {
  Facebook,
  Github,
  Link as LinkIcon,
  Linkedin,
  MessagesSquare,
  Send,
} from "lucide-react"

import { ButtonLink } from "@/components/cv/button-link"
import { SectionWrapper } from "@/components/cv/section-wrapper"
import type { CvLink } from "@/components/cv/types"

type Props = {
  links?: CvLink[]
}

const iconComponents = {
  Github,
  Linkedin,
  Send,
  MessagesSquare,
  Facebook,
}

export function Links({ links }: Props) {
  if (!links?.length) return null

  return (
    <div className="break-before-avoid">
      <SectionWrapper icon={<LinkIcon className="mr-2" />} title="Links" separator={false}>
        <div className="flex flex-col items-start justify-start">
          {links.map((item, index) => {
            const IconComponent =
              item.iconName && item.iconName in iconComponents
                ? iconComponents[item.iconName as keyof typeof iconComponents]
                : LinkIcon

            return (
              <ButtonLink
                key={`${item.link}-${index}`}
                variant="ghost"
                size="sm"
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                title={item.title}
              >
                <IconComponent className="mr-2" />
                {item.name}
              </ButtonLink>
            )
          })}
        </div>
      </SectionWrapper>
    </div>
  )
}

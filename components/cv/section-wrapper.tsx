"use client"

import * as React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type Props = {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  separator?: boolean
  defaultVisible?: boolean
}

export function SectionWrapper({
  icon,
  title,
  children,
  separator = true,
  defaultVisible = true,
}: Props) {
  const [isVisible, setIsVisible] = React.useState(defaultVisible)

  return (
    <div>
      <div className="group flex items-center justify-between">
        <h3 className="flex select-none items-center justify-start">
          {icon}
          {title}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 opacity-100 transition-all duration-500 md:opacity-0 group-hover:opacity-100"
          onClick={() => setIsVisible((v) => !v)}
        >
          <span className="opacity-30">{isVisible ? "Hide" : "Show"}</span>
          <span className="opacity-30">
            {isVisible ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </span>
        </Button>
      </div>
      {separator ? <Separator className="my-4" /> : null}
      {isVisible ? <div>{children}</div> : null}
    </div>
  )
}

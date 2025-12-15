"use client"

import * as React from "react"
import { FileText, Link as LinkIcon, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonLink } from "@/components/cv/button-link"

type Props = {
  cvUrl?: string
  cvFileUrl?: string
}

export function CvActions({ cvUrl, cvFileUrl }: Props) {
  if (!cvUrl && !cvFileUrl) return null

  return (
    <div className="flex flex-wrap gap-2">
      {cvUrl ? (
        <ButtonLink variant="outline" className="w-fit justify-start" href={cvUrl} target="_blank" rel="noopener noreferrer">
          <LinkIcon className="mr-2 h-4 w-4" />
          Open CV
        </ButtonLink>
      ) : null}

      {cvFileUrl ? (
        <ButtonLink
          variant="outline"
          className="w-fit justify-start"
          href={cvFileUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          <Save className="mr-2 h-4 w-4" />
          Download PDF
        </ButtonLink>
      ) : null}

      {!cvUrl && !cvFileUrl ? (
        <Button variant="outline" disabled>
          <FileText className="mr-2 h-4 w-4" />
          CV not available
        </Button>
      ) : null}
    </div>
  )
}

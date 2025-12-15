"use client"

import * as React from "react"
import { motion } from "motion/react"

import type { CvProfile } from "@/components/cv/types"

type Props = {
  profile: Pick<CvProfile, "name" | "role" | "about" | "cvUrl" | "cvFileUrl">
  children?: React.ReactNode
}

export function CvMain({ children }: Props) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="order-2 col-span-12 flex flex-col gap-10 overflow-hidden px-4 lg:order-0 lg:col-span-8 lg:px-0 lg:pl-10"
    >
      {children}
    </motion.main>
  )
}

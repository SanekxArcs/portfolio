"use client"

import * as React from "react"
import { motion } from "motion/react"
import Image from "next/image"

type Props = {
  profilePhotoUrl?: string
  qrCodeUrl?: string
  alt: string
}

export function ProfilePhoto({ profilePhotoUrl, qrCodeUrl, alt }: Props) {
  if (!profilePhotoUrl && !qrCodeUrl) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="group relative mx-auto my-16 hidden h-52 w-52 overflow-clip rounded-full border-4 border-primary bg-linear-to-br from-primary/40 to-primary/70 transition-all duration-700 hover:rounded-md lg:my-12 lg:block print:hidden"
    >
      {qrCodeUrl ? (
        <Image
          className="absolute left-0 top-0 h-52 w-52 scale-100 opacity-0 transition-all duration-700 delay-200 group-hover:opacity-100"
          src={qrCodeUrl}
          alt="VCARD - QrCode"
          width={208}
          height={208}
        />
      ) : null}

      {profilePhotoUrl ? (
        <Image
          className="h-52 w-52 scale-100 opacity-100 transition-all duration-700 group-hover:scale-0 group-hover:opacity-0"
          src={profilePhotoUrl}
          alt={alt}
          width={208}
          height={208}
        />
      ) : null}
    </motion.div>
  )
}

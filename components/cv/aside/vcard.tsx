"use client"

import { QrCode } from "lucide-react"

import { SectionWrapper } from "@/components/cv/section-wrapper"
import Image from "next/image"

type Props = {
  vcardUrl?: string
  qrCodeUrl?: string
}

export function Vcard({ vcardUrl, qrCodeUrl }: Props) {
  if (!qrCodeUrl) return null

  const Wrapper = vcardUrl ? "a" : "div"

  return (
    <div className="mb-2 hidden lg:block">
      <SectionWrapper icon={<QrCode className="mr-2" />} title="Business card" separator={false}>
        <div>
          <Wrapper
            {...(vcardUrl
              ? {
                  className: "cursor-pointer",
                  href: vcardUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  title: "Scan with your phone to add contact",
                }
              : { className: "cursor-default" })}
          >
            <Image
              className="mx-3 h-64 w-64 rounded-md shadow-md ring-2 ring-primary"
              src={qrCodeUrl}
              alt="VCARD - QrCode"
              width={256}
              height={256}
            />
          </Wrapper>
        </div>
      </SectionWrapper>
    </div>
  )
}

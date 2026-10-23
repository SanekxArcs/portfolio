'use client'

import {useState} from 'react'
import Image from 'next/image'
import {cn} from 'cn'
import {MiniLogo} from '@/components/studio/mini-logo'

/** A failed CMS asset falls back to the brand mark shipped with the portfolio. */
export function BrandMark({
  logoUrl,
  className,
  threeD = false,
}: {
  logoUrl?: string | null
  className?: string
  threeD?: boolean
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null)
  const source = logoUrl && logoUrl !== failedSource ? logoUrl : '/logo.svg'
  return (
    <span
      className={cn(
        'brand-mark relative inline-flex size-8 shrink-0 items-center justify-center',
        className,
      )}
      aria-hidden="true"
    >
      <Image
        src={source}
        alt=""
        width={32}
        height={32}
        unoptimized
        loading="eager"
        className="size-full object-contain dark:brightness-0 dark:invert"
        onError={() => {
          if (source !== '/logo.svg') setFailedSource(source)
        }}
      />
      {threeD && <MiniLogo />}
    </span>
  )
}

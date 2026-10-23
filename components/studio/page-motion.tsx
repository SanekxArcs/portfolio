'use client'
import {useEffect} from 'react'
import {usePathname, useRouter} from 'next/navigation'

/** Only legacy deep-link compatibility lives here; scrolling never hides visible content. */
export function PageMotion() {
  const pathname = usePathname(),
    router = useRouter()
  useEffect(() => {
    const locale = pathname.split('/')[1]
    if (pathname !== `/${locale}` || !location.hash) return
    const hash = location.hash.slice(1)
    const target =
      hash === 'projects'
        ? 'work'
        : ['about', 'experience', 'skills', 'education', 'profile'].includes(
              hash,
            )
          ? `experience#${hash}`
          : null
    if (target) router.replace(`/${locale}/${target}`)
  }, [pathname, router])
  return null
}

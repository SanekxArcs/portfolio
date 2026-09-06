'use client'

import {useRef} from 'react'
import Image from 'next/image'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {Button} from '@/components/ui/button'

export function ProjectImages({images, title}: {images: string[]; title: string}) {
  const gallery = useRef<HTMLDivElement>(null)
  const move = (direction: number) => {
    const element = gallery.current
    if (element) element.scrollBy({left: direction * element.clientWidth, behavior: 'instant'})
  }
  return <div className="bg-muted overflow-hidden rounded-md border">
    <div ref={gallery} className="flex snap-x snap-mandatory overflow-x-auto" aria-label={`${title} screenshots`} tabIndex={images.length > 1 ? 0 : undefined}>
      {images.map((src, index) => <div key={src} className="relative aspect-video min-w-0 flex-[0_0_100%] snap-start">
        <Image src={src} alt={`${title} screenshot ${index + 1}`} fill sizes="(min-width: 768px) 480px, 100vw" className="object-cover" />
      </div>)}
    </div>
    {images.length > 1 && <div className="flex items-center justify-between px-2 py-1">
      <Button variant="ghost" size="icon" onClick={() => move(-1)} aria-label={`Previous screenshot of ${title}`}><ChevronLeft /></Button>
      <span className="text-muted-foreground text-xs">{images.length} screenshots · swipe to explore</span>
      <Button variant="ghost" size="icon" onClick={() => move(1)} aria-label={`Next screenshot of ${title}`}><ChevronRight /></Button>
    </div>}
  </div>
}

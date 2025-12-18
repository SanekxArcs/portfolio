'use client'

import {Globe, Code, Pin, ImageOff} from 'lucide-react'
import {Card, CardContent, CardHeader, CardTitle, CardFooter} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import type {CvProfile, CvProject} from '@/components/cv/types'
import useEmblaCarousel from 'embla-carousel-react'
import {Spoiler} from 'spoiled'
import Image from 'next/image'
import {useEffect, useState} from 'react'
import {ActionButton} from '../atoms/action-button'
import {toast} from 'sonner'
import {Button} from '@/components/ui/button'
import {motion, Variants} from 'motion/react'
import {useUIStore} from '@/hooks/use-ui-store'

type Props = {
  profile: CvProfile
}

const containerVariants: Variants = {
  hidden: {opacity: 0, y: 20},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

function ProjectCard({project}: {project: CvProject}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({loop: true})
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (emblaApi && isHovered) {
      const interval = setInterval(() => {
        emblaApi.scrollNext()
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [emblaApi, isHovered])

  return (
    <Card
      className="group flex h-full flex-col overflow-hidden border-2 transition-all hover:border-emerald-500/50 hover:shadow-lg odd:last:md:col-span-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-2 text-lg">
          <div className="flex items-center gap-2 truncate">
            {project.isPinned && (
              <Pin className="h-4 w-4 shrink-0 fill-emerald-500 text-emerald-500" />
            )}
            {project.nda ? (
              <Spoiler revealOn={false} density={0.2}>
                {project.title || 'Project details are protected by NDA.'}
              </Spoiler>
            ) : (
              project.title
            )}
            {project.nda ? <span className="text-muted-foreground ml-1 text-xs">(NDA)</span> : null}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {project.imageUrls && project.imageUrls.length > 0 && (
          <div className="bg-muted overflow-hidden rounded-md border" ref={emblaRef}>
            <div className="flex">
              {project.imageUrls.map((url, index) => (
                <div key={index} className="relative aspect-video min-w-0 flex-[0_0_100%]">
                  {project.nda ? (
                    <div className="text-muted flex h-full w-full items-center justify-center bg-linear-to-t from-emerald-900 to-emerald-950 text-8xl"></div>
                  ) : (
                    <Image
                      src={url ?? ''}
                      alt={`${project.title} screenshot ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {(!project.imageUrls || project.imageUrls.length === 0) && (
          <div className="relative aspect-video min-w-0 bg-muted overflow-hidden rounded-md border">
            <div className="text-muted/50 dark:text-white/50 flex h-full w-full items-center justify-center bg-linear-to-t dark:from-emerald-900 from-emerald-100 text-center dark:to-emerald-950 to-emerald-700 text-2xl"><ImageOff className="mr-2" />NO IMAGE</div>
          </div>
        )}

        <div className="text-muted-foreground mt-auto flex-1 text-sm">{project.description}</div>

        <div className="mt-auto flex flex-wrap gap-2">
          {project.technologies?.map((tech, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="gap-2 pt-0">
        {project.url && (
          <>
            {project.nda ? (
              <Button
                className="flex-1"
                size="lg"
                onClick={() => toast.info('This project is under NDA. Live site is not available.')}
              >
                <Globe /> Live Site
              </Button>
            ) : (
              <ActionButton
                href={project.url}
                label="Live Site"
                external
                classLink="flex-1"
                className="w-full"
                icon={<Globe />}
              />
            )}
          </>
        )}
        {project.urlToCode && (
          <>
            {project.nda ? (
              <Button
                className="flex-1"
                size="lg"
                onClick={() => toast.info('This project is under NDA. Live site is not available.')}
              >
                <Code /> Code
              </Button>
            ) : (
              <ActionButton
                href={project.urlToCode}
                label="Code"
                external
                classLink="flex-1"
                className="w-full"
                icon={<Code />}
              />
            )}
          </>
        )}
      </CardFooter>
    </Card>
  )
}

export function Projects({profile}: Props) {
  const {isReducedMotion} = useUIStore()
  const projects = profile.projects || []

  if (projects.length === 0) {
    if (
      (!profile.commercialProjects || profile.commercialProjects.length === 0) &&
      (!profile.petProjects || profile.petProjects.length === 0)
    ) {
      return null
    }
    const oldCommercial = (profile.commercialProjects || []).map((p) => ({
      ...p,
      petProject: false,
    }))
    const oldPet = (profile.petProjects || []).map((p) => ({
      ...p,
      petProject: true,
    }))
    projects.push(...oldCommercial, ...oldPet)
  }

  if (projects.length === 0) return null

  const commercialProjects = projects
    .filter((p) => !p.petProject)
    .sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1))

  const petProjects = projects
    .filter((p) => p.petProject)
    .sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1))

  return (
    <motion.section
      id="projects"
      className="mb-20 scroll-mt-24 space-y-12"
      initial={isReducedMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{once: true, margin: '-100px'}}
      variants={containerVariants}
    >
      {commercialProjects.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <Globe className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold">Commercial Projects</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {commercialProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </div>
      )}

      {petProjects.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold">Pet Projects</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {petProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </div>
      )}
    </motion.section>
  )
}

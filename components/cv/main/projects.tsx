'use client'

import {Globe, Code, Pin, ImageOff, Sparkles, Cpu, ChevronDown} from 'lucide-react'
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
import {motion, Variants, LayoutGroup, AnimatePresence} from 'motion/react'
import {useUIStore} from '@/hooks/use-ui-store'
import {cn} from '@/lib/utils'

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
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (emblaApi && isHovered) {
      const interval = setInterval(() => {
        emblaApi.scrollNext()
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [emblaApi, isHovered])

  return (
    <motion.div
      layout
      transition={{
        layout: {type: 'spring', stiffness: 200, damping: 25, mass: 0.5},
        opacity: {duration: 0.2},
      }}
      className="h-full last:odd:md:col-span-2"
    >
      <Card
        className="group relative flex h-full flex-col overflow-hidden border-2 transition-all hover:border-emerald-500/50 hover:shadow-lg odd:last:md:col-span-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={cn(
            'absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y--8 opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.05]',
            project.petProject ? 'text-purple-500' : 'text-emerald-500',
          )}
        >
          {project.petProject ? (
            <Code className="h-full w-full" />
          ) : (
            <Globe className="h-full w-full" />
          )}
        </div>
        <motion.div layout="position">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="flex-1 text-xl font-bold tracking-tight">
                <div className="flex items-center gap-2">
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
                </div>
              </CardTitle>
              {project.nda && (
                <Badge variant="destructive" className="h-5 px-1.5 text-[10px] font-bold uppercase">
                  NDA
                </Badge>
              )}
            </div>
          </CardHeader>
        </motion.div>
        <CardContent className="flex flex-1 flex-col gap-5">
          {project.imageUrls && project.imageUrls.length > 0 && (
            <motion.div layout="position" className="bg-muted overflow-hidden rounded-md border" ref={emblaRef}>
              <div className="flex">
                {project.imageUrls.map((url, index) => (
                  <div key={index} className="relative aspect-video min-w-0 flex-[0_0_100%]">
                    {project.nda ? (
                      <div className="text-muted/50 flex h-full w-full items-center justify-center bg-linear-to-t from-emerald-100 to-emerald-700 text-center text-2xl dark:from-emerald-900 dark:to-emerald-950 dark:text-white/50">
                        <ImageOff className="mr-2" />
                        NDA PROTECTED
                      </div>
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
            </motion.div>
          )}
          {(!project.imageUrls || project.imageUrls.length === 0) && (
            <motion.div layout="position" className="bg-muted relative aspect-video min-w-0 overflow-hidden rounded-md border">
              <div className="text-muted/50 flex h-full w-full items-center justify-center bg-linear-to-t from-emerald-100 to-emerald-700 text-center text-2xl dark:from-emerald-900 dark:to-emerald-950 dark:text-white/50">
                <ImageOff className="mr-2" />
                NO IMAGE
              </div>
            </motion.div>
          )}

          <div className="flex flex-1 flex-col gap-4">
            <motion.div layout="position" className="space-y-1">
              <p
                className={cn(
                  'text-muted-foreground text-sm leading-relaxed',
                  !isExpanded && 'line-clamp-3',
                )}
              >
                {project.description}
              </p>
              {project.description && project.description.length > 120 && (
                <Button
                variant="link"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 px-0"
                >
                  {isExpanded ? 'Show less' : 'Read more'}<ChevronDown className={cn('size-4 transition-transform', isExpanded && 'rotate-180')} />
                </Button>
              )}
            </motion.div>

            <motion.div layout="position" className="space-y-4">
              {project.features && project.features.length > 0 && (
                <div className="space-y-2">
                  <div className="text-muted-foreground/70 flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
                    <Sparkles className="h-3 w-3 text-emerald-500" />
                    <span>Key Features</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.features.map((feature, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-full border border-emerald-500/10 bg-emerald-500/5 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.technologies && project.technologies.length > 0 && (
                <div className="space-y-2">
                  <div className="text-muted-foreground/70 flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
                    <Cpu className="h-3 w-3 text-purple-500" />
                    <span>Technologies</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="h-5 rounded-md border-purple-500/10 bg-purple-500/5 px-1.5 text-[10px] font-medium text-purple-700 transition-colors hover:bg-purple-500/10 dark:text-purple-300"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </CardContent>
        <motion.div layout="position">
          <CardFooter className="gap-2 pt-0">
            {project.url && (
              <>
                {project.nda ? (
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={() =>
                      toast.info('This project is under NDA. Live site is not available.')
                    }
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
                    onClick={() =>
                      toast.info('This project is under NDA. Live site is not available.')
                    }
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
        </motion.div>
      </Card>
    </motion.div>
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
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <Globe className="size-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold">Commercial Projects</h2>
            </div>

            <Badge
              variant="secondary"
              className="text-muted-foreground font-bold"
            >{`${commercialProjects.length}+`}</Badge>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <LayoutGroup id="commercial-projects">
              {commercialProjects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </LayoutGroup>
          </div>
        </div>
      )}
      {petProjects.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <Code className="size-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold">Pet Projects</h2>
            </div>
            <Badge
              variant="secondary"
              className="text-muted-foreground font-bold"
            >{`${petProjects.length}+`}</Badge>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <LayoutGroup id="pet-projects">
              {petProjects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </LayoutGroup>
          </div>
        </div>
      )}
    </motion.section>
  )
}

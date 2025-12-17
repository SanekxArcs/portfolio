"use client";

import { Globe, ExternalLink, Code, Pin } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CvProfile, CvProject } from "@/components/cv/types";
import useEmblaCarousel from "embla-carousel-react";
import { Spoiler } from "spoiled";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ActionButton } from "../atoms/action-button";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "motion/react";
import { useUIStore } from "@/hooks/use-ui-store";

type Props = {
  profile: CvProfile;
};

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

function ProjectCard({ project }: { project: CvProject }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (emblaApi && isHovered) {
      const interval = setInterval(() => {
        emblaApi.scrollNext();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [emblaApi, isHovered]);

  return (
    <Card
      className="overflow-hidden border-2 hover:border-emerald-500/50 transition-all hover:shadow-lg group flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            {project.isPinned && (
              <Pin className="w-4 h-4 text-emerald-500 fill-emerald-500 shrink-0" />
            )}
            {project.nda ? (
              <Spoiler revealOn={false} density={0.2}>
                {project.title || "Project details are protected by NDA."}
              </Spoiler>
            ) : (
              project.title
            )}
            {project.nda ? (
              <span className="ml-1 text-xs text-muted-foreground">(NDA)</span>
            ) : null}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {project.imageUrls && project.imageUrls.length > 0 && (
          <div
            className="overflow-hidden rounded-md border bg-muted"
            ref={emblaRef}
          >
            <div className="flex">
              {project.imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0 relative aspect-video"
                >
                  {project.nda  ? (
                    <div className="flex justify-center text-muted text-8xl items-center bg-linear-to-t from-emerald-900 to-emerald-950 w-full h-full"></div>
                  ) : (
                    <Image
                      src={url ?? ""}
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

        <div className="text-muted-foreground text-sm flex-1">
          {project.description}
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          {project.technologies?.map((tech, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0 gap-2">
        {project.url && (
          <>
            {project.nda ? (
              <Button
                className="flex-1"
                size="lg"
                onClick={() =>
                  toast.info(
                    "This project is under NDA. Live site is not available."
                  )
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
                  toast.info(
                    "This project is under NDA. Live site is not available."
                  )
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
    </Card>
  );
}

export function Projects({ profile }: Props) {
  const { isReducedMotion } = useUIStore();
  const projects = profile.projects || [];

  if (projects.length === 0) {
    if (
      (!profile.commercialProjects ||
        profile.commercialProjects.length === 0) &&
      (!profile.petProjects || profile.petProjects.length === 0)
    ) {
      return null;
    }
    const oldCommercial = (profile.commercialProjects || []).map((p) => ({
      ...p,
      petProject: false,
    }));
    const oldPet = (profile.petProjects || []).map((p) => ({
      ...p,
      petProject: true,
    }));
    projects.push(...oldCommercial, ...oldPet);
  }

  if (projects.length === 0) return null;

  const commercialProjects = projects
    .filter((p) => !p.petProject)
    .sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1));

  const petProjects = projects
    .filter((p) => p.petProject)
    .sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1));

  return (
    <motion.section
      id="projects"
      className="mb-20 scroll-mt-24 space-y-12"
      initial={isReducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {commercialProjects.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Globe className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold">Commercial Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commercialProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </div>
      )}

      {petProjects.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Code className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold">Pet Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {petProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}

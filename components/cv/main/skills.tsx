"use client";

import {
  LayoutTemplate,
  Server,
  Terminal,
  Cpu,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CvProfile } from "@/components/cv/types";
import { motion, Variants } from "motion/react";
import { useUIStore } from "@/hooks/use-ui-store";
import { cn } from "@/lib/utils";

type Props = {
  profile: CvProfile;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
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

export function Skills({ profile }: Props) {
  const { isReducedMotion } = useUIStore();

  const skillCategories = [
    {
      title: 'Frontend Development',
      icon: LayoutTemplate,
      skills: profile.skillsFrontend,
      color: 'emerald',
      description: 'Building responsive, performant, and accessible user interfaces.',
    },
    {
      title: 'Backend & Database',
      icon: Server,
      skills: profile.skillsBackend,
      color: 'blue',
      description: 'Designing scalable APIs and managing robust data structures.',
    },
    {
      title: 'DevOps & Infrastructure',
      icon: Terminal,
      skills: profile.skillsDevOps,
      color: 'purple',
      description: 'Automating deployments and managing cloud environments.',
    },
    {
      title: 'Specialized & Soft Skills',
      icon: Cpu,
      skills: profile.skillsOther,
      color: 'amber',
      description: 'Strategic thinking, optimization, and modern AI workflows.',
    },
  ]

  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/50',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50',
  }

  const badgeColorMap: Record<string, string> = {
    emerald: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:text-emerald-700 dark:hover:text-emerald-300 border-emerald-100 dark:border-emerald-800/30',
    blue: 'hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-300 border-blue-100 dark:border-blue-800/30',
    purple: 'hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:text-purple-700 dark:hover:text-purple-300 border-purple-100 dark:border-purple-800/30',
    amber: 'hover:bg-amber-100 dark:hover:bg-amber-900/50 hover:text-amber-700 dark:hover:text-amber-300 border-amber-100 dark:border-amber-800/30',
  }

  return (
    <motion.section
      id="skills"
      className="mb-20 scroll-mt-24"
      initial={isReducedMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{once: true, margin: '-100px'}}
      variants={containerVariants}
    >
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Zap className="h-5 w-5" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Skills & Technologies</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl text-sm">
            A comprehensive overview of my technical stack and professional expertise, 
            refined through years of commercial and personal projects.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {skillCategories.map(
          (category) =>
            category.skills &&
            category.skills.length > 0 && (
              <motion.div key={category.title} variants={itemVariants}>
                <Card
                  className={cn(
                    "group relative h-full overflow-hidden border-2 transition-all duration-300 hover:shadow-md",
                    category.color === 'emerald' && 'hover:border-emerald-500/30',
                    category.color === 'blue' && 'hover:border-blue-500/30',
                    category.color === 'purple' && 'hover:border-purple-500/30',
                    category.color === 'amber' && 'hover:border-amber-500/30',
                  )}
                >
                  <div className={cn(
                    "absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y--8 opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.05]",
                    category.color === 'emerald' && 'text-emerald-500',
                    category.color === 'blue' && 'text-blue-500',
                    category.color === 'purple' && 'text-purple-500',
                    category.color === 'amber' && 'text-amber-500',
                  )}>
                    <category.icon className="h-full w-full" />
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                        colorMap[category.color]
                      )}>
                        <category.icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <CardTitle className="text-lg font-bold">{category.title}</CardTitle>
                        <p className="text-muted-foreground text-xs">{category.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className={cn(
                            "cursor-default border px-2.5 py-1 text-xs font-medium transition-all duration-200",
                            badgeColorMap[category.color]
                          )}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ),
        )}
      </div>
    </motion.section>
  )
}

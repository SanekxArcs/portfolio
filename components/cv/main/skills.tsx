"use client";

import {
  Code,
  LayoutTemplate,
  Server,
  Terminal,
  Cpu,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CvProfile } from "@/components/cv/types";
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

export function Skills({ profile }: Props) {
  const { isReducedMotion } = useUIStore();

  const skillCategories = [
    {
      title: 'Frontend',
      icon: LayoutTemplate,
      skills: profile.skillsFrontend,
    },
    {
      title: 'Backend',
      icon: Server,
      skills: profile.skillsBackend,
    },
    {
      title: 'DevOps & Tools',
      icon: Terminal,
      skills: profile.skillsDevOps,
    },
    {
      title: 'Other',
      icon: Cpu,
      skills: profile.skillsOther,
    },
  ]

  return (
    <motion.section
      id="skills"
      className="mb-20 scroll-mt-24"
      initial={isReducedMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{once: true, margin: '-100px'}}
      variants={containerVariants}
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
          <Code className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold">Skills & Technologies</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {skillCategories.map(
          (category) =>
            category.skills &&
            category.skills.length > 0 && (
              <Card
                key={category.title}
                className="overflow-hidden border-2 transition-colors hover:border-emerald-500/50"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <category.icon className="h-5 w-5 text-emerald-500" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="cursor-default px-3 py-1 text-sm transition-colors hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-emerald-900 dark:hover:text-emerald-100"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ),
        )}
      </div>
    </motion.section>
  )
}

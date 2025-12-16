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
  return (
    <motion.section
      id="skills"
      className="mb-20 scroll-mt-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <Code className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold">Skills & Technologies</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profile.skillsFrontend && profile.skillsFrontend.length > 0 && (
          <Card className="overflow-hidden border-2 hover:border-emerald-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-emerald-500" />
                Frontend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skillsFrontend.map((skill, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-emerald-900 dark:hover:text-emerald-100 transition-colors cursor-default text-sm py-1 px-3"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {profile.skillsBackend && profile.skillsBackend.length > 0 && (
          <Card className="overflow-hidden border-2 hover:border-emerald-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-500" />
                Backend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skillsBackend.map((skill, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-emerald-900 dark:hover:text-emerald-100 transition-colors cursor-default text-sm py-1 px-3"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {profile.skillsDevOps && profile.skillsDevOps.length > 0 && (
          <Card className="overflow-hidden border-2 hover:border-emerald-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-500" />
                DevOps & Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skillsDevOps.map((skill, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-emerald-900 dark:hover:text-emerald-100 transition-colors cursor-default text-sm py-1 px-3"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {profile.skillsOther && profile.skillsOther.length > 0 && (
          <Card className="overflow-hidden border-2 hover:border-emerald-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-500" />
                Other
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skillsOther.map((skill, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-emerald-900 dark:hover:text-emerald-100 transition-colors cursor-default text-sm py-1 px-3"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.section>
  );
}

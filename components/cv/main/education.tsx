"use client";

import { GraduationCap, Award } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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

export function Education({ profile }: Props) {
  if (
    (!profile.education || profile.education.length === 0) &&
    (!profile.courses || profile.courses.length === 0)
  ) {
    return null;
  }

  return (
    <motion.section
      id="education"
      className="mb-20 scroll-mt-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold">Education & Certifications</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profile.education?.map((edu, index) => (
          <Card
            key={index}
            className="overflow-hidden md:last:col-span-2 border-2 hover:border-emerald-500/50 transition-colors group"
          >
            <CardHeader>
              <div className="flex items-start gap-2">
                <GraduationCap className="w-5 h-5 text-muted-foreground group-hover:text-emerald-500 transition-colors shrink-0 mt-1" />
                <div>
                  <CardTitle className="text-lg">{edu.institution}</CardTitle>
                  {edu.specialization && (
                    <p className="text-sm text-muted-foreground">
                      {edu.specialization}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {profile.courses?.map((cert, index) => (
          <Card
            key={index}
            className="overflow-hidden  md:last:col-span-2 border-2 hover:border-emerald-500/50 transition-colors group"
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <Award className="w-5 h-5 text-muted-foreground group-hover:text-emerald-500 transition-colors shrink-0 mt-1" />
                  <div>
                    <CardTitle className="text-lg">{cert.title}</CardTitle>
                    {cert.platform && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {cert.platform}
                      </p>
                    )}
                  </div>
                </div>
                {cert.date && (
                  <Badge
                    variant="secondary"
                    className="whitespace-nowrap shrink-0"
                  >
                    {cert.date}
                  </Badge>
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </motion.section>
  );
}

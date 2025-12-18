"use client";

import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CvProfile } from "@/components/cv/types";
import { motion, Variants } from "motion/react";
import { useUIStore } from "@/hooks/use-ui-store";
import { HighlightedText } from "../atoms/highlighted-text";
import { useMemo } from "react";
import { getAllSkills } from "@/lib/cv-utils";

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
      delay: 0.8,
      ease: "easeOut",
    },
  },
};

export function About({ profile }: Props) {
  const { isReducedMotion } = useUIStore();
  const allSkills = useMemo(() => getAllSkills(profile), [profile]);

  return (
    <motion.section
      id="about"
      className="mb-20 scroll-mt-24"
      initial={isReducedMotion ? "visible" : "hidden"}
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="size-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold">About Me</h2>
      </div>
      <Card className="overflow-hidden border-2 hover:border-emerald-500/50 transition-colors group">
        <CardContent className="lg:px-8">
          <p className="text-muted-foreground leading-relaxed mb-2 text-lg">
            <HighlightedText
              text={profile.about || ""}
              skills={allSkills}
              highlightClassName="group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
            />
          </p>
          {profile.softSkills && profile.softSkills.length > 0 && (
            <div className="flex flex-col md:flex-row gap-2 mt-3 pt-3 border-t border-border/50">
              <div className="font-semibold mr-2 w-fit h-full text-nowrap">
                Soft Skills:
              </div>
              <div className="flex flex-wrap flex-col md:flex-row gap-2">
                {profile.softSkills.map((item, i) => (
                  <Tooltip key={i}>
                    <TooltipTrigger>
                      <Badge
                        variant="outline"
                        className="hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-emerald-900 dark:hover:text-emerald-100 cursor-default transition-all active:hover focus:text-sm hover:text-sm"
                      >
                        {item.skill}
                      </Badge>
                    </TooltipTrigger>
                    {item.description && (
                      <TooltipContent>
                        <p>{item.description}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.section>
  );
}

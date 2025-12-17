"use client";
import { motion, Variants } from "motion/react";
import { Badge } from "@/components/ui/badge";
import FlagIcon from "@/components/FlagIcon";
import type { CvProfile } from "@/components/cv/types";

type Props = {
  profile: CvProfile;
  variants: Variants;
};

export function HeroLanguages({ profile, variants }: Props) {
  if (!profile.languages || profile.languages.length === 0) return null;

  return (
    <motion.div className="flex flex-wrap gap-4 mb-4" variants={variants}>
      {profile.languages.map((lang, i) => (
        <Badge
          key={i}
          variant="outline"
          className="text-xs bg-background/50 gap-1.5 pl-1.5"
        >
          <FlagIcon languageCode={lang.language || ""} />
          <span>
            {lang.language}
            {lang.level && (
              <span className="text-muted-foreground ml-1">
                - {lang.level}
              </span>
            )}
          </span>
        </Badge>
      ))}
    </motion.div>
  );
}

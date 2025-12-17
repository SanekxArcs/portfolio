"use client";
import { motion, Variants } from "motion/react";
import type { CvProfile } from "@/components/cv/types";

type Props = {
  profile: CvProfile;
  variants: Variants;
};

export function HeroInfo({ profile, variants }: Props) {
  return (
    <>
      <motion.h1
        className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 bg-linear-to-r from-foreground to-primary dark:from-foreground dark:to-emerald-950 bg-clip-text text-transparent leading-tight"
        variants={variants}
      >
        {profile.name}
      </motion.h1>
      <motion.p
        className="text-2xl sm:text-3xl text-muted-foreground mb-6 font-light"
        variants={variants}
      >
        {profile.role}
      </motion.p>
      {profile.description && (
        <motion.p
          className="text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed"
          variants={variants}
        >
          {profile.description}
        </motion.p>
      )}
    </>
  );
}

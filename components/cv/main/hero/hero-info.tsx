"use client";
import { motion, Variants } from "motion/react";
import type { CvProfile } from "@/components/cv/types";
import { HighlightedText } from "../../atoms/highlighted-text";
import { useMemo } from "react";
import { getAllSkills } from "@/lib/cv-utils";

type Props = {
  profile: CvProfile;
  variants: Variants;
};

export function HeroInfo({ profile, variants }: Props) {
  const allSkills = useMemo(() => getAllSkills(profile), [profile]);

  return (
    <>
      <motion.h1
        className="text-5xl sm:text-6xl lg:text-7xl mb-4 bg-linear-to-b dark:bg-linear-to-r from-foreground to-emerald-700 dark:from-foreground dark:to-emerald-950 bg-clip-text text-transparent leading-tight scroll-m-20 text-start font-extrabold tracking-tight text-balance"
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
          className="text-lg text-muted-foreground group mb-8 max-w-2xl leading-relaxed"
          variants={variants}
        >
          <HighlightedText text={profile.description} skills={allSkills} />
        </motion.p>
      )}
    </>
  );
}

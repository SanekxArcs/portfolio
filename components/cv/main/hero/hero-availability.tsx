"use client";
import { Badge } from "@/components/ui/badge";
import { motion, Variants } from "motion/react";
import { mainHeadConfig } from "../main-head.config";
import type { CvProfile } from "@/components/cv/types";

type Props = {
  profile: CvProfile;
  variants: Variants;
};

export function HeroAvailability({ profile, variants }: Props) {
  const { icons, availability } = mainHeadConfig;
  
  return (
    <motion.div className="inline-block mb-4" variants={variants}>
      <Badge
        variant="secondary"
        className="text-sm p-2.5 font-medium animate-pulse dark:bg-emerald-950/80 bg-emerald-200/80"
      >
        <icons.BadgeCheck className="text-emerald-600 mr-1" />
        {profile.contacts?.workAvailability &&
        Array.isArray(profile.contacts.workAvailability) &&
        profile.contacts.workAvailability.length > 0
          ? profile.contacts.workAvailability[0] === availability.immediately
            ? availability.available
            : profile.contacts.workAvailability[0]
          : availability.available}
      </Badge>
    </motion.div>
  );
}

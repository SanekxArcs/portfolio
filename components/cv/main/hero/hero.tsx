"use client";

import {useMemo} from 'react'
import { motion, Variants, useReducedMotion } from "motion/react";
import { useUIStore } from "@/hooks/use-ui-store";
import { HeroAvailability } from "./hero-availability";
import { HeroInfo } from "./hero-info";
import { HeroActions } from "./hero-actions";
import { HeroSocials } from "./hero-socials";
import { HeroLanguages } from "./hero-languages";
import { HeroDetails } from "./hero-details";
import { HeroImage } from "./hero-image";
import { CvProfile } from '../../types';

type Props = {
  profile: CvProfile;
};

export function Hero({profile}: Props) {
  const {isReducedMotion} = useUIStore()
  const prefersReducedMotion = useReducedMotion()
  const shouldReduceMotion = isReducedMotion || prefersReducedMotion

  const containerVariants: Variants = useMemo(
    () => ({
      hidden: {opacity: 0},
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: shouldReduceMotion ? 0 : 0.1,
          delayChildren: shouldReduceMotion ? 0 : 0.1,
        },
      },
    }),
    [shouldReduceMotion],
  )

  const itemVariants: Variants = useMemo(
    () => ({
      hidden: {opacity: 0, y: shouldReduceMotion ? 0 : 20},
      visible: {
        opacity: 1,
        y: 0,
        transition: {duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut'},
      },
    }),
    [shouldReduceMotion],
  )

  const imageVariants: Variants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        scale: shouldReduceMotion ? 1 : 0.8,
        rotate: shouldReduceMotion ? 0 : -15,
      },
      visible: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {duration: shouldReduceMotion ? 0 : 0.8, ease: 'backOut'},
      },
    }),
    [shouldReduceMotion],
  )

  return (
    <motion.section
      className={`relative mt-15 mb-20 cursor-default pt-10 transition-all duration-1000`}
      initial={shouldReduceMotion ? 'visible' : 'hidden'}
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col items-start gap-12 lg:flex-row">
        <div className="flex-1 md:w-2/3">
          <HeroAvailability profile={profile} variants={itemVariants} />
          <HeroInfo profile={profile} variants={itemVariants} />
          <HeroActions profile={profile} variants={itemVariants} />
          <HeroSocials profile={profile} variants={itemVariants} />
          <HeroLanguages profile={profile} variants={itemVariants} />
          <HeroDetails profile={profile} variants={itemVariants} />
        </div>
        <HeroImage
          profile={profile}
          variants={imageVariants}
          shouldReduceMotion={shouldReduceMotion || false}
        />
      </div>
    </motion.section>
  )
}


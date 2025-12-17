"use client";
import { motion, Variants } from "motion/react";
import Image from "next/image";
import { mainHeadConfig } from "../main-head.config";
import type { CvProfile } from "@/components/cv/types";

type Props = {
  profile: CvProfile;
  variants: Variants;
  shouldReduceMotion: boolean;
};

export function HeroImage({ profile, variants, shouldReduceMotion }: Props) {
  const { image } = mainHeadConfig;
  
  const initials = (profile.name || '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <motion.div
      className="relative hidden md:block group w-1/3 m-auto lg:mx-0"
      variants={variants}
    >
      {profile.logoUrl ? (
        <div className="w-64 h-64 relative perspective-250">
          <div
            className={`w-full h-full transition-all duration-700 transform-3d ${
              shouldReduceMotion ? "" : "group-hover:transform-[rotateX(180deg)]"
            }`}
          >
            {/* Front: Logo */}
            <div className="absolute inset-0 w-full h-full backface-hidden bg-transparent overflow-hidden flex justify-center items-center p-4">
              <div
                role="img"
                aria-label={image.logoAlt}
                className="w-full h-full bg-black dark:bg-white transition-colors duration-300"
                style={{
                  maskImage: `url(${profile.logoUrl})`,
                  WebkitMaskImage: `url(${profile.logoUrl})`,
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                }}
              />
            </div>
            {/* Back: Profile Photo */}
            <div className="absolute inset-0 w-full h-full backface-hidden transform-[rotateX(180deg)] rounded-2xl bg-linear-to-br from-secondary to-muted dark:from-primary dark:to-secondary overflow-hidden shadow-2xl flex justify-center items-center">
              {profile.profilePhotoUrl ? (
                <Image
                  src={profile.profilePhotoUrl}
                  alt={profile.name ?? 'Profile Photo'}
                  fill
                  quality={100}
                  className="object-cover"
                />
              ) : (
                <div className="cursor-default absolute inset-0 flex items-center justify-center text-8xl font-bold text-primary/30">
                  {initials}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`w-64 h-64 rounded-2xl bg-linear-to-br from-secondary to-muted dark:from-primary dark:to-secondary overflow-hidden shadow-2xl ${
            shouldReduceMotion
              ? ""
              : "transform group-hover:scale-105 group-hover:rotate-3"
          } transition-all duration-500 relative flex justify-center items-center`}
        >
          {profile.profilePhotoUrl ? (
            <Image
              src={profile.profilePhotoUrl}
              alt={profile.name ?? 'Profile Photo'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="cursor-default absolute inset-0 flex items-center justify-center text-8xl font-bold text-primary/30">
              {initials}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

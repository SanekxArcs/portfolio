"use client";
import { motion, Variants } from "motion/react";
import Image from "next/image";
import {mainHeadConfig} from './hero.config'
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
    <motion.div className="group relative m-auto hidden w-1/3 md:block lg:mx-0" variants={variants}>
      {profile.logoUrl ? (
        <div className="perspective-250 relative h-64 w-64">
          <div
            className={`size-full transition-all duration-700 transform-3d ${
              shouldReduceMotion ? '' : 'group-hover:transform-[rotateX(180deg)]'
            }`}
          >
            {/* Front: Logo */}
            <div className="absolute inset-0 flex size-full items-center justify-center overflow-hidden bg-transparent backface-hidden">
              <div
                role="img"
                aria-label={image.logoAlt}
                className="size-full from-emerald-950 to-emerald-900 bg-linear-to-t dark:from-white dark:to-emerald-100 transition-colors duration-300"
                style={{
                  maskImage: `url(${profile.logoUrl})`,
                  WebkitMaskImage: `url(${profile.logoUrl})`,
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                }}
              />
            </div>
            {/* Back: Profile Photo */}
            <div className="from-secondary to-muted dark:from-primary dark:to-secondary absolute inset-0 flex size-full transform-[rotateX(180deg)] items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br shadow-2xl backface-hidden">
              {profile.profilePhotoUrl ? (
                <Image
                  src={profile.profilePhotoUrl}
                  alt={profile.name ?? 'Profile Photo'}
                  fill
                  quality={100}
                  className="object-cover"
                />
              ) : (
                <div className="text-primary/30 absolute inset-0 flex cursor-default items-center justify-center text-8xl font-bold">
                  {initials}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`from-secondary to-muted dark:from-primary dark:to-secondary h-64 w-64 overflow-hidden rounded-2xl bg-linear-to-br shadow-2xl ${
            shouldReduceMotion ? '' : 'transform group-hover:scale-105 group-hover:rotate-3'
          } relative flex items-center justify-center transition-all duration-500`}
        >
          {profile.profilePhotoUrl ? (
            <Image
              src={profile.profilePhotoUrl}
              alt={profile.name ?? 'Profile Photo'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-primary/30 absolute inset-0 flex cursor-default items-center justify-center text-8xl font-bold">
              {initials}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

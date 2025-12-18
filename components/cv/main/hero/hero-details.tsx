"use client";
import { motion, Variants } from "motion/react";
import { ActionButton } from "@/components/cv/atoms/action-button";
import {mainHeadConfig} from './hero.config'
import type { CvProfile } from "@/components/cv/types";

type Props = {
  profile: CvProfile;
  variants: Variants;
};

export function HeroDetails({ profile, variants }: Props) {
  const { icons, contact, urls } = mainHeadConfig;

  return (
    <motion.div className="flex flex-row flex-wrap gap-2 mb-4" variants={variants}>
      {profile.contacts?.location && (
        <ActionButton
          href={urls.mapsWarsaw}
          icon={<icons.MapPin />}
          label={profile.contacts.location}
          variant="link"
          size="sm"
          className="text-muted-foreground"
        />
      )}
      {typeof profile.contacts?.relocationReady === "boolean" && (
        <ActionButton
          icon={<icons.Map className="w-4 h-4" />}
          href={urls.maps}
          size="sm"
          variant="link"
          label={
            profile.contacts.relocationReady
              ? contact.relocation.ready
              : contact.relocation.notReady
          }
          className="flex items-center gap-2 text-muted-foreground"
        />
      )}
      {profile.contacts?.typeOfContract && (
        <ActionButton
          href={urls.b2bSearch}
          variant="link"
          size="sm"
          icon={<icons.Banknote className="w-4 h-4" />}
          label={
            Array.isArray(profile.contacts.typeOfContract)
              ? profile.contacts.typeOfContract.join(", ")
              : profile.contacts.typeOfContract
          }
          className="flex items-center gap-2 text-muted-foreground"
        />
      )}
    </motion.div>
  );
}

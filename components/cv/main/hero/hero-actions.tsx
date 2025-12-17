"use client";
import { motion, Variants } from "motion/react";
import { ButtonGroup } from "@/components/ui/button-group";
import { ActionButton } from "@/components/cv/atoms/action-button";
import { mainHeadConfig } from "../main-head.config";
import type { CvProfile } from "@/components/cv/types";

type Props = {
  profile: CvProfile;
  variants: Variants;
};

export function HeroActions({ profile, variants }: Props) {
  const { icons, actions } = mainHeadConfig;

  return (
    <motion.div className="flex flex-wrap gap-4 mb-8" variants={variants}>
      <ButtonGroup>
        {profile.cvFileUrl && (
          <ActionButton
            href={profile.cvFileUrl}
            icon={<icons.Download />}
            label={actions.saveCv}
            className="rounded-r-none"
            download
            external
          />
        )}
        {profile.cvUrl && (
          <ActionButton
            href={profile.cvUrl}
            icon={<icons.ExternalLink />}
            label={actions.viewCv}
            className="rounded-l-none"
            external
          />
        )}
      </ButtonGroup>
      <ButtonGroup>
        {profile.contacts?.email && (
          <ActionButton
            href={`mailto:${profile.contacts?.email}`}
            icon={<icons.Mail />}
            label={profile.contacts.email}
            variant="outline"
            className="rounded-r-none text-muted-foreground"
          />
        )}
        {profile.contacts?.phoneNumber && (
          <ActionButton
            href={`tel:${profile.contacts.phoneNumber}`}
            icon={<icons.Phone />}
            spoiler
            variant="outline"
            className="rounded-l-none text-muted-foreground"
          />
        )}
      </ButtonGroup>
    </motion.div>
  );
}

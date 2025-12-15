"use client";

import { Mail, Download } from "lucide-react";
import type { CvProfile } from "@/components/cv/types";
import { ActionButton } from "../atoms/action-button";

type Props = {
  profile: CvProfile;
};

export function Cta({ profile }: Props) {
  return (
    <section className="py-24 relative overflow-hidden group cursor-default">
      <div className="absolute inset-0 bg-emerald-950/5 dark:bg-emerald-950/20 group-hover:skew-y-0 duration-700 transition-transform -skew-y-3 transform origin-bottom-right" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-linear-to-r from-primary  dark:from-primary dark:to-emerald-950 bg-clip-text text-transparent py-2">
            Ready to start your next project?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            I&apos;m currently available for freelance work and open to full-time
            opportunities. If you&apos;re interested in working together,
            let&apos;s have a chat.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            {profile.contacts?.email && (
              <ActionButton
                href={`mailto:${profile.contacts.email}`}
                icon={<Mail />}
                label="Get in Touch"

                className="transition-all duration-300"/>
            )}
            {profile.cvFileUrl && (
              <ActionButton
                href={profile.cvFileUrl}
                download
                icon={<Download />}
                label="Download CV/Resume"
                variant="outline"
                className="transition-all duration-300"/>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

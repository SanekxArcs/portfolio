"use client";

import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CvProfile } from "@/components/cv/types";

type Props = {
  profile: CvProfile;
};

export function About({ profile }: Props) {
  return (
    <section id="about" className="mb-20 scroll-mt-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold">About Me</h2>
      </div>
      <Card className="overflow-hidden border-2 hover:border-emerald-500/50 transition-colors">
        <CardContent className="p-8">
          <p className="text-muted-foreground leading-relaxed mb-4 text-lg">
            {profile.about}
          </p>
          {profile.softSkills && profile.softSkills.length > 0 && (
            <div className="flex flex-col md:flex-row gap-2 mt-6 pt-6 border-t border-border/50">
              <div className="font-semibold mr-2 w-fit h-full text-nowrap">
                Soft Skills:
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.softSkills.map((skill, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-emerald-900 dark:hover:text-emerald-100 transition-colors cursor-default text-sm"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

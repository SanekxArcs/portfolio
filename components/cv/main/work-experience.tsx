"use client";

import {
  Briefcase,
  MapPin,
  Calendar,
  ChevronRight,
  Building2,
  ArrowRight,
  Globe,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CvProfile, CvWorkExperience } from "@/components/cv/types";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { ActionButton } from "../atoms/action-button";

type Props = {
  profile: CvProfile;
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightedText({ text, skills }: { text: string; skills: string[] }) {
  const parts = useMemo(() => {
    if (!skills || skills.length === 0) return [text];

    const sortedSkills = [...skills].sort((a, b) => b.length - a.length);
    const pattern = new RegExp(
      `(?<=^|[\\s.,;!?()"'])(${sortedSkills
        .map(escapeRegExp)
        .join("|")})(?=$|[\\s.,;!?()"'])`,
      "gi"
    );

    return text.split(pattern);
  }, [text, skills]);

  return (
    <span>
      {parts.map((part, i) => {
        const isSkill = skills.some(
          (s) => s.toLowerCase() === part.toLowerCase()
        );
        if (isSkill) {
          return (
            <span
              key={i}
              className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-medium"
            >
              {part}
            </span>
          );
        }
        return part;
      })}
    </span>
  );
}

function ExperienceCard({
  job,
  layoutId,
  allSkills,
}: {
  job: CvWorkExperience;
  layoutId: string;
  allSkills: string[];
}) {
  const isRelated = job.isRelated;

  return (
    <motion.div
      key={layoutId}
      layoutId={layoutId}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
    >
      <Card
        className={cn(
          "overflow-hidden border-2 transition-all hover:shadow-lg group",
          isRelated
            ? "hover:border-emerald-500/50"
            : "hover:border-gray-500/50 dark:hover:border-gray-700"
        )}
      >
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2 gap-2">
            <div className="space-y-2">
              <CardTitle
                className={cn(
                  "text-xl flex items-start gap-2 transition-colors",
                  isRelated
                    ? "group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                    : "group-hover:text-gray-600 dark:group-hover:text-gray-400"
                )}
              >
                <Briefcase className="w-5 h-5 mt-1 shrink-0" />
                <span className="flex items-center gap-2 flex-wrap">
                  {job.jobTitle}
                  {job.jobTitle2 && (
                    <>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <span>{job.jobTitle2}</span>
                    </>
                  )}
                </span>
              </CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {job.companyName && (
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Building2 className="w-4 h-4 mr-2" />
                    {job.companyName}
                  </span>
                )}
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4  mr-2 md:mr-0" />
                    {job.location}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
              {job.duration && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 whitespace-nowrap"
                >
                  <Calendar className="w-3 h-3" />
                  {job.duration}
                </Badge>
              )}
              {job.type && (
                <Badge variant="outline" className="text-xs">
                  {job.type}
                </Badge>
              )}
              {!isRelated && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                >
                  Non-relevant
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {job.description && job.description.length > 0 && (
            <ul className="space-y-2">
              {job.description.map((desc, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 mt-0.5 shrink-0",
                      isRelated ? "text-emerald-500" : "text-gray-400"
                    )}
                  />
                  <span>
                    <HighlightedText text={desc} skills={allSkills} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter>
          {job.website && (
            <ActionButton
              href={job.website}
              label={job.websiteName || "Website"}
              icon={<Globe />}
              variant="link"
              size="sm"
              className="h-auto p-0 gap-2 text-muted-foreground hover:text-foreground"
              external
            />
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export function WorkExperience({ profile }: Props) {
  const [activeTab, setActiveTab] = useState("related");

  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    profile.skillsFrontend?.forEach((s) => skills.add(s));
    profile.skillsBackend?.forEach((s) => skills.add(s));
    profile.skillsDevOps?.forEach((s) => skills.add(s));
    profile.skillsOther?.forEach((s) => skills.add(s));
    return Array.from(skills);
  }, [profile]);

  if (!profile.workExperience || profile.workExperience.length === 0) {
    return null;
  }

  const relatedExperience = profile.workExperience.filter(
    (job) => job.isRelated
  );

  const notRelatedExperience = profile.workExperience.filter(
    (job) => !job.isRelated
  );

  // Get cards to display based on active tab
  const displayedCards =
    activeTab === "related"
      ? relatedExperience
      : activeTab === "notrelated"
        ? notRelatedExperience
        : profile.workExperience;

  return (
    <section id="experience" className="mb-20 scroll-mt-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl aspect-square bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold">Experience</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="related">Related</TabsTrigger>
          <TabsTrigger value="all">Full History</TabsTrigger>
          <TabsTrigger value="notrelated">Not Related</TabsTrigger>
        </TabsList>
        <div className="space-y-6">
          <div key={activeTab} className="space-y-6">
            <AnimatePresence mode="wait">
              {displayedCards.length > 0 ? (
                displayedCards.map((job, index) => (
                  <ExperienceCard
                    key={`${job.companyName}-${job.jobTitle}-${index}`}
                    layoutId={`${job.companyName}-${job.jobTitle}`}
                    job={job}
                    allSkills={allSkills}
                  />
                ))
              ) : (
                <motion.div className="text-center text-muted-foreground py-8">
                  No specific related experience marked. Check &quot;All
                  History&quot; to see full background.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Tabs>
    </section>
  );
}

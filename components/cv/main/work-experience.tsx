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
import { HighlightedText } from "../atoms/highlighted-text";
import { useUIStore } from "@/hooks/use-ui-store";
import { getAllSkills } from "@/lib/cv-utils";

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

function ExperienceCard({
  job,
  layoutId,
  allSkills,
}: {
  job: CvWorkExperience;
  layoutId: string;
  allSkills: string[];
}) {
  const { isReducedMotion } = useUIStore();
  const isRelated = job.isRelated;

  return (
    <motion.div
      key={layoutId}
      layoutId={layoutId}
      variants={itemVariants}
      initial={isReducedMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      exit="exit"
      viewport={{once: true, margin: '0px 0px -100px 0px'}}
    >
      <Card
        className={cn(
          'group relative overflow-hidden border-2 transition-all hover:shadow-lg',
          isRelated
            ? 'hover:border-emerald-500/20'
            : 'hover:border-gray-500/20 dark:hover:border-gray-700',
        )}
      >
        <div
          className={cn(
            'translate-y--8 absolute top-0 right-0 h-24 w-24 translate-x-8 opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.05]',
            isRelated ? 'text-emerald-500' : 'text-gray-500',
          )}
        >
          <Briefcase className="h-full w-full" />
        </div>
        <CardHeader>
          <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <CardTitle
                className={cn(
                  'flex items-start gap-2 text-xl transition-colors',
                  isRelated
                    ? 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                    : 'group-hover:text-gray-600 dark:group-hover:text-gray-400',
                )}
              >
                <Briefcase className="mt-1 h-5 w-5 shrink-0" />
                <span className="flex flex-wrap items-center gap-2">
                  {job.jobTitle}
                  {job.jobTitle2 && (
                    <>
                      <ArrowRight className="text-muted-foreground h-4 w-4" />
                      <span>{job.jobTitle2}</span>
                    </>
                  )}
                </span>
              </CardTitle>
              <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                {job.companyName && (
                  <span className="text-foreground flex items-center gap-1 font-semibold">
                    <Building2 className="mr-2 h-4 w-4" />
                    {job.companyName}
                  </span>
                )}
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="mr-2 h-4 w-4 md:mr-0" />
                    {job.location}
                  </span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
              {job.duration && (
                <Badge variant="secondary" className="flex items-center gap-1 whitespace-nowrap">
                  <Calendar className="h-3 w-3" />
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
                  className="bg-gray-100 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
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
                <li key={i} className="text-muted-foreground flex items-start gap-2 text-sm">
                  <ChevronRight
                    className={cn(
                      'mt-0.5 h-4 w-4 shrink-0',
                      isRelated ? 'text-emerald-500' : 'text-gray-400',
                    )}
                  />
                  <span>
                    <HighlightedText
                      text={desc}
                      skills={allSkills}
                      highlightClassName="group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                    />
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
              label={job.websiteName || 'Website'}
              icon={<Globe />}
              variant="link"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-auto gap-2 p-0"
              external
            />
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export function WorkExperience({ profile }: Props) {
  const [activeTab, setActiveTab] = useState("related");

  const allSkills = useMemo(() => getAllSkills(profile), [profile]);

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
      <div className="mb-8 flex items-center gap-3">
        <div className="flex aspect-square h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
          <Briefcase className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold">Work Experience</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-3">
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
                <motion.div className="text-muted-foreground py-8 text-center">
                  No specific related experience marked. Check &quot;All History&quot; to see full
                  background.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Tabs>
    </section>
  )
}

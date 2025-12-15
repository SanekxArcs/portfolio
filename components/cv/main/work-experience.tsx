"use client";

import { Briefcase, MapPin, Calendar, ChevronRight, Building2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CvProfile, CvWorkExperience } from "@/components/cv/types";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  profile: CvProfile;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
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
};

function ExperienceCard({ job }: { job: CvWorkExperience }) {
  const isRelated = job.isRelated;

  return (
    <motion.div variants={itemVariants}>
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
                  "text-xl flex items-center gap-2 transition-colors",
                  isRelated
                    ? "group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                    : "group-hover:text-gray-600 dark:group-hover:text-gray-400"
                )}
              >
                <Briefcase className="w-5 h-5 shrink-0" />
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
                    <Building2 className="w-4 h-4" />
                    {job.companyName}
                  </span>
                )}
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
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
                  <span>{desc}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function WorkExperience({ profile }: Props) {
  if (!profile.workExperience || profile.workExperience.length === 0) {
    return null;
  }

  const relatedExperience = profile.workExperience.filter(
    (job) => job.isRelated
  );

  return (
    <section id="experience" className="mb-20 scroll-mt-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold">Experience</h2>
      </div>

      <Tabs defaultValue="related" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="related">Related to Role</TabsTrigger>
          <TabsTrigger value="all">All History</TabsTrigger>
        </TabsList>
        <AnimatePresence mode="wait">
          <TabsContent value="related" className="space-y-6">
            <motion.div
              key="related"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-6"
            >
              {relatedExperience.length > 0 ? (
                relatedExperience.map((job, index) => (
                  <ExperienceCard key={index} job={job} />
                ))
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="text-center text-muted-foreground py-8"
                >
                  No specific related experience marked. Check &quot;All
                  History&quot; to see full background.
                </motion.div>
              )}
            </motion.div>
          </TabsContent>
          <TabsContent value="all" className="space-y-6">
            <motion.div
              key="all"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-6"
            >
              {profile.workExperience.map((job, index) => (
                <ExperienceCard key={index} job={job} />
              ))}
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </section>
  );
}

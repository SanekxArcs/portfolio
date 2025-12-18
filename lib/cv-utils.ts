import type { CvProfile } from "@/components/cv/types";

export function getAllSkills(profile: CvProfile): string[] {
  const skills = new Set<string>();
  profile.skillsFrontend?.forEach((s) => s && skills.add(s));
  profile.skillsBackend?.forEach((s) => s && skills.add(s));
  profile.skillsDevOps?.forEach((s) => s && skills.add(s));
  profile.skillsOther?.forEach((s) => s && skills.add(s));
  return Array.from(skills);
}

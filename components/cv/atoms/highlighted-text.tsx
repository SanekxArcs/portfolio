"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type Props = {
  text: string;
  skills: string[];
  className?: string;
  highlightClassName?: string;
};

export function HighlightedText({
  text,
  skills,
  className,
  highlightClassName,
}: Props) {
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
    <span className={className}>
      {parts.map((part, i) => {
        const isSkill = skills.some(
          (s) => s.toLowerCase() === part.toLowerCase()
        );
        if (isSkill) {
          return (
            <span
              key={i}
              className={cn(
                "transition-colors font-medium",
                highlightClassName ||
                  "group-hover:text-emerald-600 group-hover:dark:text-emerald-400"
              )}
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

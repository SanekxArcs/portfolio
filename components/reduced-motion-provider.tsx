"use client";
import { useEffect } from "react";
import { MotionConfig } from "motion/react";

import { useUIStore } from "@/hooks/use-ui-store";

export function ReducedMotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isReducedMotion, syncSystemPreference } = useUIStore();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      syncSystemPreference(e.matches);
    };

    syncSystemPreference(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [syncSystemPreference]);

  useEffect(() => {
    if (isReducedMotion) {
      document.body.classList.add("reduce-motion");
    } else {
      document.body.classList.remove("reduce-motion");
    }
  }, [isReducedMotion]);

  return (
    <MotionConfig reducedMotion={isReducedMotion ? "always" : "user"}>
      {children}
    </MotionConfig>
  );
}

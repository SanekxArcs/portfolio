"use client";

import { motion } from "motion/react";
import { useUIStore } from "@/hooks/use-ui-store";

export default function Template({ children }: { children: React.ReactNode }) {
  const { isReducedMotion } = useUIStore();

  if (isReducedMotion) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

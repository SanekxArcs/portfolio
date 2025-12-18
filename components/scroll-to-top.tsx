"use client";

import { ArrowUp } from "lucide-react";

export const ScrollToTop = () => {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 border hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-600 transition-all group"
      aria-label="Back to top"
    >
      <ArrowUp className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
};

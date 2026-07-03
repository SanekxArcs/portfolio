"use client";

import { useUIStore } from "@/hooks/use-ui-store";

export default function Template({ children }: { children: React.ReactNode }) {
  const { isReducedMotion } = useUIStore();

  if (isReducedMotion) {
    return <div>{children}</div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
      {children}
    </div>
  );
}

"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function AnimationProvider({ children }: { children: React.ReactNode }) {
  // Mount scroll tracking logic
  useScrollProgress();

  return <>{children}</>;
}

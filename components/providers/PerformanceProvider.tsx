"use client";

import { useEffect } from "react";
import { usePerformanceStore } from "@/store/performance-store";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import PerformanceManager from "@/components/performance/PerformanceManager";

export default function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const { tier } = useDeviceCapability();
  const setQuality = usePerformanceStore((state) => state.setQuality);

  // Initialize tier based on hardware capabilities on mount
  useEffect(() => {
    setQuality(tier);
  }, [tier, setQuality]);

  return (
    <>
      <PerformanceManager />
      {children}
    </>
  );
}

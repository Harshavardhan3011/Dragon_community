import { useEffect, useState } from "react";
import { QualitySetting } from "@/store/performance-store";

interface Capability {
  isMobile: boolean;
  cores: number;
  memory: number; // GB, approximation
  tier: QualitySetting;
}

export function useDeviceCapability() {
  const [capability, setCapability] = useState<Capability>({
    isMobile: false,
    cores: 4,
    memory: 4,
    tier: "high",
  });

  useEffect(() => {
    const checkCapability = () => {
      // 1. Viewport check
      const isMobile = window.innerWidth < 768;

      // 2. Hardware specs
      const cores = navigator.hardwareConcurrency || 4;
      // @ts-ignore - navigator.deviceMemory is standard in Chrome/Edge but not in Firefox/Safari types
      const memory = navigator.deviceMemory || 4;

      // 3. Heuristic to select tier
      let tier: QualitySetting = "high";
      if (isMobile) {
        tier = "low";
      } else if (cores < 4 || memory < 4) {
        tier = "medium";
      }

      setCapability({ isMobile, cores, memory, tier });
    };

    checkCapability();
    window.addEventListener("resize", checkCapability);
    return () => window.removeEventListener("resize", checkCapability);
  }, []);

  return capability;
}

"use client";

import { useEffect, useRef } from "react";
import { usePerformanceStore } from "@/store/performance-store";

export default function PerformanceManager() {
  const { quality, autoDegrade, setQuality, setFps } = usePerformanceStore();
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lowFpsCountRef = useRef(0); // Tracks consecutive seconds of poor performance

  useEffect(() => {
    lastTimeRef.current = performance.now();
    let animationId: number;

    const tick = () => {
      frameCountRef.current += 1;
      const now = performance.now();
      const delta = now - lastTimeRef.current;

      if (delta >= 1000) {
        // Calculate FPS
        const currentFps = Math.round((frameCountRef.current * 1000) / delta);
        setFps(currentFps);

        // Reset counters
        frameCountRef.current = 0;
        lastTimeRef.current = now;

        // Auto-degradation logic
        if (autoDegrade && currentFps < 32) {
          lowFpsCountRef.current += 1;
          if (lowFpsCountRef.current >= 4) {
            // Sustained low FPS
            if (quality === "high") {
              console.warn("Performance degradation detected. Switching to Medium Graphics.");
              setQuality("medium");
            } else if (quality === "medium") {
              console.warn("Performance degradation detected. Switching to Low Graphics.");
              setQuality("low");
            }
            lowFpsCountRef.current = 0; // Reset tracking
          }
        } else {
          lowFpsCountRef.current = 0;
        }
      }

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [quality, autoDegrade, setQuality, setFps]);

  return null; // Silent logic manager
}

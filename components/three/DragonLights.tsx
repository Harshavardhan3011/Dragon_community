"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePerformanceStore } from "@/store/performance-store";

export default function DragonLights() {
  const lightningLightRef = useRef<THREE.DirectionalLight>(null);
  const quality = usePerformanceStore((state) => state.quality);
  const nextFlashTime = useRef(0);
  const flashProgress = useRef(0);

  useFrame((state) => {
    if (!lightningLightRef.current || quality === "low") return;

    const time = state.clock.getElapsedTime();

    // Random lightning flash generation
    if (time > nextFlashTime.current) {
      // Start a lightning flash sequence
      flashProgress.current = 1.0;
      // Schedule next flash in 8-15 seconds
      nextFlashTime.current = time + 8 + Math.random() * 7;
    }

    if (flashProgress.current > 0) {
      // Decays lightning flash brightness exponentially
      flashProgress.current -= 0.05;
      if (flashProgress.current < 0) flashProgress.current = 0;
      
      // Flash intensity fluctuation to simulate realistic lightning
      const flicker = Math.sin(time * 50) * 0.15 + 0.85;
      lightningLightRef.current.intensity = flashProgress.current * 4.0 * flicker;
    } else {
      lightningLightRef.current.intensity = 0;
    }
  });

  return (
    <>
      {/* Soft background ambient light */}
      <ambientLight intensity={0.25} color="#050a05" />

      {/* Primary neon green light hitting model front-left */}
      <directionalLight
        position={[-4, 2, 4]}
        intensity={2.2}
        color="#00FF66"
        castShadow={quality === "high"}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.001}
      />

      {/* Emerald rim light to light up edges from behind-right */}
      <directionalLight position={[4, -2, -3]} intensity={1.5} color="#00C853" />

      {/* Atmospheric lightning light */}
      {quality !== "low" && (
        <directionalLight
          ref={lightningLightRef}
          position={[0, 10, 0]}
          intensity={0}
          color="#a3ffd0"
        />
      )}

      {/* Dynamic fire light - point light positioned near the model center */}
      <pointLight
        position={[0, 0, 1]}
        intensity={quality === "high" ? 0.6 : 0}
        color="#00FF66"
        distance={6}
      />
    </>
  );
}


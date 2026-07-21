"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import DragonModel from "./DragonModel";
import DragonCamera from "./DragonCamera";
import DragonLights from "./DragonLights";
import FireParticles from "./FireParticles";
import FloatingParticles from "./FloatingParticles";
import SmokeParticles from "./SmokeParticles";
import PortalEffect from "./PortalEffect";
import FloatingRocks from "./FloatingRocks";
import SceneLoader from "./SceneLoader";
import WebGLFallback from "./WebGLFallback";
import SceneErrorBoundary from "./SceneErrorBoundary";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { usePerformanceStore } from "@/store/performance-store";
import { useAnimationStore } from "@/store/animation-store";

export default function DragonScene() {
  const isWebGLSupported = useWebGLSupport();
  const quality = usePerformanceStore((state) => state.quality);
  const introState = useAnimationStore((state) => state.introState);

  // If WebGL is not supported, or quality mode is forced to low, render static fallback
  if (!isWebGLSupported || quality === "low") {
    return <WebGLFallback />;
  }

  // Hide 3D Canvas until the intro has progressed past the darkness stage
  if (introState === "darkness") {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none select-none" style={{ overflow: "hidden" }}>
      <SceneErrorBoundary>
        <Canvas
          shadows={quality === "high"}
          camera={{ position: [0, 0, 3.5], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ pointerEvents: "none" }}
        >
          <Suspense fallback={null}>
            <DragonCamera />
            <DragonLights />
            <DragonModel />
            <FireParticles />
            <FloatingParticles />
            <SmokeParticles />
            <PortalEffect />
            <FloatingRocks />
          </Suspense>
        </Canvas>
        <SceneLoader />
      </SceneErrorBoundary>
    </div>
  );
}

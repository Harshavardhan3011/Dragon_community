"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useAnimationStore } from "@/store/animation-store";
import { usePerformanceStore } from "@/store/performance-store";

export default function DragonModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useMousePosition();
  const activeSection = useAnimationStore((state) => state.activeSection);
  const scrollProgress = useAnimationStore((state) => state.scrollProgress);
  const quality = usePerformanceStore((state) => state.quality);

  // Load the premium Dragon Up image as a 3D texture
  const texture = useTexture("/images/hero-bg.png");

  // Animate model position, rotation and hover tilt based on cursor and scroll
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 1. Mouse cursor tracking tilt (only on non-low graphics)
    let targetRotX = 0;
    let targetRotY = 0;

    if (quality !== "low") {
      targetRotX = mouse.y * 0.25; // Pitch
      targetRotY = mouse.x * 0.25; // Yaw
    }

    // 2. Scroll-based layout mapping
    let targetX = 0.8; // default to right side of screen
    let targetY = 0;
    let targetZ = 0;
    let targetScale = 1.6;
    let scrollRotY = 0;

    // Adjust position/scale based on active section for scroll-based storytelling
    if (activeSection === "hero") {
      targetX = window.innerWidth < 768 ? 0 : 0.9;
      targetY = window.innerWidth < 768 ? -0.4 : 0;
      targetScale = window.innerWidth < 768 ? 1.2 : 1.7;
    } else if (activeSection === "stats") {
      targetX = -0.9; // Moves left behind stats text
      targetY = 0.2;
      targetScale = 1.4;
      scrollRotY = -0.4; // turns slightly
    } else if (activeSection === "video") {
      targetX = 0.8; // aligns right pointing to the video
      targetY = -0.1;
      targetScale = 1.5;
      scrollRotY = 0.5;
    } else if (activeSection === "categories") {
      targetX = 0; // centered as it "flies" through portal
      targetY = 0;
      targetScale = 1.0 + Math.sin(scrollProgress * Math.PI) * 0.6; // shrinks/grows
      scrollRotY = state.clock.getElapsedTime() * 0.5; // rotate
    } else if (activeSection === "community") {
      targetX = 0.9; // Lands right side near egg
      targetY = -0.3;
      targetScale = 1.6;
      scrollRotY = -0.2;
    } else if (activeSection === "cta") {
      targetX = 0; // center behind final logo
      targetY = 0.2;
      targetScale = 2.0;
      scrollRotY = 0;
    }

    // Breathing motion (floating)
    const breath = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.08;
    const finalY = targetY + breath;

    // Smooth damp interpolations
    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, targetX, 3, delta);
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, finalY, 3, delta);
    meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, targetZ, 3, delta);
    meshRef.current.scale.setScalar(THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 3, delta));

    // Combine scroll rotation + mouse hover tilt
    meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, targetRotX, 4, delta);
    meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, scrollRotY + targetRotY, 4, delta);
  });

  return (
    <mesh ref={meshRef} position={[0.8, 0, 0]} castShadow receiveShadow>
      {/* 3D Plane representing the dragon image */}
      <planeGeometry args={[2.5, 2.5]} />
      <meshStandardMaterial
        map={texture}
        transparent={true}
        roughness={0.2}
        metalness={0.8}
        side={THREE.DoubleSide}
        emissive={new THREE.Color("#00FF66")}
        emissiveIntensity={quality === "high" ? 0.15 : 0.05}
        emissiveMap={texture}
      />
    </mesh>
  );
}

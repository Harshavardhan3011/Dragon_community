"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAnimationStore } from "@/store/animation-store";
import { usePerformanceStore } from "@/store/performance-store";

export default function FireParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const isBreathingFire = useAnimationStore((state) => state.isBreathingFire);
  const setBreathingFire = useAnimationStore((state) => state.setBreathingFire);
  const quality = usePerformanceStore((state) => state.quality);
  const activeSection = useAnimationStore((state) => state.activeSection);

  const particleCount = quality === "high" ? 250 : quality === "medium" ? 100 : 0;

  // Initialize particles positions, velocities, colors and lifetimes
  const [positions, velocities, colors, lifetimes] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const life = new Float32Array(particleCount);

    const green = new THREE.Color("#00FF66");
    const emerald = new THREE.Color("#00C853");

    for (let i = 0; i < particleCount; i++) {
      // Start in a hidden state below the scene
      pos[i * 3] = 0;
      pos[i * 3 + 1] = -999;
      pos[i * 3 + 2] = 0;

      // Velocities
      vel[i * 3] = (Math.random() - 0.5) * 2; // direction x
      vel[i * 3 + 1] = (Math.random() - 0.5) * 2; // direction y
      vel[i * 3 + 2] = Math.random() * 3 + 2; // blow forward along z

      // Mixed colors
      const mixedColor = green.clone().lerp(emerald, Math.random());
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;

      life[i] = 0; // inactive
    }

    return [pos, vel, col, life];
  }, [particleCount]);

  const geoRef = useRef<THREE.BufferGeometry>(null);
  const timer = useRef(0);

  useFrame((state, delta) => {
    if (particleCount === 0 || !pointsRef.current || !geoRef.current) return;

    const posAttr = geoRef.current.getAttribute("position") as THREE.BufferAttribute;
    const colAttr = geoRef.current.getAttribute("color") as THREE.BufferAttribute;

    // Track breathing timer
    if (isBreathingFire) {
      timer.current += delta;
      if (timer.current > 1.8) {
        setBreathingFire(false);
        timer.current = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      // If breathing fire, spawn dead particles
      if (isBreathingFire && lifetimes[i] <= 0 && Math.random() < 0.15) {
        lifetimes[i] = 1.0; // 1 second lifetime

        // Spawn position (approximate center/mouth position of the dragon image)
        const activeX = activeSection === "stats" ? -0.9 : activeSection === "hero" ? 0.9 : 0.8;
        const activeY = activeSection === "hero" ? -0.2 : 0;
        posAttr.setXYZ(i, activeX - 0.2, activeY + 0.1, 0.2);

        // Random directional velocity blowing outward/leftward
        velocities[i * 3] = -2.5 - Math.random() * 2.0; // Shoot leftwards
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 1.5; // slight height drift
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
      }

      // Update active particles
      if (lifetimes[i] > 0) {
        lifetimes[i] -= delta;

        // Apply velocities
        let px = posAttr.getX(i) + velocities[i * 3] * delta;
        let py = posAttr.getY(i) + velocities[i * 3 + 1] * delta;
        let pz = posAttr.getZ(i) + velocities[i * 3 + 2] * delta;

        posAttr.setXYZ(i, px, py, pz);

        // Fade out color intensity as they age
        const alpha = lifetimes[i];
        colAttr.setXYZ(i, 0 * alpha, 1.0 * alpha, 0.4 * alpha);

        // Recycle if dead
        if (lifetimes[i] <= 0) {
          posAttr.setXYZ(i, 0, -999, 0); // Hide
        }
      }
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  if (particleCount === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}


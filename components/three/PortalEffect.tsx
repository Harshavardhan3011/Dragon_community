"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAnimationStore } from "@/store/animation-store";
import { usePerformanceStore } from "@/store/performance-store";

export default function PortalEffect() {
  const portalRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const activeSection = useAnimationStore((state) => state.activeSection);
  const quality = usePerformanceStore((state) => state.quality);

  const particleCount = quality === "high" ? 80 : quality === "medium" ? 30 : 0;

  // Particle positions swirling around the ring
  const particlePositions = useRef<Float32Array | null>(null);
  const particleAngles = useRef<Float32Array | null>(null);

  if (!particlePositions.current && particleCount > 0) {
    const pos = new Float32Array(particleCount * 3);
    const angles = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const theta = (i / particleCount) * Math.PI * 2 + Math.random() * 0.2;
      const radius = 2.2 + (Math.random() - 0.5) * 0.4;
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = Math.sin(theta) * radius;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      angles[i] = theta;
    }
    particlePositions.current = pos;
    particleAngles.current = angles;
  }

  useFrame((state, delta) => {
    // Portal ring mesh properties
    const active = activeSection === "categories";
    const targetScale = active ? 1.0 : 0.01;
    const targetOpacity = active ? 0.8 : 0.0;

    if (portalRef.current) {
      portalRef.current.scale.setScalar(
        THREE.MathUtils.damp(portalRef.current.scale.x, targetScale, 4, delta)
      );

      const mat = portalRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.damp(mat.opacity, targetOpacity, 4, delta);
      portalRef.current.rotation.z += 0.4 * delta;
    }

    // Swirl particles around portal
    if (particlesRef.current && particlePositions.current && particleAngles.current) {
      const geo = particlesRef.current.geometry;
      const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;

      particlesRef.current.scale.setScalar(
        THREE.MathUtils.damp(particlesRef.current.scale.x, targetScale, 4, delta)
      );

      const mat = particlesRef.current.material as THREE.PointsMaterial;
      mat.opacity = THREE.MathUtils.damp(mat.opacity, targetOpacity, 4, delta);

      for (let i = 0; i < particleCount; i++) {
        particleAngles.current[i] += 0.8 * delta; // speed
        const theta = particleAngles.current[i];
        const radius = 2.2 + Math.sin(state.clock.getElapsedTime() + i) * 0.1;

        posAttr.setXYZ(
          i,
          Math.cos(theta) * radius,
          Math.sin(theta) * radius,
          Math.sin(theta * 2) * 0.1
        );
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, -0.5]}>
      {/* Dynamic Portal ring */}
      <mesh ref={portalRef} scale={0.01}>
        <torusGeometry args={[2.2, 0.04, 8, 48]} />
        <meshBasicMaterial
          color="#00FF66"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Orbiting particles */}
      {particleCount > 0 && particlePositions.current && (
        <points ref={particlesRef} scale={0.01}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particlePositions.current, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.08}
            color="#00C853"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </group>
  );
}


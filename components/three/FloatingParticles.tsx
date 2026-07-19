"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePerformanceStore } from "@/store/performance-store";

export default function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const quality = usePerformanceStore((state) => state.quality);

  const count = quality === "high" ? 400 : quality === "medium" ? 150 : 50;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Wide scattering area
      pos[i * 3] = (Math.random() - 0.5) * 12; // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6; // Z

      // Slow drift velocities
      vel[i * 3] = (Math.random() - 0.5) * 0.05;
      vel[i * 3 + 1] = (Math.random() - 0.2) * 0.1; // slow float upwards
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }

    return [pos, vel];
  }, [count]);

  const geoRef = useRef<THREE.BufferGeometry>(null);

  useFrame((state, delta) => {
    if (!pointsRef.current || !geoRef.current) return;

    const posAttr = geoRef.current.getAttribute("position") as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      let x = posAttr.getX(i) + velocities[i * 3] * delta;
      let y = posAttr.getY(i) + velocities[i * 3 + 1] * delta;
      let z = posAttr.getZ(i) + velocities[i * 3 + 2] * delta;

      // Wrap-around boundary check
      if (y > 4) {
        y = -4;
        x = (Math.random() - 0.5) * 12;
      }
      if (x > 6) x = -6;
      if (x < -6) x = 6;

      posAttr.setXYZ(i, x, y, z);
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#00FF66"
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

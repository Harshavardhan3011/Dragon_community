"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePerformanceStore } from "@/store/performance-store";

export default function SmokeParticles() {
  const groupRef = useRef<THREE.Group>(null);
  const quality = usePerformanceStore((state) => state.quality);

  // Volumetric count
  const smokeCount = quality === "high" ? 6 : quality === "medium" ? 3 : 0;

  // Generate a procedural radial gradient smoke texture using HTML Canvas
  const smokeTexture = useMemo(() => {
    if (typeof window === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(0, 255, 102, 0.15)"); // core glow green
      grad.addColorStop(0.2, "rgba(5, 20, 10, 0.08)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)"); // fade out

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  const smokeLayers = useMemo(() => {
    const layers = [];
    for (let i = 0; i < smokeCount; i++) {
      layers.push({
        position: [
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4,
          -1.5 - Math.random() * 2, // behind dragon
        ] as [number, number, number],
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        driftSpeedX: (Math.random() - 0.5) * 0.08,
        driftSpeedY: (Math.random() - 0.2) * 0.05, // generally drift up
        scale: 4.0 + Math.random() * 3.0,
      });
    }
    return layers;
  }, [smokeCount]);

  useFrame((state, delta) => {
    if (smokeCount === 0 || !groupRef.current) return;

    const children = groupRef.current.children;
    smokeLayers.forEach((layer, i) => {
      const mesh = children[i];
      if (mesh) {
        // Rotate slowly
        mesh.rotation.z += layer.rotationSpeed * delta;

        // Slow drifting movement
        mesh.position.x += layer.driftSpeedX * delta;
        mesh.position.y += layer.driftSpeedY * delta;

        // Boundary reset
        if (mesh.position.y > 4) {
          mesh.position.y = -4;
          mesh.position.x = (Math.random() - 0.5) * 6;
        }
        if (mesh.position.x > 5) mesh.position.x = -5;
        if (mesh.position.x < -5) mesh.position.x = 5;
      }
    });
  });

  if (smokeCount === 0 || !smokeTexture) return null;

  return (
    <group ref={groupRef}>
      {smokeLayers.map((layer, index) => (
        <mesh key={index} position={layer.position}>
          <planeGeometry args={[layer.scale, layer.scale]} />
          <meshBasicMaterial
            map={smokeTexture}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}


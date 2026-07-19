"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePerformanceStore } from "@/store/performance-store";

export default function FloatingRocks() {
  const groupRef = useRef<THREE.Group>(null);
  const quality = usePerformanceStore((state) => state.quality);

  const rockCount = quality === "high" ? 6 : quality === "medium" ? 3 : 0;

  const rocks = useMemo(() => {
    const list = [];
    for (let i = 0; i < rockCount; i++) {
      list.push({
        position: [
          (Math.random() - 0.5) * 5 + (i < rockCount / 2 ? -2.5 : 2.5),
          (Math.random() - 0.5) * 3 + 1,
          -0.8 - Math.random() * 1.5,
        ] as [number, number, number],
        rotationSpeed: [
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
        ] as [number, number, number],
        floatSpeed: 0.5 + Math.random() * 0.5,
        floatHeight: 0.05 + Math.random() * 0.05,
        scale: 0.15 + Math.random() * 0.25,
      });
    }
    return list;
  }, [rockCount]);

  useFrame((state, delta) => {
    if (rockCount === 0 || !groupRef.current) return;

    const children = groupRef.current.children;
    rocks.forEach((rock, i) => {
      const mesh = children[i];
      if (mesh) {
        // Rotate rocks
        mesh.rotation.x += rock.rotationSpeed[0] * delta;
        mesh.rotation.y += rock.rotationSpeed[1] * delta;
        mesh.rotation.z += rock.rotationSpeed[2] * delta;

        // Floating hover motion
        mesh.position.y += Math.sin(state.clock.getElapsedTime() * rock.floatSpeed) * rock.floatHeight * delta;
      }
    });
  });

  if (rockCount === 0) return null;

  return (
    <group ref={groupRef}>
      {rocks.map((rock, index) => (
        <mesh key={index} position={rock.position} scale={rock.scale} castShadow receiveShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#080B08"
            roughness={0.9}
            metalness={0.2}
            emissive={new THREE.Color("#00FF66")}
            emissiveIntensity={0.03}
          />
        </mesh>
      ))}
    </group>
  );
}


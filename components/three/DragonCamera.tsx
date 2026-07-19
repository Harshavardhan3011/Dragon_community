"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useAnimationStore } from "@/store/animation-store";
import { usePerformanceStore } from "@/store/performance-store";

export default function DragonCamera() {
  const mouse = useMousePosition();
  const activeSection = useAnimationStore((state) => state.activeSection);
  const quality = usePerformanceStore((state) => state.quality);

  useFrame((state, delta) => {
    const { camera } = state;

    // Default target camera position
    let targetX = 0;
    let targetY = 0;
    let targetZ = 3.5;

    // Align camera positions dynamically per section
    if (activeSection === "hero") {
      targetX = 0;
      targetY = 0;
      targetZ = 3.5;
    } else if (activeSection === "stats") {
      // Offset slightly to shift the model behind text
      targetX = -0.2;
      targetY = 0.1;
      targetZ = 3.8;
    } else if (activeSection === "video") {
      targetX = 0.1;
      targetY = -0.1;
      targetZ = 3.4;
    } else if (activeSection === "categories") {
      targetX = 0;
      targetY = 0;
      targetZ = 3.8;
    } else if (activeSection === "community") {
      targetX = 0.2;
      targetY = -0.1;
      targetZ = 3.3;
    } else if (activeSection === "cta") {
      targetX = 0;
      targetY = 0.2;
      targetZ = 3.0;
    }

    // Add subtle camera mouse parallax on high performance
    if (quality !== "low") {
      targetX += mouse.x * 0.15;
      targetY += mouse.y * 0.15;
    }

    // Smoothly transition camera position using damp
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.5, delta);

    // Make camera always point towards center (with a small damping offset)
    const lookAtTarget = new THREE.Vector3(0, 0, 0);
    if (activeSection === "stats") {
      lookAtTarget.set(-0.5, 0, 0);
    } else if (activeSection === "community") {
      lookAtTarget.set(0.5, 0, 0);
    }
    
    // Smoothly adjust camera orientation
    const currentRotation = camera.quaternion.clone();
    camera.lookAt(lookAtTarget);
    const targetRotation = camera.quaternion.clone();
    
    camera.quaternion.copy(currentRotation);
    camera.quaternion.slerp(targetRotation, 4 * delta);
  });

  return null; // Logic-only component
}

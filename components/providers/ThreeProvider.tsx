"use client";

import DragonScene from "@/components/three/DragonScene";

export default function ThreeProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DragonScene />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </>
  );
}

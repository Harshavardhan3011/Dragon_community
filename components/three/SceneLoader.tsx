"use client";

import { useProgress } from "@react-three/drei";
import { useEffect } from "react";

interface SceneLoaderProps {
  onLoadComplete?: () => void;
}

export default function SceneLoader({ onLoadComplete }: SceneLoaderProps) {
  const { progress, active } = useProgress();

  useEffect(() => {
    if (!active && progress === 100) {
      if (onLoadComplete) onLoadComplete();
    }
  }, [progress, active, onLoadComplete]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-dragon-bg-900/60 z-30 pointer-events-none">
      <div className="text-center">
        <span className="font-heading text-xs font-semibold text-dragon-neon tracking-widest block mb-2">
          LOAD SYNC: {Math.round(progress)}%
        </span>
        <div className="w-32 h-0.5 bg-dragon-bg-500 rounded-full overflow-hidden">
          <div
            className="h-full bg-dragon-neon transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}


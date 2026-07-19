"use client";

import AudioManager from "@/components/audio/AudioManager";
import AudioControls from "@/components/audio/AudioControls";

export default function AudioProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AudioManager />
      {children}
      <AudioControls />
    </>
  );
}

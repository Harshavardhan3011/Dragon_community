"use client";

import { useAudioStore } from "@/store/audio-store";
import { Volume2, VolumeX } from "lucide-react";

export default function SoundToggle() {
  const { isMuted, setMuted, soundEnabled, setSoundEnabled } = useAudioStore();

  const handleToggle = () => {
    if (!soundEnabled) {
      setSoundEnabled(true);
    } else {
      setMuted(!isMuted);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center justify-center p-2 rounded-lg bg-dragon-bg-600 border border-dragon-neon/10 hover:border-dragon-neon/40 text-dragon-text hover:text-dragon-neon transition-all duration-300 cursor-pointer"
      aria-label={isMuted ? "Unmute Sound" : "Mute Sound"}
    >
      {isMuted || !soundEnabled ? (
        <VolumeX className="w-4 h-4 text-dragon-text-muted" />
      ) : (
        <Volume2 className="w-4 h-4 text-dragon-neon" />
      )}
    </button>
  );
}

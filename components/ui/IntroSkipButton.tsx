"use client";

import { useAnimationStore } from "@/store/animation-store";
import { SkipForward } from "lucide-react";

interface IntroSkipButtonProps {
  onSkip?: () => void;
}

export default function IntroSkipButton({ onSkip }: IntroSkipButtonProps) {
  const skipIntro = useAnimationStore((state) => state.skipIntro);

  const handleSkip = () => {
    skipIntro();
    if (onSkip) onSkip();
  };

  return (
    <button
      onClick={handleSkip}
      className="absolute bottom-10 right-10 z-[110] flex items-center gap-2 bg-dragon-bg-900/80 hover:bg-dragon-bg-900 border border-dragon-neon/30 hover:border-dragon-neon text-dragon-neon hover:text-dragon-light-green px-5 py-2.5 rounded-full font-heading text-xs uppercase tracking-widest transition-all duration-300 shadow-lg cursor-pointer"
      aria-label="Skip cinematic introduction"
    >
      <span>Skip Intro</span>
      <SkipForward className="w-3.5 h-3.5" />
    </button>
  );
}

import { useCallback } from "react";
import { useAudioStore } from "@/store/audio-store";
import { AudioSynth } from "@/lib/audio-config";

export function useSound() {
  const { soundEnabled, isMuted } = useAudioStore();

  const playSound = useCallback(
    (name: string) => {
      if (!soundEnabled || isMuted) return;
      AudioSynth.playTrack(name);
    },
    [soundEnabled, isMuted]
  );

  return {
    playSound,
    playClick: useCallback(() => playSound("click"), [playSound]),
    playHover: useCallback(() => playSound("hover"), [playSound]),
    playRoar: useCallback(() => playSound("dragon-roar"), [playSound]),
    playFire: useCallback(() => playSound("fire-whoosh"), [playSound]),
  };
}
export default useSound;

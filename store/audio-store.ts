import { create } from "zustand";

interface AudioState {
  soundEnabled: boolean; // Controls Web Audio consent
  isMuted: boolean;
  volume: number; // 0 to 1
  setSoundEnabled: (enabled: boolean) => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  soundEnabled: false,
  isMuted: false,
  volume: 0.3, // Safe default volume
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  setMuted: (muted) => set({ isMuted: muted }),
  setVolume: (volume) => set({ volume }),
}));

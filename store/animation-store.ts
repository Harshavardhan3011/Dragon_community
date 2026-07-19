import { create } from "zustand";

export type IntroState = "darkness" | "eye_reveal" | "fire_reveal" | "logo_reveal" | "completed";

interface AnimationState {
  introState: IntroState;
  activeSection: string;
  scrollProgress: number;
  introPlayed: boolean;
  isBreathingFire: boolean;
  setIntroState: (state: IntroState) => void;
  setActiveSection: (section: string) => void;
  setScrollProgress: (progress: number) => void;
  setIntroPlayed: (played: boolean) => void;
  setBreathingFire: (breathing: boolean) => void;
  skipIntro: () => void;
}

export const useAnimationStore = create<AnimationState>((set) => ({
  introState: "darkness",
  activeSection: "hero",
  scrollProgress: 0,
  introPlayed: false,
  isBreathingFire: false,
  setIntroState: (state) => set({ introState: state }),
  setActiveSection: (section) => set({ activeSection: section }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setIntroPlayed: (played) => set({ introPlayed: played }),
  setBreathingFire: (breathing) => set({ isBreathingFire: breathing }),
  skipIntro: () => set({ introState: "completed", introPlayed: true }),
}));

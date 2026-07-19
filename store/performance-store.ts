import { create } from "zustand";

export type QualitySetting = "low" | "medium" | "high";

interface PerformanceState {
  quality: QualitySetting;
  autoDegrade: boolean;
  fps: number;
  setQuality: (quality: QualitySetting) => void;
  setAutoDegrade: (auto: boolean) => void;
  setFps: (fps: number) => void;
}

export const usePerformanceStore = create<PerformanceState>((set) => ({
  quality: "high", // Default is high, detector will downgrade if needed
  autoDegrade: true,
  fps: 60,
  setQuality: (quality) => set({ quality }),
  setAutoDegrade: (auto) => set({ autoDegrade: auto }),
  setFps: (fps) => set({ fps }),
}));

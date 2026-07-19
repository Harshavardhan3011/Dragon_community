"use client";

import { usePerformanceStore } from "@/store/performance-store";
import { Cpu } from "lucide-react";

export default function PerformanceToggle() {
  const { autoDegrade, setAutoDegrade } = usePerformanceStore();

  return (
    <button
      onClick={() => setAutoDegrade(!autoDegrade)}
      className={`flex items-center justify-center p-2 rounded-lg border transition-all duration-300 cursor-pointer ${
        autoDegrade
          ? "bg-dragon-neon/10 border-dragon-neon/30 text-dragon-neon"
          : "bg-dragon-bg-600 border-dragon-neon/10 text-dragon-text-muted hover:text-dragon-text hover:border-dragon-neon/40"
      }`}
      title={autoDegrade ? "Auto-Performance Tuning: Enabled" : "Auto-Performance Tuning: Disabled"}
      aria-label="Toggle auto performance tuning"
    >
      <Cpu className="w-4 h-4" />
    </button>
  );
}

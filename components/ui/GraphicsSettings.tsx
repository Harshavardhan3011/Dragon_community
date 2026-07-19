"use client";

import { usePerformanceStore, QualitySetting } from "@/store/performance-store";
import { Settings, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GraphicsSettings() {
  const { quality, autoDegrade, setQuality, setAutoDegrade, fps } = usePerformanceStore();
  const [isOpen, setIsOpen] = useState(false);

  const options: { value: QualitySetting; label: string; desc: string }[] = [
    { value: "high", label: "Cinematic (High)", desc: "Full 3D effects, shadows & particles" },
    { value: "medium", label: "Balanced (Medium)", desc: "Simplified lighting & particles" },
    { value: "low", label: "Performance (Low)", desc: "Static image fallback, optimized for mobile" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2 rounded-lg bg-dragon-bg-600 border border-dragon-neon/10 hover:border-dragon-neon/40 text-dragon-text hover:text-dragon-neon transition-all duration-300 cursor-pointer"
        aria-label="Graphics and performance settings"
        aria-expanded={isOpen}
      >
        <Settings className={`w-4 h-4 ${isOpen ? "rotate-90" : ""} transition-transform duration-300`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close panel */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-64 rounded-xl border border-dragon-neon/20 bg-dragon-bg-800/95 p-4 shadow-xl shadow-dragon-bg-900/50 backdrop-blur-md z-50"
            >
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-dragon-neon/10">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-dragon-neon">
                  Graphics Settings
                </span>
                <span className="font-heading text-[10px] text-dragon-text-muted">
                  FPS: {fps}
                </span>
              </div>

              {/* Quality Options */}
              <div className="space-y-1">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setQuality(opt.value);
                      setAutoDegrade(false); // Disable auto degradation on manual select
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer group ${
                      quality === opt.value
                        ? "bg-dragon-neon/10 text-dragon-neon border border-dragon-neon/20"
                        : "hover:bg-dragon-bg-600 text-dragon-text-secondary border border-transparent"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{opt.label}</div>
                      <div className="text-[10px] text-dragon-text-muted group-hover:text-dragon-text-secondary/70">
                        {opt.desc}
                      </div>
                    </div>
                    {quality === opt.value && <Check className="w-3.5 h-3.5 text-dragon-neon" />}
                  </button>
                ))}
              </div>

              {/* Auto Degrade toggle */}
              <label className="flex items-center justify-between mt-3 pt-2.5 border-t border-dragon-neon/10 cursor-pointer select-none">
                <span className="text-[11px] text-dragon-text-secondary font-medium">
                  Auto-adjust quality
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={autoDegrade}
                    onChange={(e) => setAutoDegrade(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-dragon-bg-500 rounded-full peer peer-focus:ring-1 peer-focus:ring-dragon-neon peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-dragon-text-muted peer-checked:after:bg-dragon-neon after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-dragon-neon/20 border border-dragon-neon/10"></div>
                </div>
              </label>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


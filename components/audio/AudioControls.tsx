"use client";

import { useState } from "react";
import { useAudioStore } from "@/store/audio-store";
import { Volume2, VolumeX, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AudioControls() {
  const { soundEnabled, isMuted, volume, setMuted, setVolume, setSoundEnabled } = useAudioStore();
  const [hovered, setHovered] = useState(false);

  if (!soundEnabled) {
    return (
      <button
        onClick={() => setSoundEnabled(true)}
        className="fixed bottom-6 right-6 z-[90] flex items-center gap-2 bg-dragon-bg-900 border border-dragon-neon/30 hover:border-dragon-neon text-dragon-neon hover:text-dragon-light-green px-4 py-2.5 rounded-full font-heading text-xs uppercase tracking-wider shadow-lg shadow-dragon-neon/5 transition-all duration-300 group cursor-pointer"
        aria-label="Enable sound experience"
      >
        <Music className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
        <span>Enable Sound</span>
      </button>
    );
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-6 right-6 z-[90] flex items-center bg-dragon-bg-900/90 border border-dragon-neon/20 px-3.5 py-2 rounded-full shadow-lg shadow-dragon-neon/5 transition-all duration-300"
    >
      <button
        onClick={() => setMuted(!isMuted)}
        className="text-dragon-text hover:text-dragon-neon p-1 transition-colors cursor-pointer"
        aria-label={isMuted ? "Unmute audio" : "Mute audio"}
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="w-4 h-4 text-dragon-text-muted" />
        ) : (
          <Volume2 className="w-4 h-4 text-dragon-neon" />
        )}
      </button>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ width: 0, opacity: 0, marginLeft: 0 }}
            animate={{ width: 80, opacity: 1, marginLeft: 8 }}
            exit={{ width: 0, opacity: 0, marginLeft: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center overflow-hidden"
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const vol = parseFloat(e.target.value);
                setVolume(vol);
                if (isMuted && vol > 0) setMuted(false);
              }}
              className="w-full h-1 bg-dragon-bg-500 rounded-lg appearance-none cursor-pointer accent-dragon-neon"
              style={{
                background: `linear-gradient(to right, var(--color-dragon-neon) ${
                  (isMuted ? 0 : volume) * 100
                }%, var(--color-dragon-bg-500) ${(isMuted ? 0 : volume) * 100}%)`,
              }}
              aria-label="Master volume level"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


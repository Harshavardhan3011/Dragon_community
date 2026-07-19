"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-dragon-bg-900"
          aria-label="Loading Dragon Up"
          aria-live="polite"
        >
          {/* Dragon SVG */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <svg width="64" height="64" viewBox="0 0 32 32" fill="none" className="text-dragon-neon glow-md" aria-hidden="true">
              <path d="M16 2L4 10l4 6-4 6 12 8 12-8-4-6 4-6L16 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" />
              <path d="M16 8l-6 4 3 4-3 4 6 4 6-4-3-4 3-4-6-4z" fill="currentColor" opacity="0.5" />
              <circle cx="13" cy="13" r="1.5" fill="currentColor" />
              <circle cx="19" cy="13" r="1.5" fill="currentColor" />
            </svg>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-heading text-sm uppercase tracking-widest text-dragon-text-secondary mb-6"
          >
            Entering Dragon World
          </motion.p>

          {/* Progress bar */}
          <div className="w-48 h-0.5 bg-dragon-bg-500 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-dragon-dark-green via-dragon-neon to-dragon-light-green rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

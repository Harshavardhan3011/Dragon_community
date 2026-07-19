"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  // Low performance or accessibility simple fade
  if (prefersReducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className="relative overflow-hidden w-full h-full">
      {/* Cinematic swipe panel */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        style={{ originY: 0 }}
        className="fixed inset-0 bg-[#050705] z-[160] pointer-events-none flex items-center justify-center border-b-2 border-dragon-neon"
      >
        <span className="font-heading text-xs uppercase tracking-[0.3em] text-dragon-neon animate-pulse">
          Loading Sector
        </span>
      </motion.div>

      {/* Main content reveal */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

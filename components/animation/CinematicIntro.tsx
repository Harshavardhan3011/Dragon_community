"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimationStore, IntroState } from "@/store/animation-store";
import { useAudioStore } from "@/store/audio-store";
import { usePerformanceStore } from "@/store/performance-store";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSound } from "@/hooks/useSound";
import IntroSkipButton from "@/components/ui/IntroSkipButton";
import { Sparkles, Play } from "lucide-react";

export default function CinematicIntro() {
  const pathname = usePathname();

  // ── All hooks must be declared before any conditional return ──────
  const { introState, setIntroState, setIntroPlayed } = useAnimationStore();
  const { soundEnabled, setSoundEnabled } = useAudioStore();
  const { quality } = usePerformanceStore();
  const prefersReducedMotion = useReducedMotion();
  const { playRoar, playFire, playClick } = useSound();
  const [mounted, setMounted] = useState(false);
  const [needsConsent, setNeedsConsent] = useState(true);

  // ── Guard: skip cinematic intro on admin routes ──────────────────
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    setMounted(true);

    // Verify if intro has been played in this browser session
    const hasPlayed = sessionStorage.getItem("dragon_up_intro_played");
    
    // Check if we should bypass due to performance, session, or accessibility
    if (hasPlayed === "true" || prefersReducedMotion || quality === "low") {
      setIntroState("completed");
      setIntroPlayed(true);
      setNeedsConsent(false);
      return;
    }

    // Otherwise initiate intro flow
    setIntroState("darkness");
  }, [prefersReducedMotion, quality, setIntroState, setIntroPlayed]);

  // Scene triggers
  useEffect(() => {
    if (!mounted || needsConsent || introState === "completed") return;

    let timer: NodeJS.Timeout;

    if (introState === "darkness") {
      // Scene 1: Darkness (2s)
      timer = setTimeout(() => setIntroState("eye_reveal"), 2000);
    } else if (introState === "eye_reveal") {
      // Scene 2: Dragon eye (2s)
      playRoar();
      timer = setTimeout(() => setIntroState("fire_reveal"), 2000);
    } else if (introState === "fire_reveal") {
      // Scene 3: Fire reveal (1.8s)
      playFire();
      timer = setTimeout(() => setIntroState("logo_reveal"), 1800);
    } else if (introState === "logo_reveal") {
      // Scene 4: Logo reveal (2.2s)
      timer = setTimeout(() => {
        setIntroState("completed");
        setIntroPlayed(true);
        sessionStorage.setItem("dragon_up_intro_played", "true");
      }, 2400);
    }

    return () => clearTimeout(timer);
  }, [introState, mounted, needsConsent, setIntroState, setIntroPlayed, playRoar, playFire]);

  // Handle entering and activating sounds
  const handleEnterClick = (enableAudio: boolean) => {
    playClick();
    if (enableAudio) {
      setSoundEnabled(true);
    }
    setNeedsConsent(false);
  };

  if (!mounted || introState === "completed") return null;

  // Render initial Consent step to unlock Web Audio context safely
  if (needsConsent) {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#030403] text-dragon-text p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md w-full"
        >
          <div className="w-16 h-16 rounded-full bg-dragon-neon/15 flex items-center justify-center mx-auto mb-6 border border-dragon-neon/30">
            <Sparkles className="w-8 h-8 text-dragon-neon" />
          </div>
          <h2 className="font-heading text-xl uppercase tracking-widest text-dragon-text mb-4">
            Dragon Up Cinematic
          </h2>
          <p className="text-sm text-dragon-text-secondary mb-8 leading-relaxed">
            Prepare to enter the 3D interactive universe. We recommend enabling spatial sound for the full cinematic experience.
          </p>
          <div className="flex flex-col gap-3.5">
            <button
              onClick={() => handleEnterClick(true)}
              className="w-full flex items-center justify-center gap-2 bg-dragon-neon text-dragon-bg-900 font-heading text-xs uppercase tracking-widest font-bold py-4 rounded-xl hover:bg-dragon-light-green transition-colors cursor-pointer shadow-lg shadow-dragon-neon/10"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Enter With Audio</span>
            </button>
            <button
              onClick={() => handleEnterClick(false)}
              className="w-full bg-dragon-bg-600 border border-dragon-neon/15 hover:border-dragon-neon/40 text-dragon-text-secondary hover:text-dragon-text font-heading text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all cursor-pointer"
            >
              <span>Enter Silent</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const headingWords = "Rise. Fight. Dominate.".split(" ");

  return (
    <div className="fixed inset-0 z-[150] bg-[#030403] select-none overflow-hidden flex items-center justify-center">
      <IntroSkipButton onSkip={() => sessionStorage.setItem("dragon_up_intro_played", "true")} />

      <AnimatePresence mode="wait">
        {/* Scene 1: Darkness */}
        {introState === "darkness" && (
          <motion.div
            key="darkness"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              initial={{ letterSpacing: "0.2em", opacity: 0 }}
              animate={{ letterSpacing: "0.4em", opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="font-heading text-md sm:text-lg uppercase tracking-[0.4em] text-dragon-neon glow-sm"
            >
              Awakening the Dragon
            </motion.h1>
            <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />
          </motion.div>
        )}

        {/* Scene 2: Dragon Eye */}
        {introState === "eye_reveal" && (
          <motion.div
            key="eye"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: [1, 1.05], rotate: [0, 0.5, 0] }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 2.0 }}
            className="relative flex items-center justify-center"
          >
            {/* Glowing dragon eye SVG */}
            <svg width="180" height="180" viewBox="0 0 100 100" className="text-dragon-neon">
              {/* Sclera / eye outline */}
              <motion.path
                d="M 10,50 Q 50,10 90,50 Q 50,90 10,50 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5 }}
              />
              {/* Slit Pupil */}
              <motion.ellipse
                cx="50"
                cy="50"
                rx="6"
                ry="30"
                fill="currentColor"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.5, duration: 1.0, ease: "easeInOut" }}
                className="glow-md text-dragon-neon"
              />
            </svg>
            <div className="absolute w-40 h-40 bg-dragon-neon/15 rounded-full blur-[40px] animate-pulse" />
          </motion.div>
        )}

        {/* Scene 3: Fire Reveal */}
        {introState === "fire_reveal" && (
          <motion.div
            key="fire"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col items-center justify-center bg-dragon-neon/5"
          >
            {/* Logo placeholder flashing to reveal energy */}
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: [1, 1.1, 1], rotate: 0 }}
              transition={{ duration: 1.5 }}
              className="text-center"
            >
              <svg width="100" height="100" viewBox="0 0 32 32" fill="none" className="text-dragon-neon glow-lg mx-auto">
                <path d="M16 2L4 10l4 6-4 6 12 8 12-8-4-6 4-6L16 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.4" />
              </svg>
              <h2 className="font-heading text-xs tracking-widest text-dragon-light-green mt-4 uppercase">
                Synchronizing Energy
              </h2>
            </motion.div>
          </motion.div>
        )}

        {/* Scene 4: Logo Reveal */}
        {introState === "logo_reveal" && (
          <motion.div
            key="logo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center px-4"
          >
            {/* Animated Title letters */}
            <motion.h2
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold tracking-wider text-dragon-text mb-4"
            >
              {"DRAGON UP".split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.08 }}
                  className={char === " " ? "mx-2" : "inline-block text-shadow-glow"}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h2>

            {/* Tagline */}
            <div className="flex justify-center gap-3 mt-4">
              {headingWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + i * 0.3, duration: 0.5 }}
                  className="font-heading text-sm sm:text-md tracking-widest text-dragon-neon font-semibold"
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


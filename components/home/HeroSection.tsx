"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { Play, Youtube, Instagram, MessageCircle, ChevronDown, Flame } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { siteConfig } from "@/config/site";
import { useAnimationStore } from "@/store/animation-store";
import { usePerformanceStore } from "@/store/performance-store";
import { useSound } from "@/hooks/useSound";

// Memoized Background Video Component to prevent restarts and flickering
const BackgroundVideo = memo(({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // requestVideoFrameCallback support for ultra-smooth rendering loops
    if ("requestVideoFrameCallback" in video) {
      let callbackId: number;
      const updateFrame = () => {
        callbackId = (video as any).requestVideoFrameCallback(updateFrame);
      };
      callbackId = (video as any).requestVideoFrameCallback(updateFrame);
      return () => {
        (video as any).cancelVideoFrameCallback(callbackId);
      };
    }
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      style={{
        objectPosition: "center",
        zIndex: -2,
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
});

BackgroundVideo.displayName = "BackgroundVideo";

export default function HeroSection() {
  const [communityModalOpen, setCommunityModalOpen] = useState(false);
  const setBreathingFire = useAnimationStore((state) => state.setBreathingFire);
  const quality = usePerformanceStore((state) => state.quality);
  const { playFire, playHover } = useSound();

  const handleFireClick = () => {
    setBreathingFire(true);
    playFire();
  };

  const handleCTAInteraction = () => {
    if (quality === "high") {
      setBreathingFire(true);
      playFire();
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      aria-label="Hero"
      id="hero"
    >
      {/* Dynamic Smooth Background Video */}
      <BackgroundVideo src="/images/videos/dragon_up_bg.mp4" />

      {/* Subtle overlay (max 10-20% opacity) for text readability */}
      <div 
        className="absolute inset-0 bg-black/15 pointer-events-none" 
        style={{ zIndex: -1 }} 
        aria-hidden="true" 
      />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Badge className="mb-6">
              <span className="w-2 h-2 rounded-full bg-dragon-neon animate-pulse" />
              Welcome to Dragon Up
            </Badge>

            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold text-dragon-text leading-[1.05] mb-6 tracking-tight">
              Rise.{" "}
              <span className="gradient-text">Fight.</span>{" "}
              Dominate.
            </h1>

            <p className="text-dragon-text-secondary text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
              Enter the Dragon Up gaming universe for Free Fire battles, PC gaming
              adventures, livestreams, community highlights, and upcoming competitive
              events.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Button
                variant="primary"
                size="lg"
                href={siteConfig.links.youtube}
                isExternal
                onMouseEnter={handleCTAInteraction}
                onClick={handleFireClick}
              >
                <Play className="w-4 h-4" />
                Watch Latest Video
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setCommunityModalOpen(true)}
                onMouseEnter={handleCTAInteraction}
              >
                Join the Community
              </Button>
            </div>

            {/* Social proof row */}
            <div className="flex flex-wrap items-center gap-6">
              {[
                { icon: Youtube, label: "YouTube", color: "text-red-400" },
                { icon: Instagram, label: "Instagram", color: "text-pink-400" },
                { icon: MessageCircle, label: "Community", color: "text-dragon-neon" },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${color}`} aria-hidden="true" />
                  <span className="text-sm text-dragon-text-secondary">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dragon visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative flex items-center justify-center lg:justify-end min-h-[350px] w-full"
          >
            {/* 3D Spacer / Action triggers */}
            <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center justify-center border border-dragon-neon/10 bg-dragon-bg-800/30 backdrop-blur-[2px] rounded-2xl p-6 text-center shadow-lg pointer-events-auto">
              <div className="text-xs font-heading text-dragon-text-secondary mb-3 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-dragon-neon animate-pulse" />
                Tactile Hologram Active
              </div>
              <p className="text-xs text-dragon-text-muted mb-5 leading-relaxed max-w-xs">
                Interact with the dragon by moving your cursor or click below to command fire breathing.
              </p>
              <button
                onClick={handleFireClick}
                onMouseEnter={playHover}
                className="flex items-center gap-2 bg-dragon-neon/10 hover:bg-dragon-neon/20 border border-dragon-neon/30 hover:border-dragon-neon px-4 py-2.5 rounded-full font-heading text-[10px] text-dragon-neon uppercase tracking-widest cursor-pointer transition-all duration-300"
              >
                <Flame className="w-3.5 h-3.5 animate-bounce" />
                <span>Breathe Fire</span>
              </button>
            </div>
          </motion.div>

        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-dragon-text-muted font-heading uppercase tracking-widest">
            Explore Gaming
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5 text-dragon-neon" />
          </motion.div>
        </motion.div>
      </div>

      {/* Community Coming Soon Modal */}
      <Modal
        isOpen={communityModalOpen}
        onClose={() => setCommunityModalOpen(false)}
        title="Dragon Up Community"
      >
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-dragon-neon/10 flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-dragon-neon" />
          </div>
          <p className="text-dragon-text-secondary mb-6 leading-relaxed">
            Dragon Up Community accounts are coming soon. Join our YouTube and follow on
            Instagram to stay updated on the launch.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              href={siteConfig.links.youtube}
              isExternal
              onClick={() => setCommunityModalOpen(false)}
            >
              <Youtube className="w-4 h-4" />
              Subscribe on YouTube
            </Button>
            {siteConfig.links.instagram && (
              <Button
                variant="secondary"
                href={siteConfig.links.instagram}
                isExternal
                onClick={() => setCommunityModalOpen(false)}
              >
                <Instagram className="w-4 h-4" />
                Follow on Instagram
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </section>
  );
}

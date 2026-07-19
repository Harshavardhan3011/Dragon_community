"use client";

import { useEffect } from "react";
import { useAudioStore } from "@/store/audio-store";
import { AudioSynth } from "@/lib/audio-config";

export default function AudioManager() {
  const { soundEnabled, isMuted, volume } = useAudioStore();

  // Handle initialization and track mapping
  useEffect(() => {
    // Pre-load audio paths (will fall back to synth if files fail to load)
    AudioSynth.loadTrack("ambient-loop", "/audio/ambient-loop.mp3", true);
    AudioSynth.loadTrack("dragon-roar", "/audio/dragon-roar.mp3");
    AudioSynth.loadTrack("fire-whoosh", "/audio/fire-whoosh.mp3");
    AudioSynth.loadTrack("click", "/audio/click.mp3");
    AudioSynth.loadTrack("hover", "/audio/hover.mp3");

    // Initialize audio synthesizer on mount
    AudioSynth.init();

    return () => {
      AudioSynth.stopAllLoops();
    };
  }, []);

  // Update volume and mute states dynamically
  useEffect(() => {
    if (isMuted) {
      AudioSynth.setVolume(0);
    } else {
      AudioSynth.setVolume(volume);
    }
  }, [isMuted, volume]);

  // Play ambient loops when sound consent is enabled
  useEffect(() => {
    if (soundEnabled && !isMuted) {
      AudioSynth.resumeContext();
      AudioSynth.playTrack("ambient-loop");
    } else {
      AudioSynth.stopTrack("ambient-loop");
    }
  }, [soundEnabled, isMuted]);

  // Tab visibility changes to pause / resume audio smoothly
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        AudioSynth.stopAllLoops();
      } else {
        if (soundEnabled && !isMuted) {
          AudioSynth.resumeContext();
          AudioSynth.playTrack("ambient-loop");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [soundEnabled, isMuted]);

  return null; // Silent controller component
}

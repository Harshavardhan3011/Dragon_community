"use client";

/* eslint-disable @next/next/no-img-element */

export default function WebGLFallback() {
  return (
    <div
      className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-dragon-bg-900 via-transparent to-dragon-bg-900/80 z-10" />
      <div className="relative w-full max-w-lg mx-auto p-4 opacity-40">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-80 h-80 bg-dragon-neon/5 rounded-full blur-[90px] animate-pulse" />
        </div>
        <img
          src="/images/hero-bg.png"
          alt="Dragon Up Universe"
          className="relative z-0 w-full max-w-sm mx-auto object-contain rounded-2xl border border-dragon-neon/10"
        />
      </div>
    </div>
  );
}


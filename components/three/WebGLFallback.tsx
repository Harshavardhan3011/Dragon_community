"use client";

/* eslint-disable @next/next/no-img-element */

export default function WebGLFallback() {
  return (
    <div
      className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-dragon-bg-900 via-transparent to-dragon-bg-900/80 z-10" />
      <div className="relative w-full max-w-sm mx-auto p-4 opacity-40">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-80 h-80 bg-dragon-neon/5 rounded-full blur-[90px] animate-pulse" />
        </div>
        <div className="relative w-80 h-80 mx-auto rounded-full overflow-hidden border border-dragon-neon/20 aspect-square">
          <img
            src="/images/hero-bg.png"
            alt="Dragon Up Universe"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}


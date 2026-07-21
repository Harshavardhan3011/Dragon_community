"use client";

import { Shield } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-dragon-neon/10 bg-dragon-bg-800/60 backdrop-blur-sm z-40">
      {/* Left: Admin badge */}
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-dragon-neon" aria-hidden="true" />
        <span className="font-heading text-xs uppercase tracking-widest text-dragon-neon">
          Admin Panel
        </span>
      </div>

      {/* Right: Status pill */}
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-dragon-neon animate-pulse" aria-hidden="true" />
        <span className="text-xs text-dragon-text-muted font-heading uppercase tracking-wider">
          Secure Session
        </span>
      </div>
    </header>
  );
}

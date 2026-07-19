"use client";

import { cn } from "@/lib/utils";
import type { BadgeVariant } from "@/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  neon: "bg-dragon-neon/10 text-dragon-neon border-dragon-neon/30",
  emerald: "bg-dragon-emerald/10 text-dragon-emerald border-dragon-emerald/30",
  muted: "bg-dragon-bg-500 text-dragon-text-muted border-dragon-text-muted/20",
  danger: "bg-red-500/10 text-red-400 border-red-500/30",
};

export default function Badge({
  children,
  variant = "neon",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-heading uppercase tracking-wider rounded-full border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

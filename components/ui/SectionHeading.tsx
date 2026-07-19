"use client";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  badge,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl mb-12 md:mb-16",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {badge && (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-xs font-heading uppercase tracking-widest text-dragon-neon bg-dragon-neon/10 border border-dragon-neon/20 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-dragon-neon animate-pulse" />
          {badge}
        </span>
      )}
      <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-dragon-text mb-4 tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-dragon-text-secondary text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}

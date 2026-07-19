"use client";

import { cn } from "@/lib/utils";

interface GamingCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export default function GamingCard({
  children,
  className,
  hover = true,
  glow = false,
  onClick,
}: GamingCardProps) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "glass-card rounded-xl p-6 transition-all duration-300",
        hover && "hover:translate-y-[-2px]",
        glow && "glow-sm",
        onClick && "cursor-pointer w-full text-left",
        className
      )}
    >
      {children}
    </Tag>
  );
}

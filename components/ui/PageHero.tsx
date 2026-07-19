"use client";

import { motion } from "framer-motion";
import Badge from "./Badge";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  badge?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function PageHero({
  badge,
  title,
  description,
  children,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden",
        className
      )}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-dragon-neon/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {badge && (
            <div className="mb-6">
              <Badge>{badge}</Badge>
            </div>
          )}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-dragon-text mb-6 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-dragon-text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}

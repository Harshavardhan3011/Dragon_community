"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Eye, Video, Heart } from "lucide-react";
import { stats } from "@/data/featured-content";

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users className="w-6 h-6" />,
  Eye: <Eye className="w-6 h-6" />,
  Video: <Video className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
};

function CountUp({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [active, target]);

  const format = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${Math.floor(n / 1_000)}K`;
    return n.toString();
  };

  return (
    <span>
      {format(count)}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-16 md:py-20 relative"
      aria-label="Channel statistics"
      id="stats"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dragon-bg-800/30 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-dragon-neon/10 flex items-center justify-center mx-auto mb-4 text-dragon-neon group-hover:bg-dragon-neon/20 transition-colors">
                {iconMap[stat.icon]}
              </div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-dragon-neon mb-1 glow-text">
                <CountUp
                  target={stat.numericValue}
                  suffix={stat.suffix}
                  active={isInView}
                />
              </div>
              <div className="font-heading text-sm uppercase tracking-wider text-dragon-text mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-dragon-text-muted">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Eye, Video, Heart, RefreshCw } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users className="w-6 h-6" />,
  Eye: <Eye className="w-6 h-6" />,
  Video: <Video className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
};

interface StatsData {
  subscribers: number;
  views: number;
  videos: number;
  community: number;
  lastSynced: string;
}

function CountUp({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active || !target) return;
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
    if (n >= 1_000_000) {
      const raw = n / 1_000_000;
      const formatted = raw % 1 === 0 ? raw.toFixed(0) : raw.toFixed(2).replace(/\.?0+$/, "");
      return `${formatted}M`;
    }
    if (n >= 1_000) {
      const raw = n / 1_000;
      const formatted = raw % 1 === 0 ? raw.toFixed(0) : raw.toFixed(1).replace(/\.?0+$/, "");
      return `${formatted}K`;
    }
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

  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeAgoText, setTimeAgoText] = useState("synced just now");

  // ─── Fetch Statistics Client Side ─────────────────────────────────
  useEffect(() => {
    let active = true;
    const loadStats = async () => {
      try {
        const res = await fetch("/api/youtube/stats");
        const json = await res.json();
        if (active && json.success) {
          setStatsData(json.data);
        }
      } catch (err) {
        console.error("Failed to load homepage stats:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadStats();
    
    // Poll stats every 5 minutes to stay real-time
    const interval = setInterval(loadStats, 5 * 60 * 1000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // ─── Update Time Ago text dynamically ──────────────────────────────
  useEffect(() => {
    if (!statsData?.lastSynced) return;

    const updateLabel = () => {
      const elapsed = Date.now() - new Date(statsData.lastSynced).getTime();
      const minutes = Math.floor(elapsed / 60000);
      if (minutes < 1) {
        setTimeAgoText("synced just now");
      } else if (minutes === 1) {
        setTimeAgoText("synced 1 min ago");
      } else {
        setTimeAgoText(`synced ${minutes} min ago`);
      }
    };

    updateLabel();
    const timer = setInterval(updateLabel, 30000); // refresh every 30 seconds
    return () => clearInterval(timer);
  }, [statsData]);

  // static attributes mapper
  const items = [
    {
      id: "subscribers",
      label: "Subscribers",
      numericValue: statsData?.subscribers || 0,
      suffix: "+",
      description: "Growing every day",
      icon: "Users",
    },
    {
      id: "views",
      label: "Total Views",
      numericValue: statsData?.views || 0,
      suffix: "+",
      description: "Gaming since launch",
      icon: "Eye",
    },
    {
      id: "videos",
      label: "Videos",
      numericValue: statsData?.videos || 0,
      suffix: "+",
      description: "Multiple gaming categories",
      icon: "Video",
    },
    {
      id: "community",
      label: "Community Members",
      numericValue: statsData?.community || 5000,
      suffix: "+",
      description: "Active community",
      icon: "Heart",
    },
  ];

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
          {items.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 text-center group border border-dragon-neon/10"
            >
              <div className="w-12 h-12 rounded-xl bg-dragon-neon/10 flex items-center justify-center mx-auto mb-4 text-dragon-neon group-hover:bg-dragon-neon/20 transition-colors">
                {iconMap[stat.icon]}
              </div>

              {loading ? (
                // Pulse loading skeleton for values (never render zero or NaN)
                <div className="h-9 w-24 bg-dragon-bg-700/60 rounded mx-auto mb-2 animate-pulse" />
              ) : (
                <div className="font-heading text-3xl md:text-4xl font-bold text-dragon-neon mb-1 glow-text">
                  <CountUp
                    target={stat.numericValue}
                    suffix={stat.suffix}
                    active={isInView}
                  />
                </div>
              )}

              <div className="font-heading text-sm uppercase tracking-wider text-dragon-text mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-dragon-text-muted">{stat.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Last updated synchronization badge */}
        {!loading && statsData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.4 } : {}}
            className="text-center mt-10 flex items-center justify-center gap-1.5 text-[10px] font-heading uppercase tracking-widest text-dragon-text-secondary select-none"
          >
            <RefreshCw className="w-3 h-3 animate-spin bg-none" style={{ animationDuration: "10s" }} />
            <span>{timeAgoText}</span>
          </motion.div>
        )}
      </div>
    </section>
  );
}

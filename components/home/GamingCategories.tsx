"use client";

import { motion } from "framer-motion";
import { Flame, Monitor, ArrowRight } from "lucide-react";
import { gamingCategories } from "@/data/featured-content";
import SectionHeading from "@/components/ui/SectionHeading";

const iconMap: Record<string, React.ReactNode> = {
  Flame: <Flame className="w-8 h-8" />,
  Monitor: <Monitor className="w-8 h-8" />,
};

export default function GamingCategories() {
  return (
    <section className="py-16 md:py-24" aria-label="Gaming categories" id="categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Game Library"
          title="Choose Your Battle"
          description="Explore Dragon Up's main gaming content categories — from mobile battlegrounds to PC adventures."
        />

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {gamingCategories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer h-80 md:h-96"
            >
              {/* Background */}
              <div className="absolute inset-0">
                <div
                  className={`absolute inset-0 ${i === 0
                    ? "bg-gradient-to-br from-dragon-dark-green/60 via-dragon-bg-700 to-dragon-bg-900"
                    : "bg-gradient-to-br from-dragon-bg-700/80 via-dragon-dark-green/40 to-dragon-bg-900"
                    }`}
                />
                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl border border-dragon-neon/16 group-hover:border-dragon-neon/55 transition-all duration-500" />
                {/* Glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-dragon-neon/3 rounded-2xl" />
                </div>
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `linear-gradient(rgba(0,255,102,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,102,0.06) 1px, transparent 1px)`,
                  backgroundSize: "30px 30px"
                }} />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-8">
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-dragon-neon/15 border border-dragon-neon/30 flex items-center justify-center text-dragon-neon mb-6 group-hover:bg-dragon-neon/25 group-hover:scale-110 transition-all duration-300">
                  {iconMap[category.icon] || <Flame className="w-8 h-8" />}
                </div>

                <h3 className="font-heading text-2xl md:text-3xl font-bold text-dragon-text mb-3 group-hover:text-dragon-neon transition-colors">
                  {category.title}
                </h3>
                <p className="text-dragon-text-secondary text-sm leading-relaxed mb-6 max-w-xs">
                  {category.description}
                </p>

                <span className="inline-flex items-center gap-2 text-dragon-neon font-heading text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
                  {category.cta}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

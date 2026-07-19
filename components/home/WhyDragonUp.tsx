"use client";

import { motion } from "framer-motion";
import { Flame, Monitor, Users, Radio, Trophy, Sparkles } from "lucide-react";
import { whyDragonUpItems } from "@/data/featured-content";
import SectionHeading from "@/components/ui/SectionHeading";

const iconMap: Record<string, React.ElementType> = {
  Flame, Monitor, Users, Radio, Trophy, Sparkles,
};

export default function WhyDragonUp() {
  return (
    <section className="py-16 md:py-24" aria-label="Why Dragon Up" id="why">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Why Dragon Up"
          title="Built for Real Gamers"
          description="Everything you need in one gaming community platform — designed with passion, built to grow."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {whyDragonUpItems.map((item, i) => {
            const Icon = (iconMap[item.icon] || Flame) as React.ComponentType<{ className?: string }>;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-xl p-6 flex gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-dragon-neon/10 flex items-center justify-center text-dragon-neon shrink-0 group-hover:bg-dragon-neon/20 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-dragon-text mb-2 group-hover:text-dragon-neon transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-dragon-text-secondary text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

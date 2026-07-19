"use client";

import { motion } from "framer-motion";
import { Youtube, Instagram, MessageCircle } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { socialLinks } from "@/config/social-links";

const iconMap: Record<string, React.ElementType> = {
  Youtube, Instagram, MessageCircle,
};

const cardColors: Record<string, { bg: string; text: string; hover: string }> = {
  YouTube:  { bg: "bg-red-500/10", text: "text-red-400", hover: "hover:bg-red-500/20" },
  Instagram: { bg: "bg-pink-500/10", text: "text-pink-400", hover: "hover:bg-pink-500/20" },
  Discord:  { bg: "bg-indigo-500/10", text: "text-indigo-400", hover: "hover:bg-indigo-500/20" },
};

export default function SocialSection() {
  return (
    <section className="py-16 md:py-24" aria-label="Social media" id="social">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Follow Along"
          title="Stay in the Dragon World"
          description="Connect with Dragon Up across all platforms for daily gaming content, community updates, and announcements."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialLinks.map((link, i) => {
            const Icon = (iconMap[link.icon] || Youtube) as React.ComponentType<{ className?: string }>;
            const colors = cardColors[link.name] || { bg: "bg-dragon-neon/10", text: "text-dragon-neon", hover: "hover:bg-dragon-neon/20" };
            return (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-6 text-center group"
              >
                <div className={`w-16 h-16 rounded-2xl ${colors.bg} ${colors.hover} flex items-center justify-center mx-auto mb-5 transition-colors`}>
                  <Icon className={`w-8 h-8 ${colors.text}`} />
                </div>
                <h3 className="font-heading text-xl font-bold text-dragon-text mb-1">
                  {link.name}
                </h3>
                <p className="text-dragon-text-muted text-sm mb-3">{link.handle}</p>
                <p className="text-dragon-text-secondary text-sm leading-relaxed mb-6">
                  {link.description}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  href={link.href || "#"}
                  isExternal={!!link.href && link.href !== "#"}
                  className="w-full"
                >
                  {link.cta}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

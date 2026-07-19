"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Trophy, TrendingUp, Youtube, Instagram, Users } from "lucide-react";
import { communityCards } from "@/data/featured-content";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { siteConfig } from "@/config/site";

const iconMap: Record<string, React.ReactNode> = {
  Camera: <Camera className="w-7 h-7" />,
  Trophy: <Trophy className="w-7 h-7" />,
  TrendingUp: <TrendingUp className="w-7 h-7" />,
};

export default function CommunityPreview() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section
      className="py-16 md:py-24 relative overflow-hidden"
      aria-label="Community preview"
      id="community"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dragon-bg-800/20 to-transparent pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-dragon-neon/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Community"
          title="Join the Dragon Community"
          description="Connect with passionate gamers, share your best moments, and be part of something bigger."
        />

        {/* Community cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {communityCards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-dragon-neon/10 border border-dragon-neon/20 flex items-center justify-center mx-auto mb-5 text-dragon-neon group-hover:bg-dragon-neon/20 group-hover:scale-110 transition-all duration-300">
                {iconMap[card.icon]}
              </div>
              <h3 className="font-heading text-lg font-bold text-dragon-text mb-3">
                {card.title}
              </h3>
              <p className="text-dragon-text-secondary text-sm leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Features list */}
        <div className="glass-card rounded-2xl p-8 mb-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Connect with gamers",
              "Share gaming clips",
              "Join future events",
              "Participate in giveaways",
              "Earn rewards later",
              "Follow Dragon Up updates",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-dragon-text-secondary">
                <span className="w-2 h-2 rounded-full bg-dragon-neon shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="lg" onClick={() => setModalOpen(true)}>
            <Users className="w-4 h-4" />
            Join Community
          </Button>
          {siteConfig.links.instagram && (
            <Button variant="secondary" size="lg" href={siteConfig.links.instagram} isExternal>
              <Instagram className="w-4 h-4" />
              Follow on Instagram
            </Button>
          )}
          <Button variant="ghost" size="lg" href={siteConfig.links.youtube} isExternal>
            <Youtube className="w-4 h-4" />
            Subscribe on YouTube
          </Button>
        </div>
      </div>

      {/* Community Coming Soon Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Dragon Up Community">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-dragon-neon/10 flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-dragon-neon" />
          </div>
          <p className="text-dragon-text-secondary mb-2 leading-relaxed">
            Dragon Up Community accounts are coming soon. Our full community platform with
            profiles, clips, leaderboards, and rewards is in development.
          </p>
          <p className="text-dragon-text-muted text-sm mb-6">
            Stay connected via our social channels for the launch announcement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" href={siteConfig.links.youtube} isExternal onClick={() => setModalOpen(false)}>
              <Youtube className="w-4 h-4" /> Subscribe on YouTube
            </Button>
            {siteConfig.links.instagram && (
              <Button variant="secondary" href={siteConfig.links.instagram} isExternal onClick={() => setModalOpen(false)}>
                <Instagram className="w-4 h-4" /> Follow on Instagram
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </section>
  );
}

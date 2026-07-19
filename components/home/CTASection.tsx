"use client";

import { motion } from "framer-motion";
import { Youtube, Instagram } from "lucide-react";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden" aria-label="Call to action" id="cta">
      {/* Dark green premium background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-dragon-dark-green/20 via-dragon-bg-800 to-dragon-bg-900" />
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0,255,102,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,102,0.04) 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dragon-neon/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dragon-neon/20 to-transparent" />
        {/* Dragon corner accent */}
        <div className="absolute right-0 top-0 w-64 h-64 opacity-5">
          <svg viewBox="0 0 32 32" fill="currentColor" className="text-dragon-neon w-full h-full">
            <path d="M16 2L4 10l4 6-4 6 12 8 12-8-4-6 4-6L16 2z" />
          </svg>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-heading uppercase tracking-widest text-dragon-neon bg-dragon-neon/10 border border-dragon-neon/20 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-dragon-neon animate-pulse" />
            {siteConfig.secondaryTagline}
          </span>

          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-dragon-text mb-6 tracking-tight">
            Ready to Enter the{" "}
            <span className="gradient-text">Dragon World?</span>
          </h2>
          <p className="text-dragon-text-secondary text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of gamers in the Dragon Up universe. Subscribe for new videos,
            follow for daily updates, and be ready when the community platform launches.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              href={siteConfig.links.youtube}
              isExternal
            >
              <Youtube className="w-5 h-5" />
              Subscribe on YouTube
            </Button>
            {siteConfig.links.instagram && (
              <Button
                variant="secondary"
                size="lg"
                href={siteConfig.links.instagram}
                isExternal
              >
                <Instagram className="w-5 h-5" />
                Follow on Instagram
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

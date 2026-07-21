"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Youtube, Instagram, MessageCircle, ArrowUp } from "lucide-react";
import { siteConfig } from "@/config/site";
import { footerQuickLinks, footerLegalLinks } from "@/config/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="relative border-t border-dragon-neon/16 bg-dragon-bg-800/50">
      {/* Animated top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dragon-neon/40 to-transparent animate-shimmer" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-dragon-neon" aria-hidden="true">
                <path d="M16 2L4 10l4 6-4 6 12 8 12-8-4-6 4-6L16 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2" />
                <path d="M16 8l-6 4 3 4-3 4 6 4 6-4-3-4 3-4-6-4z" fill="currentColor" opacity="0.4" />
              </svg>
              <span className="font-heading text-lg font-bold text-dragon-text group-hover:text-dragon-neon transition-colors">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-dragon-text-secondary text-sm leading-relaxed mb-4 max-w-xs">
              {siteConfig.description}
            </p>
            <p className="text-dragon-neon font-heading text-sm tracking-wider">
              {siteConfig.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-sm font-bold text-dragon-text uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerQuickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-dragon-text-secondary hover:text-dragon-neon transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-heading text-sm font-bold text-dragon-text uppercase tracking-wider mb-4">
              Community
            </h3>
            <ul className="space-y-3">
              {siteConfig.links.youtube && (
                <li>
                  <a
                    href={siteConfig.links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-dragon-text-secondary hover:text-dragon-neon transition-colors inline-flex items-center gap-2"
                  >
                    <Youtube className="w-4 h-4" /> YouTube
                  </a>
                </li>
              )}
              {siteConfig.links.instagram && (
                <li>
                  <a
                    href={siteConfig.links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-dragon-text-secondary hover:text-dragon-neon transition-colors inline-flex items-center gap-2"
                  >
                    <Instagram className="w-4 h-4" /> Instagram
                  </a>
                </li>
              )}
              {siteConfig.links.discord && (
                <li>
                  <a
                    href={siteConfig.links.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-dragon-text-secondary hover:text-dragon-neon transition-colors inline-flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" /> Discord
                  </a>
                </li>
              )}
              <li>
                <span className="text-sm text-dragon-text-muted inline-flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Community Hub (Coming Soon)
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading text-sm font-bold text-dragon-text uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLegalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-dragon-text-secondary hover:text-dragon-neon transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dragon-neon/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-dragon-text-muted text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
            <p className="text-xs mt-1">Built for the Dragon Up Gaming Community</p>
          </div>

          <div className="flex items-center gap-3">
            {siteConfig.links.youtube && (
              <a
                href={siteConfig.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-dragon-text-muted hover:text-red-500 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}
            {siteConfig.links.instagram && (
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-dragon-text-muted hover:text-pink-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={() => typeof window !== "undefined" && window.scrollTo({ top: 0, behavior: "smooth" })}
              className="p-2 rounded-lg text-dragon-text-muted hover:text-dragon-neon hover:bg-dragon-neon/10 transition-all cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Youtube, Instagram, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mainNavItems } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import GraphicsSettings from "@/components/ui/GraphicsSettings";
import SoundToggle from "@/components/ui/SoundToggle";
import PerformanceToggle from "@/components/ui/PerformanceToggle";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => document.body.classList.remove("menu-open");
  }, [isMobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "glass shadow-lg shadow-black/20"
          : "bg-transparent"
      )}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group shrink-0"
            aria-label="Dragon Up Home"
          >
            <DragonLogo />
            <span className="font-heading text-lg md:text-xl font-bold text-dragon-text group-hover:text-dragon-neon transition-colors">
              Dragon Up
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                  pathname === item.href
                    ? "text-dragon-neon"
                    : "text-dragon-text-secondary hover:text-dragon-text"
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-dragon-neon rounded-full"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-2">
            <GraphicsSettings />
            <SoundToggle />
            <PerformanceToggle />
            
            {siteConfig.links.youtube && (
              <a
                href={siteConfig.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-dragon-text-secondary hover:text-red-500 hover:bg-red-500/10 transition-all"
                aria-label="YouTube Channel"
              >
                <Youtube className="w-5 h-5" />
              </a>
            )}
            {siteConfig.links.instagram && (
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-dragon-text-secondary hover:text-pink-500 hover:bg-pink-500/10 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
            <Button
              variant="primary"
              size="sm"
              href={siteConfig.links.youtube}
              isExternal
            >
              Join Community
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-dragon-text-secondary hover:text-dragon-neon hover:bg-dragon-neon/10 transition-all cursor-pointer"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass border-t border-dragon-neon/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                    pathname === item.href
                      ? "text-dragon-neon bg-dragon-neon/10"
                      : "text-dragon-text-secondary hover:text-dragon-text hover:bg-dragon-bg-600"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-dragon-neon/10 pt-4 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <GraphicsSettings />
                  <SoundToggle />
                  <PerformanceToggle />
                </div>
                <div className="flex items-center gap-3">
                  {siteConfig.links.youtube && (
                    <a
                      href={siteConfig.links.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg text-dragon-text-secondary hover:text-red-500 hover:bg-red-500/10 transition-all"
                      aria-label="YouTube"
                    >
                      <Youtube className="w-5 h-5" />
                    </a>
                  )}
                  {siteConfig.links.instagram && (
                    <a
                      href={siteConfig.links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg text-dragon-text-secondary hover:text-pink-500 hover:bg-pink-500/10 transition-all"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
              <Button
                variant="primary"
                size="md"
                href={siteConfig.links.youtube}
                isExternal
                className="w-full mt-2"
              >
                Join Community
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function DragonLogo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-dragon-neon"
      aria-hidden="true"
    >
      <path
        d="M16 2L4 10l4 6-4 6 12 8 12-8-4-6 4-6L16 2z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M16 2L4 10l4 6-4 6 12 8 12-8-4-6 4-6L16 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M16 8l-6 4 3 4-3 4 6 4 6-4-3-4 3-4-6-4z"
        fill="currentColor"
        opacity="0.4"
      />
      <circle cx="13" cy="13" r="1.5" fill="currentColor" />
      <circle cx="19" cy="13" r="1.5" fill="currentColor" />
    </svg>
  );
}

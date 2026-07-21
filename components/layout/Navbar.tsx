"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Youtube, Instagram, Menu, X, UserRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mainNavItems } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import GraphicsSettings from "@/components/ui/GraphicsSettings";
import SoundToggle from "@/components/ui/SoundToggle";
import PerformanceToggle from "@/components/ui/PerformanceToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // ── All hooks must be declared before any conditional return ──────
  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

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

  // ── Guard: never render the public nav on admin routes ────────────
  if (pathname?.startsWith("/admin")) {
    return null;
  }

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

            {/* Portal Login Button — desktop */}
            <PortalLoginButton />
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

              {/* Portal Login — mobile menu row */}
              <PortalLoginMobileRow />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ── Portal Login Button — desktop/tablet circular icon button ────────────
function PortalLoginButton() {
  const router = useRouter();

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
    >
      <motion.button
        onClick={() => router.push("/admin/login")}
        aria-label="Portal Login"
        title="Portal Login"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        style={{
          width: 44,
          height: 44,
          borderRadius: "9999px",
          background: "linear-gradient(135deg, #2D7FFF 0%, #00C8FF 100%)",
          border: "1px solid rgba(45, 127, 255, 0.45)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow:
            "0 0 14px rgba(45,127,255,0.35), 0 0 4px rgba(0,200,255,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
        }}
        className="transition-shadow duration-300 hover:[box-shadow:0_0_24px_rgba(45,127,255,0.6),0_0_8px_rgba(0,200,255,0.45),inset_0_1px_0_rgba(255,255,255,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C8FF] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      >
        <UserRound className="w-[18px] h-[18px] text-white drop-shadow-sm" aria-hidden="true" />
      </motion.button>

      {/* Tooltip */}
      <div
        role="tooltip"
        className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2.5 px-2.5 py-1 rounded-md text-[11px] font-heading uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background: "rgba(10, 18, 35, 0.92)",
          border: "1px solid rgba(45, 127, 255, 0.35)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        }}
        aria-hidden="true"
      >
        Portal Login
        {/* Tooltip caret */}
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent"
          style={{ borderBottomColor: "rgba(45, 127, 255, 0.35)" }}
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
}

// ── Portal Login — mobile menu full-width row ─────────────────────────────
function PortalLoginMobileRow() {
  const router = useRouter();

  return (
    <motion.button
      onClick={() => router.push("/admin/login")}
      aria-label="Portal Login"
      whileTap={{ scale: 0.97 }}
      className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl font-heading text-sm text-white cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C8FF]"
      style={{
        background: "linear-gradient(135deg, rgba(45,127,255,0.18) 0%, rgba(0,200,255,0.12) 100%)",
        border: "1px solid rgba(45, 127, 255, 0.35)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 0 12px rgba(45,127,255,0.15), inset 0 1px 0 rgba(255,255,255,0.07)",
      }}
    >
      {/* Circle icon badge */}
      <span
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #2D7FFF 0%, #00C8FF 100%)",
          boxShadow: "0 0 10px rgba(45,127,255,0.5)",
        }}
        aria-hidden="true"
      >
        <UserRound className="w-4 h-4 text-white" />
      </span>
      <span className="tracking-wider text-xs uppercase">Portal Login</span>
      <span className="ml-auto text-[10px] text-[#00C8FF] font-heading uppercase tracking-widest opacity-70">→</span>
    </motion.button>
  );
}

// ── Dragon Logo SVG ───────────────────────────────────────────────────────
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

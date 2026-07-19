import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/layout/LoadingScreen";
import { ToastProvider } from "@/components/ui/Toast";
import { siteConfig } from "@/config/site";

// Phase 2 custom providers
import PerformanceProvider from "@/components/providers/PerformanceProvider";
import AudioProvider from "@/components/providers/AudioProvider";
import AnimationProvider from "@/components/providers/AnimationProvider";
import ThreeProvider from "@/components/providers/ThreeProvider";

// Phase 2 global effects
import CinematicIntro from "@/components/animation/CinematicIntro";
import CustomCursor from "@/components/animation/CustomCursor";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Free Fire & PC Gaming Community`,
    template: `%s | ${siteConfig.name}`,
  },
  description: "Join Dragon Up for Free Fire gameplay, PC gaming adventures, livestreams, highlights, community updates, and future gaming events.",
  keywords: ["Dragon Up", "Free Fire", "PC Gaming", "Gaming Community", "Livestream", "Gaming Highlights", "Gaming Tournaments"],
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Free Fire & PC Gaming Community`,
    description: "Join Dragon Up for Free Fire gameplay, PC gaming adventures, livestreams, highlights, community updates, and future gaming events.",
    images: [{ url: "/images/hero-bg.png", width: 1200, height: 630, alt: "Dragon Up Gaming Community" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Free Fire & PC Gaming Community`,
    description: "Join Dragon Up for Free Fire gameplay, PC gaming adventures, and future gaming events.",
    images: ["/images/hero-bg.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#030403",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="gaming-bg" aria-hidden="true" />
        <ToastProvider>
          <PerformanceProvider>
            <AudioProvider>
              <AnimationProvider>
                <ThreeProvider>
                  <LoadingScreen />
                  <CinematicIntro />
                  <CustomCursor />
                  <Navbar />
                  <main id="main-content">{children}</main>
                  <Footer />
                </ThreeProvider>
              </AnimationProvider>
            </AudioProvider>
          </PerformanceProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

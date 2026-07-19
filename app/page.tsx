import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import LatestVideoSection from "@/components/home/LatestVideoSection";
import GamingCategories from "@/components/home/GamingCategories";
import CommunityPreview from "@/components/home/CommunityPreview";
import WhyDragonUp from "@/components/home/WhyDragonUp";
import SocialSection from "@/components/home/SocialSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import CTASection from "@/components/home/CTASection";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Free Fire & PC Gaming Community`,
  description: "Join Dragon Up for Free Fire gameplay, PC gaming adventures, livestreams, highlights, community updates, and future gaming events.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <PageTransition>
      <HeroSection />
      <StatsSection />
      <LatestVideoSection />
      <GamingCategories />
      <CommunityPreview />
      <WhyDragonUp />
      <SocialSection />
      <NewsletterSection />
      <CTASection />
    </PageTransition>
  );
}

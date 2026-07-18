import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Dragon Up",
  tagline: "Rise. Fight. Dominate.",
  secondaryTagline: "Enter the Dragon Gaming Universe",
  description:
    "Dragon Up is a gaming community platform for Free Fire, PC gaming, livestreams, clips, and future competitive events.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  creator: "Dragon Up",
  links: {
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://youtube.com/@dragonup",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    discord: process.env.NEXT_PUBLIC_DISCORD_URL || "",
  },
};

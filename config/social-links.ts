import { siteConfig } from "./site";

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
  handle: string;
  description: string;
  cta: string;
  color: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: "YouTube",
    href: siteConfig.links.youtube,
    icon: "Youtube",
    handle: "@dragonup",
    description: "Free Fire gameplay, PC gaming adventures, and livestream highlights.",
    cta: "Subscribe",
    color: "#FF0000",
  },
  {
    name: "Instagram",
    href: siteConfig.links.instagram || "#",
    icon: "Instagram",
    handle: "@dragonup",
    description: "Gaming reels, behind-the-scenes, community highlights, and updates.",
    cta: "Follow",
    color: "#E4405F",
  },
  {
    name: "Discord",
    href: siteConfig.links.discord || "#",
    icon: "MessageCircle",
    handle: "Dragon Up Community",
    description: "Join the community for tournaments, giveaways, and gaming discussions.",
    cta: "Join Server",
    color: "#5865F2",
  },
];

export const contactTypes = [
  { value: "general", label: "General Enquiry" },
  { value: "collaboration", label: "Collaboration" },
  { value: "sponsorship", label: "Sponsorship" },
  { value: "partnership", label: "Gaming Partnership" },
  { value: "technical", label: "Technical Support" },
  { value: "community", label: "Community Support" },
] as const;

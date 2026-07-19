import type { FeaturedVideo, GamingCategory, StatItem, CommunityCard, WhyItem, Milestone } from "@/types";

export const stats: StatItem[] = [
  {
    id: "subscribers",
    label: "Subscribers",
    value: "10K+",
    numericValue: 10000,
    suffix: "+",
    description: "Growing every day",
    icon: "Users",
  },
  {
    id: "views",
    label: "Total Views",
    value: "1M+",
    numericValue: 1000000,
    suffix: "+",
    description: "Gaming since launch",
    icon: "Eye",
  },
  {
    id: "videos",
    label: "Videos",
    value: "500+",
    numericValue: 500,
    suffix: "+",
    description: "Multiple gaming categories",
    icon: "Video",
  },
  {
    id: "community",
    label: "Community Members",
    value: "5K+",
    numericValue: 5000,
    suffix: "+",
    description: "Active community",
    icon: "Heart",
  },
];

export const featuredVideos: FeaturedVideo[] = [
  {
    id: "1",
    title: "Free Fire Rank Push — Road to Grandmaster",
    description:
      "Watch the intense ranked gameplay as we push through Diamond to Grandmaster with aggressive strategies and clutch plays.",
    thumbnail: "/images/videos/thumb-1.jpg",
    duration: "15:42",
    category: "Free Fire",
    views: "25K",
    uploadDate: "2 days ago",
    youtubeUrl: "#",
    isFeatured: true,
  },
  {
    id: "2",
    title: "PC Gaming Marathon — Best Moments",
    description: "Highlights from our latest 12-hour PC gaming marathon featuring multiple titles.",
    thumbnail: "/images/videos/thumb-2.jpg",
    duration: "10:30",
    category: "PC Gaming",
    views: "18K",
    uploadDate: "5 days ago",
    youtubeUrl: "#",
  },
  {
    id: "3",
    title: "Clash Squad Tips & Tricks",
    description: "Master Clash Squad with these pro-level strategies and weapon loadouts.",
    thumbnail: "/images/videos/thumb-3.jpg",
    duration: "8:15",
    category: "Free Fire",
    views: "32K",
    uploadDate: "1 week ago",
    youtubeUrl: "#",
  },
  {
    id: "4",
    title: "Dragon Up Community Highlights",
    description: "The best clips and moments submitted by the Dragon Up community this month.",
    thumbnail: "/images/videos/thumb-4.jpg",
    duration: "12:05",
    category: "Community",
    views: "15K",
    uploadDate: "2 weeks ago",
    youtubeUrl: "#",
  },
];

export const gamingCategories: GamingCategory[] = [
  {
    id: "free-fire",
    title: "Free Fire",
    description:
      "Rank pushes, custom rooms, clash squad battles, highlights, tips, and competitive gameplay.",
    image: "/images/categories/free-fire.png",
    icon: "Flame",
    cta: "Explore Free Fire",
    href: "#",
  },
  {
    id: "pc-gaming",
    title: "PC Gaming",
    description:
      "Story games, multiplayer battles, livestreams, walkthroughs, challenges, and performance content.",
    image: "/images/categories/pc-gaming.png",
    icon: "Monitor",
    cta: "Explore PC Gaming",
    href: "#",
  },
];

export const communityCards: CommunityCard[] = [
  {
    id: "moments",
    title: "Share Gaming Moments",
    description: "Capture and share your best plays, clutches, and funny moments with the community.",
    icon: "Camera",
  },
  {
    id: "compete",
    title: "Compete Together",
    description: "Join custom rooms, future tournaments, and leaderboard challenges with fellow gamers.",
    icon: "Trophy",
  },
  {
    id: "grow",
    title: "Grow the Community",
    description: "Help build the Dragon Up gaming family through engagement, support, and shared passion.",
    icon: "TrendingUp",
  },
];

export const whyDragonUpItems: WhyItem[] = [
  {
    id: "freefire",
    title: "Free Fire Content",
    description: "High-quality rank push gameplay, tips, custom rooms, and competitive highlights.",
    icon: "Flame",
  },
  {
    id: "pcgaming",
    title: "PC Gaming Adventures",
    description: "Story-driven playthroughs, multiplayer battles, challenges, and performance showcases.",
    icon: "Monitor",
  },
  {
    id: "community",
    title: "Community-First Platform",
    description: "Built for gamers, by gamers. Every feature puts community engagement first.",
    icon: "Users",
  },
  {
    id: "livestream",
    title: "Livestream Entertainment",
    description: "Live gaming sessions, interactive Q&A, watch parties, and real-time community events.",
    icon: "Radio",
  },
  {
    id: "competition",
    title: "Future Competitions",
    description: "Tournaments, leaderboards, and competitive events — coming soon to Dragon Up.",
    icon: "Trophy",
  },
  {
    id: "premium",
    title: "Premium Gaming Experience",
    description: "Cinematic design, smooth performance, and a world-class platform for every gamer.",
    icon: "Sparkles",
  },
];

export const milestones: Milestone[] = [
  {
    id: "1",
    year: "2023",
    title: "Channel Launched",
    description: "Dragon Up started its journey with the first Free Fire gameplay video.",
    icon: "Rocket",
  },
  {
    id: "2",
    year: "2023",
    title: "First Major Milestone",
    description: "Reached the first subscriber milestone and gained recognition in the gaming community.",
    icon: "Award",
  },
  {
    id: "3",
    year: "2024",
    title: "Community Growth",
    description: "The Dragon Up community expanded rapidly with active engagement and quality content.",
    icon: "TrendingUp",
  },
  {
    id: "4",
    year: "2024",
    title: "PC Gaming Expansion",
    description: "Expanded content to include PC gaming adventures, walkthroughs, and multiplayer streams.",
    icon: "Monitor",
  },
  {
    id: "5",
    year: "2025",
    title: "Dragon Up Website Launch",
    description: "The official Dragon Up gaming platform went live, bringing the community together under one roof.",
    icon: "Globe",
  },
];

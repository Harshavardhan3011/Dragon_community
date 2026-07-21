import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import YoutubeClient from "@/components/youtube/YoutubeClient";

export const metadata: Metadata = {
  title: "Media Hub",
  description: "Browse the latest gaming videos, tutorials, livestreams, and playlists from the Dragon Up YouTube channel.",
  alternates: { canonical: "/youtube" },
  openGraph: {
    title: "Dragon Up Media Hub - YouTube Roster",
    description: "Browse the latest gaming videos, tutorials, livestreams, and playlists from the Dragon Up YouTube channel.",
    type: "video.other",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dragon Up Media Hub - YouTube Roster",
    description: "Browse the latest gaming videos, tutorials, livestreams, and playlists from the Dragon Up YouTube channel.",
  },
};

export default function YoutubePage() {
  // JSON-LD Structured Data for the media channel
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoChannel",
    "name": "Dragon Up Gaming",
    "description": "Premium gaming news, guides, and esports highlights from the Dragon Up community.",
    "url": "https://dragonup.com/youtube",
    "genre": "Gaming",
  };

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <YoutubeClient />
    </PageTransition>
  );
}

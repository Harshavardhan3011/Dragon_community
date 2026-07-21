"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Youtube,
  Share2,
  Search,
  Play,
  Clock,
  Eye,
  Calendar,
  ExternalLink,
  Copy,
  Tv,
  Flame,
  Filter,
  ArrowUpDown,
  MessageSquare,
  Send,
  Loader2,
  ShieldAlert,
  ChevronRight,
  Info,
  X,
} from "lucide-react";
import {
  useChannel,
  useVideos,
  useFeaturedVideo,
  usePlaylists,
  useShorts,
  useLive,
  useSearch,
} from "@/hooks/use-youtube";
import { useToast } from "@/components/ui/Toast";
import GamingCard from "@/components/ui/GamingCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function YoutubeClient() {
  const { addToast } = useToast();

  // ─── Fetching Data via hooks ────────────────────────────────────────
  const { data: channel, loading: channelLoading, error: channelError } = useChannel();
  const { data: rawVideos, loading: videosLoading } = useVideos(24, true);
  const { data: featuredVideo, loading: featuredLoading } = useFeaturedVideo();
  const { data: playlists, loading: playlistsLoading } = usePlaylists();
  const { data: shorts, loading: shortsLoading } = useShorts(12);
  const { liveStream, upcomingStreams, loading: liveLoading } = useLive();
  const { results: searchResults, loading: searchLoading, search: executeSearch } = useSearch();

  // ─── Component State ────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState<any | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
  const [visibleCount, setVisibleCount] = useState(8);
  const [shareMenuVideo, setShareMenuVideo] = useState<string | null>(null);

  // ─── Debounce Search Query ──────────────────────────────────────────
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 450);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    executeSearch(debouncedQuery);
  }, [debouncedQuery, executeSearch]);

  // ─── Sorting and Filtering Videos ──────────────────────────────────
  const videos = [...rawVideos];
  if (sortBy === "popular") {
    videos.sort((a, b) => b.views - a.views);
  } else {
    videos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  // ─── Share Handlers ────────────────────────────────────────────────
  const handleCopyLink = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://youtu.be/${videoId}`;
    navigator.clipboard.writeText(url);
    addToast({
      type: "success",
      title: "Link Copied!",
      message: "YouTube video link copied to your clipboard.",
    });
    setShareMenuVideo(null);
  };

  const handleShareX = (videoId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://youtu.be/${videoId}`;
    const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
      `Check out this video: ${title}`
    )}&url=${encodeURIComponent(url)}`;
    window.open(xUrl, "_blank");
    setShareMenuVideo(null);
  };

  const handleShareWhatsApp = (videoId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://youtu.be/${videoId}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${title} - ${url}`
    )}`;
    window.open(waUrl, "_blank");
    setShareMenuVideo(null);
  };

  const handleShareDiscord = (videoId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://youtu.be/${videoId}`;
    navigator.clipboard.writeText(`**${title}**\n${url}`);
    addToast({
      type: "success",
      title: "Discord Share Link Copied",
      message: "Copied styled Discord message block to clipboard.",
    });
    setShareMenuVideo(null);
  };

  const handleShareChannel = () => {
    const channelUrl = channel?.handle
      ? `https://youtube.com/${channel.handle}`
      : `https://youtube.com/channel/UCDVH5IWCNZ5e0lVkmtXpPTA`;
    navigator.clipboard.writeText(channelUrl);
    addToast({
      type: "success",
      title: "Channel Link Copied!",
      message: "YouTube channel link copied to clipboard.",
    });
  };

  // ─── Format Stats Helpers ──────────────────────────────────────────
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const timeAgo = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, value] of Object.entries(intervals)) {
      const count = Math.floor(seconds / value);
      if (count >= 1) {
        return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  };

  return (
    <div className="relative min-h-screen pb-24 pt-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[30%] left-[20%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute top-[60%] right-[10%] w-[700px] h-[700px] bg-dragon-neon/3 rounded-full blur-[180px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Hero Section ───────────────────────────────────────────── */}
        {channelLoading ? (
          <HeroSkeleton />
        ) : channelError ? (
          <div className="glass-card rounded-2xl p-8 border border-red-500/20 text-center max-w-md mx-auto mb-16 mt-8">
            <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="font-heading text-lg font-bold text-dragon-text mb-2">Failed to Sync YouTube</h3>
            <p className="text-dragon-text-secondary text-sm mb-6">{channelError}</p>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Retry Connection
            </Button>
          </div>
        ) : (
          channel && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl overflow-hidden mb-16 mt-8 border border-dragon-neon/10"
            >
              {/* Banner */}
              <div className="h-36 sm:h-52 w-full bg-gradient-to-r from-dragon-bg-700 via-dragon-bg-800 to-blue-900/10 relative overflow-hidden">
                {channel.banner ? (
                  <img src={channel.banner} alt={channel.title} className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(0, 255, 102, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 102, 0.15) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                )}
                {/* Banner gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-dragon-bg-900 via-dragon-bg-900/40 to-transparent" />
              </div>

              {/* Channel Profile row */}
              <div className="px-6 sm:px-8 pb-8 relative flex flex-col md:flex-row items-center md:items-end gap-6 -mt-10 sm:-mt-12">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-3 border-dragon-bg-900 bg-dragon-bg-800 shadow-xl overflow-hidden shrink-0">
                  <img src={channel.logo} alt={channel.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 text-center md:text-left min-w-0">
                  <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-dragon-text tracking-tight flex items-center justify-center md:justify-start gap-2">
                    {channel.title}
                    <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] font-bold" title="Verified Badge">
                      ✓
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-dragon-neon mt-0.5 tracking-wider">{channel.handle}</p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-dragon-text-muted font-heading uppercase tracking-widest mt-3">
                    <span>{formatNumber(channel.subscribers)} subscribers</span>
                    <span className="text-dragon-neon/30">•</span>
                    <span>{formatNumber(channel.views)} total views</span>
                    <span className="text-dragon-neon/30">•</span>
                    <span>{channel.videosCount} videos</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 justify-center mt-4 md:mt-0 shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    href={channel.handle ? `https://youtube.com/${channel.handle}?sub_confirmation=1` : `https://youtube.com/channel/UCDVH5IWCNZ5e0lVkmtXpPTA?sub_confirmation=1`}
                    isExternal
                    className="shadow-lg shadow-dragon-neon/15"
                  >
                    <Youtube className="w-4 h-4 mr-2" />
                    Subscribe
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleShareChannel}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Channel
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="px-6 sm:px-8 pb-8 border-t border-dragon-neon/5 pt-6 text-sm text-dragon-text-secondary leading-relaxed max-w-4xl">
                <p className="line-clamp-3">{channel.description}</p>
              </div>
            </motion.div>
          )
        )}

        {/* ─── LIVE / UPCOMING LIVESTREAMS SECTION ───────────────────── */}
        {!liveLoading && (liveStream || upcomingStreams.length > 0) && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-16 border-l-2 border-red-500 pl-6 space-y-6"
          >
            {/* Live stream embed */}
            {liveStream && (
              <div className="glass-card rounded-2xl p-6 border border-red-500/20 max-w-4xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-heading font-bold bg-red-500 text-white animate-pulse">
                    LIVE
                  </span>
                  <h2 className="font-heading text-lg font-bold text-dragon-text">Active Stream</h2>
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden border border-dragon-neon/10 bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${liveStream.id}?autoplay=0`}
                    title="Live Stream"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
                <h3 className="font-heading text-md font-bold text-dragon-text mt-4">{liveStream.title}</h3>
                <p className="text-xs text-dragon-text-secondary mt-1.5">{liveStream.description}</p>
              </div>
            )}

            {/* Upcoming Schedule */}
            {upcomingStreams.length > 0 && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="font-heading text-xs font-bold text-dragon-text-muted uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-dragon-neon" /> Scheduled Broadcasts
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {upcomingStreams.map((up) => (
                    <GamingCard key={up.id} className="p-4 flex gap-4 items-center">
                      <div className="w-24 aspect-video bg-black rounded-lg border border-dragon-neon/15 relative overflow-hidden shrink-0">
                        <img src={up.thumbnail} alt={up.title} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] bg-blue-500 text-white font-heading tracking-widest font-bold">
                          SOON
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-heading text-xs font-bold text-dragon-text truncate">{up.title}</h4>
                        <p className="text-[10px] text-dragon-text-muted mt-1">
                          Starts: {new Date(up.publishedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                        <a
                          href={`https://youtube.com/watch?v=${up.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-dragon-neon mt-2 hover:underline"
                        >
                          Set Reminder <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </GamingCard>
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* ─── FEATURED VIDEO ─────────────────────────────────────────── */}
        {featuredLoading ? (
          <FeaturedSkeleton />
        ) : (
          featuredVideo && (
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-20 space-y-6"
              aria-label="Featured Highlight"
            >
              <h2 className="font-heading text-xs font-bold text-dragon-text-muted uppercase tracking-widest flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" /> Featured Highlight
              </h2>

              <div className="glass-card rounded-2xl overflow-hidden border border-dragon-neon/15 p-6 sm:p-8 flex flex-col lg:flex-row gap-8 items-center bg-gradient-to-br from-dragon-bg-800 to-blue-950/10">
                {/* Embed video container */}
                <div className="w-full lg:w-3/5 aspect-video bg-black rounded-xl overflow-hidden border border-dragon-neon/10 shadow-2xl relative group">
                  <img
                    src={featuredVideo.thumbnail}
                    alt={featuredVideo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Play Button Overlay */}
                  <button
                    onClick={() => setActiveVideo(featuredVideo)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors cursor-pointer"
                    aria-label="Play Featured Video"
                  >
                    <span className="w-16 h-16 rounded-full bg-dragon-neon text-dragon-bg-900 flex items-center justify-center shadow-lg shadow-dragon-neon/40 hover:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </span>
                  </button>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/80 rounded font-mono text-xs text-white border border-white/10">
                    {featuredVideo.duration}
                  </span>
                </div>

                {/* Video Info Details */}
                <div className="w-full lg:w-2/5 text-left flex flex-col h-full justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[9px] font-heading font-bold uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/20">
                      Featured New Release
                    </span>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-dragon-text leading-snug mt-3 mb-2">
                      {featuredVideo.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-xs text-dragon-text-muted mt-2 mb-4 font-heading uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {formatNumber(featuredVideo.views)} views</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {timeAgo(featuredVideo.publishedAt)}</span>
                    </div>

                    <p className="text-sm text-dragon-text-secondary leading-relaxed line-clamp-4">
                      {featuredVideo.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-6 mt-auto">
                    <Button variant="primary" size="sm" onClick={() => setActiveVideo(featuredVideo)}>
                      <Play className="w-4 h-4 mr-2" /> Watch Player
                    </Button>
                    <a href={`https://youtube.com/watch?v=${featuredVideo.id}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="secondary" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" /> YouTube
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </motion.section>
          )
        )}

        {/* ─── SHORTS SECTION ─────────────────────────────────────────── */}
        {!shortsLoading && shorts.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-20 space-y-6"
            aria-label="YouTube Shorts"
          >
            <h2 className="font-heading text-xs font-bold text-dragon-text-muted uppercase tracking-widest flex items-center gap-2">
              <Tv className="w-4 h-4 text-dragon-neon" /> Shorts
            </h2>
            
            {/* Horizontal scroll container */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-color scroll-smooth snap-x snap-mandatory">
              {shorts.map((short) => (
                <div
                  key={short.id}
                  onClick={() => setActiveVideo(short)}
                  className="w-48 sm:w-56 shrink-0 aspect-[9/16] rounded-2xl overflow-hidden border border-dragon-neon/10 hover:border-dragon-neon/40 shadow-lg hover:shadow-dragon-neon/5 bg-dragon-bg-800/80 cursor-pointer relative group snap-start"
                >
                  <img src={short.thumbnail} alt={short.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Gradient shadow cover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {/* Play circle overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25">
                    <span className="w-12 h-12 rounded-full bg-dragon-neon/90 text-dragon-bg-900 flex items-center justify-center shadow-lg shadow-dragon-neon/30">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </span>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <p className="text-xs font-heading font-bold text-white leading-snug line-clamp-2 drop-shadow-md">
                      {short.title}
                    </p>
                    <p className="text-[10px] text-dragon-neon mt-1 font-heading uppercase tracking-wider">
                      {formatNumber(short.views)} views
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ─── SEARCH / VIDEOS GRID SECTION ──────────────────────────── */}
        <section className="mb-20 space-y-8" aria-label="Videos Library">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-dragon-neon/10 pb-6">
            <h2 className="font-heading text-xl font-bold text-dragon-text">Videos Library</h2>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-80">
                <Input
                  placeholder="Search channel videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="w-4 h-4 text-dragon-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-dragon-text-muted hover:text-dragon-neon cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sort Control */}
              {!searchQuery && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy("newest")}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-heading uppercase tracking-wide flex items-center gap-1.5 cursor-pointer ${
                      sortBy === "newest"
                        ? "text-dragon-neon bg-dragon-neon/10 border-dragon-neon/20"
                        : "text-dragon-text-secondary border-dragon-neon/5 bg-dragon-bg-800/20 hover:border-dragon-neon/20"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" /> Date
                  </button>
                  <button
                    onClick={() => setSortBy("popular")}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-heading uppercase tracking-wide flex items-center gap-1.5 cursor-pointer ${
                      sortBy === "popular"
                        ? "text-dragon-neon bg-dragon-neon/10 border-dragon-neon/20"
                        : "text-dragon-text-secondary border-dragon-neon/5 bg-dragon-bg-800/20 hover:border-dragon-neon/20"
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" /> Popular
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Skeletons/Results */}
          {videosLoading || searchLoading ? (
            <VideosGridSkeleton />
          ) : searchQuery ? (
            // Search Results
            searchResults.length === 0 ? (
              <div className="text-center py-20 bg-dragon-bg-800/10 rounded-2xl max-w-sm mx-auto border border-dragon-neon/5">
                <Search className="w-12 h-12 text-dragon-text-muted mx-auto mb-4 opacity-30" />
                <p className="text-dragon-text-secondary text-sm">No videos found for "{searchQuery}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {searchResults.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onPlay={setActiveVideo}
                    onCopyLink={handleCopyLink}
                    onShareX={handleShareX}
                    onShareWhatsApp={handleShareWhatsApp}
                    onShareDiscord={handleShareDiscord}
                    shareMenuOpen={shareMenuVideo === video.id}
                    setShareMenuOpen={(open) => setShareMenuVideo(open ? video.id : null)}
                    timeAgo={timeAgo}
                    formatNumber={formatNumber}
                  />
                ))}
              </div>
            )
          ) : (
            // Main Videos List
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {videos.slice(0, visibleCount).map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onPlay={setActiveVideo}
                    onCopyLink={handleCopyLink}
                    onShareX={handleShareX}
                    onShareWhatsApp={handleShareWhatsApp}
                    onShareDiscord={handleShareDiscord}
                    shareMenuOpen={shareMenuVideo === video.id}
                    setShareMenuOpen={(open) => setShareMenuVideo(open ? video.id : null)}
                    timeAgo={timeAgo}
                    formatNumber={formatNumber}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < videos.length && (
                <div className="text-center mt-12">
                  <Button variant="secondary" onClick={() => setVisibleCount((prev) => prev + 8)}>
                    Load More Videos
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

        {/* ─── PLAYLISTS SECTION ──────────────────────────────────────── */}
        {!playlistsLoading && playlists.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-20 space-y-6"
            aria-label="Playlists library"
          >
            <h2 className="font-heading text-xs font-bold text-dragon-text-muted uppercase tracking-widest flex items-center gap-2">
              <Tv className="w-4 h-4 text-dragon-neon" /> Playlists
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="glass-card rounded-xl overflow-hidden border border-dragon-neon/10 group flex flex-col justify-between hover:border-dragon-neon/30 transition-all duration-300"
                >
                  <div className="relative aspect-video bg-black overflow-hidden border-b border-dragon-neon/5">
                    <img src={playlist.thumbnail} alt={playlist.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {/* Overlay count */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center border-l border-white/5">
                      <span className="font-heading text-lg font-bold text-white">{playlist.videoCount}</span>
                      <span className="text-[9px] font-heading text-dragon-text-muted uppercase tracking-wider">Videos</span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between items-start text-left">
                    <h3 className="font-heading text-xs font-bold text-dragon-text line-clamp-2 mb-4 group-hover:text-dragon-neon transition-colors">
                      {playlist.title}
                    </h3>
                    <a
                      href={`https://youtube.com/playlist?list=${playlist.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-dragon-neon hover:text-dragon-light-green transition-colors mt-auto font-heading uppercase tracking-widest"
                    >
                      Open Playlist <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* ─── VIDEO WATCH MODAL PLAYER ────────────────────────────────── */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setActiveVideo(null)}
            />

            {/* Card Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 15 }}
              className="relative w-full max-w-4xl bg-dragon-bg-900 border border-dragon-neon/20 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Close trigger */}
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-dragon-text-secondary hover:text-dragon-neon border border-dragon-neon/10 transition-colors cursor-pointer"
                aria-label="Close player"
              >
                <X className="w-5 h-5" />
              </button>

              {/* YouTube Embed Player */}
              <div className="relative aspect-video bg-black shrink-0 border-b border-dragon-neon/10">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&modestbranding=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>

              {/* Video metadata information */}
              <div className="p-6 overflow-y-auto max-h-[35vh] text-left">
                <h3 className="font-heading text-md sm:text-lg font-bold text-dragon-text leading-snug">
                  {activeVideo.title}
                </h3>
                
                <div className="flex items-center gap-4 text-xs text-dragon-text-muted mt-2 mb-4 font-heading uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {formatNumber(activeVideo.views)} views</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {timeAgo(activeVideo.publishedAt)}</span>
                </div>

                <p className="text-sm text-dragon-text-secondary leading-relaxed bg-dragon-bg-800/40 border border-dragon-neon/5 p-4 rounded-xl whitespace-pre-line">
                  {activeVideo.description || "No description provided."}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Subcomponent: Video card ───────────────────────────────────────
interface VideoCardProps {
  video: any;
  onPlay: (v: any) => void;
  onCopyLink: (id: string, e: React.MouseEvent) => void;
  onShareX: (id: string, title: string, e: React.MouseEvent) => void;
  onShareWhatsApp: (id: string, title: string, e: React.MouseEvent) => void;
  onShareDiscord: (id: string, title: string, e: React.MouseEvent) => void;
  shareMenuOpen: boolean;
  setShareMenuOpen: (open: boolean) => void;
  timeAgo: (date: string) => string;
  formatNumber: (n: number) => string;
}

function VideoCard({
  video,
  onPlay,
  onCopyLink,
  onShareX,
  onShareWhatsApp,
  onShareDiscord,
  shareMenuOpen,
  setShareMenuOpen,
  timeAgo,
  formatNumber,
}: VideoCardProps) {
  const shareMenuRef = useRef<HTMLDivElement>(null);

  // Close share menu on clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (shareMenuOpen && shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
        setShareMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [shareMenuOpen, setShareMenuOpen]);

  return (
    <div className="relative group bg-dragon-bg-800/30 border border-dragon-neon/10 hover:border-dragon-neon/40 rounded-xl overflow-hidden shadow-lg hover:shadow-dragon-neon/3 transition-all duration-300 flex flex-col justify-between">
      {/* Thumbnail Aspect Video */}
      <div
        onClick={() => onPlay(video)}
        className="relative aspect-video bg-black overflow-hidden border-b border-dragon-neon/5 cursor-pointer"
      >
        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        
        {/* Hover watch button circle */}
        <div className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="w-10 h-10 rounded-full bg-dragon-neon text-dragon-bg-900 flex items-center justify-center shadow-lg shadow-dragon-neon/20">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </span>
        </div>

        {/* Duration badge overlay */}
        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded font-mono text-[10px] text-white border border-white/5">
          {video.duration}
        </span>
      </div>

      {/* Info details */}
      <div className="p-4 flex-1 flex flex-col justify-between text-left relative">
        <div>
          <h3
            onClick={() => onPlay(video)}
            className="font-heading text-xs font-bold text-dragon-text leading-snug line-clamp-2 hover:text-dragon-neon transition-colors cursor-pointer"
          >
            {video.title}
          </h3>

          <div className="flex items-center gap-3 text-[10px] text-dragon-text-muted mt-2 font-heading uppercase tracking-wide">
            <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {formatNumber(video.views)}</span>
            <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3" /> {timeAgo(video.publishedAt)}</span>
          </div>
        </div>

        {/* Card Footer action bar */}
        <div className="flex items-center justify-between border-t border-dragon-neon/5 pt-3 mt-4">
          <button
            onClick={() => onPlay(video)}
            className="inline-flex items-center gap-1 text-[10px] font-heading uppercase text-dragon-neon hover:text-dragon-light-green tracking-wider cursor-pointer"
          >
            Play Now <ChevronRight className="w-3 h-3" />
          </button>

          {/* Share button widget */}
          <div className="relative shrink-0" ref={shareMenuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShareMenuOpen(!shareMenuOpen);
              }}
              className="p-1.5 rounded-lg text-dragon-text-secondary hover:text-dragon-neon hover:bg-dragon-neon/5 transition-colors cursor-pointer"
              title="Share options"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {/* Share dropdown popover */}
            <AnimatePresence>
              {shareMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full right-0 mb-2 w-40 glass bg-dragon-bg-800 rounded-lg p-1 border border-dragon-neon/20 shadow-2xl z-20 flex flex-col"
                >
                  <button
                    onClick={(e) => onCopyLink(video.id, e)}
                    className="w-full px-3 py-2 text-left text-[10px] font-heading uppercase tracking-wider text-dragon-text-secondary hover:text-dragon-neon hover:bg-dragon-neon/5 rounded flex items-center gap-2 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Copy Link
                  </button>
                  <button
                    onClick={(e) => onShareX(video.id, video.title, e)}
                    className="w-full px-3 py-2 text-left text-[10px] font-heading uppercase tracking-wider text-dragon-text-secondary hover:text-dragon-neon hover:bg-dragon-neon/5 rounded flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3 h-3" /> Post on X
                  </button>
                  <button
                    onClick={(e) => onShareWhatsApp(video.id, video.title, e)}
                    className="w-full px-3 py-2 text-left text-[10px] font-heading uppercase tracking-wider text-dragon-text-secondary hover:text-dragon-neon hover:bg-dragon-neon/5 rounded flex items-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3" /> WhatsApp
                  </button>
                  <button
                    onClick={(e) => onShareDiscord(video.id, video.title, e)}
                    className="w-full px-3 py-2 text-left text-[10px] font-heading uppercase tracking-wider text-dragon-text-secondary hover:text-dragon-neon hover:bg-dragon-neon/5 rounded flex items-center gap-2 cursor-pointer"
                  >
                    <Info className="w-3 h-3" /> Share Discord
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Skeletons ───────────────────────────────────────────────────────
function HeroSkeleton() {
  return (
    <div className="w-full bg-dragon-bg-800/40 rounded-2xl overflow-hidden mb-16 border border-dragon-neon/5 animate-pulse mt-8">
      <div className="h-36 sm:h-52 w-full bg-dragon-bg-700/60" />
      <div className="px-6 sm:px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 -mt-10 sm:-mt-12">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-dragon-bg-600 border-3 border-dragon-bg-900 shadow-xl" />
        <div className="flex-1 space-y-2 mt-4 md:mt-0">
          <div className="h-6 bg-dragon-bg-600 rounded w-1/3 mx-auto md:mx-0" />
          <div className="h-4 bg-dragon-bg-600 rounded w-1/4 mx-auto md:mx-0" />
        </div>
        <div className="w-36 h-10 bg-dragon-bg-600 rounded-xl" />
      </div>
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="w-full bg-dragon-bg-800/30 border border-dragon-neon/5 rounded-2xl p-6 sm:p-8 animate-pulse mb-20 flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-3/5 aspect-video bg-dragon-bg-700 rounded-xl" />
      <div className="w-full lg:w-2/5 space-y-4">
        <div className="h-4 bg-dragon-bg-600 rounded w-1/4" />
        <div className="h-8 bg-dragon-bg-600 rounded w-3/4" />
        <div className="h-4 bg-dragon-bg-600 rounded w-1/2" />
        <div className="space-y-2 pt-4">
          <div className="h-4 bg-dragon-bg-600 rounded w-full" />
          <div className="h-4 bg-dragon-bg-600 rounded w-full" />
          <div className="h-4 bg-dragon-bg-600 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

function VideosGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="bg-dragon-bg-800/30 border border-dragon-neon/5 rounded-xl h-64 p-4 flex flex-col justify-between">
          <div className="aspect-video bg-dragon-bg-700 rounded-lg w-full" />
          <div className="space-y-2 pt-4 flex-1">
            <div className="h-4 bg-dragon-bg-600 rounded w-5/6" />
            <div className="h-4 bg-dragon-bg-600 rounded w-2/3" />
          </div>
          <div className="h-6 bg-dragon-bg-600 rounded w-1/3 mt-4" />
        </div>
      ))}
    </div>
  );
}

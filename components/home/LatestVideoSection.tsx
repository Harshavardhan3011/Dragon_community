"use client";

import { motion } from "framer-motion";
import { Play, Clock, Eye, ExternalLink } from "lucide-react";
import { featuredVideos } from "@/data/featured-content";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { siteConfig } from "@/config/site";

function VideoThumbnail({ video, featured }: { video: typeof featuredVideos[0]; featured?: boolean }) {
  return (
    <div
      className={`glass-card rounded-xl overflow-hidden group ${featured ? "md:col-span-2" : ""}`}
    >
      {/* Thumbnail */}
      <div className={`relative bg-dragon-bg-600 overflow-hidden ${featured ? "h-52 md:h-72" : "h-44"}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-dragon-dark-green/30 to-dragon-bg-900/80" />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-dragon-neon/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-dragon-neon/30">
            <Play className="w-6 h-6 text-dragon-bg-900 ml-1" />
          </div>
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/70 rounded text-xs text-white font-medium">
          {video.duration}
        </div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(rgba(0,255,102,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,102,0.05) 1px, transparent 1px)`,
          backgroundSize: "20px 20px"
        }} />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="neon" className="text-[10px]">{video.category}</Badge>
        </div>
        <h3 className={`font-heading font-bold text-dragon-text mb-2 line-clamp-2 group-hover:text-dragon-neon transition-colors ${featured ? "text-lg" : "text-sm"}`}>
          {video.title}
        </h3>
        {featured && (
          <p className="text-dragon-text-secondary text-sm mb-3 line-clamp-2">
            {video.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-dragon-text-muted">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{video.views}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{video.uploadDate}</span>
          </div>
          <a
            href={video.youtubeUrl !== "#" ? video.youtubeUrl : siteConfig.links.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-dragon-neon hover:text-dragon-light-green flex items-center gap-1 font-heading uppercase tracking-wider transition-colors"
          >
            Watch <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LatestVideoSection() {
  const [featured, ...rest] = featuredVideos;

  return (
    <section className="py-16 md:py-24" aria-label="Latest videos" id="videos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Latest Content"
          title="Fresh From the Dragon"
          description="Free Fire battles, PC gaming adventures, community highlights, and more."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <VideoThumbnail video={featured} featured />
          </motion.div>

          <div className="flex flex-col gap-6">
            {rest.slice(0, 2).map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <VideoThumbnail video={video} />
              </motion.div>
            ))}
          </div>

          {rest[2] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 lg:col-span-3"
            >
              <VideoThumbnail video={rest[2]} />
            </motion.div>
          )}
        </div>

        <div className="text-center">
          <Button
            variant="secondary"
            size="lg"
            href={siteConfig.links.youtube}
            isExternal
          >
            <Play className="w-4 h-4" />
            View All Videos on YouTube
          </Button>
        </div>
      </div>
    </section>
  );
}

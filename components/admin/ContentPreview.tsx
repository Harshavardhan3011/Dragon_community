"use client";

import Modal from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import { Pin, Star, Tag, User, Calendar } from "lucide-react";
import type { ContentItem } from "./ContentEditor";

interface ContentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  item: ContentItem | null;
}

export default function ContentPreview({ isOpen, onClose, item }: ContentPreviewProps) {
  if (!item) return null;

  const statusColor =
    item.status === "PUBLISHED"
      ? "text-dragon-neon bg-dragon-neon/10 border-dragon-neon/20"
      : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Content Preview"
      className="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Cover Image */}
        {item.coverImage && (
          <div className="relative rounded-xl overflow-hidden h-48 bg-dragon-bg-600">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.coverImage}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2 items-center">
          <span
            className={`px-2.5 py-0.5 rounded text-[10px] font-heading uppercase tracking-wider border ${statusColor}`}
          >
            {item.status}
          </span>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-heading uppercase tracking-wider border text-dragon-text-muted bg-dragon-bg-600 border-dragon-neon/10">
            <Tag className="w-3 h-3 inline mr-1" />
            {item.category}
          </span>
          {item.isFeatured && (
            <span className="px-2.5 py-0.5 rounded text-[10px] font-heading uppercase tracking-wider border text-yellow-400 bg-yellow-500/10 border-yellow-500/20">
              <Star className="w-3 h-3 inline mr-1" />
              Featured
            </span>
          )}
          {item.isPinned && (
            <span className="px-2.5 py-0.5 rounded text-[10px] font-heading uppercase tracking-wider border text-blue-400 bg-blue-500/10 border-blue-500/20">
              <Pin className="w-3 h-3 inline mr-1" />
              Pinned
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-heading text-2xl font-bold text-dragon-text leading-tight">
          {item.title}
        </h1>

        {/* Excerpt */}
        {item.excerpt && (
          <p className="text-dragon-text-secondary text-base leading-relaxed border-l-2 border-dragon-neon pl-4 italic">
            {item.excerpt}
          </p>
        )}

        {/* Author & dates */}
        <div className="flex flex-wrap gap-5 text-sm text-dragon-text-muted border-t border-b border-dragon-neon/10 py-4">
          {item.authorName && (
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>{item.authorName}</span>
            </div>
          )}
          {item.publishedAt && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Published {formatDate(item.publishedAt)}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Updated {formatDate(item.updatedAt)}</span>
          </div>
        </div>

        {/* Slug */}
        <div className="text-xs text-dragon-text-muted font-mono bg-dragon-bg-600 border border-dragon-neon/10 rounded px-3 py-2">
          /news/{item.slug}
        </div>

        {/* Content body */}
        <div className="bg-dragon-bg-600 border border-dragon-neon/10 rounded-xl p-6 text-dragon-text-secondary text-sm leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
          {item.content}
        </div>
      </div>
    </Modal>
  );
}

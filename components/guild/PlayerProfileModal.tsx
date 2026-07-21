"use client";

import { useEffect, useRef } from "react";
import { X, Youtube, Instagram, MessageSquare, Facebook, Trophy, Target, Shield, Zap, Laptop } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type GuildMemberItem } from "@/components/admin/GuildEditor";
import Badge from "@/components/ui/Badge";

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: GuildMemberItem | null;
}

const roleLabels: Record<string, string> = {
  GUILD_LEADER: "Guild Leader",
  ACTING_GUILD_LEADER: "Acting Leader",
  OFFICER: "Guild Officer",
  PLAYER: "Guild Player",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-dragon-neon text-dragon-bg-900 border-dragon-neon/30",
  OFFLINE: "bg-dragon-text-muted/20 text-dragon-text-secondary border-dragon-text-muted/10",
  ON_BREAK: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export default function PlayerProfileModal({
  isOpen,
  onClose,
  member,
}: PlayerProfileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.classList.add("menu-open");
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.classList.remove("menu-open");
    };
  }, [isOpen, onClose]);

  if (!member) return null;

  // Calculate win rate percentage
  const winRate =
    member.matchesPlayed && member.wins
      ? Math.round((member.wins / member.matchesPlayed) * 100)
      : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal / Bottom Sheet Card */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="relative w-full max-h-[90vh] sm:max-h-[95vh] sm:max-w-2xl bg-dragon-bg-900 border-t sm:border border-dragon-neon/20 rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-black/80"
            role="dialog"
            aria-modal="true"
            aria-label={`${member.nickname} Profile`}
          >
            {/* Header / Avatar Hero Cover */}
            <div className="relative h-44 sm:h-48 shrink-0 bg-gradient-to-r from-dragon-dark-green/30 via-dragon-bg-800 to-dragon-neon/5 border-b border-dragon-neon/10">
              {/* Decorative Matrix grid lines */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0, 255, 102, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 102, 0.15) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-dragon-text-secondary hover:text-dragon-neon border border-dragon-neon/10 transition-colors cursor-pointer"
                aria-label="Close profile"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Avatar position overlaps header & body */}
              <div className="absolute -bottom-10 left-6 sm:left-8 flex items-end gap-4">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-dragon-neon bg-dragon-bg-800 shadow-xl shadow-black/60 flex items-center justify-center">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.nickname}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="font-heading font-bold text-3xl text-dragon-neon/40">
                      {member.nickname[0]}
                    </span>
                  )}
                </div>

                <div className="mb-2 hidden sm:block">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-heading uppercase tracking-widest bg-dragon-neon/15 text-dragon-neon border border-dragon-neon/20">
                    {roleLabels[member.role] || "Guild Member"}
                  </span>
                  <span className={`ml-2 px-2.5 py-0.5 rounded text-[10px] font-heading uppercase tracking-widest border ${statusColors[member.status]}`}>
                    {member.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Content Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 pt-14 sm:pt-14 space-y-6">
              {/* Name Details */}
              <div>
                {/* Mobile Roles Row */}
                <div className="flex sm:hidden flex-wrap gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-[9px] font-heading uppercase tracking-widest bg-dragon-neon/15 text-dragon-neon border border-dragon-neon/20">
                    {roleLabels[member.role] || "Guild Member"}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-heading uppercase tracking-widest border ${statusColors[member.status]}`}>
                    {member.status.replace("_", " ")}
                  </span>
                </div>
                
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dragon-text tracking-tight flex items-center gap-2">
                  {member.nickname}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-dragon-text-secondary mt-1">
                  <span>Player: <strong className="text-dragon-text font-normal">{member.name}</strong></span>
                  <span className="text-dragon-neon/30">•</span>
                  <span>UID: <strong className="text-dragon-text font-mono font-normal">{member.uid}</strong></span>
                  <span className="text-dragon-neon/30">•</span>
                  <span>Region: <strong className="text-dragon-text font-normal">{member.country || "India"}</strong></span>
                </div>
              </div>

              {/* Grid of Key Esports Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-dragon-bg-800/40 border border-dragon-neon/10 rounded-xl p-4 text-center">
                  <p className="text-[10px] font-heading text-dragon-text-muted uppercase tracking-wider mb-1">Level</p>
                  <p className="font-heading text-xl font-bold text-dragon-text">{member.level || "—"}</p>
                </div>
                <div className="bg-dragon-bg-800/40 border border-dragon-neon/10 rounded-xl p-4 text-center">
                  <p className="text-[10px] font-heading text-dragon-text-muted uppercase tracking-wider mb-1">Rank</p>
                  <p className="font-heading text-md font-bold text-dragon-neon truncate">{member.rank || "—"}</p>
                </div>
                <div className="bg-dragon-bg-800/40 border border-dragon-neon/10 rounded-xl p-4 text-center">
                  <p className="text-[10px] font-heading text-dragon-text-muted uppercase tracking-wider mb-1">Matches / Wins</p>
                  <p className="font-heading text-xl font-bold text-dragon-text">
                    {member.matchesPlayed || 0} <span className="text-xs text-dragon-text-muted">/</span> <span className="text-dragon-neon">{member.wins || 0}</span>
                  </p>
                </div>
                <div className="bg-dragon-bg-800/40 border border-dragon-neon/10 rounded-xl p-4 text-center">
                  <p className="text-[10px] font-heading text-dragon-text-muted uppercase tracking-wider mb-1">Win Rate</p>
                  <p className="font-heading text-xl font-bold text-dragon-text">{winRate}%</p>
                </div>
              </div>

              {/* Bio Block */}
              {member.about && (
                <div className="space-y-2 border-t border-dragon-neon/10 pt-4">
                  <h3 className="font-heading text-xs font-bold text-dragon-neon uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" /> About Player
                  </h3>
                  <p className="text-dragon-text-secondary text-sm leading-relaxed whitespace-pre-line bg-dragon-bg-800/25 p-4 rounded-xl border border-dragon-neon/5">
                    {member.about}
                  </p>
                </div>
              )}

              {/* Tactical Details */}
              <div className="grid sm:grid-cols-2 gap-4 border-t border-dragon-neon/10 pt-4">
                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold text-dragon-neon uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> Combat Preferences
                  </h3>
                  <ul className="space-y-2 text-xs text-dragon-text-secondary bg-dragon-bg-800/10 p-3 rounded-xl border border-dragon-neon/5">
                    <li className="flex justify-between py-1 border-b border-dragon-neon/5">
                      <span>Favorite Game:</span>
                      <strong className="text-dragon-text">{member.favoriteGame || "Free Fire"}</strong>
                    </li>
                    <li className="flex justify-between py-1 border-b border-dragon-neon/5">
                      <span>Signature Weapon:</span>
                      <strong className="text-dragon-text">{member.favoriteWeapon || "Not Specified"}</strong>
                    </li>
                    <li className="flex justify-between py-1 border-b border-dragon-neon/5">
                      <span>Key Character:</span>
                      <strong className="text-dragon-text">{member.favoriteCharacter || "Not Specified"}</strong>
                    </li>
                    <li className="flex justify-between py-1">
                      <span>Companion Pet:</span>
                      <strong className="text-dragon-text">{member.favoritePet || "None"}</strong>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-heading text-xs font-bold text-dragon-neon uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Esports Records
                  </h3>
                  <ul className="space-y-2 text-xs text-dragon-text-secondary bg-dragon-bg-800/10 p-3 rounded-xl border border-dragon-neon/5">
                    <li className="flex justify-between py-1 border-b border-dragon-neon/5">
                      <span>MVP Awards:</span>
                      <strong className="text-dragon-neon font-bold">{member.mvpCount || 0}</strong>
                    </li>
                    <li className="flex justify-between py-1 border-b border-dragon-neon/5">
                      <span>Guild Standing:</span>
                      <strong className="text-dragon-text">Active Roster</strong>
                    </li>
                    <li className="flex justify-between py-1 border-b border-dragon-neon/5">
                      <span>Device Rig:</span>
                      <strong className="text-dragon-text flex items-center gap-1">
                        <Laptop className="w-3 h-3 text-dragon-text-muted" /> {member.device || "Mobile Device"}
                      </strong>
                    </li>
                    <li className="flex justify-between py-1">
                      <span>Enlist Date:</span>
                      <strong className="text-dragon-text">
                        {new Date(member.joinedAt).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                      </strong>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Achievements block */}
              {member.achievements && (
                <div className="space-y-2 border-t border-dragon-neon/10 pt-4">
                  <h3 className="font-heading text-xs font-bold text-dragon-neon uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" /> Medal of Achievements
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {member.achievements.split(",").map((ach, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-heading tracking-wide uppercase flex items-center gap-1"
                      >
                        ⚡ {ach.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Channels */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dragon-neon/10 pt-6">
                <span className="text-xs text-dragon-text-muted font-heading uppercase tracking-wider">Social Channels:</span>
                <div className="flex gap-2">
                  {member.youtube && (
                    <a
                      href={member.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-500 border border-red-500/20 flex items-center justify-center transition-colors"
                      aria-label="YouTube"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                  {member.instagram && (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 hover:text-pink-500 border border-pink-500/20 flex items-center justify-center transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {member.discord && (
                    <a
                      href={member.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-500 border border-blue-500/20 flex items-center justify-center transition-colors"
                      aria-label="Discord"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  )}
                  {member.facebook && (
                    <a
                      href={member.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-500 border border-indigo-500/20 flex items-center justify-center transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {!member.youtube && !member.instagram && !member.discord && !member.facebook && (
                    <span className="text-xs text-dragon-text-muted italic">No linked profiles</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

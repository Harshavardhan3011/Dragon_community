"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Shield, Trophy, Users, Search, User, Globe } from "lucide-react";
import { type GuildMemberItem } from "@/components/admin/GuildEditor";
import PlayerProfileModal from "./PlayerProfileModal";
import SectionHeading from "@/components/ui/SectionHeading";
import GamingCard from "@/components/ui/GamingCard";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";

interface GuildClientProps {
  initialMembers: GuildMemberItem[];
}

export default function GuildClient({ initialMembers }: GuildClientProps) {
  const [selectedMember, setSelectedMember] = useState<GuildMemberItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCardClick = (member: GuildMemberItem) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  // Group members by role
  const leader = initialMembers.find((m) => m.role === "GUILD_LEADER");
  const actingLeader = initialMembers.find((m) => m.role === "ACTING_GUILD_LEADER");
  const officers = initialMembers.filter((m) => m.role === "OFFICER");
  
  // Players get search filter applied
  const rawPlayers = initialMembers.filter((m) => m.role === "PLAYER");
  const filteredPlayers = rawPlayers.filter((m) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      m.nickname.toLowerCase().includes(query) ||
      m.name.toLowerCase().includes(query) ||
      m.uid.toLowerCase().includes(query) ||
      (m.favoriteGame && m.favoriteGame.toLowerCase().includes(query)) ||
      (m.country && m.country.toLowerCase().includes(query))
    );
  });

  // Animation constants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, damping: 20, stiffness: 100 },
    },
  };

  return (
    <div className="relative min-h-screen pb-24 pt-24 overflow-hidden">
      {/* Decorative background grid and neon lights */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-dragon-neon/3 rounded-full blur-[160px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── Hero Section ───────────────────────────────────────────── */}
        <div className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 rounded-2xl bg-dragon-neon/10 border border-dragon-neon/20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-dragon-neon/5"
          >
            <Shield className="w-8 h-8 text-dragon-neon" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-dragon-text tracking-tight mb-4"
          >
            Dragon Up <span className="gradient-text">Guild</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-dragon-text-secondary text-base sm:text-lg md:text-xl max-w-xl mx-auto mb-8"
          >
            Meet the warriors who lead and strengthen our community.
          </motion.p>

          {/* Premium Animated Emerald Divider */}
          <div className="relative w-48 h-1 mx-auto overflow-hidden rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-dragon-neon/40 to-transparent animate-shimmer bg-[length:200%_100%]" />
            <div className="absolute inset-0 bg-dragon-neon/20" />
          </div>
        </div>

        {/* ─── Guild Hierarchy Tree ────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center mb-24"
        >
          {/* Tier 1: Guild Leader */}
          {leader && (
            <motion.div variants={cardVariants} className="z-10">
              <GuildMemberCard
                member={leader}
                roleLabel="Guild Leader"
                cardSize="lg"
                highlightColor="border-amber-500/50 hover:border-amber-400 shadow-amber-500/5"
                roleIcon={<Trophy className="w-4 h-4 text-amber-400 inline" />}
                onClick={() => handleCardClick(leader)}
              />
            </motion.div>
          )}

          {/* SVG Connector 1: Leader -> Acting Leader */}
          {leader && actingLeader && (
            <div className="h-16 w-1 relative flex justify-center">
              <svg className="absolute inset-0 w-8 h-16 overflow-visible pointer-events-none">
                {/* Background base path */}
                <path
                  d="M 16 0 L 16 64"
                  stroke="rgba(0, 255, 102, 0.1)"
                  strokeWidth="3"
                  fill="none"
                />
                {/* Glowing flow path */}
                <motion.path
                  d="M 16 0 L 16 64"
                  stroke="#00FF66"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="20 40"
                  animate={{ strokeDashoffset: [-60, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
              </svg>
            </div>
          )}

          {/* Tier 2: Acting Guild Leader */}
          {actingLeader && (
            <motion.div variants={cardVariants} className="z-10">
              <GuildMemberCard
                member={actingLeader}
                roleLabel="Acting Leader"
                cardSize="md"
                highlightColor="border-dragon-neon/40 hover:border-dragon-neon shadow-dragon-neon/5"
                roleIcon={<Shield className="w-4 h-4 text-dragon-neon inline" />}
                onClick={() => handleCardClick(actingLeader)}
              />
            </motion.div>
          )}

          {/* SVG Connector 2: Acting Leader -> Officers */}
          {actingLeader && officers.length > 0 && (
            <>
              {/* Desktop branching line */}
              <div className="h-16 w-full max-w-4xl relative hidden md:block">
                <svg
                  className="absolute inset-0 w-full h-16 overflow-visible pointer-events-none"
                  viewBox="0 0 800 64"
                  preserveAspectRatio="none"
                >
                  {/* Base paths */}
                  <path d="M 400 0 L 400 20" stroke="rgba(0, 255, 102, 0.1)" strokeWidth="3" fill="none" />
                  <path d="M 100 20 L 700 20" stroke="rgba(0, 255, 102, 0.1)" strokeWidth="3" fill="none" />
                  <path d="M 100 20 L 100 64" stroke="rgba(0, 255, 102, 0.1)" strokeWidth="3" fill="none" />
                  <path d="M 300 20 L 300 64" stroke="rgba(0, 255, 102, 0.1)" strokeWidth="3" fill="none" />
                  <path d="M 500 20 L 500 64" stroke="rgba(0, 255, 102, 0.1)" strokeWidth="3" fill="none" />
                  <path d="M 700 20 L 700 64" stroke="rgba(0, 255, 102, 0.1)" strokeWidth="3" fill="none" />

                  {/* Pulsing energy path 1 */}
                  <motion.path
                    d="M 400 0 L 400 20"
                    stroke="#00FF66"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="10 30"
                    animate={{ strokeDashoffset: [-40, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                  {/* Energy spreading left */}
                  <motion.path
                    d="M 400 20 L 100 20 L 100 64"
                    stroke="#00FF66"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="20 40"
                    animate={{ strokeDashoffset: [-60, 0] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                  />
                  <motion.path
                    d="M 400 20 L 300 20 L 300 64"
                    stroke="#00FF66"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="20 40"
                    animate={{ strokeDashoffset: [-60, 0] }}
                    transition={{ repeat: Infinity, duration: 2.0, ease: "linear" }}
                  />
                  {/* Energy spreading right */}
                  <motion.path
                    d="M 400 20 L 500 20 L 500 64"
                    stroke="#00FF66"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="20 40"
                    animate={{ strokeDashoffset: [-60, 0] }}
                    transition={{ repeat: Infinity, duration: 2.0, ease: "linear" }}
                  />
                  <motion.path
                    d="M 400 20 L 700 20 L 700 64"
                    stroke="#00FF66"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="20 40"
                    animate={{ strokeDashoffset: [-60, 0] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                  />
                </svg>
              </div>

              {/* Mobile vertical line connector */}
              <div className="h-16 w-1 relative flex justify-center md:hidden">
                <svg className="absolute inset-0 w-8 h-16 overflow-visible pointer-events-none">
                  <path d="M 16 0 L 16 64" stroke="rgba(0, 255, 102, 0.1)" strokeWidth="3" fill="none" />
                  <motion.path
                    d="M 16 0 L 16 64"
                    stroke="#00FF66"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="15 30"
                    animate={{ strokeDashoffset: [-45, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                </svg>
              </div>
            </>
          )}

          {/* Tier 3: Officers Row */}
          {officers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl z-10">
              {officers.map((officer) => (
                <motion.div key={officer.id} variants={cardVariants}>
                  <GuildMemberCard
                    member={officer}
                    roleLabel="Officer"
                    cardSize="sm"
                    highlightColor="border-dragon-neon/20 hover:border-dragon-neon/60 shadow-dragon-neon/3"
                    roleIcon={<Users className="w-3.5 h-3.5 text-blue-400 inline" />}
                    onClick={() => handleCardClick(officer)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ─── Players Section ────────────────────────────────────────── */}
        <section className="mt-28" aria-label="Guild Players">
          <SectionHeading
            badge="Guild Players"
            title="The Guild Roster"
            description="Our competitive roster of active players battling on the frontlines."
          />

          {/* Player Search Bar */}
          <div className="glass-card rounded-xl p-4 mb-8 max-w-xl mx-auto flex items-center relative">
            <Search className="w-5 h-5 text-dragon-text-muted mr-3" />
            <input
              type="text"
              placeholder="Search players by name, UID, region or game..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 text-sm text-dragon-text focus:outline-none placeholder-dragon-text-muted"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-dragon-text-muted hover:text-dragon-neon ml-2 cursor-pointer font-heading uppercase"
              >
                Clear
              </button>
            )}
          </div>

          {/* Players Grid (Exactly 4 cols on desktop, 2 on tablet, 1 on mobile) */}
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-16 bg-dragon-bg-800/10 border border-dragon-neon/5 rounded-2xl max-w-md mx-auto">
              <Users className="w-12 h-12 text-dragon-text-muted mx-auto mb-4 opacity-40" />
              <p className="text-dragon-text-secondary text-sm">No players matched your search criteria.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredPlayers.map((player) => {
                const hasAvatar = !!player.avatar;
                return (
                  <motion.div key={player.id} variants={cardVariants}>
                    <GamingCard
                      onClick={() => handleCardClick(player)}
                      className={`relative cursor-pointer group flex flex-col items-center text-center p-6 bg-dragon-bg-800/30 border transition-all duration-300 hover:-translate-y-2 shadow-lg ${
                        hasAvatar
                          ? "border-dragon-neon/10 hover:border-dragon-neon/50 hover:shadow-dragon-neon/5"
                          : "border-dashed border-dragon-emerald/30 hover:border-dragon-emerald/60 shadow-inner"
                      }`}
                    >
                      <div className="absolute inset-0 rounded-2xl bg-dragon-neon/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      <div
                        className={`relative w-20 h-20 rounded-full border transition-all duration-300 aspect-square overflow-hidden mb-4 ${
                          hasAvatar
                            ? "border-dragon-neon/20 group-hover:border-dragon-neon"
                            : "border-dashed border-dragon-emerald/20 group-hover:border-dragon-emerald/40"
                        }`}
                      >
                        <div className="absolute inset-0 bg-dragon-bg-700/80 flex items-center justify-center">
                          {player.avatar ? (
                            <img
                              src={player.avatar}
                              alt={player.nickname}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <User className="w-8 h-8 text-dragon-text-muted" />
                          )}
                        </div>
                      </div>

                      <h3 className="font-heading text-lg font-bold text-dragon-text group-hover:text-dragon-neon transition-colors truncate w-full max-w-xs">
                        {player.nickname}
                      </h3>
                      <p className="text-xs text-dragon-text-muted mt-0.5 truncate max-w-xs">
                        {player.name}
                      </p>

                      {!hasAvatar && (
                        <span className="text-[9px] font-heading text-dragon-emerald/80 mt-2.5 uppercase tracking-widest border border-dashed border-dragon-emerald/30 px-1.5 py-0.5 rounded">
                          Image Coming Soon
                        </span>
                      )}

                      <div className="absolute top-4 right-4 flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            player.status === "ACTIVE"
                              ? "bg-dragon-neon"
                              : player.status === "ON_BREAK"
                              ? "bg-orange-400"
                              : "bg-dragon-text-muted"
                          }`}
                        />
                      </div>
                    </GamingCard>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>
      </div>

      {/* Profile Detail Dialog */}
      <PlayerProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        member={selectedMember}
      />
    </div>
  );
}

// ─── GuildMemberCard Subcomponent ────────────────────────────────────
interface MemberCardProps {
  member: GuildMemberItem;
  roleLabel: string;
  cardSize?: "sm" | "md" | "lg";
  highlightColor: string;
  roleIcon: React.ReactNode;
  onClick: () => void;
}

function GuildMemberCard({
  member,
  roleLabel,
  cardSize = "md",
  highlightColor,
  roleIcon,
  onClick,
}: MemberCardProps) {
  const isLg = cardSize === "lg";
  const isMd = cardSize === "md";
  const hasAvatar = !!member.avatar;

  return (
    <GamingCard
      onClick={onClick}
      className={`relative cursor-pointer group flex items-center gap-4 bg-dragon-bg-800/40 border transition-all duration-300 hover:-translate-y-1.5 shadow-xl ${
        hasAvatar
          ? highlightColor
          : "border-dashed border-dragon-emerald/30 hover:border-dragon-emerald/60 shadow-inner"
      } ${
        isLg
          ? "w-80 p-5 rounded-2xl"
          : isMd
          ? "w-72 p-4.5 rounded-xl"
          : "w-full p-4 rounded-xl"
      }`}
    >
      {/* Outer subtle glow rings */}
      <div className="absolute inset-0 rounded-inherit bg-dragon-neon/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Circular masked avatar */}
      <div
        className={`relative shrink-0 rounded-full border transition-all duration-300 overflow-hidden ${
          hasAvatar
            ? "border-dragon-neon/20 group-hover:border-dragon-neon"
            : "border-dashed border-dragon-emerald/20 group-hover:border-dragon-emerald/40"
        } ${
          isLg ? "w-16 h-16" : isMd ? "w-14 h-14" : "w-12 h-12"
        }`}
      >
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.nickname}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-dragon-bg-700 flex items-center justify-center">
            <User className="w-6 h-6 text-dragon-text-muted" />
          </div>
        )}
      </div>

      {/* Info details */}
      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-1.5">
          <h3
            className={`font-heading font-bold text-dragon-text group-hover:text-dragon-neon transition-colors truncate ${
              isLg ? "text-lg" : isMd ? "text-md" : "text-sm"
            }`}
          >
            {member.nickname}
          </h3>
          {member.status === "ACTIVE" && (
            <span className="w-1.5 h-1.5 rounded-full bg-dragon-neon" />
          )}
        </div>
        
        {/* Undername label */}
        <p className="text-xs text-dragon-text-secondary truncate mt-0.5">{member.name}</p>

        {/* Esports role badge */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Badge variant="neon" className="text-[9px] py-0.5 tracking-wider uppercase flex items-center gap-1">
            {roleIcon}
            <span className="font-heading">{roleLabel}</span>
          </Badge>
          {!hasAvatar && (
            <span className="text-[9px] font-heading text-dragon-emerald/80 tracking-widest uppercase border border-dashed border-dragon-emerald/20 px-1 py-0.5 rounded">
              Coming Soon
            </span>
          )}
        </div>
      </div>
    </GamingCard>
  );
}

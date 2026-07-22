import type { Metadata } from "next";
import Link from "next/link";
import { Users, ExternalLink } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import GamingCard from "@/components/ui/GamingCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the Dragon Up team — the passionate gamers and creators behind the Dragon Up gaming community.",
  alternates: { canonical: "/team" },
};

export default async function TeamPage() {
  let dbMembers: any[] = [];
  try {
    dbMembers = await db.teamMember.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch team members from DB:", error);
    dbMembers = [];
  }

  const activeMembers = dbMembers.map((m) => ({
    ...m,
    skills: m.skills ? m.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
  }));

  return (
    <PageTransition>
      <PageHero
        badge="The Team"
        title="Meet the Dragon Up Team"
        description="The passionate gamers, creators, and community builders making Dragon Up possible."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Team grid */}
        <section className="py-8" aria-label="Team members">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeMembers.map((member) => (
              <GamingCard key={member.id} className="text-center p-6">
                {/* Avatar */}
                <div className="relative w-24 h-24 mx-auto mb-5">
                  <div className="w-24 h-24 rounded-full bg-dragon-bg-600 border-2 border-dragon-neon/30 flex items-center justify-center">
                    <Users className="w-10 h-10 text-dragon-neon/40" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-dragon-neon border-2 border-dragon-bg-900" aria-label="Active" />
                </div>

                <h3 className="font-heading font-bold text-dragon-text text-lg mb-1">{member.name}</h3>
                <Badge variant="neon" className="mb-4 text-[10px]">{member.role}</Badge>
                <p className="text-dragon-text-secondary text-sm leading-relaxed mb-4">{member.bio}</p>

                {member.favoriteGame && (
                  <p className="text-xs text-dragon-text-muted mb-4">
                    🎮 Favourite: <span className="text-dragon-neon">{member.favoriteGame}</span>
                  </p>
                )}

                {/* Skills */}
                {member.skills && member.skills.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {member.skills.map((skill: string) => (
                      <span key={skill} className="px-2 py-1 bg-dragon-bg-600 text-dragon-text-muted text-[10px] rounded font-heading uppercase tracking-wide">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {member.socialLink && (
                  <a
                    href={member.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-dragon-neon hover:text-dragon-light-green transition-colors"
                  >
                    Profile <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </GamingCard>
            ))}
          </div>
        </section>

        {/* Join the team CTA */}
        <section className="py-12 text-center" aria-label="Join the team">
          <GamingCard className="max-w-2xl mx-auto p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-dragon-neon/10 border border-dragon-neon/20 flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-dragon-neon" />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-dragon-text mb-4">
              Want to Join the Team?
            </h2>
            <p className="text-dragon-text-secondary mb-8 leading-relaxed">
              Dragon Up is always looking for passionate gamers, editors, moderators, and
              community builders. If you love gaming and want to be part of something great,
              reach out to us.
            </p>
            <Button variant="primary" size="lg" href="/contact">
              Get in Touch
            </Button>
          </GamingCard>
        </section>
      </div>
    </PageTransition>
  );
}

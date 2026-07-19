import type { Metadata } from "next";
import { Rocket, Award, TrendingUp, Monitor, Globe } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import GamingCard from "@/components/ui/GamingCard";
import { milestones } from "@/data/featured-content";
import { faqs } from "@/data/faq";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Dragon Up — our story, mission, gaming journey, and vision for the future of the Dragon Up gaming community.",
  alternates: { canonical: "/about" },
};

const iconMap: Record<string, React.ReactNode> = {
  Rocket: <Rocket className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Monitor: <Monitor className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
};

export default function AboutPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <PageHero
        badge="Our Story"
        title="The Dragon Up Story"
        description="From a passion for gaming to a thriving community platform — discover how Dragon Up was built for gamers, by gamers."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* Story + Mission */}
        <section className="py-16 grid lg:grid-cols-2 gap-12 items-center" aria-label="Story">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-xs font-heading uppercase tracking-widest text-dragon-neon bg-dragon-neon/10 border border-dragon-neon/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-dragon-neon" /> Origin
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dragon-text mb-6">
              Born from a Love of Gaming
            </h2>
            <div className="space-y-4 text-dragon-text-secondary leading-relaxed">
              <p>
                Dragon Up was created to bring together Free Fire players, PC gamers, stream
                viewers, and gaming enthusiasts through entertaining content, community
                participation, and future competitive events.
              </p>
              <p>
                What started as a YouTube channel sharing Free Fire highlights quickly grew
                into a multi-platform gaming brand. Every video, every stream, every community
                post was built on one simple idea: gaming is better together.
              </p>
              <p>
                Today, Dragon Up is home to thousands of passionate gamers who share the same
                drive — to rise, fight, and dominate in everything they do.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Mission", text: "Create a platform where every gamer feels welcome, engaged, and inspired to be their best." },
              { title: "Vision", text: "Build the most passionate gaming community platform in the region, starting with Free Fire and PC gaming." },
              { title: "Values", text: "Community first. Content quality. Consistency. Passion for gaming above all else." },
              { title: "Future", text: "Tournaments, leaderboards, community profiles, rewards, and a fully-fledged Dragon Up gaming universe." },
            ].map((item) => (
              <GamingCard key={item.title} className="text-center p-5">
                <h3 className="font-heading text-sm font-bold text-dragon-neon uppercase tracking-wider mb-2">{item.title}</h3>
                <p className="text-dragon-text-secondary text-xs leading-relaxed">{item.text}</p>
              </GamingCard>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16" aria-label="Milestones">
          <SectionHeading badge="Journey" title="Dragon Up Timeline" align="left" />
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-dragon-neon/20" aria-hidden="true" />
            <div className="space-y-8">
              {milestones.map((milestone, i) => (
                <div key={milestone.id} className="relative flex gap-6 pl-4">
                  <div className="relative z-10 w-12 h-12 rounded-full bg-dragon-bg-700 border-2 border-dragon-neon/40 flex items-center justify-center text-dragon-neon shrink-0">
                    {iconMap[milestone.icon] || <Rocket className="w-5 h-5" />}
                  </div>
                  <GamingCard className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-heading text-xs text-dragon-neon uppercase tracking-wider">{milestone.year}</span>
                      <div className="flex-1 h-px bg-dragon-neon/10" />
                      <span className="text-xs text-dragon-text-muted">#{i + 1}</span>
                    </div>
                    <h3 className="font-heading font-bold text-dragon-text mb-1">{milestone.title}</h3>
                    <p className="text-dragon-text-secondary text-sm">{milestone.description}</p>
                  </GamingCard>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Creator Message */}
        <section className="py-16" aria-label="Creator message">
          <GamingCard className="max-w-3xl mx-auto text-center p-10 md:p-12">
            <div className="w-20 h-20 rounded-full bg-dragon-neon/15 border-2 border-dragon-neon/30 flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none" className="text-dragon-neon" aria-hidden="true">
                <path d="M16 2L4 10l4 6-4 6 12 8 12-8-4-6 4-6L16 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2" />
              </svg>
            </div>
            <blockquote>
              <p className="text-dragon-text text-lg md:text-xl leading-relaxed mb-6 italic">
                &ldquo;Dragon Up is more than a YouTube channel. It&apos;s a community for every gamer
                who wants to improve, connect, compete, and enjoy the world of gaming at its
                best. We&apos;re just getting started.&rdquo;
              </p>
            </blockquote>
            <footer>
              <p className="font-heading font-bold text-dragon-neon">Dragon Up Creator</p>
              <p className="text-dragon-text-muted text-sm">Founder, {siteConfig.name}</p>
            </footer>
          </GamingCard>
        </section>

        {/* FAQ */}
        <section className="py-16" aria-label="FAQ">
          <SectionHeading
            badge="FAQ"
            title="Frequently Asked Questions"
            description="Everything you need to know about Dragon Up."
          />
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <GamingCard key={faq.id}>
                <h3 className="font-heading font-bold text-dragon-text mb-3">{faq.question}</h3>
                <p className="text-dragon-text-secondary text-sm leading-relaxed">{faq.answer}</p>
              </GamingCard>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

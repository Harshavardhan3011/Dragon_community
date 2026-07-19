import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description: "Dragon Up Community Guidelines — our rules for a respectful and inclusive gaming community.",
  alternates: { canonical: "/community-guidelines" },
};

const sections = [
  { id: "respect", title: "1. Respect Everyone", content: "Treat all community members with respect regardless of skill level, background, or gaming preference. Harassment, bullying, discrimination, or personal attacks of any kind are strictly prohibited.\n\nDragon Up is a welcoming space for all gamers. Be the kind of community member you'd want others to be." },
  { id: "content", title: "2. Appropriate Content", content: "Keep all content and discussions appropriate for a general gaming audience. Avoid sharing explicit, violent, or offensive content.\n\nSexual content, graphic violence, or anything illegal is strictly not allowed and will result in immediate removal and possible permanent ban." },
  { id: "spam", title: "3. No Spam or Self-Promotion", content: "Do not spam the community with repeated messages, irrelevant links, or unsolicited self-promotion. You may share your own gaming content when it's relevant and adds value to the community.\n\nUnauthorized advertising, phishing links, or scam messages are prohibited." },
  { id: "fair", title: "4. Fair Play", content: "Dragon Up promotes fair and honest gaming. Do not promote, share, or discuss cheating software, exploits, or any means of gaining unfair advantages in games.\n\nRespect the rules of every game and every tournament organized by Dragon Up." },
  { id: "privacy", title: "5. Privacy and Safety", content: "Do not share personal information of other community members without their consent. This includes real names, locations, phone numbers, or any identifying details.\n\nReport any behavior that makes you or others feel unsafe to our community moderators." },
  { id: "language", title: "6. Language and Communication", content: "Use language that is inclusive and respectful. Excessive profanity, hate speech, or language that demeans others is not acceptable.\n\nEnglish is the primary language for community discussions to ensure inclusivity for all members." },
  { id: "disputes", title: "7. Disputes and Disagreements", content: "Disagreements happen. Address conflicts calmly and constructively. If a dispute cannot be resolved, contact a community moderator rather than escalating conflict publicly.\n\nDo not take disputes outside the community platforms in ways that could harm other members." },
  { id: "reporting", title: "8. Reporting Violations", content: "If you witness violations of these guidelines, please report them to our community moderators through the Contact page. Include as much detail as possible to help us investigate.\n\nFalse reports made maliciously are also a violation of these guidelines." },
  { id: "enforcement", title: "9. Enforcement", content: "Violations of community guidelines may result in warnings, temporary suspension, or permanent banning from Dragon Up community spaces, depending on the severity.\n\nDragon Up reserves the right to take action at our discretion to protect the community's wellbeing." },
];

export default function CommunityGuidelinesPage() {
  return (
    <PageTransition>
      <PageHero
        badge="Community"
        title="Community Guidelines"
        description="Last updated: January 2025. Our guidelines ensure Dragon Up remains a positive space for all gamers."
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="glass-card rounded-xl p-6 mb-8">
          <h2 className="font-heading font-bold text-dragon-text mb-4">Table of Contents</h2>
          <ol className="space-y-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-sm text-dragon-text-secondary hover:text-dragon-neon transition-colors">{s.title}</a>
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="font-heading text-xl font-bold text-dragon-neon mb-4">{s.title}</h2>
              {s.content.split("\n\n").map((para, i) => (
                <p key={i} className="text-dragon-text-secondary leading-relaxed mb-3 text-sm">{para}</p>
              ))}
            </section>
          ))}
        </div>
        <div className="mt-12 flex items-center justify-between border-t border-dragon-neon/10 pt-8">
          <Link href="/" className="flex items-center gap-2 text-sm text-dragon-text-secondary hover:text-dragon-neon transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <a href="#main-content" className="text-sm text-dragon-neon hover:text-dragon-light-green transition-colors">
            Back to top ↑
          </a>
        </div>
      </div>
    </PageTransition>
  );
}

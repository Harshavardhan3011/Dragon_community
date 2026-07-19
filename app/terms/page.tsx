import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Dragon Up Terms and Conditions — rules and guidelines for using the Dragon Up website.",
  alternates: { canonical: "/terms" },
};

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms", content: "By accessing and using the Dragon Up website, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website." },
  { id: "use", title: "2. Use of Website", content: "You may use the Dragon Up website for lawful purposes only. You agree not to use the website in any way that violates applicable laws, infringes on others' rights, or interferes with the website's operation.\n\nYou may not attempt to gain unauthorized access to any part of the website, its servers, or any connected databases." },
  { id: "content", title: "3. Content", content: "All content on the Dragon Up website, including text, graphics, logos, and gaming content, is the property of Dragon Up unless otherwise stated. You may not reproduce, distribute, or use our content without explicit written permission.\n\nContent shared from third-party platforms such as YouTube and Instagram remains the property of those platforms and their respective creators." },
  { id: "gaming", title: "4. Gaming Content", content: "Dragon Up provides gaming content for entertainment purposes. Any gameplay tips, strategies, or guides are provided as personal opinion and experience. We do not guarantee results from following any gaming advice provided.\n\nGame-specific rules and regulations are governed by the respective game developers' terms of service." },
  { id: "community", title: "5. Community Guidelines", content: "Participation in the Dragon Up community requires adherence to our Community Guidelines. We reserve the right to remove any content or ban users who violate these guidelines.\n\nSee our Community Guidelines page for full details." },
  { id: "disclaimers", title: "6. Disclaimers", content: "The Dragon Up website is provided on an 'as is' and 'as available' basis. We make no warranties, express or implied, regarding the website's reliability, availability, or fitness for a particular purpose.\n\nWe are not responsible for any technical issues, data loss, or damages resulting from use of our website." },
  { id: "limitation", title: "7. Limitation of Liability", content: "Dragon Up shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website, even if we have been advised of the possibility of such damages.\n\nOur total liability for any claims related to the website shall not exceed the amount you paid to access our services (if any)." },
  { id: "changes", title: "8. Changes to Terms", content: "We reserve the right to modify these Terms and Conditions at any time. Changes will be posted on this page with an updated date. Continued use of the website after changes constitutes acceptance." },
  { id: "contact", title: "9. Contact", content: "For questions regarding these Terms and Conditions, please contact us through the Contact page on our website." },
];

export default function TermsPage() {
  return (
    <PageTransition>
      <PageHero
        badge="Legal"
        title="Terms & Conditions"
        description="Last updated: January 2025. Please read these terms carefully before using the Dragon Up website."
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

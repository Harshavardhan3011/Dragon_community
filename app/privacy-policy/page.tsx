import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Dragon Up Privacy Policy — how we collect, use, and protect your information.",
  alternates: { canonical: "/privacy-policy" },
};

const sections = [
  { id: "information", title: "1. Information We Collect", content: `We collect information that you voluntarily provide when contacting us through our website, including your name, email address, and message content. We may also collect non-personally identifiable information such as browser type, referring pages, and website usage data through standard web analytics tools.\n\nWe do not collect sensitive personal information such as payment details, government IDs, or health information.` },
  { id: "use", title: "2. How We Use Your Information", content: `Information you provide through our contact form is used solely to respond to your inquiry and to improve our services. We may use aggregated, anonymized data to understand how visitors use our website.\n\nWe do not sell, rent, or trade your personal information to third parties for marketing purposes.` },
  { id: "cookies", title: "3. Cookies and Tracking", content: `Our website may use cookies to improve your browsing experience. Cookies are small files stored on your device that help us remember your preferences. You can control cookie settings through your browser preferences.\n\nWe use analytics tools to understand website traffic patterns. These tools may set their own cookies according to their respective privacy policies.` },
  { id: "thirdparty", title: "4. Third-Party Links", content: `Our website contains links to YouTube, Instagram, and other third-party platforms. These external sites have their own privacy policies, and we have no control over their practices. We encourage you to review the privacy policies of any third-party sites you visit.` },
  { id: "security", title: "5. Data Security", content: `We implement reasonable security measures to protect your information from unauthorized access. However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of data transmitted through our website.\n\nAll form submissions are encrypted during transit and stored securely.` },
  { id: "retention", title: "6. Data Retention", content: `We retain contact form submissions and newsletter subscriptions for up to 2 years or until you request deletion. You may request deletion of your personal data at any time by contacting us through our website.` },
  { id: "rights", title: "7. Your Rights", content: `You have the right to access, correct, or request deletion of your personal information. To exercise these rights, please contact us through the Contact page. We will respond to your request within 30 days.` },
  { id: "changes", title: "8. Changes to This Policy", content: `We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of our website after changes constitutes acceptance of the revised policy.` },
  { id: "contact", title: "9. Contact Us", content: `If you have questions about this Privacy Policy, please contact us through the Contact page on our website. We are committed to addressing your concerns promptly and transparently.` },
];

export default function PrivacyPolicyPage() {
  return (
    <PageTransition>
      <PageHero
        badge="Legal"
        title="Privacy Policy"
        description="Last updated: January 2025. This policy explains how Dragon Up collects and uses your information."
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* TOC */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <h2 className="font-heading font-bold text-dragon-text mb-4">Table of Contents</h2>
          <ol className="space-y-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-sm text-dragon-text-secondary hover:text-dragon-neon transition-colors">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="font-heading text-xl font-bold text-dragon-text mb-4 text-dragon-neon">{s.title}</h2>
              {s.content.split("\n\n").map((para, i) => (
                <p key={i} className="text-dragon-text-secondary leading-relaxed mb-3 text-sm">{para}</p>
              ))}
            </section>
          ))}
        </div>

        {/* Back to top */}
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

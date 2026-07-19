"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Bell } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export default function NewsletterSection() {
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addToast({ type: "error", title: "Invalid email", message: "Please enter a valid email address." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        addToast({ type: "success", title: "Subscribed!", message: "You'll receive Dragon Up updates." });
      } else {
        const data = await res.json();
        addToast({ type: "error", title: "Error", message: data.error || "Failed to subscribe." });
      }
    } catch {
      addToast({ type: "error", title: "Network error", message: "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" aria-label="Newsletter" id="newsletter">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dragon-dark-green/5 to-transparent pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 rounded-2xl bg-dragon-neon/10 border border-dragon-neon/20 flex items-center justify-center mx-auto mb-6">
            <Bell className="w-8 h-8 text-dragon-neon" />
          </div>
          <SectionHeading
            title="Never Miss a Dragon Update"
            description="Get video alerts, livestream schedules, community news, and future tournament announcements."
          />

          {subscribed ? (
            <div className="glass-card rounded-2xl p-8">
              <div className="w-16 h-16 rounded-full bg-dragon-neon/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-dragon-neon" />
              </div>
              <p className="font-heading text-lg font-bold text-dragon-neon mb-2">You&apos;re subscribed!</p>
              <p className="text-dragon-text-secondary text-sm">
                Welcome to the Dragon Up community. Stay tuned for updates.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" noValidate>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                aria-label="Email address"
                required
              />
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                disabled={loading}
                className="shrink-0"
              >
                <Bell className="w-4 h-4" />
                Subscribe
              </Button>
            </form>
          )}
          <p className="text-dragon-text-muted text-xs mt-4">
            No spam. Unsubscribe anytime. Your privacy is respected.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

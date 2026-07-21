"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Youtube, Instagram, Mail, Clock, CheckCircle } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import PageHero from "@/components/ui/PageHero";
import GamingCard from "@/components/ui/GamingCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";
import { contactTypes } from "@/config/social-links";
import { siteConfig } from "@/config/site";
import { sendContactEmail } from "@/lib/emailjs";

export default function ContactForm() {
  const { addToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    const result = await sendContactEmail(data);
    if (result.success) {
      setReferenceId(result.referenceId);
      setSubmitted(true);
      reset();
      addToast({
        type: "success",
        title: "Message sent!",
        message: `Reference: ${result.referenceId}`,
      });
    } else {
      addToast({
        type: "error",
        title: "Failed to send",
        message: "Please try again.",
      });
    }
  };

  return (
    <PageTransition>
      <PageHero
        badge="Get in Touch"
        title="Contact Dragon Up"
        description="Collaborations, sponsorships, gaming partnerships, or general inquiries — we'd love to hear from you."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <GamingCard className="p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-dragon-neon/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-dragon-neon" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-dragon-text mb-3">Message Received!</h2>
                <p className="text-dragon-text-secondary mb-2">
                  Thank you for reaching out to Dragon Up. We&apos;ll get back to you as soon as possible.
                </p>
                {referenceId && (
                  <p className="text-xs text-dragon-text-muted mb-8">
                    Reference ID: <span className="text-dragon-neon font-heading">{referenceId}</span>
                  </p>
                )}
                <Button variant="secondary" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </GamingCard>
            ) : (
              <GamingCard className="p-8">
                <h2 className="font-heading text-xl font-bold text-dragon-text mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input label="Full Name" placeholder="Your name" error={errors.name?.message} {...register("name")} />
                    <Input label="Email Address" type="email" placeholder="your@email.com" error={errors.email?.message} {...register("email")} />
                  </div>
                  <Select label="Contact Type" options={contactTypes.map(c => ({ value: c.value, label: c.label }))} placeholder="Select a category" error={errors.type?.message} {...register("type")} />
                  <Input label="Subject" placeholder="Brief subject line" error={errors.subject?.message} {...register("subject")} />
                  <Textarea label="Message" placeholder="Tell us more..." error={errors.message?.message} {...register("message")} />
                  <Input label="Social Media Link (Optional)" type="url" placeholder="https://youtube.com/yourchannel" error={errors.socialLink?.message} {...register("socialLink")} />
                  <div className="pt-2">
                    <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} disabled={isSubmitting}>
                      <Send className="w-4 h-4" /> Send Message
                    </Button>
                  </div>
                  <p className="text-xs text-dragon-text-muted">
                    By submitting, you agree to our <a href="/privacy-policy" className="text-dragon-neon hover:underline">Privacy Policy</a>. Your information is kept confidential.
                  </p>
                </form>
              </GamingCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <GamingCard className="p-6">
              <h3 className="font-heading font-bold text-dragon-text mb-4">Connect With Us</h3>
              <div className="space-y-4">
                {siteConfig.links.youtube && (
                  <a href={siteConfig.links.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-dragon-text-secondary hover:text-dragon-neon transition-colors">
                    <Youtube className="w-5 h-5 text-red-400" />
                    <div><p className="text-sm font-medium text-dragon-text">YouTube</p><p className="text-xs text-dragon-text-muted">Subscribe for gaming content</p></div>
                  </a>
                )}
                {siteConfig.links.instagram && (
                  <a href={siteConfig.links.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-dragon-text-secondary hover:text-dragon-neon transition-colors">
                    <Instagram className="w-5 h-5 text-pink-400" />
                    <div><p className="text-sm font-medium text-dragon-text">Instagram</p><p className="text-xs text-dragon-text-muted">Daily gaming highlights</p></div>
                  </a>
                )}
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-dragon-neon" />
                  <div><p className="text-sm font-medium text-dragon-text">Business Email</p><p className="text-xs text-dragon-text-muted">DragonUpff@gmail.com</p></div>
                </div>
              </div>
            </GamingCard>
            <GamingCard className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-dragon-neon" />
                <h3 className="font-heading font-bold text-dragon-text">Response Time</h3>
              </div>
              <p className="text-dragon-text-secondary text-sm leading-relaxed">
                We typically respond within 24–72 hours for collaborations. General inquiries may take up to 5 business days.
              </p>
            </GamingCard>
            <GamingCard className="p-6">
              <h3 className="font-heading font-bold text-dragon-text mb-3">Categories</h3>
              <ul className="space-y-2">
                {contactTypes.map((type) => (
                  <li key={type.value} className="flex items-center gap-2 text-sm text-dragon-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-dragon-neon shrink-0" />
                    {type.label}
                  </li>
                ))}
              </ul>
            </GamingCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

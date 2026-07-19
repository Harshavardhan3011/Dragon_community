import Link from "next/link";
import { Home } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {/* Dragon art */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 bg-dragon-neon/5 rounded-full blur-[60px]" />
        </div>
        <svg width="120" height="120" viewBox="0 0 32 32" fill="none" className="text-dragon-neon/40 relative z-10" aria-hidden="true">
          <path d="M16 2L4 10l4 6-4 6 12 8 12-8-4-6 4-6L16 2z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
          <path d="M16 8l-6 4 3 4-3 4 6 4 6-4-3-4 3-4-6-4z" fill="currentColor" opacity="0.3" />
        </svg>
      </div>

      <span className="font-heading text-8xl font-bold text-dragon-neon/20 mb-2">404</span>
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-dragon-text mb-4">
        You Have Left the Dragon Realm
      </h1>
      <p className="text-dragon-text-secondary max-w-md mb-8 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist in the Dragon Up universe. It may have
        been moved, deleted, or never existed.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button variant="primary" href="/">
          <Home className="w-4 h-4" /> Back to Home
        </Button>
        <Button variant="secondary" href="/contact">
          Report an Issue
        </Button>
      </div>
    </div>
  );
}

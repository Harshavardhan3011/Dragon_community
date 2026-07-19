"use client";

import { useEffect } from "react";
import { Home, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Dragon Up Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-8">
        <svg width="40" height="40" viewBox="0 0 32 32" fill="none" className="text-red-400" aria-hidden="true">
          <path d="M16 2L4 10l4 6-4 6 12 8 12-8-4-6 4-6L16 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-dragon-text mb-4">
        The Dragon Encountered an Error
      </h1>
      <p className="text-dragon-text-secondary max-w-md mb-8 leading-relaxed">
        Something went wrong in the Dragon Up universe. Our team has been notified.
        Please try again or return to the home page.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button variant="primary" onClick={reset}>
          <RefreshCw className="w-4 h-4" /> Try Again
        </Button>
        <Button variant="secondary" href="/">
          <Home className="w-4 h-4" /> Back to Home
        </Button>
      </div>
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";

export default function GamingBackground() {
  const pathname = usePathname();

  // Do not render the decorative gaming background on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <div className="gaming-bg" aria-hidden="true" />;
}

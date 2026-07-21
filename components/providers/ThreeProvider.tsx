"use client";

import { usePathname } from "next/navigation";
import DragonScene from "@/components/three/DragonScene";

export default function ThreeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <DragonScene />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </>
  );
}

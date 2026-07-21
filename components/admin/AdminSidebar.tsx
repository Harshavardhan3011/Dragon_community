"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Mail, LogOut, FileText, Users, Settings, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Enquiries", href: "/admin/dashboard/enquiries", icon: Mail },
  { label: "Content", href: "/admin/dashboard/content", icon: FileText },
  { label: "Team", href: "/admin/dashboard/team", icon: Users },
  { label: "Guild Roster", href: "/admin/dashboard/guild", icon: Users },
  { label: "YouTube Settings", href: "/admin/dashboard/youtube", icon: Youtube },
  { label: "Settings", href: "/admin/dashboard/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <aside className="w-64 shrink-0 glass border-r border-dragon-neon/10 h-screen sticky top-0 flex flex-col z-40">
      <div className="p-6 border-b border-dragon-neon/10">
        <Link href="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-dragon-neon" aria-hidden="true">
            <path d="M16 2L4 10l4 6-4 6 12 8 12-8-4-6 4-6L16 2z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
          </svg>
          <span className="font-heading font-bold text-dragon-text">Dragon Up</span>
        </Link>
        <p className="text-xs text-dragon-text-muted mt-1 font-heading">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1" aria-label="Admin navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-dragon-neon/10 text-dragon-neon border border-dragon-neon/20"
                  : "text-dragon-text-secondary hover:text-dragon-text hover:bg-dragon-bg-600"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-dragon-neon/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

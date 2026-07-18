import type { NavItem, AdminNavItem } from "@/types";

export const mainNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

export const adminNavItems: AdminNavItem[] = [
  { label: "Overview", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Website Content", href: "/admin/dashboard/content", icon: "FileText", badge: "Soon" },
  { label: "Contact Enquiries", href: "/admin/dashboard/enquiries", icon: "Mail" },
  { label: "Team", href: "/admin/dashboard/team", icon: "Users", badge: "Soon" },
  { label: "Social Links", href: "/admin/dashboard/social", icon: "Share2", badge: "Soon" },
  { label: "Settings", href: "/admin/dashboard/settings", icon: "Settings", badge: "Soon" },
];

export const footerQuickLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

export const footerLegalLinks: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Community Guidelines", href: "/community-guidelines" },
];

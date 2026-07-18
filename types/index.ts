// ─── Site Configuration ─────────────────────────────────────────────
export interface SiteConfig {
  name: string;
  tagline: string;
  secondaryTagline: string;
  description: string;
  url: string;
  creator: string;
  links: SocialLinks;
}

export interface SocialLinks {
  youtube: string;
  instagram: string;
  discord: string;
}

// ─── Navigation ─────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
  icon?: string;
}

export interface AdminNavItem extends NavItem {
  badge?: string;
}

// ─── Team ───────────────────────────────────────────────────────────
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  favoriteGame?: string;
  socialLink?: string;
  skills?: string[];
  displayOrder: number;
  isActive: boolean;
}

// ─── Content ────────────────────────────────────────────────────────
export interface FeaturedVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
  views: string;
  uploadDate: string;
  youtubeUrl: string;
  isFeatured?: boolean;
}

export interface GamingCategory {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  cta: string;
  href: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  numericValue: number;
  suffix: string;
  description: string;
  icon: string;
}

export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  icon: string;
}

export interface CommunityCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface WhyItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

// ─── Contact ────────────────────────────────────────────────────────
export interface ContactFormData {
  name: string;
  email: string;
  type: string;
  subject: string;
  message: string;
  socialLink?: string;
}

export type ContactType =
  | "general"
  | "collaboration"
  | "sponsorship"
  | "partnership"
  | "technical"
  | "community";

export interface ContactTypeOption {
  value: ContactType;
  label: string;
}

// ─── Admin ──────────────────────────────────────────────────────────
export interface AdminLoginData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AdminDashboardStats {
  totalEnquiries: number;
  teamMembers: number;
  homepageSections: number;
  websiteStatus: "online" | "maintenance";
}

export interface EnquiryRow {
  id: string;
  name: string;
  email: string;
  type: string;
  subject: string;
  status: string;
  createdAt: string;
}

// ─── API Responses ──────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ContactSubmissionResponse {
  referenceId: string;
}

// ─── Component Props ────────────────────────────────────────────────
export type ButtonVariant = "primary" | "secondary" | "ghost" | "icon" | "danger";
export type ButtonSize = "sm" | "md" | "lg";
export type BadgeVariant = "neon" | "emerald" | "muted" | "danger";
export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

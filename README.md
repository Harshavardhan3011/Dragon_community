# 🐉 Dragon Up Gaming Community

Welcome to the official repository for **Dragon Up**, a premium web platform built for a gaming content creator and gaming community focused on Free Fire, PC gaming, livestreams, and future tournaments. 

This project implements **Phase 1: Foundation**, establishing a highly scalable, high-performance, and visually striking codebase that supports modern web design best practices and robust user interactions.

---

## ⚡ Tech Stack & Architecture

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) for server-side rendering, dynamic routing, and serverless API handlers.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a custom CSS-first design system utilizing neon-green accents, glassmorphic card patterns, custom glows, and rich dark-mode overlays.
- **Database**: [Prisma ORM v7](https://www.prisma.io/) with SQLite configuration (PostgreSQL-ready structure) and custom database driver adapter support (`@prisma/adapter-better-sqlite3`).
- **State & Animation**: [Framer Motion](https://www.framer-motion.pages.dev/) for high-fidelity entry animations, fluid micro-interactions, page-level transition states, and sticky headers.
- **Security & Validation**: [JWT](https://github.com/panva/jose) edge-middleware sessions and [Zod](https://zod.dev/) request validation.

---

## 📂 Project Structure

```bash
├── app/                  # Next.js pages, layouts, and API routes
│   ├── admin/            # Admin area (login and protected dashboards)
│   ├── api/              # API endpoints (newsletter, contact, admin auth)
│   └── globals.css       # Core styling & Tailwind v4 theme configurations
├── components/           # Reusable components
│   ├── layout/           # Page transitions, Navbars, Footers, and Loading screens
│   ├── ui/               # Core atomic primitives (Buttons, Cards, Inputs, Toast, Modals)
│   └── admin/            # Admin specific widgets
├── config/               # Navigation, social links, and SEO configuration
├── data/                 # Content data (FAQs, timeline, team, mock videos)
├── lib/                  # Utilities, Prisma wrapper, auth helpers, Zod validation
├── prisma/               # Schema definition, migrations, and seed scripts
└── public/               # Static assets (logos, OG images, categories)
```

---

## 🛠️ Getting Started

### 1. Prerequisite Installations
Ensure you have [Node.js v20+](https://nodejs.org/) installed on your machine.

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="dragon-up-your-secure-secret-key-change-in-production"
ADMIN_EMAIL="admin@dragonup.com"
ADMIN_PASSWORD="DragonUp@2025!"
```

### 4. Database Setup & Migrations
Sync the database with the schema and seed the initial administrative credentials, site configurations, and team members:
```bash
npx prisma generate
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live site.

---

## 🔒 Admin Access Credentials

Use these default credentials to test the admin panel (available at `/admin/login`):

- **Email**: `admin@dragonup.com`
- **Password**: `DragonUp@2025!`

---

## 🌟 Key Features Completed in Phase 1

1. **Brand Aesthetic**: Aggressive premium gaming dark design with custom dragon artwork animations and smooth green neon highlights.
2. **Dynamic Animations**: Seamless page loading transition screens, count-up metric trackers, card hover effects, and Framer Motion layouts.
3. **Structured Admin Panel**: Complete overview dashboard presenting statistics and contact form inquiries. Includes interactive modals to mark enquiries as new/responded/closed.
4. **API Integration & Security**: Real-time validation, rate-limiting on forms, custom JWT session verification via middleware, and CSRF protection.
5. **SEO Optimized**: Sitemap.xml, robots.txt, dynamic page headers, alt tag verification, keyboard navigability, and custom og:image coverage.

---

## 📜 License

Created with 💚 for the Dragon Up Gaming Community. All rights reserved.

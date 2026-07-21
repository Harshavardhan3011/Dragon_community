# DEVELOPER CHECKLIST

This checklist maps out all tasks from the implementation roadmap, providing a structured approach for developers to complete the remaining phases of the project.

---

## Task 1: Add Missing Assets & Fix Auth Delay
- [ ] Create `/public/audio` directory if missing and add all required sound effects (`click.mp3`, `hover.mp3`, `ambient-loop.mp3`, `dragon-roar.mp3`, `fire-whoosh.mp3`).
- [ ] Add default avatar files to `/public/images/team/` (`founder.png`, `content-manager.png`, `video-editor.png`, `community-manager.png`, `stream-mod.png`, `tournament-manager.png`).
- [ ] Create a placeholder logo in `/public/logos/` (`dragon-up-logo.png`, `dragon-up-symbol.png`).
- [ ] Add `300ms` setTimeout timing delay to password mismatch blocks in `app/api/admin/login/route.ts` to prevent user enumeration.
- [ ] Consolidate JWT configuration and fallback secret keys between `lib/auth.ts` and `middleware.ts`.

## Task 2: Build Phase 1 Admin CMS Pages
- [ ] Create Website Content CMS editor page at `app/admin/dashboard/content/page.tsx`.
- [ ] Create Team Roster CRUD manager page at `app/admin/dashboard/team/page.tsx`.
- [ ] Create Social Links configuration page at `app/admin/dashboard/social/page.tsx`.
- [ ] Create System Settings and maintenance toggle page at `app/admin/dashboard/settings/page.tsx`.
- [ ] Enable backend APIs `/api/admin/settings` and `/api/admin/team` to receive configuration updates.
- [ ] Map admin sidebar links to new pages inside `components/admin/AdminSidebar.tsx`.

## Task 3: Integrate Phase 2 Interactive Animations
- [ ] Create `components/animation/MagneticButton.tsx` and integrate it into CTA buttons.
- [ ] Create `components/animation/TiltCard.tsx` and integrate it into category cards and thumbnails.
- [ ] Update `components/three/DragonModel.tsx` to load 3D GLB assets (`dragon.glb` and `dragon-mobile.glb`) using `useGLTF`.
- [ ] Map skeleton joints in `DragonModel.tsx` to follow cursor movements and trigger flying animations on scroll.
- [ ] Create the development-only debug panel overlay at `components/performance/DebugPanel.tsx`.

## Task 4: Setup Phase 3 Database Models
- [ ] Add models (`YouTubeChannel`, `Video`, `VideoCategory`, `VideoCategoryMap`, `Playlist`, `PlaylistVideo`, `NewsArticle`, `Announcement`, `GalleryItem`, `SetupCategory`, `SetupItem`, `SyncLog`, `AdminAuditLog`) to `prisma/schema.prisma`.
- [ ] Generate database migration: `npx prisma migrate dev --name add_phase3_models`.
- [ ] Re-compile Prisma Client Typings using `npx prisma generate`.

## Task 5: Implement YouTube API Sync Client
- [ ] Add sync secrets and API key parameters to `.env.example`.
- [ ] Create the YouTube client helper file at `lib/youtube/client.ts`.
- [ ] Create the channel verification helper file at `lib/youtube/channel.ts`.
- [ ] Build the sync endpoint at `app/api/youtube/sync/route.ts` with lock mechanisms to prevent concurrent synchronizations.

## Task 6: Create Rule-Based Dynamic Classifier
- [ ] Create the text classifier parser at `lib/youtube/classifier.ts`.
- [ ] Add rules to match Free Fire and PC Gaming terms and assign category mappings during sync.

## Task 7: Build Phase 3 Public Route Pages
- [ ] Build public videos catalog at `app/videos/page.tsx`.
- [ ] Build individual video player and metadata reader at `app/videos/[videoId]/page.tsx`.
- [ ] Build vertical shorts discovery grid at `app/shorts/page.tsx`.
- [ ] Build playlists index at `app/playlists/page.tsx` and detail list at `app/playlists/[playlistId]/page.tsx`.
- [ ] Build livestreams countdown page at `app/livestreams/page.tsx`.
- [ ] Build PC Gaming and Free Fire subpages and guides reader routes under `app/pc-gaming/` and `app/free-fire/`.
- [ ] Build news feeds index page at `app/news/page.tsx` and article view page at `app/news/[slug]/page.tsx`.
- [ ] Build sitemaps and announcements list pages at `app/announcements/page.tsx`.
- [ ] Build responsive masonry grid at `app/gallery/page.tsx` with lightboxes.
- [ ] Build specifications display matrix table at `app/gaming-setup/page.tsx`.
- [ ] Build search results views at `app/search/page.tsx` and search endpoint `/api/search`.

## Task 8: Implement CSV/JSON Import/Export System
- [ ] Create CSV/JSON upload handlers at `app/api/admin/import/route.ts` with downloadable templates.
- [ ] Create data backup download utility at `app/api/admin/export/route.ts`.

## Task 9: Build Admin CRUD Editors
- [ ] Create sync configurations manager at `app/admin/dashboard/videos/page.tsx`.
- [ ] Create news editor and publisher at `app/admin/dashboard/news/page.tsx`.
- [ ] Create media upload gallery manager at `app/admin/dashboard/gallery/page.tsx`.
- [ ] Create specs builder interface at `app/admin/dashboard/gaming-setup/page.tsx`.
- [ ] Create announcement banner publisher at `app/admin/dashboard/announcements/page.tsx`.

## Task 10: Integrate Event Tracking & Disclosures
- [ ] Create event log parser utility at `lib/analytics.ts`.
- [ ] Add event tracking to CTA buttons, search queries, and content filter selections.
- [ ] Update terms and privacy layouts to disclose YouTube API Services utilization.
- [ ] Exclude draft content and hidden pages from sitemaps inside `app/sitemap.ts`.
- [ ] Run `npm run lint` and `npm run build` to verify there are no compilation errors.

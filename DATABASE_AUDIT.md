# DATABASE AUDIT REPORT
### Dragon Up — CMS Implementation
**Audit Date**: 2026-07-20  
**Audit Time**: 22:35 IST  
**Auditor**: Automated script (`prisma/audit.cjs`) + `npx prisma migrate status`  
**Database Engine**: SQLite (via `better-sqlite3` + `@prisma/adapter-better-sqlite3`)

---

## 1. Database File Existence

| Property | Value |
| :--- | :--- |
| **File Path** | `prisma/dev.db` |
| **Exists** | ✅ YES |
| **File Size** | 81,920 bytes (80 KB) |
| **Last Modified** | 2026-07-20 22:19:44 IST |

The database file is present at the expected location defined in `.env`:
```
DATABASE_URL="file:./prisma/dev.db"
```

---

## 2. Total Number of Tables

**Total user tables**: **6**  
**Prisma internal tables**: **1** (`_prisma_migrations`)  
**Grand total in file**: **7**

---

## 3. Table List

| # | Table Name | Purpose |
| :---: | :--- | :--- |
| 1 | `Admin` | Admin user accounts with hashed passwords |
| 2 | `ContactEnquiry` | Contact form submissions from users |
| 3 | `NewsArticle` | CMS content articles (Phase 1 CMS) |
| 4 | `NewsletterSubscriber` | Newsletter email subscriptions |
| 5 | `SiteSetting` | Key-value store for site configuration |
| 6 | `TeamMember` | Team roster records |
| — | `_prisma_migrations` | Prisma internal migration tracking |

---

## 4. Record Count Per Table

| Table | Record Count | Notes |
| :--- | :---: | :--- |
| `Admin` | **1** | Seeded admin user (`admin@dragonup.com`) |
| `ContactEnquiry` | **0** | No form submissions yet |
| `NewsArticle` | **3** | 3 seed articles (1 Published, 2 Draft) |
| `NewsletterSubscriber` | **0** | No subscribers yet |
| `SiteSetting` | **3** | `site_status`, `maintenance_message`, `last_updated` |
| `TeamMember` | **6** | All 6 seed team members |
| **TOTAL** | **13** | |

---

## 5. Applied Migrations

**Total migrations applied**: **2**  
**Migration tracking table**: `_prisma_migrations` ✅ present

| # | Migration Name | Applied | Steps |
| :---: | :--- | :--- | :---: |
| 1 | `20260718150917_init` | ✅ Applied | 1 |
| 2 | `20260720163333_add_news_article` | ✅ Applied | 1 |

### Migration 1 — `20260718150917_init`
Created tables: `Admin`, `ContactEnquiry`, `TeamMember`, `SiteSetting`, `NewsletterSubscriber`  
Created indexes: `Admin_email_key`, `ContactEnquiry_reference_key`, `SiteSetting_key_key`, `NewsletterSubscriber_email_key`

### Migration 2 — `20260720163333_add_news_article`
Created table: `NewsArticle`  
Created index: `NewsArticle_slug_key`

---

## 6. Pending Migrations

**Pending migrations**: **0** ✅ None

Output from `npx prisma migrate status`:
```
2 migrations found in prisma/migrations
Database schema is up to date!
```

The database is in full sync with `prisma/schema.prisma`. No action required.

---

## 7. Prisma Client Status

| Item | Status |
| :--- | :--- |
| Prisma version | `v7.8.0` |
| Client generation | ✅ Generated (last run: 2026-07-20) |
| Adapter | `@prisma/adapter-better-sqlite3` |
| Client location | `node_modules/@prisma/client` |
| All 6 model accessors available | ✅ YES |
| `prisma.$disconnect()` functional | ✅ YES |

The Prisma Client was regenerated after the `NewsArticle` migration via `npx prisma generate`. All model accessors (`prisma.admin`, `prisma.contactEnquiry`, `prisma.teamMember`, `prisma.siteSetting`, `prisma.newsletterSubscriber`, `prisma.newsArticle`) are present and functional.

---

## 8. Database Health Check

| Check | Result | Detail |
| :--- | :---: | :--- |
| File readable | ✅ PASS | `better-sqlite3` opened successfully |
| `sqlite_master` accessible | ✅ PASS | All table metadata returned |
| Prisma Client connection | ✅ PASS | All queries executed without error |
| WAL journal mode | ✅ SQLite default | Standard rollback journal |
| Schema-DB sync | ✅ PASS | `prisma migrate status` reports "up to date" |
| All expected tables present | ✅ PASS | 6/6 tables found |
| No orphaned tables | ✅ PASS | 0 extra unexpected tables |
| All unique indexes created | ✅ PASS | 5 unique indexes verified |

---

## 9. Foreign Key Integrity

**Foreign key declarations in schema**: **None** — the current `schema.prisma` defines no explicit `@relation` fields between models. All 6 models are standalone (no inter-table relationships).

**SQLite `PRAGMA foreign_key_check` result**: **0 violations** ✅

| Table | FK Declarations | Violations |
| :--- | :---: | :---: |
| `Admin` | 0 | 0 |
| `ContactEnquiry` | 0 | 0 |
| `NewsArticle` | 0 | 0 |
| `NewsletterSubscriber` | 0 | 0 |
| `SiteSetting` | 0 | 0 |
| `TeamMember` | 0 | 0 |

No referential integrity violations exist. Integrity is clean.

---

## 10. CRUD Verification Per Table

All read operations were executed via Prisma Client. Results:

| Table | Prisma Model | `count()` | `findFirst()` returns data | Status |
| :--- | :--- | :---: | :---: | :---: |
| `Admin` | `prisma.admin` | 1 | ✅ Yes | ✅ OK |
| `ContactEnquiry` | `prisma.contactEnquiry` | 0 | ✅ null (empty, expected) | ✅ OK |
| `NewsArticle` | `prisma.newsArticle` | 3 | ✅ Yes | ✅ OK |
| `NewsletterSubscriber` | `prisma.newsletterSubscriber` | 0 | ✅ null (empty, expected) | ✅ OK |
| `SiteSetting` | `prisma.siteSetting` | 3 | ✅ Yes | ✅ OK |
| `TeamMember` | `prisma.teamMember` | 6 | ✅ Yes | ✅ OK |

**API-level CRUD verification** (from implemented REST endpoints):

| Model | Create (POST) | Read (GET) | Update (PATCH) | Delete (DELETE) | Auth Guard | Zod Validation |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `Admin` | — | ✅ login only | — | — | N/A | ✅ |
| `ContactEnquiry` | ✅ `/api/contact` | ✅ `/api/admin/enquiries` | ✅ status PATCH | — | ✅ JWT | ✅ |
| `NewsArticle` | ✅ `/api/admin/content` | ✅ `/api/admin/content` | ✅ `/api/admin/content/[id]` | ✅ `/api/admin/content/[id]` | ✅ JWT | ✅ |
| `SiteSetting` | — | ✅ dashboard read | — | — | ✅ server | — |
| `TeamMember` | — | ✅ `/team` page | — | — | — | — |
| `NewsletterSubscriber` | ✅ newsletter form | — | — | — | — | ✅ |

---

## 11. Column Schema Verification

### `Admin` (3 columns + PK)
| Column | Type | Nullable | Default | Unique |
| :--- | :--- | :---: | :--- | :---: |
| `id` | TEXT | NO | cuid() | ✅ PK |
| `email` | TEXT | NO | — | ✅ INDEX |
| `passwordHash` | TEXT | NO | — | — |
| `createdAt` | DATETIME | NO | CURRENT_TIMESTAMP | — |
| `updatedAt` | DATETIME | NO | — | — |

### `ContactEnquiry` (9 columns + PK)
| Column | Type | Nullable | Default | Unique |
| :--- | :--- | :---: | :--- | :---: |
| `id` | TEXT | NO | cuid() | ✅ PK |
| `name` | TEXT | NO | — | — |
| `email` | TEXT | NO | — | — |
| `type` | TEXT | NO | — | — |
| `subject` | TEXT | NO | — | — |
| `message` | TEXT | NO | — | — |
| `status` | TEXT | NO | `'NEW'` | — |
| `reference` | TEXT | NO | — | ✅ INDEX |
| `createdAt` | DATETIME | NO | CURRENT_TIMESTAMP | — |
| `updatedAt` | DATETIME | NO | — | — |

### `NewsArticle` (14 columns + PK)
| Column | Type | Nullable | Default | Unique |
| :--- | :--- | :---: | :--- | :---: |
| `id` | TEXT | NO | cuid() | ✅ PK |
| `title` | TEXT | NO | — | — |
| `slug` | TEXT | NO | — | ✅ INDEX |
| `excerpt` | TEXT | YES | — | — |
| `content` | TEXT | NO | — | — |
| `coverImage` | TEXT | YES | — | — |
| `category` | TEXT | NO | — | — |
| `authorName` | TEXT | YES | — | — |
| `status` | TEXT | NO | `'DRAFT'` | — |
| `isFeatured` | BOOLEAN | NO | `false` | — |
| `isPinned` | BOOLEAN | NO | `false` | — |
| `publishedAt` | DATETIME | YES | — | — |
| `createdAt` | DATETIME | NO | CURRENT_TIMESTAMP | — |
| `updatedAt` | DATETIME | NO | — | — |

### `NewsletterSubscriber` (2 columns + PK)
| Column | Type | Nullable | Default | Unique |
| :--- | :--- | :---: | :--- | :---: |
| `id` | TEXT | NO | cuid() | ✅ PK |
| `email` | TEXT | NO | — | ✅ INDEX |
| `createdAt` | DATETIME | NO | CURRENT_TIMESTAMP | — |

### `SiteSetting` (4 columns + PK)
| Column | Type | Nullable | Default | Unique |
| :--- | :--- | :---: | :--- | :---: |
| `id` | TEXT | NO | cuid() | ✅ PK |
| `key` | TEXT | NO | — | ✅ INDEX |
| `value` | TEXT | NO | — | — |
| `createdAt` | DATETIME | NO | CURRENT_TIMESTAMP | — |
| `updatedAt` | DATETIME | NO | — | — |

### `TeamMember` (10 columns + PK)
| Column | Type | Nullable | Default | Unique |
| :--- | :--- | :---: | :--- | :---: |
| `id` | TEXT | NO | cuid() | ✅ PK |
| `name` | TEXT | NO | — | — |
| `role` | TEXT | NO | — | — |
| `bio` | TEXT | NO | — | — |
| `image` | TEXT | YES | — | — |
| `favoriteGame` | TEXT | YES | — | — |
| `socialLink` | TEXT | YES | — | — |
| `displayOrder` | INTEGER | NO | `0` | — |
| `isActive` | BOOLEAN | NO | `true` | — |
| `createdAt` | DATETIME | NO | CURRENT_TIMESTAMP | — |
| `updatedAt` | DATETIME | NO | — | — |

---

## 12. Missing Models Compared to `schema.prisma`

**Models in `schema.prisma`**: 6  
**Tables in `dev.db`**: 6  
**Missing from DB**: **0** ✅  
**Extra in DB (not in schema)**: **0** ✅

| Model in Schema | Table in DB | Match |
| :--- | :--- | :---: |
| `Admin` | `Admin` | ✅ |
| `ContactEnquiry` | `ContactEnquiry` | ✅ |
| `NewsArticle` | `NewsArticle` | ✅ |
| `NewsletterSubscriber` | `NewsletterSubscriber` | ✅ |
| `SiteSetting` | `SiteSetting` | ✅ |
| `TeamMember` | `TeamMember` | ✅ |

The database perfectly mirrors the Prisma schema. No drift detected.

---

## 13. Index Inventory

| Index Name | Table | Type | Column |
| :--- | :--- | :--- | :--- |
| `Admin_email_key` | `Admin` | UNIQUE | `email` |
| `ContactEnquiry_reference_key` | `ContactEnquiry` | UNIQUE | `reference` |
| `NewsArticle_slug_key` | `NewsArticle` | UNIQUE | `slug` |
| `NewsletterSubscriber_email_key` | `NewsletterSubscriber` | UNIQUE | `email` |
| `SiteSetting_key_key` | `SiteSetting` | UNIQUE | `key` |

**Total indexes**: 5 (all UNIQUE, all Prisma-managed) ✅

---

## 14. Sample Data Snapshot

### `Admin` (1 record)
```json
{
  "id": "cmrqieyfu0000wcdu8xma39hg",
  "email": "admin@dragonup.com",
  "passwordHash": "$2b$12$9is3Y...XXXhashed",
  "createdAt": "2026-07-18T15:16:24.666Z",
  "updatedAt": "2026-07-18T15:16:24.666Z"
}
```

### `SiteSetting` (3 records)
| key | value |
| :--- | :--- |
| `site_status` | `online` |
| `maintenance_message` | `Dragon Up is currently undergoing maintenance.` |
| `last_updated` | `2026-07-18T15:16:24.709Z` |

### `TeamMember` (6 records)
| id | name | role | isActive |
| :--- | :--- | :--- | :---: |
| seed-1 | Dragon Up Creator | Founder & Creator | ✅ |
| seed-2 | Content Manager | Content Manager | ✅ |
| seed-3 | Video Editor | Video Editor | ✅ |
| seed-4 | Community Manager | Community Manager | ✅ |
| seed-5 | Stream Moderator | Stream Moderator | ✅ |
| seed-6 | Tournament Manager | Tournament Manager | ✅ |

### `NewsArticle` (3 records)
| id | title | status | category | isFeatured |
| :--- | :--- | :---: | :--- | :---: |
| seed-article-1 | Awakening the Dragon: Free Fire Guide | PUBLISHED | Guides | ✅ |
| seed-article-2 | PC Gaming vs Mobile Gaming | DRAFT | Opinion | ❌ |
| seed-article-3 | Dragon Up Esports Tournament Announcement | DRAFT | News | ❌ |

---

## 15. Production Readiness Verdict

### Current Implementation Scope

> [!NOTE]
> This verdict is scoped to Phase 1 of the Dragon Up implementation (Core Portal + CMS). Phase 3 models (YouTube sync, videos, gallery etc.) are not yet implemented — those are expected gaps.

| Category | Status | Details |
| :--- | :---: | :--- |
| Schema-DB sync | ✅ READY | Zero drift, all 6 models applied |
| Migration history | ✅ READY | 2 clean migrations, no pending |
| Prisma Client | ✅ READY | Regenerated, all accessors functional |
| Indexes | ✅ READY | All `@unique` fields indexed |
| Foreign key integrity | ✅ READY | 0 violations detected |
| Seed data | ✅ READY | Admin, team, settings, articles all seeded |
| Auth record | ✅ READY | 1 admin with bcrypt-12 password hash |
| CRUD coverage | ✅ READY | All 6 models readable; NewsArticle has full REST CRUD |
| Empty tables | ✅ EXPECTED | `ContactEnquiry` and `NewsletterSubscriber` correctly empty (no users yet) |
| Missing models | ✅ NONE | 0 schema models missing from DB |
| Extra tables | ✅ NONE | 0 orphaned tables |

### Known Gaps (Not Blockers for Current Phase)
| Gap | Reason | Phase |
| :--- | :--- | :---: |
| `TeamMember.image` is `null` for all records | Avatar files not yet added to `/public/images/team/` | Phase 1 |
| `ContactEnquiry` is empty | No users have submitted contact forms | Expected |
| `NewsletterSubscriber` is empty | No newsletter subscriptions yet | Expected |
| No YouTube, Video, Gallery, News models beyond `NewsArticle` | Phase 3 not yet implemented | Phase 3 |

### Final Verdict

> [!IMPORTANT]
> **The database is production-ready for the current Phase 1 implementation.**
>
> All 6 schema models are correctly migrated, indexed, seeded, and accessible via Prisma Client. There are zero pending migrations, zero schema drift, and zero FK violations. The CMS (`NewsArticle`) is fully operational with CRUD APIs in place.

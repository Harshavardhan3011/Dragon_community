import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const dbUrl = process.env.DATABASE_URL ?? `file:${dbPath}`;

const adapter = new PrismaBetterSqlite3({
  url: dbUrl,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🐉 Seeding Dragon Up database...");

  // ─── Admin User ─────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || "admin@dragonup.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "DragonUp@2025!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
    },
  });
  console.log(`✅ Admin user created: ${adminEmail}`);

  // ─── Team Members ──────────────────────────────────────────────
  const teamMembers = [
    {
      name: "Dragon Up Creator",
      role: "Founder & Creator",
      bio: "The visionary behind Dragon Up. Passionate about Free Fire, PC gaming, and building a community where every gamer feels at home.",
      favoriteGame: "Free Fire",
      displayOrder: 1,
    },
    {
      name: "Content Manager",
      role: "Content Manager",
      bio: "Responsible for planning, scheduling, and ensuring every video and post meets the Dragon Up quality standard.",
      favoriteGame: "Valorant",
      displayOrder: 2,
    },
    {
      name: "Video Editor",
      role: "Video Editor",
      bio: "The creative force behind Dragon Up's cinematic gaming edits, highlights, and montages.",
      favoriteGame: "GTA V",
      displayOrder: 3,
    },
    {
      name: "Community Manager",
      role: "Community Manager",
      bio: "The bridge between Dragon Up and the community. Manages events and keeps the energy high.",
      favoriteGame: "Fortnite",
      displayOrder: 4,
    },
    {
      name: "Stream Moderator",
      role: "Stream Moderator",
      bio: "Keeps Dragon Up livestreams engaging and safe for all viewers.",
      favoriteGame: "Minecraft",
      displayOrder: 5,
    },
    {
      name: "Tournament Manager",
      role: "Tournament Manager",
      bio: "Planning and coordinating future competitive events for the Dragon Up community.",
      favoriteGame: "Free Fire",
      displayOrder: 6,
    },
  ];

  for (const member of teamMembers) {
    await prisma.teamMember.upsert({
      where: { id: `seed-${member.displayOrder}` },
      update: member,
      create: {
        id: `seed-${member.displayOrder}`,
        ...member,
        isActive: true,
      },
    });
  }
  console.log(`✅ ${teamMembers.length} team members created`);

  // ─── Site Settings ─────────────────────────────────────────────
  const settings = [
    { key: "site_status", value: "online" },
    { key: "maintenance_message", value: "Dragon Up is currently undergoing maintenance." },
    { key: "last_updated", value: new Date().toISOString() },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log(`✅ ${settings.length} site settings created`);

  console.log("🐉 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

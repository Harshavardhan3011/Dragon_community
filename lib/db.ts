import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const defaultDbDir = path.join(process.cwd(), "prisma");
if (!fs.existsSync(defaultDbDir)) {
  try {
    fs.mkdirSync(defaultDbDir, { recursive: true });
  } catch {
    // Ignore error if directory creation fails or exists
  }
}

const dbPath = path.join(defaultDbDir, "dev.db");
const dbUrl = process.env.DATABASE_URL ?? `file:${dbPath}`;

const adapter = new PrismaBetterSqlite3({
  url: dbUrl,
});

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;


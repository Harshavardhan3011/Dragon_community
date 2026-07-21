import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { sanitizeInput } from "@/lib/utils";

// Protected system keys that cannot be deleted or have their keys changed
export const PROTECTED_KEYS = ["site_status", "maintenance_message", "last_updated"];

const settingSchema = z.object({
  key: z
    .string()
    .min(2, "Key must be at least 2 characters")
    .max(100, "Key must be under 100 characters")
    .regex(/^[a-z0-9_.-]+$/, "Key must be lowercase letters, numbers, underscores, hyphens, or dots only"),
  value: z.string().max(5000, "Value must be under 5000 characters"),
});

// ─── GET /api/admin/settings ──────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    // Build where clause
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { key: { contains: search } },
        { value: { contains: search } },
      ];
    }

    const settings = await db.siteSetting.findMany({
      where,
      orderBy: { key: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (err) {
    console.error("GET /api/admin/settings error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings." },
      { status: 500 }
    );
  }
}

// ─── POST /api/admin/settings ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = settingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { key, value } = parsed.data;

    // Check unique key
    const existing = await db.siteSetting.findUnique({ where: { key } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Setting with key "${key}" already exists.` },
        { status: 409 }
      );
    }

    const setting = await db.siteSetting.create({
      data: {
        key: sanitizeInput(key),
        value: sanitizeInput(value),
      },
    });

    // Update last_updated setting automatically
    try {
      await db.siteSetting.upsert({
        where: { key: "last_updated" },
        update: { value: new Date().toISOString() },
        create: { key: "last_updated", value: new Date().toISOString() },
      });
    } catch (e) {
      console.warn("Could not update last_updated timestamp:", e);
    }

    return NextResponse.json({ success: true, data: setting }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/settings error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create setting." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { sanitizeInput } from "@/lib/utils";
import { PROTECTED_KEYS } from "../route";

const updateSchema = z.object({
  key: z
    .string()
    .min(2, "Key must be at least 2 characters")
    .max(100, "Key must be under 100 characters")
    .regex(/^[a-z0-9_.-]+$/, "Key must be lowercase letters, numbers, underscores, hyphens, or dots only")
    .optional(),
  value: z.string().max(5000, "Value must be under 5000 characters").optional(),
});

// ─── GET /api/admin/settings/[id] ────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const setting = await db.siteSetting.findUnique({ where: { id } });

    if (!setting) {
      return NextResponse.json({ success: false, error: "Setting not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: setting });
  } catch (err) {
    console.error("GET /api/admin/settings/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch setting." },
      { status: 500 }
    );
  }
}

// ─── PATCH /api/admin/settings/[id] ──────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    // Verify setting exists
    const existing = await db.siteSetting.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Setting not found." }, { status: 404 });
    }

    const data = parsed.data;

    // Check if updating key of a protected setting or to a protected key
    if (data.key && data.key !== existing.key) {
      if (PROTECTED_KEYS.includes(existing.key)) {
        return NextResponse.json(
          { success: false, error: `The key of system setting "${existing.key}" is protected and cannot be changed.` },
          { status: 403 }
        );
      }

      // Check if new key is already in use
      const duplicate = await db.siteSetting.findUnique({ where: { key: data.key } });
      if (duplicate) {
        return NextResponse.json(
          { success: false, error: `Setting with key "${data.key}" already exists.` },
          { status: 409 }
        );
      }
    }

    const updated = await db.siteSetting.update({
      where: { id },
      data: {
        ...(data.key && { key: sanitizeInput(data.key) }),
        ...(data.value !== undefined && { value: sanitizeInput(data.value) }),
      },
    });

    // Update last_updated setting automatically
    if (existing.key !== "last_updated") {
      try {
        await db.siteSetting.upsert({
          where: { key: "last_updated" },
          update: { value: new Date().toISOString() },
          create: { key: "last_updated", value: new Date().toISOString() },
        });
      } catch (e) {
        console.warn("Could not update last_updated timestamp:", e);
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("PATCH /api/admin/settings/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update setting." },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/admin/settings/[id] ─────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const existing = await db.siteSetting.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Setting not found." }, { status: 404 });
    }

    // Prevent deletion of protected system keys
    if (PROTECTED_KEYS.includes(existing.key)) {
      return NextResponse.json(
        { success: false, error: `Protected system setting "${existing.key}" cannot be deleted.` },
        { status: 403 }
      );
    }

    await db.siteSetting.delete({ where: { id } });

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

    return NextResponse.json({ success: true, message: "Setting deleted successfully." });
  } catch (err) {
    console.error("DELETE /api/admin/settings/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete setting." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { sanitizeInput } from "@/lib/utils";

// ─── Validation Schema for Partial Updates ───────────────────────────
const updateTeamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  role: z.string().min(2, "Role must be at least 2 characters").max(100).optional(),
  bio: z.string().min(5, "Bio must be at least 5 characters").max(1000).optional(),
  image: z.string().max(500).optional().nullable(),
  favoriteGame: z.string().max(100).optional().nullable(),
  socialLink: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal(""))
    .nullable(),
  skills: z.string().max(500).optional().nullable(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

// ─── GET /api/admin/team/[id] ────────────────────────────────────────
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
    const member = await db.teamMember.findUnique({ where: { id } });

    if (!member) {
      return NextResponse.json({ success: false, error: "Team member not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: member });
  } catch (err) {
    console.error("GET /api/admin/team/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch team member." },
      { status: 500 }
    );
  }
}

// ─── PATCH /api/admin/team/[id] ──────────────────────────────────────
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
    const parsed = updateTeamMemberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    // Verify member exists
    const existing = await db.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Team member not found." }, { status: 404 });
    }

    const data = parsed.data;

    const updated = await db.teamMember.update({
      where: { id },
      data: {
        ...(data.name && { name: sanitizeInput(data.name) }),
        ...(data.role && { role: sanitizeInput(data.role) }),
        ...(data.bio && { bio: sanitizeInput(data.bio) }),
        ...(data.image !== undefined && { image: data.image ? sanitizeInput(data.image) : null }),
        ...(data.favoriteGame !== undefined && {
          favoriteGame: data.favoriteGame ? sanitizeInput(data.favoriteGame) : null,
        }),
        ...(data.socialLink !== undefined && {
          socialLink: data.socialLink ? sanitizeInput(data.socialLink) : null,
        }),
        ...(data.skills !== undefined && { skills: data.skills ? sanitizeInput(data.skills) : null }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("PATCH /api/admin/team/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update team member." },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/admin/team/[id] ────────────────────────────────────
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
    const existing = await db.teamMember.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Team member not found." }, { status: 404 });
    }

    await db.teamMember.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Team member deleted successfully." });
  } catch (err) {
    console.error("DELETE /api/admin/team/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete team member." },
      { status: 500 }
    );
  }
}

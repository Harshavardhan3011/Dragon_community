import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { sanitizeInput } from "@/lib/utils";

// ─── Validation Schema ───────────────────────────────────────────────
const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.string().min(2, "Role must be at least 2 characters").max(100),
  bio: z.string().min(5, "Bio must be at least 5 characters").max(1000),
  image: z.string().max(500).optional().nullable(),
  favoriteGame: z.string().max(100).optional().nullable(),
  socialLink: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal(""))
    .nullable(),
  skills: z.string().max(500).optional().nullable(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

// ─── GET /api/admin/team ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all"; // 'all' | 'active' | 'inactive'
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { role: { contains: search } },
        { bio: { contains: search } },
        { favoriteGame: { contains: search } },
        { skills: { contains: search } },
      ];
    }

    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    const [members, total] = await Promise.all([
      db.teamMember.findMany({
        where,
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      db.teamMember.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: members,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("GET /api/admin/team error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch team members." },
      { status: 500 }
    );
  }
}

// ─── POST /api/admin/team ────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = teamMemberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const data = parsed.data;

    const member = await db.teamMember.create({
      data: {
        name: sanitizeInput(data.name),
        role: sanitizeInput(data.role),
        bio: sanitizeInput(data.bio),
        image: data.image ? sanitizeInput(data.image) : null,
        favoriteGame: data.favoriteGame ? sanitizeInput(data.favoriteGame) : null,
        socialLink: data.socialLink ? sanitizeInput(data.socialLink) : null,
        skills: data.skills ? sanitizeInput(data.skills) : null,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      },
    });

    return NextResponse.json({ success: true, data: member }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/team error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create team member." },
      { status: 500 }
    );
  }
}

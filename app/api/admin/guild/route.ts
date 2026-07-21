import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { sanitizeInput } from "@/lib/utils";

// ─── Validation Schema for Creation ──────────────────────────────────
const guildMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  nickname: z.string().min(2, "Gaming name must be at least 2 characters").max(100),
  avatar: z.string().max(500).optional().nullable(),
  uid: z.string().min(3, "UID must be at least 3 characters").max(50),
  role: z.enum(["GUILD_LEADER", "ACTING_GUILD_LEADER", "OFFICER", "PLAYER"]),
  status: z.enum(["ACTIVE", "OFFLINE", "ON_BREAK"]),
  joinedAt: z.string().or(z.date()).transform((val) => new Date(val)),
  favoriteGame: z.string().max(100).optional().nullable(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
  
  // Profile stats and info
  country: z.string().max(100).optional().nullable(),
  about: z.string().max(1000).optional().nullable(),
  achievements: z.string().max(1000).optional().nullable(),
  rank: z.string().max(100).optional().nullable(),
  level: z.number().int().nonnegative().optional().nullable(),
  matchesPlayed: z.number().int().nonnegative().optional().nullable(),
  wins: z.number().int().nonnegative().optional().nullable(),
  mvpCount: z.number().int().nonnegative().optional().nullable(),
  favoriteWeapon: z.string().max(100).optional().nullable(),
  favoriteCharacter: z.string().max(100).optional().nullable(),
  favoritePet: z.string().max(100).optional().nullable(),
  device: z.string().max(100).optional().nullable(),
  
  // Social Links
  youtube: z.string().url("Please enter a valid URL").optional().or(z.literal("")).nullable(),
  instagram: z.string().url("Please enter a valid URL").optional().or(z.literal("")).nullable(),
  discord: z.string().url("Please enter a valid URL").optional().or(z.literal("")).nullable(),
  facebook: z.string().url("Please enter a valid URL").optional().or(z.literal("")).nullable(),
});

// ─── GET /api/admin/guild ────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "all"; // 'all' | 'GUILD_LEADER' | ...
    const status = searchParams.get("status") || "all"; // 'all' | 'active' | 'inactive'
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, any> = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { nickname: { contains: search } },
        { uid: { contains: search } },
        { favoriteGame: { contains: search } },
        { country: { contains: search } },
        { about: { contains: search } },
      ];
    }

    if (role !== "all") {
      where.role = role;
    }

    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    const [members, total] = await Promise.all([
      db.guildMember.findMany({
        where,
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      db.guildMember.count({ where }),
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
    console.error("GET /api/admin/guild error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch guild members." },
      { status: 500 }
    );
  }
}

// ─── POST /api/admin/guild ───────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = guildMemberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const data = parsed.data;

    // Check unique UID
    const existing = await db.guildMember.findUnique({ where: { uid: data.uid } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Member with UID "${data.uid}" already exists.` },
        { status: 409 }
      );
    }

    // If role is GUILD_LEADER or ACTING_GUILD_LEADER, verify there isn't one already
    if (data.role === "GUILD_LEADER" || data.role === "ACTING_GUILD_LEADER") {
      const currentRoleHolder = await db.guildMember.findFirst({
        where: { role: data.role, isActive: true },
      });
      if (currentRoleHolder) {
        return NextResponse.json(
          {
            success: false,
            error: `Active role holder for "${data.role}" already exists (${currentRoleHolder.name}). Please change their role first.`,
          },
          { status: 409 }
        );
      }
    }

    const member = await db.guildMember.create({
      data: {
        name: sanitizeInput(data.name),
        nickname: sanitizeInput(data.nickname),
        avatar: data.avatar ? sanitizeInput(data.avatar) : null,
        uid: sanitizeInput(data.uid),
        role: data.role,
        status: data.status,
        joinedAt: data.joinedAt,
        favoriteGame: data.favoriteGame ? sanitizeInput(data.favoriteGame) : null,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
        country: data.country ? sanitizeInput(data.country) : null,
        about: data.about ? sanitizeInput(data.about) : null,
        achievements: data.achievements ? sanitizeInput(data.achievements) : null,
        rank: data.rank ? sanitizeInput(data.rank) : null,
        level: data.level,
        matchesPlayed: data.matchesPlayed,
        wins: data.wins,
        mvpCount: data.mvpCount,
        favoriteWeapon: data.favoriteWeapon ? sanitizeInput(data.favoriteWeapon) : null,
        favoriteCharacter: data.favoriteCharacter ? sanitizeInput(data.favoriteCharacter) : null,
        favoritePet: data.favoritePet ? sanitizeInput(data.favoritePet) : null,
        device: data.device ? sanitizeInput(data.device) : null,
        youtube: data.youtube ? sanitizeInput(data.youtube) : null,
        instagram: data.instagram ? sanitizeInput(data.instagram) : null,
        discord: data.discord ? sanitizeInput(data.discord) : null,
        facebook: data.facebook ? sanitizeInput(data.facebook) : null,
      },
    });

    return NextResponse.json({ success: true, data: member }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/guild error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create guild member." },
      { status: 500 }
    );
  }
}

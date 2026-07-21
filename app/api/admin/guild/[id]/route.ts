import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { sanitizeInput } from "@/lib/utils";

// ─── Validation Schema for Updates (all optional) ────────────────────
const updateGuildMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  nickname: z.string().min(2, "Gaming name must be at least 2 characters").max(100).optional(),
  avatar: z.string().max(500).optional().nullable(),
  uid: z.string().min(3, "UID must be at least 3 characters").max(50).optional(),
  role: z.enum(["GUILD_LEADER", "ACTING_GUILD_LEADER", "OFFICER", "PLAYER"]).optional(),
  status: z.enum(["ACTIVE", "OFFLINE", "ON_BREAK"]).optional(),
  joinedAt: z.string().or(z.date()).transform((val) => new Date(val)).optional(),
  favoriteGame: z.string().max(100).optional().nullable(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  
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

// ─── GET /api/admin/guild/[id] ───────────────────────────────────────
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
    const member = await db.guildMember.findUnique({ where: { id } });

    if (!member) {
      return NextResponse.json({ success: false, error: "Guild member not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: member });
  } catch (err) {
    console.error("GET /api/admin/guild/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch guild member." },
      { status: 500 }
    );
  }
}

// ─── PATCH /api/admin/guild/[id] ─────────────────────────────────────
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
    const parsed = updateGuildMemberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    // Verify member exists
    const existing = await db.guildMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Guild member not found." }, { status: 404 });
    }

    const data = parsed.data;

    // Check unique UID if updating UID
    if (data.uid && data.uid !== existing.uid) {
      const otherExisting = await db.guildMember.findUnique({ where: { uid: data.uid } });
      if (otherExisting) {
        return NextResponse.json(
          { success: false, error: `Member with UID "${data.uid}" already exists.` },
          { status: 409 }
        );
      }
    }

    // If role is updated to GUILD_LEADER or ACTING_GUILD_LEADER, ensure there isn't one already
    if (data.role && data.role !== existing.role && (data.role === "GUILD_LEADER" || data.role === "ACTING_GUILD_LEADER")) {
      const activeState = data.isActive !== undefined ? data.isActive : existing.isActive;
      if (activeState) {
        const currentRoleHolder = await db.guildMember.findFirst({
          where: { role: data.role, isActive: true, id: { not: id } },
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
    }

    // If active state is set to true and role is leader, check constraints
    if (data.isActive === true && !existing.isActive && (existing.role === "GUILD_LEADER" || existing.role === "ACTING_GUILD_LEADER")) {
      const targetRole = data.role || existing.role;
      const currentRoleHolder = await db.guildMember.findFirst({
        where: { role: targetRole, isActive: true, id: { not: id } },
      });
      if (currentRoleHolder) {
        return NextResponse.json(
          {
            success: false,
            error: `Active role holder for "${targetRole}" already exists (${currentRoleHolder.name}). Please deactivate them first.`,
          },
          { status: 409 }
        );
      }
    }

    const updated = await db.guildMember.update({
      where: { id },
      data: {
        ...(data.name && { name: sanitizeInput(data.name) }),
        ...(data.nickname && { nickname: sanitizeInput(data.nickname) }),
        ...(data.avatar !== undefined && { avatar: data.avatar ? sanitizeInput(data.avatar) : null }),
        ...(data.uid && { uid: sanitizeInput(data.uid) }),
        ...(data.role && { role: data.role }),
        ...(data.status && { status: data.status }),
        ...(data.joinedAt && { joinedAt: data.joinedAt }),
        ...(data.favoriteGame !== undefined && {
          favoriteGame: data.favoriteGame ? sanitizeInput(data.favoriteGame) : null,
        }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.country !== undefined && { country: data.country ? sanitizeInput(data.country) : null }),
        ...(data.about !== undefined && { about: data.about ? sanitizeInput(data.about) : null }),
        ...(data.achievements !== undefined && {
          achievements: data.achievements ? sanitizeInput(data.achievements) : null,
        }),
        ...(data.rank !== undefined && { rank: data.rank ? sanitizeInput(data.rank) : null }),
        ...(data.level !== undefined && { level: data.level }),
        ...(data.matchesPlayed !== undefined && { matchesPlayed: data.matchesPlayed }),
        ...(data.wins !== undefined && { wins: data.wins }),
        ...(data.mvpCount !== undefined && { mvpCount: data.mvpCount }),
        ...(data.favoriteWeapon !== undefined && {
          favoriteWeapon: data.favoriteWeapon ? sanitizeInput(data.favoriteWeapon) : null,
        }),
        ...(data.favoriteCharacter !== undefined && {
          favoriteCharacter: data.favoriteCharacter ? sanitizeInput(data.favoriteCharacter) : null,
        }),
        ...(data.favoritePet !== undefined && {
          favoritePet: data.favoritePet ? sanitizeInput(data.favoritePet) : null,
        }),
        ...(data.device !== undefined && { device: data.device ? sanitizeInput(data.device) : null }),
        ...(data.youtube !== undefined && { youtube: data.youtube ? sanitizeInput(data.youtube) : null }),
        ...(data.instagram !== undefined && { instagram: data.instagram ? sanitizeInput(data.instagram) : null }),
        ...(data.discord !== undefined && { discord: data.discord ? sanitizeInput(data.discord) : null }),
        ...(data.facebook !== undefined && { facebook: data.facebook ? sanitizeInput(data.facebook) : null }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("PATCH /api/admin/guild/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update guild member." },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/admin/guild/[id] ───────────────────────────────────
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
    const existing = await db.guildMember.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Guild member not found." }, { status: 404 });
    }

    await db.guildMember.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Guild member deleted successfully." });
  } catch (err) {
    console.error("DELETE /api/admin/guild/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete guild member." },
      { status: 500 }
    );
  }
}

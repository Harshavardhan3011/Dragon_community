import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { sanitizeInput } from "@/lib/utils";

// ─── Validation Schema ───────────────────────────────────────────────
const updateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only")
    .optional(),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(10).optional(),
  coverImage: z.string().url("Invalid URL").optional().nullable(),
  category: z.string().min(1).max(100).optional(),
  authorName: z.string().max(100).optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  isFeatured: z.boolean().optional(),
  isPinned: z.boolean().optional(),
});

// ─── GET /api/admin/content/[id] ────────────────────────────────────
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
    const article = await db.newsArticle.findUnique({ where: { id } });

    if (!article) {
      return NextResponse.json({ success: false, error: "Content not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: article });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch content." },
      { status: 500 }
    );
  }
}

// ─── PATCH /api/admin/content/[id] ──────────────────────────────────
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

    // Verify article exists
    const existing = await db.newsArticle.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Content not found." }, { status: 404 });
    }

    // If slug changed, check uniqueness
    const data = parsed.data;
    if (data.slug && data.slug !== existing.slug) {
      const slugConflict = await db.newsArticle.findUnique({ where: { slug: data.slug } });
      if (slugConflict) {
        return NextResponse.json(
          { success: false, error: "A content item with this slug already exists." },
          { status: 409 }
        );
      }
    }

    // Determine publishedAt
    let publishedAt = existing.publishedAt;
    if (data.status === "PUBLISHED" && !existing.publishedAt) {
      publishedAt = new Date();
    } else if (data.status === "DRAFT") {
      publishedAt = null;
    }

    const updated = await db.newsArticle.update({
      where: { id },
      data: {
        ...(data.title && { title: sanitizeInput(data.title) }),
        ...(data.slug && { slug: data.slug }),
        ...(data.excerpt !== undefined && {
          excerpt: data.excerpt ? sanitizeInput(data.excerpt) : null,
        }),
        ...(data.content && { content: data.content }),
        ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
        ...(data.category && { category: sanitizeInput(data.category) }),
        ...(data.authorName !== undefined && {
          authorName: data.authorName ? sanitizeInput(data.authorName) : null,
        }),
        ...(data.status && { status: data.status }),
        ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
        ...(data.isPinned !== undefined && { isPinned: data.isPinned }),
        publishedAt,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update content." },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/admin/content/[id] ─────────────────────────────────
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
    const existing = await db.newsArticle.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Content not found." }, { status: 404 });
    }

    await db.newsArticle.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Content deleted successfully." });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete content." },
      { status: 500 }
    );
  }
}

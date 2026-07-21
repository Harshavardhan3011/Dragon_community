import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { sanitizeInput } from "@/lib/utils";

// ─── Validation Schema ───────────────────────────────────────────────
const createSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  coverImage: z.string().url("Invalid URL").optional().nullable(),
  category: z.string().min(1, "Category is required").max(100),
  authorName: z.string().max(100).optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  isFeatured: z.boolean().default(false),
  isPinned: z.boolean().default(false),
});

// ─── GET /api/admin/content ──────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const category = searchParams.get("category") || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { slug: { contains: search } },
        { excerpt: { contains: search } },
        { category: { contains: search } },
        { authorName: { contains: search } },
      ];
    }
    if (status !== "all") {
      where.status = status.toUpperCase();
    }
    if (category !== "all") {
      where.category = category;
    }

    const [articles, total] = await Promise.all([
      db.newsArticle.findMany({
        where,
        orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
        skip,
        take: limit,
      }),
      db.newsArticle.count({ where }),
    ]);

    // Gather distinct categories for filter dropdown
    const allCategories = await db.newsArticle.findMany({
      select: { category: true },
      distinct: ["category"],
    });

    return NextResponse.json({
      success: true,
      data: articles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        categories: allCategories.map((c) => c.category),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch content." },
      { status: 500 }
    );
  }
}

// ─── POST /api/admin/content ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const data = parsed.data;

    // Check slug uniqueness
    const existing = await db.newsArticle.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A content item with this slug already exists." },
        { status: 409 }
      );
    }

    const article = await db.newsArticle.create({
      data: {
        title: sanitizeInput(data.title),
        slug: data.slug,
        excerpt: data.excerpt ? sanitizeInput(data.excerpt) : null,
        content: data.content,
        coverImage: data.coverImage || null,
        category: sanitizeInput(data.category),
        authorName: data.authorName ? sanitizeInput(data.authorName) : null,
        status: data.status,
        isFeatured: data.isFeatured,
        isPinned: data.isPinned,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create content." },
      { status: 500 }
    );
  }
}

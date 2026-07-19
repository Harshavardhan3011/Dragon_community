import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsletterSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { allowed } = rateLimit(`newsletter:${ip}`, 3, 60_000);
    if (!allowed) {
      return NextResponse.json({ success: false, error: "Too many requests." }, { status: 429 });
    }

    const body = await req.json();
    const result = newsletterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ success: false, error: "Please enter a valid email." }, { status: 400 });
    }

    await db.newsletterSubscriber.upsert({
      where: { email: result.data.email },
      update: {},
      create: { email: result.data.email },
    });

    return NextResponse.json({ success: true, message: "Subscribed successfully!" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to subscribe." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const enquiries = await db.contactEnquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, data: enquiries });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch enquiries." }, { status: 500 });
  }
}

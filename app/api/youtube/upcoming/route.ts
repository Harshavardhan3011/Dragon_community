import { NextResponse } from "next/server";
import { getUpcomingStream } from "@/lib/youtube";

export async function GET() {
  try {
    const data = await getUpcomingStream();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("GET /api/youtube/upcoming error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch upcoming live streams." },
      { status: 500 }
    );
  }
}

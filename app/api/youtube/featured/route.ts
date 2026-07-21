import { NextResponse } from "next/server";
import { getVideosList } from "@/lib/youtube";

export async function GET() {
  try {
    const videos = await getVideosList(10);
    // Find the latest long-form video (duration > 60 seconds)
    const featured = videos.find((v: any) => v.durationSeconds > 60) || videos[0] || null;
    return NextResponse.json({ success: true, data: featured });
  } catch (err: any) {
    console.error("GET /api/youtube/featured error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch featured video." },
      { status: 500 }
    );
  }
}
